import axios from "axios";

export const instance = axios.create({
  withCredentials: true,
  baseURL: "/",
});

instance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("system_access_token")}`
    return config
  },
  (response) => {
    if (response.response && response.response.headers && response.response.headers.Refresh) {
      localStorage.setItem("system_access_token", response.response.headers.refresh);
    }
    return Promise.reject(response);
  }
);