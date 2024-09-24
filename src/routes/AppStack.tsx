import React, { useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const { Navigator, Screen } = createStackNavigator();

import Login from "../pages/Login";
import EventsMap from "../pages/EventsMap";
import EventDetails from "../pages/EventDetails";
import {
  AuthenticationContext,
  AuthenticationContextObject,
} from "../context/AuthenticationContext";
import { User } from "../types/User";
import AddEventLocation from "../pages/AddEventLocation"; // Import your new screen
import AddEventDetails from "../pages/AddEventDetails"; // Import your new screen

export default function Routes() {
  const [authenticatedUser, setAuthenticatedUser] = useState<User>();

  const authenticationContextObj: AuthenticationContextObject = {
    value: authenticatedUser as User,
    setValue: setAuthenticatedUser,
  };

  return (
    <AuthenticationContext.Provider value={authenticationContextObj}>
      <NavigationContainer>
        <Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: "#F2F3F5" },
          }}
        >
          <Screen name="Login" component={Login} />
          <Screen name="EventsMap" component={EventsMap} />
          <Screen name="EventDetails" component={EventDetails} />
          <Screen name="AddEventLocation" component={AddEventLocation} />
          <Screen name="AddEventDetails" component={AddEventDetails} />
          {/* New Screen */}
        </Navigator>
      </NavigationContainer>
    </AuthenticationContext.Provider>
  );
}
