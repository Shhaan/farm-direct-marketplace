import React, { useEffect, useState } from "react";
import UserHeader from "../../../../Components/UserHeader/UserHeader";
import style from "../Profile/Profile.module.css";

import UserprofileSidebar from "../../../../Components/UserprofileSidebar/UserprofileSidebar";
import axios from "../../../../Config/Axios";
import { useDispatch, useSelector } from "react-redux";
import { UserRegistered } from "../../../../Slices/UserSlice";
import { useNavigate } from "react-router-dom";
import { Api_base } from "../../../../Config/Constants";
const Orders = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [order, setorder] = useState([]);
  console.log("hi");

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
        console.log(getuser.data);
      } catch (e) {
        console.log(e);

        navigate("/");
      }
    };

    fetchUser();

    const fetchorder = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        const { data } = await axios.get("customer/profile/fetchorder/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setorder(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchorder();
  }, []);

  return (
    <div>
      <UserprofileSidebar />

      <div className={style.content}>
        <hr id={style.sepratehr} />

        <div>
          <h4>Delivered item</h4>

          <div className="mt-5 ">
            {order
              .filter((obj) => obj.order.status != "pending")
              .map((o) => (
                <div
                  style={{
                    display: "flex",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                  onClick={() => {
                    navigate(`/orders/${o.id}`);
                  }}
                  className="mb-4 p-2 bg-white"
                >
                  <img
                    style={{ width: "24px", borderRadius: "20px" }}
                    src={Api_base + o?.crop?.image?.image}
                  />

                  <h6>{o.crop.cropName}</h6>
                </div>
              ))}
          </div>
        </div>
        <hr className={style.hrdivorder} />
        <div>
          <h4>Shipping item</h4>
          <div className="mt-5 ">
            {order
              .filter((obj) => obj.order.status == "pending")
              .map((o) => (
                <div
                  style={{
                    display: "flex",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                  className="mb-4 p-2 bg-white"
                >
                  <img
                    style={{ width: "24px", borderRadius: "20px" }}
                    src={Api_base + o?.crop?.image?.image}
                  />

                  <h6>{o.crop.cropName}</h6>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
