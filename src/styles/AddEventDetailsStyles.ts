// EventDetailsStyles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f3f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Changed from 'flex-start' to 'space-between'
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  backButton: {
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8fa7b3",
  },
  closeButton: {
    zIndex: 10,
  },
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1.4,
    borderColor: "#D3E2E5",
    borderRadius: 8,
    height: 56,
    padding: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-around", // Change this to space-around for less space
    marginBottom: 20,
  },
  inputHalf: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d3e2e6",
    width: 200, // Keep the width of each field at 48%
    textAlign: "left",
    fontSize: 18,
    height: 60, // Height of the input field
    justifyContent: "center", // Vertically center the text
    marginHorizontal: 5, // Vertically center text
  },
  pictureContainer: {
    borderWidth: 1.4,
    borderColor: "#00A3FF",
    borderRadius: 8,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderStyle: "dashed",
  },
  buttonContainer: {
    marginTop: 20, // Adjust the space above the button
    marginBottom: 40, // Extra space below the button to keep it visible
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#8fa7b3",
  },
  maxChar: {
    fontSize: 12,
    color: "#8fa7b3",
    alignSelf: "flex-end", // Align text to the right of the "About" field
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelRow: {
    flexDirection: "row", // Row layout for label and character limit
    justifyContent: "space-between", // Space between the two elements
    alignItems: "center",
    marginBottom: 5, // Spacing between label and input
  },
  charLimit: {
    fontSize: 14, // Smaller font size for the character limit
    color: "#8fa7b3",
  },
  thumbnailContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    height: "100%",
    position: "relative",
    borderRadius: 8,
    justifyContent: "space-between", // Space between image and X
    flex: 1, // Ensure it takes the full width
  },

  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  scrollContainer: {},
});
