import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken, removetoken } from "../../../Slices/Access";
import axios from "../../../Config/Axios";
import { UserRegistered } from "../../../Slices/UserSlice";
import FarmerHeader from "../../../Components/FarmerHeader/FarmerHeader";
import FarmerSidebar from "../../../Components/FarmerSidebar/FarmerSidebar";
import style from "../Home/Home.module.css";
import { Api_base } from "../../../Config/Constants";
import salecss from "./Sale.module.css";
const Sale = () => {
  const dispatch = useDispatch();
  const { access, refresh } = useSelector((state) => state.Token);
  const { user } = useSelector((state) => state.user);

  const [crop, setcrop] = useState([]);
  const [quickcrop, setquickcrop] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        const getuser = await axios.get(`currentuser/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!getuser.data.is_staff) {
          navigate("/");
        }
        dispatch(UserRegistered(getuser.data));
      } catch (e) {
        console.log(e);
        navigate("/");
      }
    };

    fetchUser();

    const fetchCrop = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        const data = await axios.get(`farmer-main/crop/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setcrop(data.data);

        setquickcrop(data.data.filter((o) => o.quickSale));
      } catch (e) {
        console.log(e);
      }
    };
    fetchCrop();
  }, [access, user.id]);

  const handlequicksale = async (id, quick) => {
    const accessToken = localStorage.getItem("access_token");
    try {
      const data = await axios.patch(
        `farmer-main/cropcrud/${id}/`,
        { quickSale: !quick },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setquickcrop((prevQuickCrop) => {
        if (!data.data.quickSale) {
          return prevQuickCrop.filter((crop) => crop.id !== data.data.id);
        } else {
          return [...prevQuickCrop, data.data];
        }
      });
      setcrop((prevCrop) =>
        prevCrop.map((crop) => (crop.id === data.data.id ? data.data : crop))
      );
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <FarmerHeader />

      <div style={{ display: "flex" }}>
        <FarmerSidebar />
        <div className={style.content}>
          <h2 className="text-center mt-4">Quick sale</h2>

          <div className={` mt-4 ${salecss.quickflexdiv}`}>
            {quickcrop.map((o) => (
              <div>
                <img
                  className={salecss.quickimage}
                  src={Api_base + o.image.image}
                  alt=""
                />
              </div>
            ))}
          </div>

          <div style={{ textAlign: "end", width: "75%", margin: "auto" }}>
            <button
              onClick={() => navigate("/farmer/sale/add/crop")}
              className={`mt-3 ${salecss.addcropbutton}`}
            >
              Add crop
            </button>
          </div>
          <div className="m-auto mt-4 col-12 col-md-10 col-lg-8    ">
            {crop.map((o) => (
              <div className={salecss.cropflexdiv}>
                <img
                  className={salecss.cropimg}
                  src={Api_base + o.image.image}
                  alt=""
                />
                <h6>{o.category.categoryName}</h6>
                <h6>{o.cropName}</h6>
                <h6>{o.price}/kg</h6>
                <h6>{o.quantity} kg</h6>
                <svg
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/farmer/sale/edit/crop/${o.id}`)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pencil-fill text-primary"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                </svg>

                <div onClick={() => handlequicksale(o.id, o.quickSale)}>
                  {o.quickSale ? (
                    <button
                      style={{ background: "#FE0D0D" }}
                      className={salecss.cropquickbutton}
                    >
                      Remove from quick sale
                    </button>
                  ) : (
                    <button
                      style={{ background: "#4FBF61" }}
                      className={salecss.cropquickbutton}
                    >
                      Add to quick sale
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sale;
