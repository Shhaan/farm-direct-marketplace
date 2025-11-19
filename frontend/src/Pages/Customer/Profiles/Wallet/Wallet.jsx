import React, { useEffect, useState } from "react";
import UserHeader from "../../../../Components/UserHeader/UserHeader";
import style from "../Profile/Profile.module.css";

import logincss from "../../Login/Login.module.css";
import register from "../../Register/Register.module.css";
import { setToken } from "../../../../Slices/Access";

import UserprofileSidebar from "../../../../Components/UserprofileSidebar/UserprofileSidebar";
import Userprofilesidebarmobile from "../../../../Components/UserprofileSidebar/Userprofilesidebarmobile";

import axios from "../../../../Config/Axios";
import { useDispatch, useSelector } from "react-redux";
import { UserRegistered } from "../../../../Slices/UserSlice";
import { useNavigate } from "react-router-dom";
const Wallet = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [wallet, setwallet] = useState([]);
  const dispatch = useDispatch();
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
        console.log(getuser.data);
      } catch (e) {
        console.log(e);

        navigate("/");
      }
    };

    fetchUser();

    const fetchWallet = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        const { data } = await axios.get(`customer/profile/wallet/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setwallet(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchWallet();
  }, []);

  return (
    <div>
      <UserprofileSidebar />

      <div style={{ height: "100vh" }} className={style.content}>
        <hr id={style.sepratehr} />

        <div className={register.innerdiv}>
          <div>
            {wallet.map((o) => (
              <div className={style.walletdiv}>
                <h4 className={style.walleth1}>Balance amount:{o.amount} </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
