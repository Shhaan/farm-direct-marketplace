import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../../../Config/Axios";
import { UserRegistered } from "../../../Slices/UserSlice";
import FarmerHeader from "../../../Components/FarmerHeader/FarmerHeader";
import FarmerSidebar from "../../../Components/FarmerSidebar/FarmerSidebar";
import style from "./Home.module.css";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─── Helpers ────────────────────────────────────────────────────────────────

const groupByDate = (orders) => {
  const map = {};
  orders.forEach((order) => {
    const date = order.created_at?.slice(0, 10) || "Unknown";
    if (!map[date]) map[date] = { date, orders: 0, sales: 0 };
    map[date].orders += 1;
    map[date].sales += parseFloat(order.total || 0);
  });
  return Object.values(map).sort((a, b) => (a.date > b.date ? 1 : -1));
};

const groupByStatus = (orders) => {
  const map = {};
  orders.forEach((order) => {
    const s = order.status || "pending";
    map[s] = (map[s] || 0) + 1;
  });
  return Object.entries(map).map(([status, count]) => ({ status, count }));
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(15,20,15,0.95)",
          border: "1px solid #2a4a2a",
          borderRadius: 10,
          padding: "10px 16px",
          color: "#c8f0c8",
          fontSize: 13,
        }}
      >
        <p style={{ marginBottom: 4, color: "#6fcf6f" }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ margin: "2px 0", color: p.color }}>
            {p.name}: <strong>{p.name === "sales" ? `$${p.value}` : p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Component ───────────────────────────────────────────────────────────────

const Home = () => {
  const dispatch = useDispatch();
  const { access } = useSelector((state) => state.Token);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [stats, setStats] = useState({ totalOrders: 0, followers: 0, totalSales: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);       // daily orders + sales
  const [statusData, setStatusData] = useState([]);     // orders by status
  const [chartFilter, setChartFilter] = useState("week");

  useEffect(() => {
    const token = () => localStorage.getItem("access_token");

    const fetchUser = async () => {
      try {
        const res = await axios.get("currentuser/", {
          headers: { Authorization: `Bearer ${token()}` },
        });
        if (!res.data.is_staff) navigate("/");
        dispatch(UserRegistered(res.data));
      } catch {
        navigate("/login");
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await axios.get("farmer-main/orders/", {
          headers: { Authorization: `Bearer ${token()}` },
        });
        const orders = res.data;

        const totalSales = orders.reduce((s, o) => s + parseFloat(o.total || 0), 0);
        setStats((p) => ({ ...p, totalOrders: orders.length, totalSales }));
        setRecentOrders(orders.slice(0, 5));
        setStatusData(groupByStatus(orders));

        // Filter for chart
        applyChartFilter(orders, chartFilter);
      } catch (e) {
        console.log(e);
      }
    };

    const fetchFollowers = async () => {
      try {
        const res = await axios.get("farmer-main/follower/", {
          headers: { Authorization: `Bearer ${token()}` },
        });
        if (res.data.count) setStats((p) => ({ ...p, followers: res.data.count }));
      } catch (e) {
        console.log(e);
      }
    };

    fetchUser();
    fetchOrders();
    fetchFollowers();
    // eslint-disable-next-line
  }, [access]);

  const applyChartFilter = (orders, filter) => {
    const now = new Date();
    let cutoff;
    if (filter === "week") cutoff = new Date(now - 7 * 86400000);
    else if (filter === "month") cutoff = new Date(now - 30 * 86400000);
    else cutoff = new Date(now - 365 * 86400000);

    const filtered = orders.filter((o) => new Date(o.created_at) >= cutoff);
    setChartData(groupByDate(filtered.length ? filtered : orders));
  };

  const handleFilterChange = async (filter) => {
    setChartFilter(filter);
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.get("farmer-main/orders/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      applyChartFilter(res.data, filter);
    } catch (e) {
      console.log(e);
    }
  };

  const statusColors = {
    pending: "#f0a500",
    completed: "#4caf50",
    cancelled: "#ef5350",
    shipped: "#42a5f5",
    delivered: "#66bb6a",
  };

  return (
    <div className={style.farmerDashboard}>
      <FarmerHeader />
      <div className={style.dashboardLayout}>
        <FarmerSidebar />
        <div className={style.content}>

          {/* Welcome */}
          <div className={style.welcomeSection}>
            <div className={style.welcomeContent}>
              <h1 className={style.welcomeTitle}>
                Welcome back, {user?.First_name || "Farmer"}! 🌱
              </h1>
              <p className={style.welcomeSubtitle}>
                Here's what's happening with your farm today
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className={style.statsGrid}>
            
            <div className={style.statCard}>
              <div className={style.statHeader}>
                <div className={`${style.statIcon} ${style.orders}`}>📦</div>
              </div>
              <div className={style.statValue}>{stats.totalOrders}</div>
              <div className={style.statLabel}>Total Orders</div>
            </div>
            <div className={style.statCard}>
              <div className={style.statHeader}>
                <div className={`${style.statIcon} ${style.followers}`}>👥</div>
              </div>
              <div className={style.statValue}>{stats.followers}</div>
              <div className={style.statLabel}>Followers</div>
            </div>
            <div className={style.statCard}>
              <div className={style.statHeader}>
                <div className={`${style.statIcon} ${style.earnings}`}>💰</div>
              </div>
              <div className={style.statValue}>${stats.totalSales.toFixed(2)}</div>
              <div className={style.statLabel}>Total Sales</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className={style.chartsRow}>

            {/* Sales & Orders Area Chart */}
            <div className={style.chartCard} style={{ flex: 2 }}>
              <div className={style.cardTitle}>
                Sales & Orders Overview
                <div className={style.chartFilters}>
                  {["week", "month", "year"].map((f) => (
                    <button
                      key={f}
                      className={`${style.filterBtn} ${chartFilter === f ? style.active : ""}`}
                      onClick={() => handleFilterChange(f)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ width: "100%", height: 260 }}>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4caf50" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#81c784" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#81c784" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e3a1e" />
                      <XAxis dataKey="date" tick={{ fill: "#6a9a6a", fontSize: 11 }} />
                      <YAxis yAxisId="sales" orientation="left" tick={{ fill: "#6a9a6a", fontSize: 11 }} />
                      <YAxis yAxisId="orders" orientation="right" tick={{ fill: "#6a9a6a", fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: "#6a9a6a", fontSize: 12 }} />
                      <Area
                        yAxisId="sales"
                        type="monotone"
                        dataKey="sales"
                        stroke="#4caf50"
                        strokeWidth={2}
                        fill="url(#salesGrad)"
                        name="sales"
                      />
                      <Area
                        yAxisId="orders"
                        type="monotone"
                        dataKey="orders"
                        stroke="#81c784"
                        strokeWidth={2}
                        fill="url(#ordersGrad)"
                        name="orders"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#555" }}>
                    No order data available yet
                  </div>
                )}
              </div>
            </div>

          
          </div>

        

          {/* Recent Orders Table */}
          <div className={style.ordersCard}>
            <div className={style.cardTitle}>
              Recent Orders
              <button className={style.viewOrderBtn} onClick={() => navigate("/farmer/orders")}>
                View All
              </button>
            </div>
            <div className={style.ordersTable}>
              <div className={`${style.orderRow} ${style.orderHeader}`}>
                <div>Order ID</div>
                <div>Customer</div>
                <div>Amount</div>
                <div>Payment</div>
                <div>Status</div>
                <div>Action</div>
              </div>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className={style.orderRow}>
                    <div className={style.orderCell}>#{order.id}</div>
                    <div className={style.orderCell}>{order.user?.Email}</div>
                    <div className={style.orderCell}>${order.total}</div>
                    <div className={style.orderCell}>{order.payment_method || "—"}</div>
                    <div className={style.orderCell}>
                      <span
                        className={`${style.orderStatus} ${style[order.status?.toLowerCase() || "pending"]}`}
                      >
                        {order.status || "Pending"}
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
                <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
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