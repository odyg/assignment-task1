import React, { useState, useContext } from "react"; // React imports for state and context
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"; // React Native components
import { Feather } from "@expo/vector-icons"; // Feather icons for UI enhancements
import DateTimePicker from "@react-native-community/datetimepicker"; // DateTime picker for date and time input
import { styles } from "../styles/AddEventDetailsStyles"; // Importing custom styles
import BigButton from "../components/BigButton"; // Reusable BigButton component for the save button
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from "@react-navigation/native"; // React Navigation hooks for navigation
import { AuthenticationContext } from "../context/AuthenticationContext"; // Context to get the authenticated user

// Type definition for navigation params
type AddEventDetailsParams = {
  selectedLocation: {
    latitude: number; // Latitude of the event location
    longitude: number; // Longitude of the event location
  };
};

// Typing the route parameters for useRoute
type RouteParams = RouteProp<{ params: AddEventDetailsParams }, "params">;

// Main component for adding event details
export default function AddEventDetails() {
  const route = useRoute<RouteParams>(); // Access the route and params
  const { selectedLocation } = route.params; // Extract selectedLocation from route params
  const navigation = useNavigation<NavigationProp<any>>(); // Access the navigation object

  // State variables for form inputs
  const [eventName, setEventName] = useState(""); // Event name input
  const [about, setAbout] = useState(""); // Description of the event
  const [volunteersNeeded, setVolunteersNeeded] = useState(""); // Number of volunteers required
  const [date, setDate] = useState<Date | null>(null); // Selected date
  const [time, setTime] = useState<Date | null>(null); // Selected time
  const [showDatePicker, setShowDatePicker] = useState(false); // Toggle for date picker visibility
  const [showTimePicker, setShowTimePicker] = useState(false); // Toggle for time picker visibility
  const authContext = useContext(AuthenticationContext); // Access authentication context
  const [imageUrl, setImageUrl] = useState<string | null>(null); // URL of the uploaded image

  // Handle the case where authentication context might be null
  if (!authContext) {
    console.log("Authentication context is not available.");
    return null; // Fallback if auth context is unavailable
  }

  const { value: loggedInUser } = authContext; // Get logged-in user details

  // Logs for debugging
  console.log("Received selectedLocation:", selectedLocation);
  console.log("Logged-in user:", loggedInUser);
  console.log("Logged-in user ID:", loggedInUser?.id);

  // Function to handle date selection from the date picker
  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date; // Retain the previous date if no change
    setShowDatePicker(false); // Close the date picker
    setDate(currentDate); // Update state
  };

  // Function to handle time selection from the time picker
  const onTimeChange = (event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || time; // Retain the previous time if no change
    setShowTimePicker(false); // Close the time picker
    setTime(currentTime); // Update state
  };

  // Helper function to format the date for display
  const formatDate = (date: Date | null) => {
    return date ? date.toLocaleDateString() : "Select Date"; // Return formatted date or placeholder text
  };

  // Helper function to format the time for display
  const formatTime = (time: Date | null) => {
    return time
      ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "Select Time"; // Return formatted time or placeholder text
  };

  // Function to handle saving the event details
  const handleSaveEvent = async () => {
    // Validate required fields
    if (
      !eventName ||
      !about ||
      !date ||
      !time ||
      !imageUrl ||
      !selectedLocation
    ) {
      Alert.alert("Error", "Please fill in all fields before saving.");
      return;
    }

    const organizerId = loggedInUser?.id ?? "unknown"; // Use logged-in user's ID or a fallback

    // Construct the event object
    const newEvent = {
      id: `${organizerId}-${Math.random().toString(36).substr(2, 9)}`, // Unique ID
      name: eventName,
      description: about,
      dateTime: new Date(date).toISOString(), // Combine date and time
      organizerId: organizerId,
      imageUrl: imageUrl,
      volunteersNeeded: parseInt(volunteersNeeded, 10),
      position: {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      },
      volunteersIds: [], // Start with an empty list
    };

    try {
      // Send the event details to the API
      const response = await fetch("http://192.168.1.86:3333/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent), // Convert event to JSON
      });

      // Handle success or failure
      if (response.ok) {
        navigation.navigate("EventsMap"); // Navigate back to the map
      } else {
        Alert.alert("Error", "Failed to save the event. Please try again.");
      }
    } catch (error) {
      console.error("Error saving event:", error);
      Alert.alert("Error", "There was a problem saving the event.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80} // Adjust this value as necessary
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="#00A3FF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Event</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setEventName("");
                setAbout("");
                setVolunteersNeeded("");
                setDate(null);
                setTime(null);
                console.log(eventName, about, volunteersNeeded, date, time); // Check if the state is cleared
              }}
            >
              <Feather name="x" size={24} color="red" />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Event Name */}
            <Text style={styles.label}>Event Name</Text>
            <TextInput
              value={eventName}
              onChangeText={setEventName}
              style={styles.input}
            />

            {/* About */}
            <View style={styles.labelRow}>
              <Text style={styles.label}>About</Text>
              <Text style={styles.charLimit}>300 characters max.</Text>
            </View>
            <TextInput
              value={about}
              onChangeText={setAbout}
              style={[styles.input, styles.textArea]}
              multiline
            />

            {/* Volunteers Needed */}
            <Text style={styles.label}>Volunteers Needed</Text>
            <TextInput
              value={volunteersNeeded}
              onChangeText={setVolunteersNeeded}
              style={styles.input}
              keyboardType="numeric"
            />

            {/* Date and Time */}
            <Text style={styles.label}>Date and Time</Text>
            <View style={styles.dateTimeRow}>
              {/* Date Picker Trigger */}
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                  value={formatDate(date)}
                  editable={false}
                  style={styles.inputHalf}
                />
              </TouchableOpacity>

              {/* Time Picker Trigger */}
              <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                <TextInput
                  value={formatTime(time)}
                  editable={false}
                  style={styles.inputHalf}
                />
              </TouchableOpacity>
            </View>

            {/* Picture Section */}
            <Text style={styles.label}>Picture</Text>
            <TouchableOpacity style={styles.pictureContainer}>
              {imageUrl ? (
                <View style={styles.thumbnailContainer}>
                  <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
                  <TouchableOpacity onPress={() => setImageUrl(null)}>
                    <Feather name="x" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ) : (
                <Feather name="plus" size={24} color="#00A3FF" />
              )}
            </TouchableOpacity>

            {/* Text Input for Image URL */}
            <TextInput
              style={styles.input}
              placeholder="Enter image URL"
              value={imageUrl ?? ""}
              onChangeText={setImageUrl}
            />

            {/* Save Button */}
            <View style={styles.buttonContainer}>
              <BigButton
                label="Save"
                color="#00A3FF"
                onPress={handleSaveEvent}
              />
            </View>
          </View>

          {/* Date Picker Modal */}
          {showDatePicker && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          {/* Time Picker Modal */}
          {showTimePicker && (
            <DateTimePicker
              value={time || new Date()}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
