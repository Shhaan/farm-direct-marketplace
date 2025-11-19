import React, { useEffect, useState } from "react";
import UserHeader from "../../../../Components/UserHeader/UserHeader";
import style from "../Profile/Profile.module.css";
import logincss from "../../Login/Login.module.css";
import register from "../../Register/Register.module.css";
import followerstyle from "./Following.module.css";
import UserprofileSidebar from "../../../../Components/UserprofileSidebar/UserprofileSidebar";
import axios from "../../../../Config/Axios";
import { useDispatch, useSelector } from "react-redux";
import { UserRegistered } from "../../../../Slices/UserSlice";
import { useNavigate } from "react-router-dom";
const Following = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [follower, setfollower] = useState([]);
  const dispatch = useDispatch();
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

          dispatch(UserRegistered(getuser.data));
          console.log(getuser.data);
        } else {
          navigate("/");
        }
      } catch (e) {
        console.log(e);

        navigate("/");
      }
    };

    fetchUser();

    const fetchfollower = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        const { data } = await axios.get(`customer/profile/follower/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log(data);
        setfollower(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchfollower();
  }, []);

  const hanleunfollow = async (id) => {
    try {
      const accessToken = localStorage.getItem("access_token");

      const { data } = await axios.delete(
        `customer/profile/follower/edit/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(data);
      setfollower((prevFollowers) => {
        return prevFollowers.filter((follower) => follower.id !== id);
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <UserprofileSidebar />

      <div className={style.content}>
        <hr id={style.sepratehr} />

        <div className={register.innerdiv}>
          <div>
            {follower.map((obj) => (
              <div className={followerstyle.folowerdiv}>
                <img
                  style={{
                    height: "30px",
                    width: "32px",
                    borderRadius: "37px",
                  }}
                  src={obj?.farmer?.farmer_photo}
                  alt=""
                />
                <h6>{obj?.farmer?.user?.First_name}</h6>

                <h6>{obj?.farmer?.Location}</h6>

                <h6
                  onClick={() => hanleunfollow(obj.id)}
                  style={{ cursor: "pointer" }}
                  className="text-danger"
                >
                  Unfollow
                </h6>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Following;
