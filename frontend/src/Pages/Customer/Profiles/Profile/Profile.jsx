import React, { useEffect } from "react";
import UserHeader from "../../../../Components/UserHeader/UserHeader";
import style from "./Profile.module.css";

import logincss from "../../Login/Login.module.css";
import register from "../../Register/Register.module.css";
import { setToken } from "../../../../Slices/Access";

import UserprofileSidebar from "../../../../Components/UserprofileSidebar/UserprofileSidebar";
import axios from "../../../../Config/Axios";
import { useDispatch, useSelector } from "react-redux";
import { UserRegistered } from "../../../../Slices/UserSlice";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
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
      } catch (e) {
        navigate("/");
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <UserprofileSidebar />

      <div className={style.content}>
        <hr id={style.sepratehr} />

        <div className={register.innerdiv}>
          {user && (
            <div className={logincss.inpdiv} style={{ top: 0 }}>
              <div>
                <label htmlFor="">First name:-</label>
                <h6 className={`w-100  ${logincss.inp}`}>{user.First_name}</h6>
              </div>

              <div>
                <label htmlFor="">Last name:-</label>
                <h6 className={`w-100  ${logincss.inp}`}>{user.Last_name}</h6>
              </div>

              <div>
                <label htmlFor="">Email:-</label>

                <h6 className={`w-100  ${logincss.inp}`}>{user.Email}</h6>
              </div>

              <div>
                <label htmlFor="">Address:-</label>

                <h6 className={`w-100  ${logincss.inp}`}>{user.Address}</h6>
              </div>
              <div>
                <label htmlFor="">Phone number:-</label>

                <h6 className={`w-100  ${logincss.inp}`}>
                  {user.Phone_number}
                </h6>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <label htmlFor="">Country:-</label>

                <h6 className={`${logincss.inp} ${register.width40}`}>
                  {user.Country}
                </h6>

                <label htmlFor="" style={{ zIndex: "10" }}>
                  State:-
                </label>

                <h6 className={`${logincss.inp} ${register.width40}`}>
                  {user.State}
                </h6>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <label htmlFor="">Postal Code:-</label>

                <h6 className={`${logincss.inp} ${register.width40}`}>
                  {user.postal_code}
                </h6>
                <label htmlFor="" style={{ zIndex: "10" }}>
                  District:-
                </label>

                <h6 className={`${logincss.inp} ${register.width40}`}>
                  {user.District}
                </h6>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
