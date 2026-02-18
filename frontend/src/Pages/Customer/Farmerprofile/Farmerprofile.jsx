import React, { useEffect, useState } from "react";
import UserHeader from "../../../Components/UserHeader/UserHeader";
import axios from "../../../Config/Axios";
import Userfooter from "../../../Components/userFooter/UserFooter";
import { Api_base } from "../../../Config/Constants";
import style from "./farmerprofile.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Aboutproduct = () => {
  const navigate = useNavigate();
  const [farmer, setfarmer] = useState({});
  const [selectedParent, setSelectedParent] = useState(null);
  const [farmerreview, setfarmerreview] = useState([]);
  const [following, setfollowing] = useState(false);

  const [crops, setfarmercrops] = useState([]);
  const { slug } = useParams();

  useEffect(() => {
    const fetchfarmer = async () => {
      try {
        const { data } = await axios.get(
          `customer/profile/farmer-profile/${slug}/`
        );

        setfarmer(data);
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchfarmer();

    const fetchFarmerReview = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const { data } = await axios.get(
          `customer/profile/farmers-review/${slug}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setfarmerreview(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchFarmerReview();

    const Isfollowingfarmer = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const { data } = await axios.get(
          `customer/profile/isfollowing/${slug}/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setfollowing(data.isFollowing);
      } catch (e) {
        console.log(e);
      }
    };
    Isfollowingfarmer();

    const Farmerscrop = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const { data } = await axios.get(`customer/profile/crops/${slug}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setfarmercrops(data);
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    };
    Farmerscrop();
  }, [slug]);

  const followfarmer = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      const { data } = await axios.delete(
        `customer/profile/isfollowing/${slug}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setfollowing(data.isFollowing);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <UserHeader />
      <div
        className="py-4 pt-5 text-center"
        style={{
          width: "100%",
          background: "#77E87B",
          opacity: "0.8",
        }}
      >
        <div className={style.container}>
          <div>
            <div className={style.leftColumn}>
              <div className={style.profileHeader}>
                <img
                  className={style.profileImage}
                  src={farmer?.farmer_photo}
                  alt="Profile"
                />
                <h1>{farmer?.user?.First_name + farmer?.user?.Last_name}</h1>
              </div>
              <div className={style.actionButtons}>
                {/* <button
                  onClick={() =>
                    navigate("/inbox", { state: farmer?.user?.id })
                  }
                  className={style.messageButton}
                >
                  Message
                </button> */}
                {following ? (
                  <button
                    onClick={followfarmer}
                    className={style.followingButton}
                  >
                    Following
                  </button>
                ) : (
                  <button onClick={followfarmer} className={style.followButton}>
                    Follow
                  </button>
                )}
              </div>
              <div className={style.bioSection}>
                <p>
                  <strong>Bio:</strong> {farmer?.Bio}
                </p>
                <p>
                  <strong>Cultivating crops:</strong>{" "}
                  {farmer?.cultivatingCrop?.Cropname}
                </p>

                <p>
                  <strong>Location:</strong> {farmer?.Location}
                </p>
              </div>
            </div>

            <div className={style.reviewsSection}>
              <h4>Reviews</h4>

              {farmerreview.map((obj) => (
                <div className={style.review}>
                  <p>
                    <strong>{obj.user.First_name}</strong> {obj.review}
                  </p>

                  <div className={style.rating}>
                    {Array.from({ length: obj.rating }, (_, index) => (
                      <span key={index}>⭐</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className={style.rightColumn}>
              <div className={style.fieldPhotos}>
                <h4>Field photos</h4>
                <div className={style.photos}>
                  {farmer?.feildPhoto &&
                    Array.isArray(farmer.feildPhoto) &&
                    farmer.feildPhoto.map((o, index) => (
                      <img
                        key={index}
                        src={o.Feild_photo}
                        alt={`Field ${index + 1}`}
                      />
                    ))}
                </div>
              </div>
              <div className={style.sellingCrops}>
                <h4>Selling crops</h4>
                {crops.map((obj) => (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/crop/${obj.slug}`)}
                    className={`mb-5 ${style.cropItem}`}
                  >
                    <img src={Api_base + obj.image.image} alt="Crop" />
                    <p>{obj.cropName}</p>
                    <p>{obj.category.categoryName}</p>
                    <p>{obj.quantity}/kg</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Userfooter />
    </div>
  );
};

export default Aboutproduct;
