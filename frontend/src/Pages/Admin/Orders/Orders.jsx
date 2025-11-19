import React, { useEffect, useState } from "react";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import AdminSidebar from "../../../Components/AdminSidebar/AdminSidebar";
import categorycss from "../Category/Category.module.css";
import axios from "../../../Config/Axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../../utils/dateFormatter";

const Order = () => {
  const dispatch = useDispatch();
  const { access, refresh } = useSelector((state) => state.Token);
  const [order, setOrder] = useState([]);
  const [side, settoggleside] = useState(true);
  const [isdelete, setisDelete] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const user = await axios("admin/get-admin/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log(user);
      } catch (e) {
        console.log(e);
        if (e.response.status == 401 || e.response.status == 403) {
          navigate("/admin/login");
        }
      }
    };
    fetchUser();

    const fetchorder = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        const orders = await axios.get("admin-main/admin-orders/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setOrder(orders.data.results);
        console.log(orders.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchorder();
  }, [access]);
  return (
    <React.Fragment>
      <div
        onClick={() => {
          return setisDelete(false), navigate(`/admin/orders`);
        }}
      >
        <AdminHeader
          onClick
          side={side}
          toggleSidebar={() => settoggleside((p) => !p)}
        />
      </div>

      <div className={categorycss.maindiv}>
        <AdminSidebar side={side} />
      </div>
      <div
        className={`${categorycss.content} ${
          side ? "" : categorycss.noSidebar
        }`}
      >
        <div className={categorycss.orderListContainer}>
          <h2 className={categorycss.orderListTitle}>Order List</h2>
          <div className={categorycss.orderGrid}>
            {order.map((o) => (
              <div
                key={o.id}
                onClick={() => navigate(`/admin/orders/${o.id}`)}
                className={categorycss.orderCard}
              >
                <div className={categorycss.orderHeader}>
                  <h3>Order #{o.id}</h3>
                  <span
                    className={`${categorycss.orderStatus} ${
                      categorycss[o.status]
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
                <div className={categorycss.orderDetails}>
                  <p>
                    <strong>User ID:</strong> {o?.user?.Email}
                  </p>
                  <p>
                    <strong>Farmer ID:</strong> {o?.farmer?.user?.Email}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatDate(o.created_at)}
                  </p>
                  <p>
                    <strong>Amount:</strong> ${o.paid_amount}
                  </p>

                  <p>
                    <strong>Total:</strong> {o.total}
                  </p>
                  <p>
                    <strong>Items:</strong> {o.order_items.length}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Order;
