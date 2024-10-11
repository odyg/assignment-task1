import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },

  logoutButton: {
    position: "absolute",
    top: 70,
    right: 24,

    elevation: 3,
  },

  footer: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 40,

    backgroundColor: "#FFF",
    borderRadius: 16,
    height: 56,
    paddingLeft: 24,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 3,
  },

  footerText: {
    fontFamily: "Nunito_700Bold",
    color: "#8fa7b3",
    fontSize: 16,
  },

  smallButton: {
    width: 56,
    height: 56,
    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",
  },
});
