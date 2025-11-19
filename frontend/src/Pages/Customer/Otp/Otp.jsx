import React, { useState } from "react";
import Bg from "../../../Asset/Image/bgreg.jpg";
import Header from "../../../Components/athenticationHeader/Header";
import logincss from "../Login/Login.module.css";
import otpcss from "./Otp.module.css";
import axios from "../../../Config/Axios";
import { useNavigate } from "react-router-dom";
const Otp = () => {
  const [inpval, setinpval] = useState({
    inp1: "",
    inp2: "",
    inp3: "",
    inp4: "",
  });
  const [error, seterror] = useState("");
  const navigate = useNavigate();
  const handlechang = (e) => {
    const { name, value } = e.target;
    const inputLength = value.length;

    if (value.length < 2) {
      setinpval((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    if (inputLength === 1) {
      const nextInput = e.target.nextSibling;

      if (nextInput && nextInput.tagName.toLowerCase() === "input") {
        nextInput.focus();
      }
    }

    if (inputLength === 0) {
      const prevInput = e.target.previousSibling;
      if (prevInput && prevInput.tagName.toLowerCase() === "input") {
        prevInput.value = "";
        prevInput.focus();
      }
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    if (!inpval.inp1 || !inpval.inp4 || !inpval.inp3 || !inpval.inp2) {
      seterror("Enter valid Otp");
      return;
    }
    try {
      const otp = inpval.inp1 + inpval.inp2 + inpval.inp3 + inpval.inp4;
      const email = localStorage.getItem("email");

      const verifieduser = await axios.post("register/otp-verification", {
        otp: otp,
        email: email,
      });

      if (verifieduser.status == 200) {
        if (verifieduser.data.is_staff) {
          navigate("/farmer/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (e) {
      console.log(e);
      seterror(e.response.data["error"]);
    }
  };

  return (
    <React.Fragment>
      <Header admin={false} />

      <div
        style={{ backgroundImage: `url(${Bg})`, backgroundSize: "cover" }}
        className="py-2"
      >
        <div style={{ height: "399px" }} className={logincss.innnerdiv}>
          <h1 className={logincss.mainhead}>Otp verification</h1>
          <form onSubmit={handlesubmit}>
            <div id={otpcss.inpdivflex}>
              <input
                type="number"
                name="inp1"
                value={inpval.inp1}
                inputMode="numeric"
                onChange={(e) => handlechang(e)}
                maxLength={1}
                className={`${otpcss.inp} col-2 col-sm-1`}
              />
              <input
                type="number"
                name="inp2"
                value={inpval.inp2}
                onChange={(e) => handlechang(e)}
                maxLength={1}
                className={`${otpcss.inp} col-2 col-sm-1`}
              />
              <input
                type="number"
                name="inp3"
                value={inpval.inp3}
                onChange={(e) => handlechang(e)}
                maxLength={1}
                className={`${otpcss.inp} col-2 col-sm-1`}
              />
              <input
                type="number"
                name="inp4"
                value={inpval.inp4}
                onChange={(e) => handlechang(e)}
                maxLength={1}
                className={`${otpcss.inp} col-2 col-sm-1`}
              />
            </div>
            {error && <h5 className={otpcss.error}>{error}</h5>}

            <div className="m-auto text-center" style={{ paddingTop: "94px" }}>
              <button type="submit" className={logincss.button}>
                Verifiy
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className={logincss.footer}></div>
    </React.Fragment>
  );
};

export default Otp;
