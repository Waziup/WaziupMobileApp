import {
  AUTH_ERR_LOG_IN,
  AUTH_ERR_LOG_OUT,
  AUTH_LOGGED_IN,
  AUTH_LOGGING_IN,
  AUTH_LOGGING_OUT,
  AUTH_LOGOUT,
} from "../constants/auth";
import { navigate } from "../services/navRef";
import userService from "../services/userService";

import Lang from "../i18n/";

export const loggingIn = (loggingIn) => ({
  type: AUTH_LOGGING_IN,
  payload: loggingIn,
});

export const loggedIn = (data) => ({
  type: AUTH_LOGGED_IN,
  payload: data,
});

export const errorLogIn = (errorMessage) => ({
  type: AUTH_ERR_LOG_IN,
  payload: errorMessage,
});

export const login = (username, password) => (dispatch) => {
  dispatch(loggingIn(true));
  userService
    .login(username, password)
    .then(async (res) => {
      await dispatch(loggedIn({ token: res.data, user: username }));
      navigate("Devices");
    })
    .catch((err) => {
      dispatch(errorLogIn(Lang.t("errors.loginFailed")));
    })
    .finally(() => {
      dispatch(loggingIn(false));
    });
};

export const loggedOut = () => ({
  type: AUTH_LOGOUT,
});

export const loggingOut = (lOut) => ({
  type: AUTH_LOGGING_OUT,
  payload: lOut,
});

export const errorLogOut = (errorMessage) => ({
  type: AUTH_ERR_LOG_OUT,
  payload: errorMessage,
});

export const logout = () => async (dispatch, getState) => {
  dispatch(loggingOut(true));
  try {
    userService.logout(getState);
    dispatch(loggedOut());
  } catch (err) {
    dispatch(errorLogOut(Lang.t("errors.logoutFailed")));
  } finally {
    dispatch(loggingOut(false));
  }
};
