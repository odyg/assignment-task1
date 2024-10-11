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
  closeButton: {
    zIndex: 10,
  },
  mapStyle: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
});
