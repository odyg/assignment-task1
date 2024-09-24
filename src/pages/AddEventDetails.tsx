import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import BigButton from "../components/BigButton";
import { styles } from "./AddEventDetailsStyles";
import { useContext } from "react";
import { AuthenticationContext } from "../context/AuthenticationContext";

export default function AddEventDetails() {
  const navigation = useNavigation();
  const authenticationContext = useContext(AuthenticationContext);

  const [eventName, setEventName] = useState("");
  const [about, setAbout] = useState("");
  const [volunteersNeeded, setVolunteersNeeded] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [picture, setPicture] = useState(null);

  const handleSave = () => {
    // Handle form submission logic here
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
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
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

        {/* About Section */}
        <View style={styles.row}>
          <Text style={styles.label}>About</Text>
          <Text style={styles.maxChar}>300 characters max.</Text>
        </View>
        <TextInput
          value={about}
          onChangeText={setAbout}
          style={[styles.input, styles.textArea]}
          multiline
          maxLength={300}
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
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="Date"
            style={styles.inputHalf}
          />
          <TextInput
            value={time}
            onChangeText={setTime}
            placeholder="Time"
            style={styles.inputHalf}
          />
        </View>

        {/* Picture Section */}
        <Text style={styles.label}>Picture</Text>
        <TouchableOpacity style={styles.pictureContainer}>
          <Feather name="plus" size={24} color="#00A3FF" />
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <BigButton label="Save" color="#00A3FF" onPress={handleSave} />
      </View>
    </View>
  );
}
