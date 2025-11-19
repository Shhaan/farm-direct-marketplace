import React, { useEffect, useState } from "react";
import style from "./Inboxsidebar.module.css";
import axios from "../../Config/Axios";
import { Api_base_without_append } from "../../Config/Constants";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserRegistered } from "../../Slices/UserSlice";
const Inboxsidebar = ({ id }) => {
  const [farmer, setfarmers] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
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

          dispatch(UserRegistered(getuser.data));
          console.log(getuser);
        } else {
          navigate("/");
        }
      } catch (e) {
        console.log(e);

        navigate("/");
      }
    };

    fetchUser();
    const fetchfarmer = async () => {
      try {
        const { data } = await axios.get("customer/profile/farmer/");
        console.log(data, user);
        setfarmers(data.filter((obj) => obj.user.id !== user.id));
      } catch (e) {
        console.log(e);
      }
    };
    fetchfarmer();
  }, [id]);
  return (
    <aside className={style.aside}>
      {farmer.map((obj) => (
        <div
          onClick={() => navigate("/inbox", { state: obj.user.id })}
          className={`${style.profileflexdiv} ${
            id == obj.user.id ? "bg-dark text-white" : ""
          }`}
        >
          <img
            src={Api_base_without_append + obj.farmer_photo}
            className={style.imgUserProfile}
            alt=""
          />
          <h6 style={{ fontSize: "10px" }}>{obj.user.First_name}</h6>
        </div>
      ))}
    </aside>
  );
};

export default Inboxsidebar;
