import React, { useContext, useEffect, useState } from "react";
import style from "../Inboxsidebar/Inboxsidebar.module.css";
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
    const fetchMessage = async () => {
      try {
        const access = localStorage.getItem("access_token");
        const message = await axios.get(`chat/my-message/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        setfarmers(message.data.filter((obj) => obj.user.id !== user.id));
      } catch (e) {
        console.log(e);
      }
    };
    fetchMessage();
  }, [id]);
  return (
    <aside
      style={{ backgroundColor: "rgb(136 245 140)" }}
      className={style.aside}
    >
      {farmer.map((obj) => (
        <div
          onClick={() => navigate("/farmer/inbox", { state: obj.user.id })}
          className={`${style.profileflexdiv} ${
            id == obj.user.id ? "bg-dark text-white" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-person-circle"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path
              fill-rule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
            />
          </svg>

          <h6 style={{ fontSize: "10px" }}>{obj.user.First_name}</h6>
        </div>
      ))}
    </aside>
  );
};

export default Inboxsidebar;
