import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken, removetoken } from "../../../Slices/Access";
import axios from "../../../Config/Axios";
import { UserRegistered } from "../../../Slices/UserSlice";
import FarmerHeader from "../../../Components/FarmerHeader/FarmerHeader";
import FarmerSidebar from "../../../Components/FarmerSidebar/FarmerSidebar";
import style from "../Home/Home.module.css";
import "./Orders.css"; // We'll create this file for styling

const Orders = () => {
  const dispatch = useDispatch();
  const { access, refresh } = useSelector((state) => state.Token);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

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

          // Fetch orders
          const ordersResponse = await axios.get("farmer-main/orders/", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setOrders(ordersResponse.data);
          console.log(ordersResponse.data);
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
        <div className={style.content}>
          <h2 className="orders-title text-center">Your Orders</h2>
          <div className="orders-container">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/farmer/orders/${order.id}`)}
                className="order-card"
              >
                <div className="order-card-left">
                  <h3>Order #{order.id}</h3>
                  <p>Customer: {order.user.Email}</p>
                </div>
                <div className="order-card-right">
                  <p>Total: ${order.total}</p>
                  <p className="order-status">Status: {order.status}</p>
                  <p className="order-status">
                    Approved by you: {order.farmer_accept ? "Yes" : "No"}
                  </p>
                  <p className="order-date">
                    Date: {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
