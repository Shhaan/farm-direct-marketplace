import React, { useEffect, useState } from "react";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import AdminSidebar from "../../../Components/AdminSidebar/AdminSidebar";
import categorycss from "../Category/Category.module.css";
import axios from "../../../Config/Axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDate } from "../../../utils/dateFormatter";

const Order = () => {
  const { access } = useSelector((state) => state.Token);
  const [order, setOrder] = useState({});
  const [side, settoggleside] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`admin-main/admin-orders/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setOrder(response.data);
      } catch (e) {
        console.log(e);
        if (
          e.response &&
          (e.response.status === 401 || e.response.status === 403)
        ) {
          navigate("/admin/login");
        }
      }
    };
    fetchOrder();
  }, [access, id, navigate]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await axios.patch(
        `admin-main/admin-orders/${id}/update-status/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setOrder(response.data);
    } catch (error) {
      console.error("Error updating order status:", error);
      // Optionally, add user feedback here (e.g., error toast)
    }
  };

  return (
    <React.Fragment>
      <div onClick={() => settoggleside((p) => !p)}>
        <AdminHeader
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
        style={{ paddingTop: "100px" }}
      >
        <div
          className={`${categorycss.orderdetailcontent} m-auto col-12 col-lg-10`}
        >
          <h3 className={`${categorycss.orderTitle} text-center mb-4`}>
            Order Details
          </h3>
          <div className={categorycss.orderCard}>
            <div className={categorycss.orderHeader}>
              <h5>
                Order ID: <span>{order.id}</span>
              </h5>
              <span className={categorycss.orderStatus}>
                Status:
                <select
                  value={order.status || ""}
                  onChange={handleStatusChange}
                  className={`${categorycss.statusDropdown} ${
                    order.status === "pending"
                      ? categorycss.statusPending
                      : order.status === "completed"
                      ? categorycss.statusCompleted
                      : ""
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </span>
            </div>
            <div className={`${categorycss.orderInfo} row`}>
              <div className={`${categorycss.infoGroup} col-md-6 mb-3`}>
                <h6>Farmer Details</h6>
                {order.farmer && (
                  <>
                    <p>
                      <strong>Name:</strong> {order.farmer.user.First_name}{" "}
                      {order.farmer.user.Last_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.farmer.user.Email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.farmer.user.Phone_number}
                    </p>
                    <p>
                      <strong>Location:</strong> {order.farmer.Location}
                    </p>
                  </>
                )}
              </div>
              <div className={`${categorycss.infoGroup} col-md-6 mb-3`}>
                <h6>Customer Details</h6>
                {order.user && (
                  <>
                    <p>
                      <strong>Name:</strong> {order.user.First_name}{" "}
                      {order.user.Last_name}
                    </p>
                    <p>
                      <strong>Email:</strong> {order.user.Email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.user.Phone_number}
                    </p>
                    <p>
                      <strong>Address:</strong> {order.user.Address},{" "}
                      {order.user.District}, {order.user.State},{" "}
                      {order.user.Country} - {order.user.postal_code}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className={categorycss.orderItems}>
              <h6>Order Items</h6>
              <div className="table-responsive">
                <table className={`${categorycss.itemsTable} table`}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.order_items &&
                      order.order_items.map((item) => (
                        <tr key={item.id}>
                          <td>{item.crop.cropName}</td>
                          <td>{item.quantity}</td>
                          <td>${item.crop.price}</td>
                          <td>${item.total}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={categorycss.orderTotal}>
              <h6>
                Total Amount: <span>${order?.total}</span>
              </h6>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Order;
