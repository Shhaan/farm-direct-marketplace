import React, { useEffect, useState } from "react";
import AdminSidebar from "../../../Components/AdminSidebar/AdminSidebar";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import AdminDashbord from "../../../Components/AdminDashbord/AdminDashbord";

import axios from "../../../Config/Axios";
import { useNavigate } from "react-router-dom";
import { setToken } from "../../../Slices/Access";
import { useDispatch } from "react-redux";
import categorycss from "../Category/Category.module.css";
const Dashboard = () => {
  const [side, settoggleside] = useState(true);
  const [access_token, setaccess_token] = useState(
    localStorage.getItem("access_token")
      ? localStorage.getItem("access_token")
      : ""
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  }, []);

  return (
    <React.Fragment>
      <AdminHeader side={side} toggleSidebar={() => settoggleside((p) => !p)} />

      <div className={categorycss.maindiv}>
        <AdminSidebar side={side} />
        <div
          className={`${categorycss.content} ${
            side ? "" : categorycss.noSidebar
          }`}
        >
          <AdminDashbord />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
