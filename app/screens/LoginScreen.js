import * as React from "react";
import { Image, View, StyleSheet, SafeAreaView } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// https://material.io/resources/icons/?style=baseline
import { useDispatch, useSelector } from "react-redux";

/*------------*/

import Lang from "../i18n/";
import Colors from "../constants/colors";
import userService from "../services/userService";
import { login } from "../actions/auth";

/*------------*/

export default function LoginScreen(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPass] = React.useState("");

  /*---------------------*/

  const auth = useSelector((state) => state.auth);
  const { errorMessageLogin } = auth;
  const dispatch = useDispatch();

  /*---------------------*/

  const handleLogin = (e) => {
    var inEmail = email.trim().toLowerCase();
    if (inEmail == "") {
      alert(Lang.t("errors.emailEmpty"));
      return;
    }
    if (!userService.emailValid(inEmail) && inEmail != "guest") {
      alert(Lang.t("errors.emailBadFormat"));
      return;
    }
    dispatch(login(inEmail, password));
  };

  /*---------------------*/

  /*---------------------*/
  return (
    <SafeAreaView style={styles.mainView}>
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      {/* <Text style={styles.text}>{Lang.t("labels.login")}</Text> */}

      {errorMessageLogin && (
        <View style={styles.elmView}>
          <Text style={styles.errorMessage}>{errorMessageLogin}</Text>
        </View>
      )}

      <Input
        placeholder={Lang.t("labels.emailAddr")}
        leftIcon={<Icon name="email" size={30} color={Colors.LightGray} />}
        onChangeText={(text) => setEmail(text)}
        value={email}
        textContentType={"emailAddress"}
        autoCompleteType={"email"}
        clearButtonMode={"while-editing"}
        keyboardType={"email-address"}
        returnKeyLabel={"next"}
        returnKeyType={"next"}
        placeholder={Lang.t("labels.emailAddr")}
        style={styles.textInput}
        color={Colors.VeryDarkGray}
        placeholderTextColor={Colors.VeryLightGray}
        autoFocus={true}
      />

      <Input
        leftIcon={<Icon name="key" size={30} color={Colors.LightGray} />}
        textContentType={"password"}
        onChangeText={(text) => setPass(text)}
        value={password}
        autoCompleteType={"password"}
        clearButtonMode={"while-editing"}
        returnKeyLabel={"done"}
        returnKeyType={"done"}
        placeholder={Lang.t("labels.password")}
        secureTextEntry={true}
        style={styles.textInput}
        color={Colors.VeryDarkGray}
        placeholderTextColor={Colors.VeryLightGray}
      />
      <View style={styles.elmView}>
        <Button
          title={Lang.t("labels.login")}
          raised
          // icon={{ name: "login", size: 32, color: Colors.LightGray }}
          buttonStyle={styles.button}
          textStyle={styles.buttonTxt}
          onPress={handleLogin}
          loading={auth.loggingIn}
        />
      </View>

      <View style={styles.elmView}>
        <Text style={styles.text}>www.waziup.io{"   "}</Text>
      </View>

      <View
        style={{
          position: "absolute",
          right: 10,
          bottom: 10,
        }}
      >
        <Button
          onPress={() =>
            alert("This App is developed by:\nmojtaba.eskandari@waziup.org")
          }
          raised
          icon={{ name: "info", size: 24, color: Colors.LightGray }}
          buttonStyle={{ backgroundColor: Colors.White }}
          title=""
        />
      </View>
    </SafeAreaView>
  );
  /**--------------------- */
}

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
    marginBottom: 10,
    // flex: 1,
    width: 250,
    resizeMode: "contain",
  },
  mainView: {
    padding: 20,
    flex: 1,
    backgroundColor: Colors.White,
    justifyContent: "center",
  },
  text: {
    alignSelf: "center",
    fontSize: 18,
    marginBottom: 50,
    color: Colors.Blue,
    fontWeight: "600",
  },
  textInput: {
    flex: 1,
    paddingLeft: 20,
    // borderBottomColor: Colors.LightGray,
    // borderBottomWidth: 1,
  },
  viewCenter: {
    alignSelf: "center",
    marginTop: 30,
  },
});
