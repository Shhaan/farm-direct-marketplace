import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Config/Axios";
import { useDispatch, useSelector } from "react-redux";
import style from "./UserprofileSidebar.module.css";

import {
  UserLogLoading,
  UserRegistered,
  UserRegistrationerr,
  UserisFarmer,
} from "../../Slices/UserSlice";
import styles from "../UserHeader/UserHeader.module.css";
import bag from "../../Asset/Image/Famlogo.jpg";
const Header = () => {
  const navigate = useNavigate();

  const [toggle, settoggle] = useState(false);
  const [farmermouse, setfarmermouse] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

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
        dispatch(UserRegistered(null));
        navigate("/");
        console.log(e);
      }
    };

    fetchUser();
  }, []);
  const handlelogout = async (e) => {
    e.preventDefault();
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      const access_token = localStorage.getItem("access_token");

      const logout = await axios.post(
        "admin/logout/",
        { refresh_token: refresh_token },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      localStorage.removeItem("refresh_token");
      localStorage.removeItem("access_token");

      if (logout.status == 205) {
        navigate("/");
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <header>
      <div className={styles.rectangleParent}>
        <img className={styles.preview15} loading="lazy" alt="" src={bag} />

        <div className={styles.toggleside}>
          {toggle ? (
            <div onClick={() => settoggle((e) => !e)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="currentColor"
                class="bi bi-x-lg"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
            </div>
          ) : (
            <div onClick={() => settoggle((e) => !e)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="currentColor"
                class="bi bi-list"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
      {toggle && (
        <div className={styles.mobileSizeside}>
          <ul style={{ padding: "0" }}>
            <li onClick={() => navigate("/")} className={styles.list}>
              Home
            </li>
            <li onClick={() => navigate("/profile")} className={styles.list}>
              profile
            </li>
            <li
              className={styles.list}
              onClick={() => navigate(`/edit/profile`)}
            >
              Profile Edit{" "}
            </li>

            {user.is_staff && (
              <li
                onClick={() => navigate("/farmer/dashboard")}
                className={styles.list}
              >
                Farmer profile
              </li>
            )}
            <li
              onClick={() => navigate("/shipping-address")}
              className={styles.list}
            >
              Shipping Address
            </li>
            <li onClick={() => navigate("/cart")} className={styles.list}>
              Cart
            </li>
            <li onClick={() => navigate("/orders")} className={styles.list}>
              Order details
            </li>
            <li onClick={() => navigate("/wallet")} className={styles.list}>
              Wallet
            </li>
            <li
              onClick={() => navigate("/following-farmer")}
              className={styles.list}
            >
              Following farmer
            </li>
            <li onClick={() => navigate("/inbox")} className={styles.list}>
              Message
            </li>
            <li
              className={style.sidebarList}
              id={style.logout}
              onClick={(e) => handlelogout(e)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-box-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
                />
                <path
                  fill-rule="evenodd"
                  d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
                />
              </svg>
              <h6 className={style.h6}> Log out</h6>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
