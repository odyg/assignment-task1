import React, { useState, useContext, useEffect } from "react";
import { View, Text, Image, Button, Linking, ScrollView } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import mapMarkerImg from "../images/map-marker.png";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native"; // or RectButton from 'react-native-gesture-handler'
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { styles } from "../styles/EventDetailsStyles";
import customMapStyle from "../../map-style.json";
import { AuthenticationContext } from "../context/AuthenticationContext";

// import { format } from 'date-fns';

type ParamList = {
  EventDetails: {
    id: string;
    name: string;
    description: string;
    dateTime: Date;
    locationLat: number;
    locationLong: number;
    volunteersNeeded: number;
    volunteersIds: string[];
    organizerId: string;
    currentUserId: string;
    imageUrl: string; // Added imageUrl field
    organizerPhone: string; // Pass the dynamically retrieved phone number
    organizerName: string; // Pass the dynamically retrieved organizer name
  };
};

export default function EventDetails() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, "EventDetails">>();
  const {
    id,
    name,
    volunteersNeeded,
    // volunteersIds,
    organizerPhone,
    organizerName,
    locationLat,
    locationLong,
    currentUserId,
    organizerId,
    imageUrl,
    description,
    dateTime,
  } = route.params;

  const [volunteersIds, setVolunteersIds] = useState<string[]>([]); // Initialize state for volunteersIds

  // Fetch the initial event data when the component loads
  useEffect(() => {
    const fetchEventData = async () => {
      const response = await fetch(`http://192.168.1.86:3333/events/${id}`);
      const eventData = await response.json();
      setVolunteersIds(eventData.volunteersIds); // Set the initial volunteers
    };

    fetchEventData();
  }, []);

  const hasVolunteered = volunteersIds.includes(currentUserId);
  const teamIsFull = volunteersIds.length >= volunteersNeeded;
  console.log(dateTime); // Log the dateTime to the console
  const date = new Date(dateTime);

  // Manually construct the formatted date
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const authenticationContext = useContext(AuthenticationContext);
  const day = date.getUTCDate(); // Get the day of the month
  const monthIndex = date.getUTCMonth(); // Get the month index (0-11)
  const year = date.getUTCFullYear(); // Get the full year

  const formattedDate = `${monthNames[monthIndex]} ${day}, ${year}`;
  console.log(formattedDate); // Output: January 6, 2023

  // Format time in 12-hour format with AM/PM
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  console.log(`${formattedDate} at ${formattedTime}`);

  console.log(typeof locationLat, typeof locationLong); // Log the imageUrl to the console

  // Example button actions:
  const handleSharePress = () => {
    alert("Share button pressed!");
  };

  const handleVolunteerPress = async () => {
    if (!teamIsFull && !hasVolunteered) {
      try {
        const response = await fetch(`http://192.168.1.86:3333/events/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id, // Use the event ID
            volunteersIds: [...volunteersIds, authenticationContext?.value?.id], // Add user ID to volunteersIds
            name, // Keep other event properties
            description,
            dateTime,
            organizerId,
            imageUrl,
            volunteersNeeded,
            position: {
              latitude: locationLat,
              longitude: locationLong,
            },
          }),
        });

        if (response.ok) {
          // Fetch the updated event details from the API
          const updatedEventResponse = await fetch(
            `http://192.168.1.86:3333/events/${id}`
          );
          const updatedEvent = await updatedEventResponse.json();

          // Update local state with the updated event data
          setVolunteersIds(updatedEvent.volunteersIds);
          // alert("You have successfully volunteered!");
        } else {
          alert("Failed to volunteer. Please try again.");
        }
      } catch (error) {
        console.error("Error volunteering:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert(
        "Cannot volunteer. Either the team is full or you've already volunteered."
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#00A3FF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Event Image */}
        <Image style={styles.eventImage} source={{ uri: imageUrl }} />

        {/* Event Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.eventName}>{name}</Text>
          <Text style={styles.organizer}>organized by {organizerName}</Text>
          <Text style={styles.description}>{description}</Text>

          {/* Event Date and Volunteers Info */}
          <View style={styles.infoContainer}>
            <View style={styles.dateBox}>
              <FontAwesome name="calendar" size={70} color="#00A3FF" />
              <Text style={styles.dateText}>{formattedDate}</Text>
              <Text style={styles.timeText}>{formattedTime}</Text>
            </View>
            <View
              style={[
                styles.volunteerBox,
                teamIsFull
                  ? styles.teamFullBox // Grey box for full team
                  : hasVolunteered
                  ? { backgroundColor: "#E0F2FF", borderColor: "#00A3FF" } // Blue for volunteered
                  : { backgroundColor: "#FFEAD1", borderColor: "#FFB84D" }, // Default orange
              ]}
            >
              {teamIsFull ? (
                <>
                  <Feather name="slash" size={50} color="#CCCCCC" />
                  <Text style={styles.teamFullText}>Team is full</Text>
                </>
              ) : hasVolunteered ? (
                <>
                  <Feather name="check" size={50} color="#00A3FF" />
                  <Text
                    style={{
                      fontSize: 18,
                      color: "#00A3FF",
                      fontWeight: "bold",
                    }}
                  >
                    Volunteered
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.volunteerBoldText}>
                    <Text style={styles.largeNumberText}>
                      {volunteersIds.length}
                    </Text>
                    <Text style={styles.smallText}> of </Text>
                    <Text style={styles.largeNumberText}>
                      {volunteersNeeded}
                    </Text>
                  </Text>
                  <Text style={styles.volunteerText}>Volunteer(s)</Text>
                  <Text style={styles.volunteerText}>needed</Text>
                </>
              )}
            </View>
          </View>

          {/* Share and Volunteer Buttons */}
          {!teamIsFull && (
            <View
              style={hasVolunteered ? styles.threeButtonRow : styles.buttonRow}
            >
              <TouchableOpacity
                style={[styles.button, styles.shareButton]}
                onPress={handleSharePress}
              >
                <Feather name="share-2" size={24} color="#FFF" />
                <Text style={styles.buttonText}>Share</Text>
              </TouchableOpacity>

              {hasVolunteered ? (
                <>
                  <TouchableOpacity
                    style={[styles.button, styles.blueButton]} // For Call button
                    onPress={() => Linking.openURL(`tel:${organizerPhone}`)}
                  >
                    <Feather name="phone" size={24} color="#FFF" />
                    <Text style={styles.buttonText}>Call</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.blueButton]} // For Text button
                    onPress={() => Linking.openURL(`sms:${organizerPhone}`)}
                  >
                    <Feather name="message-square" size={24} color="#FFF" />
                    <Text style={styles.buttonText}>Text</Text>
                  </TouchableOpacity>
                </>
              ) : (
                !teamIsFull && (
                  <TouchableOpacity
                    style={[styles.button, styles.volunteerButton]} // Regular volunteer button
                    onPress={handleVolunteerPress}
                  >
                    <Feather name="plus" size={24} color="#FFF" />
                    <Text style={styles.buttonText}>Volunteer</Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          )}

          {/* Map View */}
          <MapView
            style={styles.mapStyle}
            customMapStyle={customMapStyle}
            initialRegion={{
              latitude: locationLat,
              longitude: locationLong,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Marker
              coordinate={{ latitude: locationLat, longitude: locationLong }}
              icon={mapMarkerImg}
            />
          </MapView>

          {/* Grey Button */}
          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => Linking.openURL("https://maps.google.com")}
          >
            <Feather name="map-pin" size={30} color="#FFF" />
            <Text style={styles.directionsButtonText}>
              Get Directions to Event
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
