import React, { useEffect, useState } from "react";
import UserHeader from "../../../../Components/UserHeader/UserHeader";
import style from "../Profile/Profile.module.css";
import logincss from "../../Login/Login.module.css";
import register from "../../Register/Register.module.css";
import { setToken } from "../../../../Slices/Access";

import UserprofileSidebar from "../../../../Components/UserprofileSidebar/UserprofileSidebar";
import axios from "../../../../Config/Axios";
import { useDispatch, useSelector } from "react-redux";
import { UserRegistered } from "../../../../Slices/UserSlice";
import { useNavigate } from "react-router-dom";
import { Api_base } from "../../../../Config/Constants";
import cartcss from "./cart.module.css";
const Cart = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [cart, setcart] = useState([]);
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

    const fetchcart = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        const cart = await axios.get("customer/profile/add/cart/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setcart(cart.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchcart();

    localStorage.removeItem("shipaddress");
  }, []);

  const handleupdate = async (e, id) => {
    try {
      const accessToken = localStorage.getItem("access_token");

      const update = await axios.patch(
        `customer/profile/edit/cart/${id}/`,
        { quantity: e },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setcart((prevCart) =>
        prevCart.map((obj) =>
          obj.id === update.data.id
            ? { ...obj, quantity: update.data.quantity }
            : obj
        )
      );
    } catch (E) {
      console.log(E);
    }
  };

  const hadledelete = async (id) => {
    try {
      const accessToken = localStorage.getItem("access_token");

      const update = await axios.delete(`customer/profile/edit/cart/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if ((update.status = 204)) {
        setcart((prevCart) => prevCart.filter((obj) => obj.id !== id));
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <UserprofileSidebar />

      <div className={style.content}>
        <hr id={style.sepratehr} />

        <div className={cartcss.innerdiv}>
          <div>
            {cart.map((obj) => (
              <>
                {" "}
                <div className={cartcss.cartdetaildiv}>
                  <img
                    className={cartcss.cartimage}
                    src={Api_base + obj.crop.image.image}
                    alt=""
                  />
                  <h6>{obj.crop.category.categoryName}</h6>
                  <h6>{obj.crop.cropName}</h6>
                  <h6>{parseInt(obj.crop.price)}/kg</h6>

                  <h6>{parseInt(obj.crop.price) * parseInt(obj.quantity)}</h6>

                  <select
                    onChange={(e) => handleupdate(e.target.value, obj.id)}
                    name=""
                    id=""
                  >
                    <option value={obj?.quantity}>{obj?.quantity}</option>

                    {Array(obj.crop.quantity || 0)
                      .fill(null)
                      .map((_, index) => (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() =>
                      navigate(`/crop/buy/${obj.crop.slug}`, { state: obj.id })
                    }
                    className={cartcss.buybutton}
                  >
                    Buy
                  </button>
                  <svg
                    onClick={() => hadledelete(obj.id)}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-trash3-fill"
                    viewBox="0 0 16 16"
                    style={{ color: "red", cursor: "pointer" }}
                  >
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                  </svg>
                </div>
                <hr />
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
