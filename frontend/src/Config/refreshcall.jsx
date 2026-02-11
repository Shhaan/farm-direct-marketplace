import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../Slices/Access";
import axiosInstance from "./AxiosRefresh";

const useTokenRefresh = () => {
  const dispatch = useDispatch();
  const { refresh } = useSelector((state) => state.Token);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        if (refresh) {
          const response = await axiosInstance.post("api/token/refresh/", {
            refresh,
          });
          if (response.status === 200) {
            const { access, refresh: newRefresh } = response.data;
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", newRefresh);
            dispatch(setToken({ access, refresh: newRefresh }));
          }
        }
      } catch (e) {
        console.error("Failed to refresh access token", e);
      }
    };

    const intervalId = setInterval(refreshAccessToken, 480000);

    return () => clearInterval(intervalId);
  }, [dispatch, refresh]);
};

export default useTokenRefresh;
