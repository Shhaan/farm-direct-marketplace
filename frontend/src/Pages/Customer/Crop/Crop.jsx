import React, { useEffect, useState } from "react";
import UserHeader from "../../../Components/UserHeader/UserHeader";
import UserFooter from "../../../Components/userFooter/UserFooter";
import { useDispatch, useSelector } from "react-redux";
import { UserRegistered } from "../../../Slices/UserSlice";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../Config/Axios";
import style from "./Crop.module.css";
import { Api_base } from "../../../Config/Constants";
import styles from "../Home/User.module.css";
import toast from "react-hot-toast";

const Market = () => {
  const dispatch = useDispatch();
  const { access, refresh } = useSelector((state) => state.Token);
  const [crops, setCrops] = useState({});
  const { slug } = useParams();
  const navigate = useNavigate();
  const [quantity, selectquantity] = useState(1);
  const [showError, setShowError] = useState(false);
  const [review, setreivew] = useState([]);
  const [relatedcrop, setrelatedcrop] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
          const getUser = await axios.get(`currentuser/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          dispatch(UserRegistered(getUser.data));
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchUser();

    const fetchCrop = async () => {
      try {
        const { data } = await axios.get(
          `customer/profile/crop/detail/${slug}/`
        );

        const givenDate = new Date(data.createdAt);
        const currentDate = new Date();
        const timeDifference = currentDate - givenDate;
        const millisecondsPerDay = 1000 * 60 * 60 * 24;
        const dayDifference = Math.floor(timeDifference / millisecondsPerDay);
        data.createdAt = dayDifference;
        console.log(data);
        setCrops({ ...data });
      } catch (e) {
        console.log(e);
      }
    };

    fetchCrop();

    const fetchreview = async () => {
      try {
        const review = await axios.get(`customer/profile/crop-review/${slug}/`);
        setreivew(review.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchreview();
    const fetchcrop = async () => {
      try {
        const data = await axios.get("customer/profile/crop/all/");

        setrelatedcrop(data.data);
        console.log(data.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchcrop();
  }, [access, dispatch, slug]);

  const handlecart = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      const data = await axios.post(
        "customer/profile/add/cart/",
        { quantity, slug },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (data.status == 201) {
        toast.success(` ${quantity} quantity added`, 5000);
      }
    } catch (e) {
      if ((e.response.status = 401)) {
        setShowError(true);
        const timeoutId = setTimeout(() => setShowError(false), 10000);

        return () => clearTimeout(timeoutId);
      }
    }
  };
  return (
    <div>
      <UserHeader />

      {showError && (
        <div className={style.errorBox}>
          <p style={{ color: "red" }}>
            You must login for adding product to cart
          </p>
          <button onClick={() => navigate("/login")}>Login</button>
        </div>
      )}
      <section className={`pt-4 ${style.content}`}>
        <h2 className="text-center text-white">{crops.cropName}</h2>
        <div className={style.mainflexdiv}>
          <div>
            {Array.isArray(crops.image) && crops.image.length > 0 && (
              <img
                style={{ height: "111px" }}
                alt=""
                src={Api_base + crops.image[0].image}
              />
            )}
            <div style={{ width: "300px", position: "absolute" }}>
              <h6 className="text-white text-center mt-4">
                {crops.About ? crops.About : ""}
              </h6>
            </div>
          </div>
          <hr id={style.hr} />
          <div style={{ width: "19%" }}>
            <div className={style.flexcontenddiv}>
              <h6>Name of farmer: {crops.farmer?.user?.First_name || ""}</h6>
              <h6>Type of: {crops.parent?.categoryName || ""}</h6>
              <h6>Variety of: {crops.category?.categoryName || ""}</h6>
              <h6>Price: {crops.price || ""}/kg</h6>
              <h6>Available: {crops.quantity || ""}kg</h6>
            </div>
            <div className={style.addcartflexdiv}>
              <button className={style.addcart} onClick={handlecart}>
                Add to cart
              </button>

              <select
                className={style.selectquantity}
                onChange={(e) => selectquantity(e.target.value)}
              >
                {Array(crops.quantity || 0)
                  .fill(null)
                  .map((_, index) => (
                    <option key={index} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-center m-0 text-white">Review</h3>
          <h6
            style={{ marginLeft: "200px" }}
            className="text-center text-white  "
          >
            Add review
          </h6>
          <div className={style.reviewmainflexdiv}>
            {review.map((o) => (
              <div className={style.reviewsubdiv}>
                <h6 style={{ fontSize: "10px" }}>{o?.user?.First_name}</h6>
                <h6 className="p-2">{o?.review}</h6>
              </div>
            ))}
          </div>
        </div>
      </section>

      <h3 className="text-center">Related crop</h3>

      <div className={style.relatedcropmaindiv}>
        {relatedcrop
          .filter(
            (o, i) => o?.category?.parent_id == crops?.parent?.id && i < 4
          )
          .map((obj) => (
            <div
              className={styles.userHomeChild1}
              onClick={() => navigate(`/crop/${obj.slug}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                style={{
                  width: "290px",
                  borderRadius: "8px 9px 0 0",
                  height: "160px",
                }}
                src={Api_base + obj?.image?.image}
                alt=""
              />
              <div className={styles.corn} style={{ color: "white" }}>
                {obj?.cropName}
              </div>
              <div className="ps-2">
                <div className={styles.pricePerKg}>
                  Price per kg : {obj?.price}
                </div>
                <div className={styles.locationGujarat}>
                  Location : {obj?.farmer?.Location}
                </div>

                <div className={styles.farmerName}>
                  Farmer name : {obj?.farmer?.user?.First_name}
                </div>
              </div>
              <div className={`ps-1 pt-2 ${styles.farmerName}`}>
                {obj?.About}
              </div>
            </div>
          ))}
      </div>

      <UserFooter />
    </div>
  );
};

export default Market;
