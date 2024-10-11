import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Feather } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/types";
import { styles } from "../styles/AddEventLocationStyles";
import BigButton from "../components/BigButton";
import customMapStyle from "../../map-style.json";
import mapMarkerImg from "../images/map-marker.png";
import { StackNavigationProp } from "@react-navigation/stack";
// import { StackScreenProps } from "@react-navigation/stack";
type AddEventLocationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddEventDetails"
>;

// Define a simple interface for location
interface Location {
  latitude: number;
  longitude: number;
}
export default function AddEventLocation() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // const navigation = useNavigation();

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  // The event is a press on the map, which has the nativeEvent.coordinate
  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleNext = () => {
    if (selectedLocation) {
      console.log("Proceeding with selectedLocation:", selectedLocation);
      // Use RootStackParamList to type check the navigation
      navigation.navigate("AddEventDetails", { selectedLocation });
    } else {
      Alert.alert("Error", "Please select a location.");
    }
  };

  const handleResetLocation = () => {
    setSelectedLocation(null); // Reset the selected location
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
