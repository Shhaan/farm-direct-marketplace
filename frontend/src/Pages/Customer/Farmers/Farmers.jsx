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

      <section style={{ display: "flex" }}>
        <div style={{ width: "100%" }}>
          <div className={styles.marketgrid}>
            {farmers
              .slice(0, 4)
              .filter((i) => i.user.id != user.id)
              .map((o) => (
                <div
                  onClick={() => navigator(`/farmer-profile/${o.user.Email}`)}
                  style={{
                    backgroundImage: `url(${Api_base + o.farmer_photo})`,
                    backgroundSize: "cover",
                    height: "199px",
                    width: "302px",
                    padding: "10px",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  <h4>{o?.user?.First_name}</h4>
                  <h5>Items: {o?.cultivatingCrop?.Cropname}</h5>
                  <p>{o?.Bio}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      <UserFooter />
    </div>
  );
};

export default Farmer;
