import axios from "axios";

export const instance = axios.create({
  withCredentials: true,
  baseURL: "/",
});

instance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("system_access_token")}`
    return config
  }
);