import React, { useEffect, useState } from "react";

import styles from "./User.module.css";
import bag from "../../../Asset/Image/userbaground.png";
import trancperency from "../../../Asset/Image/trancperency.png";
import fairtrad from "../../../Asset/Image/fairtrad.png";
import userfriendly from "../../../Asset/Image/userfriendly.png";
import toast from "react-hot-toast";

import "./Home.css";
import axios from "../../../Config/Axios";
import UserHeader from "../../../Components/UserHeader/UserHeader";
import Userfooter from "../../../Components/userFooter/UserFooter";

import { useDispatch, useSelector } from "react-redux";
import { UserRegistered } from "../../../Slices/UserSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { setToken, removetoken } from "../../../Slices/Access";
import { Api_base } from "../../../Config/Constants";
const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const { access, refresh } = useSelector((state) => state.Token);
  const [crops, setcrops] = useState([]);
  const [farmers, setfarmers] = useState([]);
  const [category, setcategory] = useState([]);
  const [faq, setfaq] = useState({ faq1: false, faq2: false, faq3: false });

  const { state } = useLocation();

  const dispatch = useDispatch();
  useEffect(() => {
    if (state && !state.log) {
      toast.error("Must Login", 5000);
    }

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

    const fetchcrop = async () => {
      try {
        const data = await axios.get("customer/profile/crop/");

        setcrops(data.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchcrop();

    const fetchfarmer = async () => {
      try {
        const data = await axios.get("customer/profile/farmer/");

        setfarmers(data.data);
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchfarmer();

    const fetchcategory = async () => {
      try {
        const data = await axios.get("customer/profile/category/home/");

        setcategory(data.data.slice(0, 4));
      } catch (e) {
        console.log(e);
      }
    };
    fetchcategory();
  }, [access]);
  return (
    <div className={styles.userHome}>
      <UserHeader />

      <div
        style={{
          backgroundImage: `url(${bag})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          width: "100%",
          justifyContent: "space-around",
        }}
      >
        <div>
          <div className={styles.fromFieldTo}>From field to your table</div>
          <div className={styles.feelTheFreshness}>Feel the freshness</div>
        </div>
        <div className={styles.userHomeChild11}>
          <div className={styles.startCultivating}>Start Cultivating</div>
          <img className={styles.mangoMixBoxPreOrderFor2} alt="" src={bag} />

          <div className={styles.mango}>Mango</div>
          <img className={styles.mangoMixBoxPreOrderFor2} alt="" src={bag} />

          <div className={styles.mango}>Mango</div>
          <img className={styles.mangoMixBoxPreOrderFor2} alt="" src={bag} />

          <div className={styles.mango}>Mango</div>
          <img className={styles.mangoMixBoxPreOrderFor23} alt="" src={bag} />

          <div className={styles.mango3}>Mango</div>
          <img className={styles.mangoMixBoxPreOrderFor23} alt="" src={bag} />
        </div>
      </div>

      <div className={`${styles.rectangleDiv}`}>
        <div className={styles.featuredItems}>Featured Crop</div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            gap: "85px",
            flexWrap: "wrap",
          }}
        >
          {crops.map((obj) => (
            <div
              onClick={() => navigate(`/crop/${obj.slug}`)}
              className={styles.userHomeChild1}
            >
              <img
                style={{
                  width: "290px",
                  borderRadius: "8px 9px 0 0",
                  height: "160px",
                }}
                src={Api_base + obj.image.image}
                alt=""
              />
              <div className={styles.corn}>{obj.cropName}</div>
              <div className="ps-2">
                <div className={styles.pricePerKg}>
                  Price per kg : {obj.price}
                </div>
                <div className={styles.locationGujarat}>
                  Location : {obj.farmer.Location}
                </div>

                <div className={styles.farmerName}>
                  Farmer name : {obj.farmer.user.First_name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className={styles.meetOurFarmers}>Meet our Farmer’s</div>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {farmers.slice(0, 4).map((o) => (
            <div
              style={{
                backgroundImage: `url(${Api_base + o.farmer_photo})`,
                backgroundSize: "cover",
                height: "199px",
                width: "302px",
              }}
            >
              <div className={styles.sudeerDas}>{o.user.First_name}</div>
              <div className={styles.itemstomatorice}>
                Items: {o.cultivatingCrop.Cropname}
              </div>
              <div className={styles.knownForLarge}>{o.Bio}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.aboutdiv}>
        <div className={` ${styles.aboutUs}`}>About Us</div>

        <div className={styles.aboutflex}>
          <div className={styles.userHomeChild28}>
            Welcome to our FarmAid, where we connect you directly with local
            farmers to bring you the freshest produce straight from the fields
            to your table. By cutting out the middlemen, we ensure fair prices
            for both farmers and customers while promoting sustainable
            agriculture practices. Browse our diverse selection of fruits,
            vegetables, grains, and more, knowing that each item is grown with
            care and harvested at its peak freshness. With transparent sourcing
            and convenient online ordering, we make it easy for you to support
            local farmers and enjoy the highest quality ingredients for your
            meals. Join us i n fostering a community of growers and consumers
            committed to promoting healthy eating, environmental stewardship,
            and thriving local economies
          </div>
        </div>
      </div>
      {user && !user.is_staff && (
        <div
          onClick={() => navigate("/farmer/register")}
          className={styles.sellingmaindiv}
        >
          <div className={styles.userHomeChild30}>Start</div>
          <div className={styles.userHomeChild31}>selling ?</div>
        </div>
      )}

      {!user && (
        <div
          onClick={() => navigate("/farmer/register")}
          className={styles.sellingmaindiv}
        >
          <div className={styles.userHomeChild30}>Start</div>
          <div className={styles.userHomeChild31}>selling ?</div>
        </div>
      )}

      <div style={{ backgroundColor: "#F3EEEE" }}>
        <div className={`text-center  ${styles.category1}`}>Category</div>

        <div className={styles.categorymaindiv}>
          {category.map((o) => (
            <div style={{ position: "relative", marginBottom: "20px" }}>
              <img
                className={styles.foodieInstagramAccountsThat}
                alt=""
                src={Api_base + o.categoryImg}
              />
              <div className={styles.userHomeChild35}>{o.categoryName}</div>
              <div className={styles.fruitsAreCommonly}>{o.about}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mt-5 text-center">
          <div className={styles.keyFeatures}>
            <span>Key</span>
            <span className={styles.selling}> Features</span>
          </div>
          <div className={` mt-3 ${styles.howFarmaidMake}`}>
            How FarmAid make benefit for food supply chain
          </div>
        </div>
        <div className={styles.keyfactorflex}>
          <div>
            <div className={styles.userHomeChild32}>
              <img
                src={userfriendly}
                className={styles.keyFeaturesimg}
                alt=""
              />
            </div>
            <div className={styles.userFriendly}>User Friendly</div>

            <div className={styles.reduceCostsTo}>
              Reduce costs to buyers without losing reliability
            </div>
          </div>
          <div>
            <div className={styles.userHomeChild33}>
              <img src={fairtrad} alt="" className={styles.keyFeaturesimg} />
            </div>
            <div className={styles.userFriendly}>Fair Trade</div>

            <div className={styles.redistributionOfValue}>
              Redistribution of value in food supply chain
            </div>
          </div>

          <div>
            <div className={styles.userHomeChild34}>
              <img
                src={trancperency}
                alt=""
                className={styles.keyFeaturesimg}
              />
            </div>
            <div className={styles.userFriendly}>Trancparency</div>

            <div className={styles.directTransactionsBetween}>
              Direct transactions between farmers and industry/retail
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className={`text-center ${styles.faq}`}>FAQ</div>

        <div className={styles.faqFlex}>
          <div className={styles.faqFlexsubdiv}>
            <div
              className={styles.userHomeChild38}
              style={{ width: faq.faq1 ? "70%" : "100%" }}
              onClick={() =>
                setfaq((e) => {
                  return { ...e, faq1: !e.faq1 };
                })
              }
            >
              Why should I buy from your local farmers?
            </div>
            {faq.faq1 && (
              <div className={styles.userHomeChild41}>
                Buying from local farmers supports the local economy, promotes
                sustainable agriculture practices, and ensures that you're
                getting the freshest produce possible. Plus, you can connect
                directly with the people who grow your food and learn more about
                where it comes from.
              </div>
            )}
          </div>
          <div className={styles.faqFlexsubdiv}>
            <div
              className={styles.userHomeChild39}
              style={{ width: faq.faq2 ? "70%" : "100%" }}
              onClick={() => setfaq((e) => ({ ...e, faq2: !e.faq2 }))}
            >
              How are the crops harvested and handled?
            </div>
            {faq.faq2 && (
              <div className={styles.userHomeChild41}>
                Buying from local farmers supports the local economy, promotes
                sustainable agriculture practices, and ensures that you're
                getting the freshest produce possible. Plus, you can connect
                directly with the people who grow your food and learn more about
                where it comes from.
              </div>
            )}
          </div>

          <div className={styles.faqFlexsubdiv}>
            <div
              className={styles.userHomeChild40}
              style={{ width: faq.faq3 ? "70%" : "100%" }}
              onClick={() => setfaq((e) => ({ ...e, faq3: !e.faq3 }))}
            >
              How are the orders fulfilled and delivered?
            </div>
            {faq.faq3 && (
              <div className={styles.userHomeChild41}>
                Buying from local farmers supports the local economy, promotes
                sustainable agriculture practices, and ensures that you're
                getting the freshest produce possible. Plus, you can connect
                directly with the people who grow your food and learn more about
                where it comes from.
              </div>
            )}
          </div>
        </div>
      </div>

      <Userfooter />
    </div>
  );
};

export default Home;
