import React from "react";
import style from "./UserprofileSidebar.module.css";
import axios from "../../Config/Axios";
import { useNavigate, NavLink } from "react-router-dom";
import "./profileSidebar.css";
import { useSelector, useDispatch } from "react-redux";
import { UserRegistered } from "../../Slices/UserSlice";
const UserprofileSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handlelogout = async (e) => {
    e.preventDefault();
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      const access_token = localStorage.getItem("access_token");

      const logout = await axios.post(
        "admin/logout/",
        { refresh_token: refresh_token },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      localStorage.removeItem("refresh_token");
      localStorage.removeItem("access_token");

      if (logout.status == 205) {
        navigate("/");
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <aside className={style.mobileview}>
        <ul className={style.listul}>
          <li onClick={() => navigate("/profile")}>Profile</li>
          <li onClick={() => navigate("/edit/profile")}>Edit profile</li>
          <li onClick={() => navigate("/shipping-address")}>
            Shipping address
          </li>
          <li onClick={() => navigate("/cart")}>Cart</li>
          <li onClick={() => navigate("/orders")}>Order details</li>
          <li onClick={() => navigate("/farmer/dashboard")}>Farmer profile</li>
          <li onClick={() => navigate("/wallet")}>Wallet</li>
          <li onClick={() => navigate("/following-farmer")}>
            Following farmer's
          </li>
          <li onClick={() => navigate("/inbox")}>Message</li>
        </ul>
      </aside>
    </>
  );
};

export default UserprofileSidebar;
