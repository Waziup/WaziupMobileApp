import axios from "axios";
import { API_URL } from "../config/constants";

/**---------------- */

const getList = async (token, owner = null, limit = 10, offset = 0) => {
  return new Promise((resolve, reject) => {
    axios({
      url:
        `${API_URL}devices?limit=${limit}&offset=${offset}` +
        (owner ? `&q=owner==${owner}` : ""),
      method: "GET",
      headers: {
        "accept:": "application/json;charset=utf-8",
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        try {
          resolve(response.data);
        } catch (e) {
          reject(e);
        }
      })
      .catch((er) => {
        reject(er);
      });
  });
};

/*--------------------*/

const getSensorsList = async (token, deviceId) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `${API_URL}devices/${deviceId}/sensors`,
      method: "GET",
      headers: {
        "accept:": "application/json;charset=utf-8",
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        try {
          resolve(response.data);
        } catch (e) {
          reject(e);
        }
      })
      .catch((er) => {
        reject(er);
      });
  });
};

/*--------------------*/

const getSensorValue = async (
  token,
  deviceId,
  sensorId,
  limit = 10,
  offset = 0
) => {
  return new Promise((resolve, reject) => {
    axios({
      url: `${API_URL}devices/${deviceId}/sensors/${sensorId}/values?limit=${limit}&offset=${offset}`, //&date_from=2016-01-01T00:00:00.000Z&date_to=2025-01-31T23:59:59.999Z
      method: "GET",
      headers: {
        "accept:": "application/json;charset=utf-8",
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        try {
          resolve(response.data);
        } catch (e) {
          reject(e);
        }
      })
      .catch((er) => {
        reject(er);
      });
  });
};

/*--------------------*/

/*--------------------*/

export default {
  getList,
  getSensorsList,
  getSensorValue,
};
