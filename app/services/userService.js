import axios from "axios";
import { API_URL } from "../config/constants";
import {
  resetAuthAsyncStorage,
  setAuthAsyncStorage,
} from "./getAuthAsyncStorage";

/**---------------- */

const login = (username, password) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}auth/token`, {
        username,
        password,
      })
      .then(async (response) => {
        try {
          await setAuthAsyncStorage(response, username);
          resolve(response);
        } catch (e) {
          reject(e);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/*--------------------*/

const logout = (getState) => {
  const currentState = getState();
  const { token } = currentState.auth;
  resetAuthAsyncStorage();
};

/*--------------------*/

const emailValid = (txt) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return reg.test(txt) !== false;
};

/*--------------------*/

export default {
  login,
  logout,
  emailValid,
};
