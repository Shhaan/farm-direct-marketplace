import React, { useEffect, useState } from "react";
import UserHeader from "../../../Components/UserHeader/UserHeader";
import UserFooter from "../../../Components/userFooter/UserFooter";
import Marketsidebar from "../../../Components/Marketsidebar/Marketsidebar";
import { useDispatch, useSelector } from "react-redux";
import { UserRegistered } from "../../../Slices/UserSlice";
import { setToken } from "../../../Slices/Access";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../Config/Axios";
import styles from "../Home/User.module.css";
import { Api_base } from "../../../Config/Constants";

const Market = () => {
  const dispatch = useDispatch();
  const { access, refresh } = useSelector((state) => state.Token);
  const [crops, setcrops] = useState([]);
  const { user } = useSelector((state) => state.user);
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

          dispatch(UserRegistered(getuser.data));
        }
      } catch (e) {}
    };

    fetchUser();
    const fetchcrop = async () => {
      try {
        const data = await axios.get("customer/profile/crop/all/");

        setcrops(data.data);
        console.log(data.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchcrop();
  }, [access]);
  return (
    <div>
      <UserHeader />

      <section style={{ display: "flex" }}>
        {/* <Marketsidebar /> */}

       <div style={{ width: "100%", background: "#F3EEEE", padding: "20px 0" }}>
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "20px",
      padding: "0 20px",
    }}
  >
    {crops.map((obj) => (
      <div
        key={obj.id}
        onClick={() => navigate(`/crop/${obj.slug}`)}
        style={{
          cursor: "pointer",
          background: "#ffffff",
          borderRadius: "10px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "320px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          transition: "0.3s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-5px)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0)")
        }
      >
        {/* Image */}
        <img
          src={Api_base + obj.image.image}
          alt={obj.cropName}
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover",
          }}
        />

        {/* Content */}
        <div style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <h5 style={{ margin: 0 }}>{obj.cropName}</h5>

          <div style={{ fontSize: "14px", color: "#555" }}>
            <strong>Price per kg:</strong> ₹{obj.price}
          </div>

          <div style={{ fontSize: "14px", color: "#555" }}>
            <strong>Location:</strong> {obj.farmer.Location}
          </div>

          <div style={{ fontSize: "14px", color: "#555" }}>
            <strong>Farmer:</strong> {obj.farmer.user.First_name}
          </div>

        
        </div>
      </div>
    ))}
  </div>
</div>

      </section>

      <UserFooter />
    </div>
  );
};

export default Market;
