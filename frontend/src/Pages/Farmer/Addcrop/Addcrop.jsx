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
import logincss from "../../Customer/Login/Login.module.css";
import addcropstyle from "./Addcrop.module.css";
import * as yup from "yup";
const Addcrop = () => {
  const dispatch = useDispatch();
  const { access, refresh } = useSelector((state) => state.Token);
  const { user } = useSelector((state) => state.user);
  const [parentcategory, setparentcategory] = useState([]);
  const [subcategory, setsubcategory] = useState([]);
  const [selectedParent, setselectedparent] = useState("");
  const [formdata, setformdata] = useState({
    parentcategory: "",
    category: "",
    cropName: "",
    quantity: 0,
    price: 0,
    image: [],
    About: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
          const getuser = await axios.get(`currentuser/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!getuser.data.is_staff) {
            navigate("/");
          }
          dispatch(UserRegistered(getuser.data));
        } else {
          navigate("/");
        }
      } catch (e) {
        navigate("/");
      }
    };

    fetchUser();
    const fetchcategory = async () => {
      try {
        const data = await axios.post("customer/profile/category/home/");

        setsubcategory(data.data.filter((o) => !o.is_parent));
        setparentcategory(data.data.filter((o) => o.is_parent));
      } catch (e) {
        console.log(e);
      }
    };
    fetchcategory();
  }, [access]);

  const validatedata = yup.object({
    parentcategory: yup.string().trim().required("parentcategory is required"),
    category: yup.string().trim().required("subcategory is required"),
    About: yup.string().trim().required("About is required"),

    cropName: yup.string().trim().required("cropName is required"),
    image: yup
      .array()
      .of(yup.string().trim().required("Image is required"))
      .min(1, "At least one image is required")
      .max(3, "No more than 3 image are allowed"),
    quantity: yup
      .number()
      .typeError("must be number")
      .required("quantity is required"),
    price: yup
      .number()
      .typeError("must be number")
      .required("price is required"),
  });
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      await validatedata.validate(formdata, { abortEarly: false });

      const accessToken = localStorage.getItem("access_token");
      formdata["farmer"] = parseInt(user.id);

      const dataform = new FormData();
      for (const key in formdata) {
        if (Array.isArray(formdata[key])) {
          formdata[key].forEach((item) => {
            dataform.append(key, item);
            console.log(item);
          });
        } else {
          dataform.append(key, formdata[key]);
        }
      }

      const response = await axios.post("farmer-main/cropadd/", dataform, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status == 201) {
        navigate("/farmer/sale");
      }
    } catch (e) {
      if (e.inner) {
        e.inner.forEach((error) => {
          console.log(error.message);
        });
      } else {
        console.log(e);
      }
    }
  };

  const handlechange = (e) => {
    const { name } = e.target;
    if (name == "image") {
      const { files } = e.target;
      if (files.length > 3) {
        return console.log("You can only add upto 3 image");
      }
      return setformdata((p) => ({ ...p, [name]: [...files] }));
    }
    const { value } = e.target;
    return setformdata((p) => ({ ...p, [name]: value }));
  };
  return (
    <div>
      <FarmerHeader />

      <div style={{ display: "flex" }}>
        <FarmerSidebar />
        <div className={style.content}>
          <h2 className="text-center mt-4">Add crop</h2>

          <form
            onSubmit={(e) => handlesubmit(e)}
            className="col-10 col-sm-9 col-md-8 col-lg-7 col-xl-5 m-auto p-4"
          >
            <div>
              <div className="m-4">
                <select
                  name="parentcategory"
                  className={`${logincss.inp} w-100`}
                  onChange={(e) => (
                    setselectedparent(e.target.value), handlechange(e)
                  )}
                  value={selectedParent}
                >
                  <option
                    style={{ color: "white" }}
                    value="Select main category"
                  >
                    Select main category
                  </option>
                  {parentcategory.map((o) => (
                    <option style={{ color: "white" }} value={o.id}>
                      {o.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="m-4">
                <select
                  onChange={(e) => handlechange(e)}
                  name="category"
                  className={`${logincss.inp} w-100`}
                  id=""
                >
                  <option style={{ color: "white" }} value="">
                    Select sub category
                  </option>
                  {subcategory
                    .filter((obj) => obj.parent_id == parseInt(selectedParent))
                    .map((o) => (
                      <option style={{ color: "white" }} value={o.id}>
                        {o.categoryName}
                      </option>
                    ))}
                </select>
              </div>
              <div className="m-4">
                <input
                  onChange={(e) => handlechange(e)}
                  type="text"
                  name="cropName"
                  placeholder="Vareity name"
                  className={`${logincss.inp} w-100`}
                />
              </div>
              <div className="m-4">
                <input
                  onChange={(e) => handlechange(e)}
                  type="number"
                  name="price"
                  placeholder="Price"
                  className={`${logincss.inp} w-100`}
                />
              </div>
              <div className="m-4">
                <input
                  onChange={(e) => handlechange(e)}
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  className={`${logincss.inp} w-100`}
                />
              </div>
              <div className="m-4">
                <input
                  onChange={(e) => handlechange(e)}
                  type="text"
                  name="About"
                  placeholder="About"
                  className={`${logincss.inp} w-100`}
                />
              </div>
              <div className="m-4 position-relative" style={{ zIndex: "2" }}>
                <input
                  onChange={(e) => handlechange(e)}
                  type="file"
                  name="image"
                  placeholder="Image"
                  accept="image/*"
                  multiple={true}
                  className={addcropstyle.customfileuploadinp}
                />
                <div
                  className={`position-absolute ${addcropstyle.customfileuploaddiv}`}
                >
                  Crop image
                </div>
              </div>
            </div>
            <button
              type="submit"
              className={`${logincss.button} col-lg-4 col-md-4  mt-5 d-block`}
            >
              Add crop
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addcrop;
