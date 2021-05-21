import AsyncStorage from "@react-native-community/async-storage";

export async function getAuthAsyncStorage() {
  const token = await AsyncStorage.getItem("userToken");
  const user = await AsyncStorage.getItem("userData");
  return {
    token,
    user: JSON.parse(user),
  };
}

export async function setAuthAsyncStorage(response, username) {
  await AsyncStorage.setItem("userToken", response.data);
  await AsyncStorage.setItem("userData", JSON.stringify(username));
}

export async function resetAuthAsyncStorage() {
  await AsyncStorage.removeItem("userData");
  await AsyncStorage.removeItem("userToken");
}
