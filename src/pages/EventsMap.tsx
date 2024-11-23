import { Feather } from "@expo/vector-icons"; // Feather icons for UI
import AsyncStorage from "@react-native-async-storage/async-storage"; // Persistent storage for user session
import { StackScreenProps } from "@react-navigation/stack"; // Type for navigation props
import React, { useContext, useEffect, useState, useRef } from "react"; // React hooks
import { Image, Text, View } from "react-native"; // Core React Native components
import { RectButton } from "react-native-gesture-handler"; // Button for touch interactions
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"; // Map components
import customMapStyle from "../../map-style.json"; // Custom map styling
import * as MapSettings from "../constants/MapSettings"; // Map settings
import { AuthenticationContext } from "../context/AuthenticationContext"; // Auth context
import mapMarkerImg from "../images/map-marker.png"; // Default marker image
import * as Location from "expo-location"; // Location services
import { useIsFocused } from "@react-navigation/native"; // Hook to detect screen focus
import axios from "axios"; // HTTP requests
import { Event } from "../types/Event"; // Event type definition
import { User } from "../types/User"; // User type definition
import blueMarkerImg from "../images/map-marker-blue.png"; // Marker image for volunteered events
import greyMarkerImg from "../images/map-marker-grey.png"; // Marker image for full events
import { styles } from "../styles/EventsMapStyles"; // Custom styles

// Define interface for user location
interface LocationCoords {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function EventsMap(props: StackScreenProps<any>) {
  const [events, setEvents] = useState<Event[]>([]); // State for storing events
  const [users, setUsers] = useState<User[]>([]); // State for storing users
  const { navigation } = props;
  const authenticationContext = useContext(AuthenticationContext); // Access auth context
  const mapViewRef = useRef<MapView>(null); // Reference to the map view
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null); // User's current location
  const isFocused = useIsFocused(); // Detect when the screen is focused

  // Filter future events
  const futureEvents = events.filter((event) => {
    const eventDate = new Date(event.dateTime);
    return eventDate >= new Date(); // Include only future events
  });

  /**
   * Fetch events and users from the server.
   * Runs when the screen is focused.
   */
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

  /**
   * Fetch user's current location.
   * Runs once when the component mounts.
   */
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
  /**
   * Adjust map view to include all future events.
   * Runs whenever the future events change.
   */
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

  /**
   * Navigate to the EventDetails screen with event details.
   */
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

  /**
   * Log the user out by clearing stored data.
   */
  const handleLogout = async () => {
    AsyncStorage.multiRemove(["userInfo", "accessToken"]).then(() => {
      authenticationContext?.setValue(undefined);
      navigation.navigate("Login");
    });
  };

  /**
   * Navigate to the AddEventLocation screen for creating a new event.
   */
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
