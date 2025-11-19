import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Config/Axios";
import { useDispatch, useSelector } from "react-redux";
import {
  UserLogLoading,
  UserRegistered,
  UserRegistrationerr,
  UserisFarmer,
} from "../../Slices/UserSlice";
import styles from "./UserHeader.module.css";
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

        console.log(e);
      }
    };

    fetchUser();
  }, []);

  return (
    <header>
      <div className={styles.rectangleParent}>
        <img className={styles.preview15} loading="lazy" alt="" src={bag} />
        <div className={styles.frameWrapper}>
          <div className={styles.frameParent}>
            <div onClick={() => navigate("/")} className={styles.homeWrapper}>
              <div className={styles.home}>Home</div>
            </div>

            <div
              className={styles.categoryWrapper}
              onMouseLeave={() => setfarmermouse((e) => (e = false))}
              onMouseOver={() => setfarmermouse((e) => (e = true))}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/farmer`)}
                className={styles.farmers}
              >
                Farmers
              </div>
            </div>
            <div
              onClick={() => navigate("/market")}
              className={styles.marketWrapper}
            >
              <div className={styles.market}>Market</div>
            </div>
            <div
              onClick={() => navigate("/aboutitem")}
              className={styles.aboutProductsWrapper}
            >
              <div className={styles.aboutProducts}>About items</div>
            </div>

            <div className={styles.farmersWrapper}>
              <div className={styles.farmers}>Contact Us</div>
            </div>

            <div className={`${styles.frameGroup} ${user ? "col-2" : "col-3"}`}>
              <div className={styles.frameItem} />

              {user ? (
                <div
                  className={styles.radixiconcrossWrapper}
                  onClick={() => navigate("/profile")}
                >
                  <div className={styles.user}>{user.First_name}</div>
                </div>
              ) : (
                <>
                  <div
                    className={styles.radixiconcrossWrapper}
                    onClick={() => navigate("/register")}
                  >
                    <div className={styles.user}>Register</div>
                  </div>

                  <div
                    className={styles.radixiconcrossWrapper}
                    onClick={() => navigate("/login")}
                  >
                    <div className={styles.user}>Login</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.toggle}>
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
        <div className={styles.mobileSize}>
          <ul style={{ padding: "0" }}>
            <li onClick={() => navigate("/")} className={styles.list}>
              Home
            </li>
            <li className={styles.list} onClick={() => navigate(`/farmer`)}>
              Farmers
            </li>

            <li className={styles.list}>Market</li>

            <li
              onClick={() => navigate("/aboutproduct")}
              className={styles.list}
            >
              About items
            </li>
            <li className={styles.list}>Contact Us</li>

            {user ? (
              <li onClick={() => navigate("/profile")} className={styles.list}>
                {user.First_name}
              </li>
            ) : (
              <>
                <li
                  onClick={() => navigate("/register")}
                  className={styles.list}
                >
                  Register
                </li>
                <li onClick={() => navigate("/login")} className={styles.list}>
                  Login
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
