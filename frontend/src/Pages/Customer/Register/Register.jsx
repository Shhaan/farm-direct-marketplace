import React, { useEffect, useReducer, useState } from "react";
import Header from "../../../Components/athenticationHeader/Header";
import Bg from "../../../Asset/Image/bgreg.jpg";
import Bguser from "../../../Asset/Image/bgreguser.jpg";
import logincss from "../Login/Login.module.css";
import register from "./Register.module.css";
import google from "../../../Asset/Image/google.png";
import { reducerRegister } from "../../../Functions/Reducer";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../../Config/Axios";
import onGoogleLoginSuccess from "../../../Components/GoogleLoginbutton/Googlebutton";
import { UserRegistered } from "../../../Slices/UserSlice";
import { useDispatch } from "react-redux";

const Register = () => {
  const initialState = {
    First_name: "",
    Last_name: "",
    Email: "",
    Phone: "",
    password1: "",
    password2: "",
    Address: "",
    Country: "",
    State: "",
    District: "",
    Postal_code: "",
  };

  const dispatch = useDispatch();
  const [val, dispatchstate] = useReducer(reducerRegister, initialState);
  const [uniqeMailer, setuniquemailer] = useState("");
  const [err, setErrors] = useState({});

  const handlechange = (e) => {
    const { name, value } = e.target;

    dispatchstate({ type: "Change", field: name, value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    if (!val.First_name.trim()) {
      validationErrors.First_name = "First name is required.";
    }
    if (!val.Last_name.trim()) {
      validationErrors.Last_name = "Last name is required.";
    }
    if (!val.Email.trim()) {
      validationErrors.Email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(val.Email)) {
      validationErrors.Email = "Invalid email address.";
    }

    if (!val.Address.trim()) {
      validationErrors.Address = "Address is required.";
    }

    if (!val.password1.trim()) {
      validationErrors.password1 = "Password is required.";
    } else if (val.password1.trim().length < 6) {
      validationErrors.password1 =
        "Password must be at least 6 characters long.";
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(val.password1)) {
      validationErrors.password1 =
        "Password must contain at least one letter and one number.";
    } else if (val.password1 === val.Email) {
      validationErrors.password1 = "Password can't be email";
    }

    if (!val.Phone.trim()) {
      validationErrors.Phone = "Phone number is required";
    }

    if (val.password1 != val.password2) {
      validationErrors.password2 = "Both password must be same";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      return;
    }
    try {
      const user = await axios.post("register/user/", val);

      if (user.status == 201) {
        const response = await axios.post("api/token/", {
          Email: user.data["Email"],
          password: val.password1,
        });

        if (response.status == 200) {
          localStorage.setItem("access_token", response.data.access);
          localStorage.setItem("refresh_token", response.data.refresh);
        }
        localStorage.setItem("email", user.data["Email"]);

        dispatch(UserRegistered(user.data));
        navigate("/register/otp-verification");
      }
    } catch (e) {
      console.log(e);
      if (e.response.data["Email"]) {
        setuniquemailer(e.response.data["Email"]);
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

        if (user.status == 200) {
          navigate("/");
        }
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
        className="py-2"
      >
        <div className={register.innerdiv}>
          <h1 className={logincss.mainhead}>Register</h1>
          <div className={logincss.inpdiv} style={{ top: 0 }}>
            <div>
              {" "}
              <input
                type="text"
                name="First_name"
                value={val.First_name}
                onChange={(e) => handlechange(e)}
                placeholder="First name"
                className={`w-100  ${logincss.inp}`}
              />
              {err.First_name && (
                <h5 className={register.error}>{err.First_name}</h5>
              )}
            </div>
            <div>
              {" "}
              <input
                type="text"
                name="Last_name"
                value={val.Last_name}
                onChange={(e) => handlechange(e)}
                placeholder="Last name"
                className={`w-100  ${logincss.inp}`}
              />
              {err.Last_name && (
                <h5 className={register.error}>{err.Last_name}</h5>
              )}
            </div>
            <div>
              <input
                type="email"
                name="Email"
                value={val.Email}
                onChange={(e) => handlechange(e)}
                placeholder="Email"
                className={`w-100  ${logincss.inp}`}
              />

              {err.Email && <h5 className={register.error}>{err.Email}</h5>}
              {uniqeMailer && <h5 className={register.error}>{uniqeMailer}</h5>}
            </div>
            <div>
              <textarea
                name="Address"
                id=""
                onChange={(e) => handlechange(e)}
                className={`w-100  ${logincss.inp}`}
                placeholder="Address"
              >
                {val.Address}
              </textarea>
              {err.Address && <h5 className={register.error}>{err.Address}</h5>}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <input
                type="text"
                name="Country"
                required
                value={val.Country}
                onChange={(e) => handlechange(e)}
                placeholder="Country"
                className={`${logincss.inp} ${register.width40}`}
              />
              <input
                type="text"
                name="State"
                required
                value={val.State}
                onChange={(e) => handlechange(e)}
                placeholder="State"
                className={`${logincss.inp} ${register.width40}`}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <input
                type="text"
                required
                name="District"
                value={val.District}
                onChange={(e) => handlechange(e)}
                placeholder="District"
                className={`${logincss.inp} ${register.width40}`}
              />
              <input
                type="number"
                required
                name="Postal_code"
                value={val.Postal_code}
                onChange={(e) => handlechange(e)}
                placeholder="Postal code"
                className={`${logincss.inp} ${register.width40}`}
              />
            </div>
            <div>
              <input
                type="number"
                name="Phone"
                value={val.Phone}
                onChange={(e) => handlechange(e)}
                placeholder="Phone number"
                className={`w-100  ${logincss.inp}`}
              />
              {err.Phone && <h5 className={register.error}>{err.Phone}</h5>}
            </div>
            <div>
              <input
                type="password"
                value={val.password1}
                onChange={(e) => handlechange(e)}
                name="password1"
                className={`w-100  ${logincss.inp}`}
                placeholder="Password"
              />
              {err.password1 && (
                <h5 className={register.error}>{err.password1}</h5>
              )}
            </div>
            <div>
              <input
                type="password"
                value={val.password2}
                onChange={(e) => handlechange(e)}
                name="password2"
                placeholder="Password Confirm"
                className={`w-100  ${logincss.inp}`}
              />
              {err.password2 && (
                <h5 className={register.error}>{err.password2}</h5>
              )}
            </div>{" "}
            <button
              type="submit"
              onClick={(e) => handleSubmit(e)}
              className={logincss.button}
            >
              Submit
            </button>
            <div className={logincss.sepraterdiv}>
              <hr className={logincss.sepraterhr} />
              <h1 className={logincss.seprateh1}>or</h1>
              <hr className={logincss.sepraterhr} />
            </div>
            <div
              onClick={() => onGoogleLoginSuccess(false)}
              style={{ position: "relative" }}
            >
              <img src={google} alt="google" className={register.img} />
              <button
                id={logincss.google}
                style={{ position: "relative" }}
                className={logincss.button}
              >
                Authenticate with google
              </button>
            </div>
            <div>
              {" "}
              <h2 className={logincss.navs} style={{ top: 0 }}>
                {" "}
                Already had a account ?{" "}
                <Link style={{ textDecoration: "none" }} to={"/login"}>
                  {" "}
                  <span style={{ color: "black" }}> Login </span>
                </Link>
              </h2>
              <h2 className={logincss.navs} style={{ top: 0 }}>
                {" "}
                Do you want to sell crops?{" "}
                <Link
                  style={{ textDecoration: "none" }}
                  to={"/farmer/register"}
                >
                  {" "}
                  <span style={{ color: "black" }}>Join as farmer</span>
                </Link>
              </h2>
            </div>
          </div>
        </div>
        <img src={Bguser} className={register.image} />
      </div>

      <div className={logincss.footer}></div>
    </React.Fragment>
  );
};

export default Register;
