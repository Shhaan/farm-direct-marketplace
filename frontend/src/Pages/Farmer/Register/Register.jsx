import React, { useEffect, useState } from "react";
import Header from "../../../Components/athenticationHeader/Header";
import logincss from "../../Customer/Login/Login.module.css";
import Bg from "../../../Asset/Image/bgreg.jpg";
import farmerRegister from "./Register.module.css";
import axios from "../../../Config/Axios";
import { useDispatch, useSelector } from "react-redux";
import {
  UserLogLoading,
  UserRegistered,
  UserRegistrationerr,
  UserisFarmer,
} from "../../../Slices/UserSlice";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    First_name: "",
    Cultivating_crop: "",
    Last_name: "",
    Bio: "",
    Email: "",
    Location: "",
    Phone: "",
    Award: "",
    Date_of_birth: "",
    Address: "",
    Password1: "",
    Country: "",
    Password2: "",
    State: "",
    District: "",
    Zip_code: "",
    farmer_photo: null,
    Field_photo: null,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setErrors((prevFormData) => ({
      ...prevFormData,
      [name]: "",
    }));
  };

  const { user, loading, error } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.First_name) newErrors.First_name = "First name is required";
    if (!formData.Last_name) newErrors.Last_name = "Last name is required";
    if (!formData.Email) newErrors.Email = "Email is required";
    if (formData.Email && !/\S+@\S+\.\S+/.test(formData.Email))
      newErrors.Email = "Email is invalid";
    if (!formData.Phone) newErrors.Phone = "Phone number is required";
    if (formData.Phone && !/^\d+$/.test(formData.Phone))
      newErrors.Phone = "Phone number is invalid";
    if (!formData.Password1) newErrors.Password1 = "Password is required";
    if (!formData.Password2)
      newErrors.Password2 = "Confirmation password is required";
    if (formData.Password1 !== formData.Password2)
      newErrors.Password2 = "Passwords must match";
    if (!formData.Country) newErrors.Country = "Country is required";
    if (!formData.State) newErrors.State = "State is required";
    if (!formData.District) newErrors.District = "District is required";
    if (!formData.Zip_code) newErrors.Zip_code = "Zip code is required";
    if (!formData.Date_of_birth)
      newErrors.Date_of_birth = "Date of birth is required";
    if (!formData.Cultivating_crop)
      newErrors.Cultivating_crop = "Cultivating crop is required";
    if (!formData.Bio) newErrors.Bio = "Bio is required";
    if (!formData.Location) newErrors.Location = "Location is required";
    if (!formData.Address) newErrors.Address = "Address is required";
    if (!formData.farmer_photo)
      newErrors.farmer_photo = "Farmer photo is required";
    if (!formData.Field_photo)
      newErrors.Field_photo = "Field photo is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    try {
      dispatch(UserLogLoading());

      const appendFormData = (data) => {
        const formDataObj = new FormData();
        for (const key in data) {
          if (data[key] !== null) {
            formDataObj.append(key, data[key]);
          }
        }
        return formDataObj;
      };

      const data = appendFormData(formData);

      const userasd = await axios.post("farmer/register/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(UserRegistered(userasd.data));

      dispatch(UserisFarmer());
      localStorage.setItem("email", userasd.data.data.user.Email);

      const response = await axios.post("api/token/", {
        Email: userasd.data.data.user.Email,
        password: formData.Password1,
      });

      if (response.status == 200) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
      }

      if (userasd.data.otp) {
        navigate("/farmer/profile", { state: { otp: true } });
      } else {
        navigate("/farmer/profile", { state: { otp: false } });
      }
    } catch (e) {
      console.log(e);
      if ((e.response.status = 401)) {
        dispatch(UserRegistrationerr(e.response.data.error));
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        const user = await axios("currentuser/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } catch (e) {
        console.log(e);
      }
    };
    fetchUser();
  }, []);

  return (
    <React.Fragment>
      <Header admin={false} />
      <div
        style={{ backgroundImage: `url(${Bg})`, backgroundSize: "cover" }}
        className="py-4"
      >
        <div className={farmerRegister.innerdiv}>
          <h1 className={logincss.mainhead}>Register as farmer</h1>
          <form style={{ textAlign: "center" }} onSubmit={handleSubmit}>
            <div className={farmerRegister.gridDiv}>
              <div>
                <input
                  type="text"
                  name="First_name"
                  value={formData.First_name}
                  onChange={(e) => handleChange(e)}
                  placeholder="First Name"
                  className={`${logincss.inp} w-100`}
                />
                {errors.First_name && <h6>{errors.First_name}</h6>}
              </div>
              <div>
                <input
                  type="text"
                  name="Cultivating_crop"
                  value={formData.Cultivating_crop}
                  onChange={(e) => handleChange(e)}
                  placeholder="Cultivating crop"
                  className={`${logincss.inp} w-100`}
                />
                {errors.Cultivating_crop && <h6>{errors.Cultivating_crop}</h6>}
              </div>
              <div>
                <input
                  type="text"
                  name="Last_name"
                  value={formData.Last_name}
                  onChange={(e) => handleChange(e)}
                  placeholder="Last Name"
                  className={`${logincss.inp} w-100`}
                />
                {errors.Last_name && <h6>{errors.Last_name}</h6>}
              </div>
              <div>
                <textarea
                  name="Bio"
                  placeholder="Bio"
                  value={formData.Bio}
                  onChange={(e) => handleChange(e)}
                  className={`${logincss.inp} w-100`}
                ></textarea>
                {errors.Bio && <h6>{errors.Bio}</h6>}
              </div>
              <div>
                <input
                  type="email"
                  name="Email"
                  onChange={(e) => handleChange(e)}
                  placeholder="Email"
                  className={`${logincss.inp} w-100`}
                />

                {errors.Email && <h6>{errors.Email}</h6>}
              </div>
              <div>
                <input
                  type="text"
                  name="Location"
                  value={formData.Location}
                  onChange={(e) => handleChange(e)}
                  placeholder="Field Location"
                  className={`${logincss.inp} w-100`}
                />
                {errors.Location && <h6>{errors.Location}</h6>}
              </div>

              <div>
                <input
                  type="tel"
                  name="Phone"
                  value={formData.Phone}
                  onChange={(e) => handleChange(e)}
                  placeholder="Phone Number"
                  className={`${logincss.inp} w-100`}
                />
                {errors.Phone && <h6>{errors.Phone}</h6>}
              </div>
              <div>
                <input
                  type="text"
                  name="Award"
                  value={formData.Award}
                  onChange={(e) => handleChange(e)}
                  placeholder="Award if Any"
                  className={`${logincss.inp} w-100`}
                />
              </div>
              <div>
                <input
                  type="date"
                  name="Date_of_birth"
                  value={formData.Date_of_birth}
                  onChange={(e) => handleChange(e)}
                  placeholder="Date of birth"
                  className={`${logincss.inp} w-100`}
                />
                {errors.Date_of_birth && <h6>{errors.Date_of_birth}</h6>}
              </div>

              <div className={farmerRegister.sectiondiv}>
                <div style={{ position: "relative", zIndex: "0" }}>
                  <div>
                    <input
                      type="file"
                      name="Field_photo"
                      placeholder="Field_photo"
                      accept="image/*"
                      onChange={(e) => (
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          [e.target.name]: e.target.files[0],
                        })),
                        setErrors((prevFormData) => ({
                          ...prevFormData,
                          [e.target.name]: "",
                        }))
                      )}
                      className={farmerRegister.customfileuploadinp}
                    />
                    {errors.Field_photo && <h6>{errors.Field_photo}</h6>}
                  </div>
                  <div className={`${farmerRegister.customfileuploaddiv}`}>
                    Field photo
                  </div>
                </div>
              </div>
              <div>
                <textarea
                  name="Address"
                  value={formData.Address}
                  className={`${logincss.inp} w-100`}
                  onChange={(e) => handleChange(e)}
                  placeholder="Address"
                ></textarea>
                {errors.Address && <h6>{errors.Address}</h6>}
              </div>
              <div>
                <input
                  type="password"
                  value={formData.Password1}
                  name="Password1"
                  onChange={(e) => handleChange(e)}
                  placeholder="Password"
                  className={`${logincss.inp} w-100`}
                />
                {errors.Password1 && <h6>{errors.Password1}</h6>}
                {error && <h6>{error}</h6>}
              </div>
              <div>
                <input
                  type="text"
                  value={formData.Country}
                  name="Country"
                  onChange={(e) => handleChange(e)}
                  placeholder="Country"
                  className={`${logincss.inp} w-100`}
                />
                {errors.Country && <h6>{errors.Country}</h6>}
              </div>
              <div>
                <input
                  type="password"
                  value={formData.Password2}
                  name="Password2"
                  onChange={(e) => handleChange(e)}
                  placeholder="Password Confirm"
                  className={`${logincss.inp} w-100`}
                />
                {errors.Password2 && <h6>{errors.Password2}</h6>}
              </div>
              <div className={farmerRegister.sectiondiv}>
                <div>
                  <input
                    type="text"
                    name="State"
                    value={formData.State}
                    onChange={(e) => handleChange(e)}
                    placeholder="State"
                    className={`${logincss.inp} w-100`}
                  />
                  {errors.State && <h6>{errors.State}</h6>}
                </div>
                <div>
                  <input
                    type="text"
                    name="District"
                    value={formData.District}
                    onChange={(e) => handleChange(e)}
                    placeholder="District"
                    className={`${logincss.inp} w-100`}
                  />
                  {errors.District && <h6>{errors.District}</h6>}
                </div>
                <div style={{ position: "relative", zIndex: "0" }}>
                  <div>
                    <input
                      type="file"
                      name="farmer_photo"
                      placeholder="Farmer photo"
                      accept="image/*"
                      onChange={(e) => (
                        setFormData((prevFormData) => ({
                          ...prevFormData,
                          [e.target.name]: e.target.files[0],
                        })),
                        setErrors((prevFormData) => ({
                          ...prevFormData,
                          [e.target.name]: "",
                        }))
                      )}
                      className={farmerRegister.customfileuploadinp}
                    />
                    {errors.farmer_photo && <h6>{errors.farmer_photo}</h6>}
                  </div>
                  <div className={`${farmerRegister.customfileuploaddiv}`}>
                    Farmer photo
                  </div>
                </div>
                <div>
                  <input
                    type="number"
                    name="Zip_code"
                    value={formData.Zip_code}
                    onChange={(e) => handleChange(e)}
                    placeholder="Zip Code"
                    className={`${logincss.inp} w-100`}
                  />
                  {errors.Zip_code && <h6>{errors.Zip_code}</h6>}
                </div>
              </div>
            </div>

            {loading ? (
              <div class="spinner-border text-center text-info" role="status">
                <span class="sr-only"></span>
              </div>
            ) : (
              <button
                type="submit"
                className={`${logincss.button} col-lg-4 col-md-4  mt-5 d-block`}
              >
               Register
              </button>
            )}
          </form>
        </div>
      </div>{" "}
      <div className={logincss.footer}></div>
    </React.Fragment>
  );
};

export default Register;
