import React, { useEffect } from "react";
import Header from "../../../Components/athenticationHeader/Header";
import adminLogin from "./Login.module.css";
import logincss from "../../Customer/Login/Login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../Config/Axios";
const Login = () => {
  const nav = useNavigate();

  const [data, setData] = useState({ Email: "", password: "" });
  const [error, seterror] = useState("");

  const handlechange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!data.Email || !data.password) {
      seterror("Invalid user credential");
      return;
    }

    try {
      const response = await axios.post("api/token/", data);

      if (response.status == 200) {
        localStorage.setItem("access_token", response?.data?.access);
        localStorage.setItem("refresh_token", response?.data?.refresh);

        const accessToken = localStorage.getItem("access_token");

        const getuser = await axios.get(`admin/login/${data.Email}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        nav("/admin/dashboard");
      }
    } catch (e) {
      seterror(e?.response?.data["detail"]);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        const user = await axios("admin/get-admin/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (user.status == 200) {
          nav("/admin/dashboard");
        }

        console.log(user);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <Header admin={true} />

      <div>
        <form
          style={{ backgroundColor: "transparent" }}
          onSubmit={(e) => handlesubmit(e)}
        >
          <div
            className={`${adminLogin.innerdiv}  col-10 col-sm-8 col-md-6 col-lg-4 m-auto mt-5`}
          >
            <h1
              className={`${logincss.mainhead}  py-5`}
              style={{ fontFamily: "Oswald" }}
            >
              Login
            </h1>

            <div className={logincss.inpdiv} style={{ top: 0 }}>
              <input
                type="text"
                name="Email"
                value={data.Email}
                onChange={(e) => handlechange(e)}
                placeholder="Email"
                className={`${logincss.inp} ${adminLogin.inp}`}
              />
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={(e) => handlechange(e)}
                placeholder="Password"
                className={`${logincss.inp} ${adminLogin.inp}`}
              />
            </div>
            {error && <h5 className={adminLogin.error}>{error}</h5>}
            <div className="text-center w-100">
              <button
                type="submit"
                style={{ backgroundColor: "#7CA0D7" }}
                className={`${logincss.button} my-5`}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
