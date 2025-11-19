import React, { useEffect, useState } from "react";
import UserHeader from "../../../../Components/UserHeader/UserHeader";
import style from "../Profile/Profile.module.css";
import UserprofileSidebar from "../../../../Components/UserprofileSidebar/UserprofileSidebar";
import axios from "../../../../Config/Axios";
import { useDispatch, useSelector } from "react-redux";
import { UserRegistered } from "../../../../Slices/UserSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Api_base } from "../../../../Config/Constants";
import { formatDate } from "../../../../utils/dateFormatter";

const OrderDetails = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null); // Initialize with null
  const { id } = useParams();

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
        console.error("Error fetching user data:", e);
        navigate("/");
      }
    };

    const fetchorder = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const { data } = await axios.get(`customer/profile/fetchorder/`, {
          params: { id },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setOrder(data);
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchUser();
    fetchorder();
  }, [id, navigate, dispatch]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <UserprofileSidebar />
      <div className={style.content}>
        <hr id={style.sepratehr} />
        <div className={style.orderDetails}>
          <h2>Order Details</h2>
          <div className={style.orderInfo}>
            <p>
              <strong>Order ID:</strong> {order.id || "N/A"}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(order.created_at) || "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {order.status || "N/A"}
            </p>
            <p>
              <strong>Total Amount:</strong> ${order.total || "0.00"}
            </p>
          </div>
          <div className={style.orderItems}>
            <h3>Order Items</h3>
            {order.order_items?.length > 0 ? (
              order.order_items.map((item) => (
                <div key={item.id} className={style.orderItem}>
                  <img
                    src={Api_base + item.crop.image.image}
                    alt={item.crop.cropName}
                    className={style.cropImage}
                  />
                  <div className={style.itemDetails}>
                    <h4>{item.crop.cropName || "Unknown"}</h4>
                    <p>Quantity: {item.quantity || 0}</p>
                    <p>Price: ${item.crop.price || 0.0}</p>
                    <p>Total: ${item.total || 0.0}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No items found in this order.</p>
            )}
          </div>
          <div className={style.farmerInfo}>
            <h3>Farmer Information</h3>
            {order.farmer?.user ? (
              <>
                <p>
                  <strong>Name:</strong>{" "}
                  {`${order.farmer.user.First_name || "N/A"} ${
                    order.farmer.user.Last_name || ""
                  }`}
                </p>
                <p>
                  <strong>Email:</strong> {order.farmer.user.Email || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong>{" "}
                  {order.farmer.user.Phone_number || "N/A"}
                </p>
              </>
            ) : (
              <p>Farmer information is unavailable.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
