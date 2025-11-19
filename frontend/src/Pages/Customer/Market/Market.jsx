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
        <Marketsidebar />

        <div style={{ width: "100%", background: "#F3EEEE" }}>
          <div className={styles.marketgrid}>
            {crops.map((obj) => (
              <div
                className={styles.userHomeChild1}
                onClick={() => navigate(`/crop/${obj.slug}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  style={{
                    width: "290px",
                    borderRadius: "8px 9px 0 0",
                    height: "166px",
                  }}
                  src={Api_base + obj.image.image}
                  alt=""
                />
                <div>
                  <div className={styles.corn} style={{ color: "white" }}>
                    {obj.cropName}
                  </div>
                  <div className="ps-2">
                    <div className={styles.pricePerKg}>
                      Price per kg : {obj.price}
                    </div>
                    <div className={styles.locationGujarat}>
                      Location : {obj.farmer.Location}
                    </div>

                    <div className={styles.farmerName}>
                      Farmer name : {obj.farmer.user.First_name}
                    </div>
                  </div>
                  <div className={`ps-1 pt-2 ${styles.farmerName}`}>
                    {obj.About}
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
