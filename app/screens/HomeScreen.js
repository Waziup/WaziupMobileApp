import React, { useState } from "react";

import { SafeAreaView, View, StyleSheet, Image } from "react-native";
import { Button, Text } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { logout } from "../actions/auth";
import Lang from "../i18n/";
import Colors from "../constants/colors";

const HomeScreen = (props) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [randomString, setRandomString] = useState("1");

  /**------------------- */

  if (!auth.user) {
    return (
      <View>
        <Text>Login required!</Text>
      </View>
    );
  }

  /**------------------- */

  return (
    <SafeAreaView style={styles.mainView}>
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <Text h4 style={{ textAlign: "center", marginBottom: 50 }}>
        Welcome to Waziup IoT Device observer
      </Text>
      <View>
        <Button
          containerStyle={{
            // alignItems: "center",
            marginBottom: 20,
          }}
          raised
          icon={{ name: "devices", size: 24, color: Colors.LightGray }}
          buttonStyle={styles.button}
          textStyle={styles.buttonTxt}
          onPress={() => props.navigation.navigate("Devices")}
          title={Lang.t("labels.myDevices")}
        />
        <Button
          // containerStyle={{ alignItems: "center" }}
          loading={auth.loggingOut}
          onPress={() => dispatch(logout())}
          raised
          icon={{ name: "logout", size: 24, color: Colors.LightGray }}
          buttonStyle={styles.button}
          textStyle={styles.buttonTxt}
          title={Lang.t("labels.logout")}
        />
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
          }}
        >
          <Text
            style={{ textAlign: "center", marginTop: 10, color: Colors.Blue }}
          >
            {auth.user}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.VeryDarkGray,
    borderRadius: 10,
  },
  buttonTxt: {
    color: Colors.LightGray,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  elmView: {
    marginBottom: 10,
  },
  errorMessage: {
    color: Colors.Red,
  },
  logo: {
    alignSelf: "center",
    marginBottom: 30,
    flex: 1,
    width: 250,
    resizeMode: "contain",
  },
  mainView: {
    padding: 20,
    paddingBottom: 150,
    flex: 1,
    backgroundColor: Colors.White,
    justifyContent: "center",
  },
  image: {
    borderRadius: 15,
  },
  imageHolder: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },
  text: {
    color: "#008",
    fontWeight: "bold",
    fontSize: 24,
  },
});

export default HomeScreen;
