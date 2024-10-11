import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  spinnerText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#fff",
  },

  label: {
    color: "#fff",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
  },

  inputLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1.4,
    borderColor: "#D3E2E5",
    borderRadius: 8,
    height: 56,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    color: "#5C8599",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
  },

  invalid: {
    borderColor: "red",
  },

  error: {
    color: "white",
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
  },
});
