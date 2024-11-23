import React, { useState } from "react"; // Import React and useState for managing component state
import { View, Text, TouchableOpacity, Alert } from "react-native"; // Import React Native components
import MapView, { Marker } from "react-native-maps"; // MapView and Marker for map interactions
import { Feather } from "@expo/vector-icons"; // Feather icons for UI elements
import { useNavigation, NavigationProp } from "@react-navigation/native"; // React Navigation hooks
import { RootStackParamList } from "../types/types"; // Type definition for navigation stack
import { styles } from "../styles/AddEventLocationStyles"; // Custom styles for the component
import BigButton from "../components/BigButton"; // Reusable button component
import customMapStyle from "../../map-style.json"; // Custom map styling
import mapMarkerImg from "../images/map-marker.png"; // Custom map marker image
import { StackNavigationProp } from "@react-navigation/stack"; // Navigation type definition for type safety

// Define navigation prop for type checking the navigation flow
type AddEventLocationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddEventDetails"
>;

// Define a simple interface for location data
interface Location {
  latitude: number;
  longitude: number;
}

export default function AddEventLocation() {
  // Access the navigation object for controlling navigation between screens
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // State to track the selected location on the map
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  /**
   * Handles map press events and sets the selected location.
   * @param event - The event object containing the pressed coordinates.
   */
  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate; // Extract coordinates from the event
    setSelectedLocation({ latitude, longitude }); // Update the selected location state
  };

  /**
   * Navigates to the next screen with the selected location.
   * If no location is selected, it shows an alert.
   */
  const handleNext = () => {
    if (selectedLocation) {
      console.log("Proceeding with selectedLocation:", selectedLocation);
      // Navigate to the AddEventDetails screen with the selected location
      navigation.navigate("AddEventDetails", { selectedLocation });
    } else {
      Alert.alert("Error", "Please select a location."); // Show an error if no location is selected
    }
  };

  /**
   * Resets the selected location state.
   */
  const handleResetLocation = () => {
    setSelectedLocation(null); // Clear the selected location
  };

  return (
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
          onPress={handleResetLocation}
          style={styles.closeButton}
        >
          <Feather name="x" size={24} color="red" />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        style={styles.mapStyle}
        customMapStyle={customMapStyle}
        initialRegion={{
          latitude: 51.04112,
          longitude: -114.069325,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} image={mapMarkerImg} />
        )}
      </MapView>

      {/* Show the BigButton when a location is selected */}
      {selectedLocation && (
        <View style={styles.buttonContainer}>
          <BigButton label="Next" color="#00A3FF" onPress={handleNext} />
        </View>
      )}
    </View>
  );
}
