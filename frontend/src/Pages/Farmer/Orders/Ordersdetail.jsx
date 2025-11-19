import React, { useEffect, useState } from "react";
import axios from "../../../Config/Axios";
import { useParams, useNavigate } from "react-router-dom";
import FarmerHeader from "../../../Components/FarmerHeader/FarmerHeader";
import FarmerSidebar from "../../../Components/FarmerSidebar/FarmerSidebar";
import style from "../Home/Home.module.css";
import "./Orders.css";
import styles from "./Ordersdetail.module.css";
import toast from "react-hot-toast";

const Ordersdetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`admin-main/admin-orders/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setOrder(response.data);
        console.log(response.data.farmer_accept);
      } catch (error) {
        console.error("Error fetching order details:", error);
        navigate("/");
      }
    };

    fetchOrder();
  }, [id]);

  const approveOrder = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to approve this order?"
    );

    if (isConfirmed) {
      try {
        const response = await axios.put(
          `farmer-main/approve-order/${id}/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (response.status === 200) {
          console.log(response.data);
          setOrder({ ...response.data });
          toast.success("Order approved successfully!");
        }
      } catch (error) {
        console.log(error);
        toast.error(
          error.response?.data?.error ||
            "An error occurred while approving the order",
          5000
        );
      }
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div>
      <FarmerHeader />
      <div style={{ display: "flex" }}>
        <FarmerSidebar />
        <div className={style.content}>
          <div className={styles.orderDetailContainer}>
            <h2 className={styles.orderDetailTitle}>Order Details</h2>
            <div className={styles.orderInfo}>
              <p className={styles.orderInfoItem}>
                <span className={styles.orderInfoLabel}>Order ID:</span>{" "}
                {order.id}
              </p>
              <p className={styles.orderInfoItem}>
                <span className={styles.orderInfoLabel}>Farmer:</span>{" "}
                {order.farmer.user.Email}
              </p>
              <p className={styles.orderInfoItem}>
                <span className={styles.orderInfoLabel}>User:</span>{" "}
                {order.user.Email}
              </p>
              <p className={styles.orderInfoItem}>
                <span className={styles.orderInfoLabel}>Paid:</span>{" "}
                {order.paid ? "Yes" : "No"}
              </p>
              <p className={styles.orderInfoItem}>
                <span className={styles.orderInfoLabel}>Total:</span> $
                {order.total}
              </p>
              <p className={styles.orderInfoItem}>
                <span className={styles.orderInfoLabel}>Paid Amount:</span> $
                {order.paid_amount}
              </p>
              <p className={styles.orderInfoItem}>
                <span className={styles.orderInfoLabel}>Status:</span>{" "}
                <span
                  className={`${styles.orderStatus} ${
                    styles[order.status.toLowerCase()]
                  }`}
                >
                  {order.status}
                </span>
              </p>
              <p className={styles.orderInfoItem}>
                <span className={styles.orderInfoLabel}>Approved by you:</span>{" "}
                <span
                  className={`${styles.orderStatus} ${
                    order.farmer_accept ? styles.approved : styles.notApproved
                  }`}
                >
                  {order.farmer_accept ? "Yes" : "No"}
                </span>
              </p>
              <p className={styles.orderInfoItem}>
                <span className={styles.orderInfoLabel}>Created At:</span>{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
              {!order.farmer_accept && (
                <button onClick={approveOrder} className={styles.approveButton}>
                  Approve Order
                </button>
              )}
            </div>
            <h3 className={styles.orderItemsTitle}>Order Items</h3>
            <ul className={styles.orderItemsList}>
              {order.order_items.map((item) => (
                <li key={item.id} className={styles.orderItem}>
                  <p className={styles.orderItemInfo}>
                    <span className={styles.orderItemLabel}>Product:</span>{" "}
                    {item.crop.cropName}
                  </p>
                  <p className={styles.orderItemInfo}>
                    <span className={styles.orderItemLabel}>Quantity:</span>{" "}
                    {item.quantity}
                  </p>
                  <p className={styles.orderItemInfo}>
                    <span className={styles.orderItemLabel}>Price:</span> $
                    {item.crop.price}
                  </p>
                  <p className={styles.orderItemInfo}>
                    <span className={styles.orderItemLabel}>Total Price:</span>{" "}
                    ${item.total}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ordersdetail;
