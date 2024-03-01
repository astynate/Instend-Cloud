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

instance.interceptors.response.use(
  (response) => {
    if (response.headers && response.headers.refresh) {
      localStorage.setItem("system_access_token", response.headers.refresh);
    }
    return response;
  }
);