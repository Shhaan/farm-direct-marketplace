import React, { useEffect, useState } from "react";
import UserHeader from "../../../Components/UserHeader/UserHeader";
import UserFooter from "../../../Components/userFooter/UserFooter";
import { useDispatch, useSelector } from "react-redux";
import { UserRegistered } from "../../../Slices/UserSlice";
import axios from "../../../Config/Axios";
import styles from "../Home/User.module.css";
import { Api_base } from "../../../Config/Constants";
import { useNavigate } from "react-router-dom";

const Farmer = () => {
  const dispatch = useDispatch();
  const [farmers, setfarmers] = useState([]);
  const [follower, setfollower] = useState([]);
  const { user } = useSelector((state) => state.user);
  const navigator = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        const getuser = await axios.get(`currentuser/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        dispatch(UserRegistered(getuser.data));
      } catch (e) {
        navigator("/", { state: { log: false } });
      }
    };

    fetchUser();

    const fetchFarmers = async () => {
      try {
        const { data } = await axios.get("customer/profile/farmer-all/");

        setfarmers(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchFarmers();

    const fetchfollower = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        const { data } = await axios.get(`customer/profile/follower/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log(data);
        setfollower(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchfollower();
  }, []);
  return (
    <div>
      <UserHeader />

      <section style={{ padding: "40px 20px", background: "#f8f9fa" }}>
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "25px",
    }}
  >
    {farmers
      .slice(0, 4)
      .filter((i) => i.user.id !== user.id)
      .map((o) => (
        <div
          key={o.id}
          onClick={() => navigator(`/farmer-profile/${o.user.Email}`)}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "300px",
            height: "220px",
            borderRadius: "12px",
            overflow: "hidden",
            cursor: "pointer",
            backgroundImage: `url(${Api_base + o.farmer_photo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
            transition: "0.3s ease",
            display: "flex",
            alignItems: "flex-end",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "translateY(-6px)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "translateY(0)")
          }
        >
          {/* Dark Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2))",
            }}
          />

          {/* Content */}
          <div
            style={{
              position: "relative",
              padding: "15px",
              color: "white",
              zIndex: 2,
            }}
          >
            <h4 style={{ margin: 0 }}>{o?.user?.First_name}</h4>
            <p style={{ margin: "5px 0", fontSize: "14px" }}>
              🌾 Crops: {o?.cultivatingCrop?.Cropname}
            </p>
            <p style={{ fontSize: "13px", opacity: 0.9 }}>{o?.Bio}</p>
          </div>
        </div>
      ))}
  </div>
</section>


      <UserFooter />
    </div>
  );
};

export default Farmer;
