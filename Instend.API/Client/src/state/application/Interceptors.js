import axios from "axios";
import ApplicationState from "./ApplicationState";

export const instance = axios.create({
  withCredentials: true,
  baseURL: "/",
  paramsSerializer: (params) => {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  },
});

instance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("system_access_token")}`
    return config
  }
);

instance.interceptors.response.use(
  (response) => {
    if (response.headers && response.headers.refresh)
      localStorage.setItem("system_access_token", response.headers.refresh);

    return response;
  },
  (error) => {
    console.error(error);
    // ApplicationState.AddErrorInQueueByError('Attention!', error);
  }
);