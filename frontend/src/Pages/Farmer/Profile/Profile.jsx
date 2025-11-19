import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken, removetoken } from "../../../Slices/Access";
import axios from "../../../Config/Axios";
import { UserRegistered } from "../../../Slices/UserSlice";
import FarmerHeader from "../../../Components/FarmerHeader/FarmerHeader";
import FarmerSidebar from "../../../Components/FarmerSidebar/FarmerSidebar";
import style from "../Home/Home.module.css";
const Profile = () => {
  const dispatch = useDispatch();
  const { access, refresh } = useSelector((state) => state.Token);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
          const getuser = await axios.get(`currentuser/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!getuser.data.is_staff) {
            console.log("hi");
            navigate("/");
          }
          dispatch(UserRegistered(getuser.data));
        } else {
          navigate("/");
        }
      } catch (e) {
        console.log(e);

        navigate("/");
      }
    };

    fetchUser();
  }, [access]);
  return (
    <div>
      <FarmerHeader />

      <div style={{ display: "flex" }}>
        <FarmerSidebar />
        <div className={style.content}></div>
      </div>
    </div>
  );
};

export default Profile;
