import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setToken, removetoken } from "../../../Slices/Access";
import axios from "../../../Config/Axios";
import { UserRegistered } from "../../../Slices/UserSlice";
import FarmerHeader from "../../../Components/FarmerHeader/FarmerHeader";
import FarmerSidebar from "../../../Components/FarmerSidebar/FarmerSidebar";
import style from "../Home/Home.module.css";
import logincss from "../../Customer/Login/Login.module.css";

import salecss from "../Sale/Sale.module.css";
const Edit = () => {
  const dispatch = useDispatch();
  const { access, refresh } = useSelector((state) => state.Token);
  const { user } = useSelector((state) => state.user);
  const [selectedParent, setselectedparent] = useState("");

  const [parentcategory, setparentcategory] = useState([]);
  const [subcategory, setsubcategory] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formdata, setformdata] = useState({
    parentcategory: "",
    category: "",
    cropName: "",
    quantity: 0,
    price: 0,
    image: [],
    About: "",
    id: "",
  });
  useEffect(() => {
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
        console.log(e);
        navigate("/");
      }
    };

    fetchUser();

    const fetchCrop = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        const { data } = await axios.get(`farmer-main/cropimgall/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setformdata((p) => ({
          ...p,
          parentcategory: data.parent.categoryName,
          category: data.category.categoryName,
          cropName: data.cropName,
          quantity: data.quantity,
          price: data.price,
          image: data.image,
          About: data.About,
        }));
      } catch (e) {
        console.log(e);
      }
    };
    fetchCrop();
  }, [access, user.id]);
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
          <h2 className="text-center mt-4">Edit crop</h2>

          <div className={` mt-4 ${salecss.quickflexdiv}`}>
            <form className="col-10 col-sm-9 col-md-8 col-lg-7 col-xl-5 m-auto p-4">
              <div>
                <div className="m-4">
                  <select
                    name="parentcategory"
                    className={`${logincss.inp} w-100`}
                    onChange={(e) => (
                      setselectedparent(e.target.value), handlechange(e)
                    )}
                  >
                    <option
                      style={{ color: "white" }}
                      value={formdata.parentcategory}
                    >
                      {formdata.parentcategory}
                    </option>
                    {parentcategory
                      .filter(
                        (obj) => obj.categoryName != formdata.parentcategory
                      )
                      .map((o) => (
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
                    <option
                      style={{ color: "white" }}
                      value={formdata.category}
                    >
                      {formdata.category}
                    </option>
                    {subcategory
                      .filter(
                        (obj) => obj.parent_id == parseInt(selectedParent)
                      )
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
                    value={formdata.cropName}
                    placeholder="Vareity name"
                    className={`${logincss.inp} w-100`}
                  />
                </div>
                <div className="m-4">
                  <input
                    onChange={(e) => handlechange(e)}
                    type="number"
                    name="price"
                    value={formdata.price}
                    placeholder="Price"
                    className={`${logincss.inp} w-100`}
                  />
                </div>
                <div className="m-4">
                  <input
                    onChange={(e) => handlechange(e)}
                    type="number"
                    name="quantity"
                    value={formdata.quantity}
                    placeholder="Quantity"
                    className={`${logincss.inp} w-100`}
                  />
                </div>
                <div className="m-4">
                  <input
                    onChange={(e) => handlechange(e)}
                    type="text"
                    name="About"
                    value={formdata.About}
                    placeholder="About"
                    className={`${logincss.inp} w-100`}
                  />
                </div>
              </div>
              <button
                type="submit"
                className={`${logincss.button} col-lg-4 col-md-4  mt-5 d-block`}
              >
                Edit crop
              </button>
            </form>
          </div>

          <div style={{ textAlign: "end", width: "75%", margin: "auto" }}></div>
          <div className="m-auto mt-4 col-12 col-md-10 col-lg-8    "></div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
