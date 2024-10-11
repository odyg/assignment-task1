import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Image, Text, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import customMapStyle from "../../map-style.json";
import * as MapSettings from "../constants/MapSettings";
import { AuthenticationContext } from "../context/AuthenticationContext";
import mapMarkerImg from "../images/map-marker.png";
import * as Location from "expo-location"; // Import Location for fetching user's location
import { useIsFocused } from "@react-navigation/native"; // Import useIsFocused
// import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { Event } from "../types/Event";
import { User } from "../types/User";
import blueMarkerImg from "../images/map-marker-blue.png";
import greyMarkerImg from "../images/map-marker-grey.png";
import { styles } from "../styles/EventsMapStyles";

interface LocationCoords {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function EventsMap(props: StackScreenProps<any>) {
  const [events, setEvents] = useState<Event[]>([]); // Explicitly define the type as an array of Event
  const [users, setUsers] = useState<User[]>([]); // Explicitly define the type as an array of User

  const { navigation } = props;
  const authenticationContext = useContext(AuthenticationContext);
  const mapViewRef = useRef<MapView>(null);

  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);
  const isFocused = useIsFocused();
  // Filter events to only include future events
  const futureEvents = events.filter((event) => {
    const eventDate = new Date(event.dateTime);
    const currentDate = new Date();
    return eventDate >= currentDate; // Only return future events
  });

  //=================================

  // Fetch events and users when the component mounts or when it becomes focused
  useEffect(() => {
    const fetchEventsAndUsers = async () => {
      try {
        const eventsResponse = await axios.get<Event[]>(
          "http://192.168.1.86:3333/events"
        );
        setEvents(eventsResponse.data);

        const usersResponse = await axios.get<User[]>(
          "http://192.168.1.86:3333/users"
        );
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching events or users:", error);
      }
    };

    if (isFocused) {
      fetchEventsAndUsers(); // Refetch events and users whenever the map screen is focused
    }
  }, [isFocused]); // Only runs when the screen is focused

  // Fetch user's location when the component mounts
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  useEffect(() => {
    if (mapViewRef.current && futureEvents.length > 0) {
      // Get all future event positions
      const eventCoordinates = futureEvents.map((event) => ({
        latitude: event.position.latitude,
        longitude: event.position.longitude,
      }));

      // Zoom the map to include all future events with padding
      mapViewRef.current.fitToCoordinates(eventCoordinates, {
        edgePadding: { top: 100, right: 50, bottom: 100, left: 50 }, // Add margin
        animated: true,
      });
    }
  }, [futureEvents]); // Re-run when futureEvents change

  const handleNavigateToEventDetails = (event: any) => {
    // Find the organizer in the users array by matching the organizerId
    const organizer = users.find((user) => user.id === event.organizerId);

    // If the organizer is found, extract their contact info
    const organizerPhone = organizer ? organizer.mobile : "Unknown Phone";
    const organizerName = organizer
      ? `${organizer.name.first} ${organizer.name.last}`
      : "Unknown Organizer";

    // Navigate to EventDetails screen, passing the event details and the organizer's contact info
    navigation.navigate("EventDetails", {
      id: event.id,
      name: event.name,
      dateTime: event.dateTime,
      description: event.description,
      locationLat: event.position.latitude,
      locationLong: event.position.longitude,
      volunteersNeeded: event.volunteersNeeded,
      volunteersIds: event.volunteersIds,
      organizerId: event.organizerId,
      organizerPhone: organizerPhone, // Pass the dynamically retrieved phone number
      organizerName: organizerName, // Pass the organizer's name as well
      currentUserId: authenticationContext?.value?.id,
      imageUrl: event.imageUrl,
    });
  };

  const handleLogout = async () => {
    AsyncStorage.multiRemove(["userInfo", "accessToken"]).then(() => {
      authenticationContext?.setValue(undefined);
      navigation.navigate("Login");
    });
  };

  const handleNavigateToCreateEvent = () => {
    navigation.navigate("AddEventLocation");
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        provider={PROVIDER_GOOGLE}
        initialRegion={userLocation || MapSettings.DEFAULT_REGION}
        style={styles.mapStyle}
        customMapStyle={customMapStyle}
        showsMyLocationButton={false}
        showsUserLocation={true}
        rotateEnabled={false}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        mapPadding={MapSettings.EDGE_PADDING}
      >
        {futureEvents.map((event) => {
          const isEventFull =
            event.volunteersIds.length >= event.volunteersNeeded;
          const hasVolunteered = authenticationContext?.value?.id
            ? event.volunteersIds.includes(authenticationContext.value.id)
            : false;

          let markerImage;
          if (hasVolunteered) {
            markerImage = blueMarkerImg;
          } else if (isEventFull) {
            markerImage = greyMarkerImg;
          } else {
            markerImage = mapMarkerImg;
          }

          return (
            <Marker
              key={event.id}
              coordinate={{
                latitude: event.position.latitude,
                longitude: event.position.longitude,
              }}
              onPress={() => handleNavigateToEventDetails(event)}
            >
              <Image
                resizeMode="contain"
                style={{ width: 48, height: 54 }}
                source={markerImage}
              />
            </Marker>
          );
        })}
      </MapView>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {futureEvents.length === 0
            ? "No events found"
            : futureEvents.length === 1
            ? "1 event found"
            : `${futureEvents.length} events found`}
        </Text>

        <RectButton
          style={[styles.smallButton, { backgroundColor: "#00A3FF" }]}
          onPress={handleNavigateToCreateEvent}
        >
          <Feather name="plus" size={20} color="#FFF" />
        </RectButton>
      </View>

      <RectButton
        style={[
          styles.logoutButton,
          styles.smallButton,
          { backgroundColor: "#4D6F80" },
        ]}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={20} color="#FFF" />
      </RectButton>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     flex: 1,
//     justifyContent: "flex-end",
//     alignItems: "center",
//   },

//   mapStyle: {
//     ...StyleSheet.absoluteFillObject,
//   },

//   logoutButton: {
//     position: "absolute",
//     top: 70,
//     right: 24,

//     elevation: 3,
//   },

//   footer: {
//     position: "absolute",
//     left: 24,
//     right: 24,
//     bottom: 40,

//     backgroundColor: "#FFF",
//     borderRadius: 16,
//     height: 56,
//     paddingLeft: 24,

//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",

//     elevation: 3,
//   },

//   footerText: {
//     fontFamily: "Nunito_700Bold",
//     color: "#8fa7b3",
//     fontSize: 16,
//   },

//   smallButton: {
//     width: 56,
//     height: 56,
//     borderRadius: 16,

//     justifyContent: "center",
//     alignItems: "center",
//   },
// });
