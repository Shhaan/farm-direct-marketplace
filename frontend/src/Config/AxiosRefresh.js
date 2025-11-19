import axios from "axios";
import store from "../Store";
import { setToken } from "../Slices/Access";
import { useDispatch } from "react-redux";
import { Api_base } from "./Constants";
// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: Api_base,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          console.log(refreshToken);
          const response = await axios.post("api/token/refresh/", {
            refresh: refreshToken,
          });
          if (response.status === 200) {
            const newAccessToken = response.data.access;
            localStorage.setItem("access_token", newAccessToken);
            localStorage.setItem("refresh_token", response.data.refresh);
            store.dispatch(
              setToken({
                refresh: response.data.refresh,
                access: newAccessToken,
              })
            );

            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            return axiosInstance(originalRequest);
          }
        } catch (e) {
          console.log("Refresh token is invalid", e);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
