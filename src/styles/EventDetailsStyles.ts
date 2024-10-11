// EventDetailsStyles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20, // Add padding at the bottom for better scroll experience
  },
  container: {
    flex: 1,
    backgroundColor: "#f2f3f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  backButton: {
    marginRight: 10,
    marginLeft: 0,
    zIndex: 10,
  },
  headerTitle: {
    paddingTop: 50,
    fontSize: 18,
    fontWeight: "bold",
    color: "#8fa7b3",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  eventImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    margin: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  eventName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  organizer: {
    fontSize: 16,
    color: "#666",
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    alignItems: "center",
    height: 120, // Set height for the container to make it square
  },
  dateBox: {
    width: 185, // Match the width to the container height to make it square
    height: 150, // Set equal height and width to make it square
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#00A3FF",
    borderRadius: 10,
    backgroundColor: "#E0F2FF",
    marginRight: 10,
  },
  volunteerBox: {
    width: 185, // Match the width to the container height to make it square
    height: 150, // Set equal height and width to make it square
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFA500",
    borderRadius: 10,
    backgroundColor: "#FFE6CC",
  },
  teamFullBox: {
    width: 185, // Match the width to the container height to make it square
    height: 150, // Set equal height and width to make it square
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#666666",
    borderRadius: 10,
    backgroundColor: "#E0E0E0", // Grey background
  },
  icon: {
    marginBottom: 20, // Adds space between the icon and the date
  },
  dateText: {
    fontSize: 16,
    color: "#00A3FF",
    marginBottom: 2,
  },
  timeText: {
    fontSize: 15,
    color: "#00A3FF",
  },
  volunteerBoldText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#FFA500",
  },
  teamFullText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666666",
  },
  volunteerText: {
    fontSize: 18,
    color: "#FFA500",
  },
  largeNumberText: {
    // Styling for the larger number
    fontSize: 35, // Larger number size
    color: "#E67200", // Color for the number
  },
  smallText: {
    // Smaller text for "of"
    fontSize: 25, // Smaller size for "of"
    color: "#E67200", // You can change the color here if needed
  },
  // // Button row styles
  // buttonRow: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginTop: 20,
  //   paddingHorizontal: 20,
  // },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Regular two-button layout
    marginTop: 10,
  },
  // button: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderRadius: 20,
  //   marginTop: 20,
  //   marginHorizontal: 5,
  //   width: 185,
  //   height: 70,
  // },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center", // Center the icon and text within the button
    alignItems: "center", // Vertically align items within the button
    marginHorizontal: 5,
    backgroundColor: "#00A3FF",
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 15,
    height: 50,
  },
  shareButton: {
    backgroundColor: "#00A3FF",
    marginLeft: 0, // Blue background for share button
  },
  volunteerButton: {
    backgroundColor: "#FF8700", // Orange background for volunteer button
  },

  blueButton: {
    backgroundColor: "#00A3FF", // Apply the same blue color for Call and Text
  },
  textButton: {
    backgroundColor: "#00A3FF",
    marginRight: 0, // Orange for Text button
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },

  threeButton: {
    flex: 1, // Ensures buttons fit equally within the row
    marginHorizontal: 3, // Adjust space between the buttons
    paddingVertical: 10, // Reduce vertical padding to make buttons smaller
  },
  threeButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Three-button layout
    marginTop: 10,
  },

  mapStyle: {
    width: "100%",
    height: 300,
    marginTop: 20,
  },
  directionsButton: {
    backgroundColor: "#6E7B8B", // Grey color for the button
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: 70,
  },
  directionsButtonText: {
    color: "#FFF", // White text color
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
