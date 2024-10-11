import React, { useState, useContext } from "react";
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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "../styles/AddEventDetailsStyles";
import BigButton from "../components/BigButton";
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from "@react-navigation/native";
import { AuthenticationContext } from "../context/AuthenticationContext"; // Make sure this is the correct path

type AddEventDetailsParams = {
  selectedLocation: {
    latitude: number;
    longitude: number;
  };
};

type RouteParams = RouteProp<{ params: AddEventDetailsParams }, "params">;

export default function AddEventDetails() {
  const route = useRoute<RouteParams>(); // Type the route with the expected params
  const { selectedLocation } = route.params; // Get the selected location from navigatio
  const navigation = useNavigation<NavigationProp<any>>();
  const [eventName, setEventName] = useState("");
  const [about, setAbout] = useState("");
  const [volunteersNeeded, setVolunteersNeeded] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const authContext = useContext(AuthenticationContext);
  // const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // URL after upload
  console.log("Received selectedLocation:", selectedLocation);

  // Handle the case where authContext might be null
  if (!authContext) {
    console.log("Authentication context is not available.");
    return null; // Or handle it differently
  }

  const { value: loggedInUser } = authContext;

  // Now you can safely log the user's details
  console.log("Logged-in user:", loggedInUser);
  console.log("Logged-in user ID:", loggedInUser?.id);

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const formatDate = (date: Date | null) => {
    return date ? date.toLocaleDateString() : "Select Date";
  };

  const formatTime = (time: Date | null) => {
    return time
      ? time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "Select Time";
  };

  const handleSaveEvent = async () => {
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

    const organizerId = loggedInUser?.id ?? "unknown"; // Use the logged-in user's ID

    const newEvent = {
      id: `${organizerId}-${Math.random().toString(36).substr(2, 9)}`, // Generate a unique ID
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
      volunteersIds: [], // Empty initially
    };

    try {
      // Send a POST request to your API to save the event
      const response = await fetch("http://192.168.1.86:3333/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        navigation.navigate("EventsMap"); // Go back to the previous screen
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
