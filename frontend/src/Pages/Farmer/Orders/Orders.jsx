import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken, removetoken } from "../../../Slices/Access";
import axios from "../../../Config/Axios";
import { UserRegistered } from "../../../Slices/UserSlice";
import FarmerHeader from "../../../Components/FarmerHeader/FarmerHeader";
import FarmerSidebar from "../../../Components/FarmerSidebar/FarmerSidebar";
import style from "../Home/Home.module.css";
import "./Orders.css";

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
            navigate("/");
          }
          dispatch(UserRegistered(getuser.data));

          const ordersResponse = await axios.get("farmer-main/orders/", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setOrders(ordersResponse.data);
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
    <div className={style.farmerDashboard}>
      <FarmerHeader />
      <div className={style.dashboardLayout}>
        <FarmerSidebar />
        <div className={style.content}>
          <h2 className="orders-title">Your Orders</h2>
          <div className="orders-container">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/farmer/orders/${order.id}`)}
                  className="order-card"
                >
                  <div className="order-card-left">
                    <h3>Order #{order.id}</h3>
                    <p><strong>Customer:</strong> {order.user.Email}</p>
                  </div>
                  <div className="order-card-right">
                    <p><strong>Total:</strong> ${order.total}</p>
                    <p className="order-status" style={{
                      background: order.farmer_accept ? 'rgba(34, 197, 94, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                      color: order.farmer_accept ? '#16A34A' : '#D97706',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {order.farmer_accept ? 'Approved' : 'Pending Approval'}
                    </p>
                    <p className="order-date">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-orders">
                <div className="empty-orders-icon">📦</div>
                <h3>No Orders Yet</h3>
                <p>Orders from customers will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
