import { useIsFocused } from "@react-navigation/native"; // Hook to detect screen focus
import { StackScreenProps } from "@react-navigation/stack"; // Navigation prop types
import { LinearGradient } from "expo-linear-gradient"; // For gradient background
import { StatusBar } from "expo-status-bar"; // Control status bar styling
import React, { useContext, useEffect, useState } from "react"; // React hooks
import { Alert, Image, StyleSheet, Text, TextInput, View } from "react-native"; // Core React Native components
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; // For handling keyboard overlaps
import Spinner from "react-native-loading-spinner-overlay"; // Loading spinner
import BigButton from "../components/BigButton"; // Reusable button component
import Spacer from "../components/Spacer"; // Spacer for consistent spacing
import { AuthenticationContext } from "../context/AuthenticationContext"; // Authentication context
import logoImg from "../images/logo.png"; // App logo
import * as api from "../services/api"; // API service for authentication
import { getFromCache, setInCache } from "../services/caching"; // Caching helpers
import { User } from "../types/User"; // User type definition
import { isTokenExpired, sanitizeEmail, validateEmail } from "../utils"; // Utility functions
import { styles } from "../styles/LoginStyles"; // Custom styles

export default function Login({ navigation }: StackScreenProps<any>) {
  // Authentication context to manage user session
  const authenticationContext = useContext(AuthenticationContext);

  // State variables for input fields and form state
  const [email, setEmail] = useState(""); // Email input
  const [password, setPassword] = useState(""); // Password input
  const [emailIsInvalid, setEmailIsInvalid] = useState<boolean>(); // Email validation state
  const [passwordIsInvalid, setPasswordIsInvalid] = useState<boolean>(); // Password validation state
  const [authError, setAuthError] = useState<string>(); // Authentication error state
  const [accessTokenIsValid, setAccessTokenIsValid] = useState<boolean>(false); // Token validity state
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false); // Spinner visibility state
  const isFocused = useIsFocused(); // Track whether the screen is active

  /**
   * Effect to check for cached user info and token when the component mounts.
   * Displays authentication errors as alerts.
   */
  useEffect(() => {
    getFromCache("userInfo").then(
      (cachedUserInfo) =>
        authenticationContext?.setValue(cachedUserInfo as User), // Restore user from cache
      (error) => console.log(error)
    );

    getFromCache("accessToken").then(
      (accessToken) =>
        accessToken &&
        !isTokenExpired(accessToken as string) &&
        setAccessTokenIsValid(true), // Check token validity
      (error) => console.log(error)
    );

    if (authError) {
      Alert.alert("Authentication Error", authError, [
        { text: "Ok", onPress: () => setAuthError(undefined) },
      ]); // Show error alert
    }
  }, [authError]);

  /**
   * Effect to navigate to the EventsMap screen if the token is valid and user info is available.
   */
  useEffect(() => {
    if (accessTokenIsValid && authenticationContext?.value) {
      navigation.navigate("EventsMap"); // Redirect to main app screen
    }
  }, [accessTokenIsValid]);

  /**
   * Validates the form and initiates the authentication process.
   */
  const handleAuthentication = () => {
    if (formIsValid()) {
      setIsAuthenticating(true); // Show spinner
      api
        .authenticateUser(sanitizeEmail(email), password) // Call API
        .then((response) => {
          setInCache("userInfo", response.data.user); // Cache user info
          setInCache("accessToken", response.data.accessToken); // Cache access token
          authenticationContext?.setValue(response.data.user); // Update user in context
          setIsAuthenticating(false); // Hide spinner
          navigation.navigate("EventsMap"); // Navigate to events map
        })
        .catch((error) => {
          if (error.response) {
            setAuthError(error.response.data); // Set authentication error
          } else {
            setAuthError("Something went wrong."); // Generic error message
          }
          setIsAuthenticating(false); // Hide spinner
        });
    }
  };

  /**
   * Validates the entire form.
   * @returns {boolean} - True if the form is valid.
   */
  const formIsValid = () => {
    const emailIsValid = !isEmailInvalid();
    const passwordIsValid = !isPasswordInvalid();
    return emailIsValid && passwordIsValid; // Ensure both fields are valid
  };

  /**
   * Validates the password field.
   * @returns {boolean} - True if the password is invalid.
   */
  const isPasswordInvalid = (): boolean => {
    const invalidCheck = password.length < 6; // Password must be at least 6 characters
    setPasswordIsInvalid(invalidCheck); // Update validation state
    return invalidCheck;
  };

  /**
   * Validates the email field.
   * @returns {boolean} - True if the email is invalid.
   */
  const isEmailInvalid = (): boolean => {
    const invalidCheck = !validateEmail(email); // Check if the email is valid
    setEmailIsInvalid(invalidCheck); // Update validation state
    return invalidCheck;
  };

  return (
    <LinearGradient
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      colors={["#031A62", "#00A3FF"]}
      style={styles.gradientContainer}
    >
      {isFocused && <StatusBar animated translucent style="light" />}
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{
          padding: 24,
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        <Image
          resizeMode="contain"
          style={{
            width: 240,
            height: 142,
            alignSelf: "center",
          }}
          source={logoImg}
        />
        <Spacer size={80} />
        <View style={styles.inputLabelRow}>
          <Text style={styles.label}>Email</Text>
          {emailIsInvalid && <Text style={styles.error}>invalid email</Text>}
        </View>
        <TextInput
          style={[styles.input, emailIsInvalid && styles.invalid]}
          onChangeText={(value) => setEmail(value)}
          onEndEditing={isEmailInvalid}
        />

        <View style={styles.inputLabelRow}>
          <Text style={styles.label}>Password</Text>
          {passwordIsInvalid && (
            <Text style={styles.error}>invalid password</Text>
          )}
        </View>
        <TextInput
          style={[styles.input, passwordIsInvalid && styles.invalid]}
          secureTextEntry={true}
          onChangeText={(value) => setPassword(value)}
          onEndEditing={isPasswordInvalid}
        />
        <Spacer size={80} />
        <BigButton
          style={{ marginBottom: 8 }}
          onPress={handleAuthentication}
          label="Log in"
          color="#FF8700"
        />
        <Spinner
          visible={isAuthenticating}
          textContent={"Authenticating..."}
          overlayColor="#031A62BF"
          textStyle={styles.spinnerText}
        />
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
}

// const styles = StyleSheet.create({
//   gradientContainer: {
//     flex: 1,
//   },

//   container: {
//     flex: 1,
//   },

//   spinnerText: {
//     fontSize: 16,
//     fontFamily: "Nunito_700Bold",
//     color: "#fff",
//   },

//   label: {
//     color: "#fff",
//     fontFamily: "Nunito_600SemiBold",
//     fontSize: 15,
//   },

//   inputLabelRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "baseline",
//     marginBottom: 4,
//   },

//   input: {
//     backgroundColor: "#fff",
//     borderWidth: 1.4,
//     borderColor: "#D3E2E5",
//     borderRadius: 8,
//     height: 56,
//     paddingTop: 16,
//     paddingBottom: 16,
//     paddingHorizontal: 24,
//     marginBottom: 16,
//     color: "#5C8599",
//     fontFamily: "Nunito_600SemiBold",
//     fontSize: 15,
//   },

//   invalid: {
//     borderColor: "red",
//   },

//   error: {
//     color: "white",
//     fontFamily: "Nunito_600SemiBold",
//     fontSize: 12,
//   },
// });
