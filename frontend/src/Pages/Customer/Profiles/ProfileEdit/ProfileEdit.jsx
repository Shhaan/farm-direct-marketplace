import React, { useEffect, useReducer, useState } from "react";
import UserHeader from "../../../../Components/UserHeader/UserHeader";
import style from "../Profile/Profile.module.css";
import logincss from "../../Login/Login.module.css";
import register from "../../Register/Register.module.css";
import UserprofileSidebar from "../../../../Components/UserprofileSidebar/UserprofileSidebar";
import axios from "../../../../Config/Axios";
import { useDispatch, useSelector } from "react-redux";
import { UserRegistered } from "../../../../Slices/UserSlice";
import { useNavigate } from "react-router-dom";
import { setToken, removetoken } from "../../../../Slices/Access";
import { reducerRegister } from "../../../../Functions/Reducer";
import * as yup from "yup";

const Profile = () => {
  const initialState = {
    First_name: "",
    Last_name: "",
    Email: "",
    Phone_number: "",

    Address: "",
    Country: "",
    State: "",
    District: "",
    postal_code: "",
  };

  const [val, dispatchstate] = useReducer(reducerRegister, initialState);
  const [error, seterror] = useState({});
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { access, refresh } = useSelector((state) => state.Token);

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
        console.log(getuser.data);
        dispatchstate({ type: "UPDATE_USER", payload: getuser.data });
      } catch (e) {
        navigate("/");
      }
    };

    fetchUser();
  }, [access]);

  const handlechange = (e) => {
    const { name, value } = e.target;

    seterror((er) => ({
      ...er,
      [name]: "",
    }));
    dispatchstate({ type: "Change", field: name, value });
  };

  const validatedata = yup.object({
    First_name: yup.string().trim().required("First name is required"),
    Last_name: yup.string().trim().required("Last name is required"),
    Email: yup
      .string()
      .trim()
      .required("Email is required")
      .email("Enter a valid format"),
    Phone_number: yup
      .number()
      .typeError("must be number")
      .required("Phone_number is required"),
    Address: yup.string().trim().required("Address is required"),
    Country: yup.string().trim().required("Country is required"),
    State: yup.string().trim().required("State is required"),
    District: yup.string().trim().required("District is required"),
    postal_code: yup
      .number()
      .typeError("must be number")
      .required("postal_code is required"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await validatedata.validate(val, { abortEarly: false });

      try {
        const access_token = localStorage.getItem("access_token");
        const data = await axios.put("customer/profile/edit/", val, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        dispatch(UserRegistered(data.data));

        dispatchstate({ type: "UPDATE_USER", payload: data.data });
        navigate("/profile");
      } catch (e) {
        seterror((pr) => ({ ...pr, ["Email"]: e.response.data.Email }));
      }
    } catch (e) {
      const er = {};
      if (e.inner) {
        e.inner.forEach((element) => {
          er[element.path] = element.message;
        });

        seterror(er);
      }
    }
  };

  return (
    <div>
      <UserprofileSidebar />

      <div className={style.content}>
        <hr id={style.sepratehr} />

        <div className={register.innerdiv}>
          <form onSubmit={handleSubmit}>
            <div className={logincss.inpdiv} style={{ top: 0 }}>
              <div>
                <label htmlFor="">First name:-</label>
                <input
                  name="First_name"
                  onChange={(e) => handlechange(e)}
                  className={`w-100  ${logincss.inp}`}
                  value={val.First_name}
                />
                {error.First_name && <h6>{error.First_name}</h6>}
              </div>

              <div>
                <label htmlFor="">Last name:-</label>
                <input
                  name="Last_name"
                  onChange={(e) => handlechange(e)}
                  className={`w-100  ${logincss.inp}`}
                  value={val.Last_name}
                />
                {error.Last_name && <h6>{error.Last_name}</h6>}
              </div>

              <div>
                <label htmlFor="">Email:-</label>

                <input
                  name="Email"
                  className={`w-100  ${logincss.inp}`}
                  value={val.Email}
                />
                {error.Email && <h6>{error.Email}</h6>}
              </div>

              <div>
                <label htmlFor="">Address:-</label>

                <input
                  name="Address"
                  onChange={(e) => handlechange(e)}
                  className={`w-100  ${logincss.inp}`}
                  value={val.Address}
                />
                {error.Address && <h6>{error.Address}</h6>}
              </div>
              <div>
                <label htmlFor="">Phone number:-</label>

                <input
                  type="number"
                  name="Phone_number"
                  onChange={(e) => handlechange(e)}
                  className={`w-100  ${logincss.inp}`}
                  value={val.Phone_number}
                />
                {error.Phone_number && <h6>{error.Phone_number}</h6>}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <div>
                  <label htmlFor="">Country:-</label>

                  <input
                    name="Country"
                    onChange={(e) => handlechange(e)}
                    className={`${logincss.inp} ${register.width40}`}
                    value={val.Country}
                  />
                </div>
                {error.Country && <h6>{error.Country}</h6>}

                <div>
                  <label htmlFor="" style={{ zIndex: "10" }}>
                    State:-
                  </label>

                  <input
                    name="State"
                    onChange={(e) => handlechange(e)}
                    className={`${logincss.inp} ${register.width40}`}
                    value={val.State}
                  />
                </div>
                {error.State && <h6>{error.State}</h6>}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <div>
                  <label htmlFor="">Postal Code:-</label>
                  <input
                    type="number"
                    name="postal_code"
                    onChange={(e) => handlechange(e)}
                    className={`${logincss.inp} ${register.width40}`}
                    value={val.postal_code}
                  />{" "}
                </div>
                {error.postal_code && <h6>{error.postal_code}</h6>}

                <div>
                  <label htmlFor="" style={{ zIndex: "10" }}>
                    District:-
                  </label>

                  <input
                    name="District"
                    onChange={(e) => handlechange(e)}
                    className={`${logincss.inp} ${register.width40}`}
                    value={val.District}
                  />
                </div>
                {error.District && <h6>{error.District}</h6>}
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: "33px",
                width: "25%",
                marginLeft: "208px",
                marginBottom: "14px",
              }}
              className={logincss.button}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
