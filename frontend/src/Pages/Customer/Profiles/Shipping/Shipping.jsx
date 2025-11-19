import React, { useEffect, useState } from "react";
import UserHeader from "../../../../Components/UserHeader/UserHeader";
import style from "../Profile/Profile.module.css";
import logincss from "../../Login/Login.module.css";
import register from "../../Register/Register.module.css";
import { setToken } from "../../../../Slices/Access";
import * as yup from "yup";
import UserprofileSidebar from "../../../../Components/UserprofileSidebar/UserprofileSidebar";
import axios from "../../../../Config/Axios";
import { useDispatch, useSelector } from "react-redux";
import { UserRegistered } from "../../../../Slices/UserSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [shippingaddress, setshippingaddress] = useState([]);
  const [errors, setErrors] = useState({});
  const [isFormDisabled, setIsFormDisabled] = useState(false);

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
        console.log(e);

        navigate("/");
      }
    };

    fetchUser();

    const fetchshipping = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        const { data } = await axios.get(`customer/profile/getshipping/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setshippingaddress(data);
        setIsFormDisabled(data.length >= 3);
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchshipping();
  }, []);

  const [profile, setProfile] = useState({
    First_name: "",
    Last_name: "",
    Address: "",
    Country: "",
    city: "",
    State: "",
    Postal_code: "",
    District: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validatedata = yup.object({
    First_name: yup.string().trim().required("First name is required"),
    Last_name: yup.string().trim().required("Last name is required"),
    city: yup.string().trim().required("City is required"),
    Address: yup.string().trim().required("Address is required"),
    Country: yup.string().trim().required("Country is required"),
    State: yup.string().trim().required("State is required"),
    District: yup.string().trim().required("District is required"),
    Postal_code: yup
      .number()
      .typeError("Must be a number")
      .required("Postal code is required"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormDisabled) return;
    try {
      await validatedata.validate(profile, { abortEarly: false });

      const { data } = await axios.post(
        `customer/profile/getshipping/`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setshippingaddress([...shippingaddress, data]);
      setProfile({
        First_name: "",
        Last_name: "",
        Address: "",
        Country: "",
        city: "",
        State: "",
        Postal_code: "",
        District: "",
      });
      setIsFormDisabled(shippingaddress.length + 1 >= 3);
    } catch (error) {
      const newErrors = {};
      if (error.inner) {
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      }
      console.log(error);
    }
  };

  return (
    <div style={{ color: "red" }}>
      <UserprofileSidebar />

      <div className={style.content}>
        <hr id={style.sepratehr} />

        <div
          onClick={() => {
            if (isFormDisabled) {
              toast.error("You can only add 3 shipping addresses", 4000);
            }
          }}
          className={register.innerdiv}
        >
          <div className={logincss.inpdiv} style={{ top: 0 }}>
            <div>
              <label htmlFor="firstName">First name:</label>
              <input
                type="text"
                name="First_name"
                value={profile.First_name}
                onChange={handleChange}
                className={`w-100 ${logincss.inp}`}
                disabled={isFormDisabled}
              />
              {errors.First_name && (
                <div className={style.error}>{errors.First_name}</div>
              )}
            </div>

            <div>
              <label htmlFor="lastName">Last name:</label>
              <input
                type="text"
                name="Last_name"
                value={profile.Last_name}
                onChange={handleChange}
                className={`w-100 ${logincss.inp}`}
                disabled={isFormDisabled}
              />
              {errors.Last_name && (
                <div className={style.error}>{errors.Last_name}</div>
              )}
            </div>

            <div>
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                name="Address"
                value={profile.Address}
                onChange={handleChange}
                className={`w-100 ${logincss.inp}`}
                disabled={isFormDisabled}
              />
              {errors.Address && (
                <div className={style.error}>{errors.Address}</div>
              )}
            </div>

            <div>
              <label htmlFor="country">Country:</label>
              <input
                type="text"
                name="Country"
                value={profile.Country}
                onChange={handleChange}
                className={`w-100 ${logincss.inp}`}
                disabled={isFormDisabled}
              />
              {errors.Country && (
                <div className={style.error}>{errors.Country}</div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <div style={{ width: "45%" }}>
                <label htmlFor="city">City:</label>
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  className={`${logincss.inp} ${register.width40}`}
                  disabled={isFormDisabled}
                />
                {errors.City && (
                  <div className={style.error}>{errors.city}</div>
                )}
              </div>

              <div style={{ width: "45%" }}>
                <label htmlFor="state" style={{ zIndex: 10 }}>
                  State:
                </label>
                <input
                  type="text"
                  name="State"
                  value={profile.State}
                  onChange={handleChange}
                  className={`${logincss.inp} ${register.width40}`}
                  disabled={isFormDisabled}
                />
                {errors.State && (
                  <div className={style.error}>{errors.State}</div>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <div style={{ width: "45%" }}>
                <label htmlFor="postalCode">Postal Code:</label>
                <input
                  type="text"
                  name="Postal_code"
                  value={profile.Postal_code}
                  onChange={handleChange}
                  className={`${logincss.inp} ${register.width40}`}
                  disabled={isFormDisabled}
                />
                {errors.Postal_code && (
                  <div className={style.error}>{errors.Postal_code}</div>
                )}
              </div>

              <div style={{ width: "45%" }}>
                <label htmlFor="district" style={{ zIndex: 10 }}>
                  District:
                </label>
                <input
                  type="text"
                  name="District"
                  value={profile.District}
                  onChange={handleChange}
                  className={`${logincss.inp} ${register.width40}`}
                  disabled={isFormDisabled}
                />
                {errors.District && (
                  <div className={style.error}>{errors.District}</div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: "33px",
              width: "25%",
              marginLeft: "208px",
              marginBottom: "14px",
              opacity: isFormDisabled ? 0.5 : 1,
              cursor: isFormDisabled ? "not-allowed" : "pointer",
            }}
            onClick={handleSubmit}
            className={logincss.button}
            disabled={isFormDisabled}
          >
            Submit
          </button>
        </div>
        <hr className={style.hrdivorder} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "12px",
          }}
        >
          {shippingaddress.length > 0 &&
            shippingaddress.map((obj) => (
              <div key={obj.id} className={style.shippingdisplay}>
                {obj.First_name} {obj.Last_name}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Shipping;
