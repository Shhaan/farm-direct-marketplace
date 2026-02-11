import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken, removetoken } from "../../../Slices/Access";
import axios from "../../../Config/Axios";
import { UserRegistered } from "../../../Slices/UserSlice";
import FarmerHeader from "../../../Components/FarmerHeader/FarmerHeader";
import FarmerSidebar from "../../../Components/FarmerSidebar/FarmerSidebar";
import style from "./Home.module.css";

const Home = () => {
  const dispatch = useDispatch();
  const { access, refresh } = useSelector((state) => state.Token);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    followers: 0,
    earnings: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

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
        } else {
          navigate("/login");
        }
      } catch (e) {
        console.log(e);
        navigate("/login");
      }
    };

    const fetchOrders = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get("farmer-main/orders/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setRecentOrders(response.data.slice(0, 5));
        setStats(prev => ({ ...prev, totalOrders: response.data.length }));
      } catch (e) {
        console.log(e);
      }
    };

    const fetchFollowers = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get("farmer-main/follower/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data.count) {
          setStats(prev => ({ ...prev, followers: response.data.count }));
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchUser();
    fetchOrders();
    fetchFollowers();
  }, [access]);

  return (
    <div className={style.farmerDashboard}>
      <FarmerHeader />

      <div className={style.dashboardLayout}>
        <FarmerSidebar />
        <div className={style.content}>
          {/* Welcome Section */}
          <div className={style.welcomeSection}>
            <div className={style.welcomeContent}>
              <h1 className={style.welcomeTitle}>
                Welcome back, {user?.First_name || 'Farmer'}! 🌱
              </h1>
              <p className={style.welcomeSubtitle}>
                Here's what's happening with your farm today
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={style.statsGrid}>
            <div className={style.statCard}>
              <div className={style.statHeader}>
                <div className={`${style.statIcon} ${style.sales}`}>🌾</div>
                <span className={`${style.statTrend} ${style.up}`}>+12%</span>
              </div>
              <div className={style.statValue}>{stats.totalSales || 24}</div>
              <div className={style.statLabel}>Active Crops</div>
            </div>

            <div className={style.statCard}>
              <div className={style.statHeader}>
                <div className={`${style.statIcon} ${style.orders}`}>📦</div>
                <span className={`${style.statTrend} ${style.up}`}>+8%</span>
              </div>
              <div className={style.statValue}>{stats.totalOrders}</div>
              <div className={style.statLabel}>Total Orders</div>
            </div>

            <div className={style.statCard}>
              <div className={style.statHeader}>
                <div className={`${style.statIcon} ${style.followers}`}>👥</div>
                <span className={`${style.statTrend} ${style.up}`}>+5%</span>
              </div>
              <div className={style.statValue}>{stats.followers}</div>
              <div className={style.statLabel}>Followers</div>
            </div>

            <div className={style.statCard}>
              <div className={style.statHeader}>
                <div className={`${style.statIcon} ${style.earnings}`}>💰</div>
                <span className={`${style.statTrend} ${style.up}`}>+15%</span>
              </div>
              <div className={style.statValue}>$2,450</div>
              <div className={style.statLabel}>Monthly Earnings</div>
            </div>
          </div>

          {/* Main Grid */}
          <div className={style.mainGrid}>
            {/* Chart Card */}
            <div className={style.chartCard}>
              <div className={style.cardTitle}>
                Sales Overview
                <div className={style.chartFilters}>
                  <button className={`${style.filterBtn} ${style.active}`}>Week</button>
                  <button className={style.filterBtn}>Month</button>
                  <button className={style.filterBtn}>Year</button>
                </div>
              </div>
              <div className={style.chartWrapper}>
                📊 Sales chart visualization
              </div>
            </div>

            {/* Quick Actions */}
            <div className={style.quickActionsCard}>
              <div className={style.cardTitle}>Quick Actions</div>
              <div 
                className={style.quickAction}
                onClick={() => navigate('/farmer/sale/add/crop')}
              >
                <div className={style.actionIcon}>🌱</div>
                <div className={style.actionContent}>
                  <div className={style.actionTitle}>Add New Crop</div>
                  <div className={style.actionDesc}>List a new product for sale</div>
                </div>
              </div>
              <div 
                className={style.quickAction}
                onClick={() => navigate('/farmer/orders')}
              >
                <div className={style.actionIcon}>📋</div>
                <div className={style.actionContent}>
                  <div className={style.actionTitle}>View Orders</div>
                  <div className={style.actionDesc}>Manage pending orders</div>
                </div>
              </div>
              <div 
                className={style.quickAction}
                onClick={() => navigate('/farmer/inbox')}
              >
                <div className={style.actionIcon}>💬</div>
                <div className={style.actionContent}>
                  <div className={style.actionTitle}>Messages</div>
                  <div className={style.actionDesc}>Chat with customers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className={style.ordersCard}>
            <div className={style.cardTitle}>
              Recent Orders
              <button 
                className={style.viewOrderBtn}
                onClick={() => navigate('/farmer/orders')}
              >
                View All
              </button>
            </div>
            <div className={style.ordersTable}>
              <div className={`${style.orderRow} ${style.orderHeader}`}>
                <div>Order ID</div>
                <div>Customer</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Action</div>
              </div>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className={style.orderRow}>
                    <div className={style.orderCell}>#{order.id}</div>
                    <div className={style.orderCell}>{order.user?.Email}</div>
                    <div className={style.orderCell}>${order.total}</div>
                    <div className={style.orderCell}>
                      <span className={`${style.orderStatus} ${style[order.status?.toLowerCase() || 'pending']}`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                    <div className={style.orderCell}>
                      <button 
                        className={style.viewOrderBtn}
                        onClick={() => navigate(`/farmer/orders/${order.id}`)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  No orders yet. Start by adding crops to sell!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
