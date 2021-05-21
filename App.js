import React from "react";
import { StyleSheet, Text, View } from "react-native";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";

// import defaults from "./app/config/defaults";
import { navigationRef } from "./app/services/navRef";
import store from "./app/reducers";
import Navigation from "./app/navigation/Navigation";
import { loggedIn } from "./app/actions/auth";
import { getAuthAsyncStorage } from "./app/services/getAuthAsyncStorage";

// import Test from "./app/screens/Test";

export default function App() {
  const [isLoading, setIsLoadingFromAsyncStorage] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoadingFromAsyncStorage(true);
      const userStorage = await getAuthAsyncStorage();
      if (userStorage.user && userStorage.token) {
        await store.dispatch(
          loggedIn({
            user: userStorage.user,
            token: userStorage.token,
          })
        );
      }
      setIsLoadingFromAsyncStorage(false);
    };
    load();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <Navigation />
      </NavigationContainer>
    </Provider>
  );
}
