import * as React from "react";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import DevicesScreen from "../screens/DevicesScreen";
import SensorsScreen from "../screens/SensorsScreen";
import SensorChartScreen from "../screens/SensorChartScreen";
import Lang from "../i18n/";

const Stack = createStackNavigator();

export default function Navigation(props) {
  const auth = useSelector((state) => state.auth);
  const userToken = auth.user ? auth.user.token : null;

  if (userToken === null) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="SignIn"
          component={LoginScreen}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: Lang.t("labels.home") }}
      />
      <Stack.Screen
        name="Devices"
        options={{ title: Lang.t("labels.devices") }}
        component={DevicesScreen}
      />
      <Stack.Screen
        name="Sensors"
        component={SensorsScreen}
        options={{ title: Lang.t("labels.sensors") }}
      />
      <Stack.Screen
        name="SensorChart"
        component={SensorChartScreen}
        options={{ title: Lang.t("labels.chart") }}
      />
    </Stack.Navigator>
  );
}
