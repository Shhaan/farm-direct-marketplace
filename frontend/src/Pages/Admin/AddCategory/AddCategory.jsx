import React, { useState, useReducer, useEffect } from "react";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import AdminSidebar from "../../../Components/AdminSidebar/AdminSidebar";
import categorycss from "../Category/Category.module.css";
import addCategoryCss from "./AddCategory.module.css";
import { categoryreducer } from "../../../Functions/Reducer";
import axios from "../../../Config/Axios";
import { useNavigate } from "react-router-dom";
const Category = () => {
  const [side, settoggleside] = useState(true);
  const navigate = useNavigate("");
  const [mainCategory, setcategories] = useState([]);
  const [error, setErrors] = useState({});

  const initialState = {
    categoryName: "",
    categoryImg: null,
    categoryAbout: "",
    parentId: 0,
    isParent: true,
  };

  const [data, setdatadispatch] = useReducer(categoryreducer, initialState);

  useEffect(() => {
    const fetchParent = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) {
        try {
          const categories = await axios.get("admin-main/category/", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if ((categories.status = 200)) {
            const data = categories.data.filter((obj) => obj.is_parent);

            setcategories(data);
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    fetchParent();
  }, []);

  const handleState = (e) => {
    const { name, value } = e.target;

    setdatadispatch({ type: "AddCategory", field: name, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationerror = {};

    if (!data.categoryName) {
      validationerror.categoryName = "Must enter the name of category";
    }
    if (!data.categoryAbout) {
      validationerror.categoryAbout = "Must Enter the describtion of category";
    }
    if (!data.categoryImg) {
      validationerror.categoryImg = "Must Enter the image of category";
    }

    if (!data.isParent && data.parentId == 0) {
      validationerror.categoryParent = "Must Enter Main category";
    } else if (data.isParent) {
      setdatadispatch({ type: "AddCategory", field: "parentId", value: 0 });
    }

    if (Object.keys(validationerror).length > 0) {
      setErrors(validationerror);

      return;
    }

    try {
      const formData = new FormData();
      formData.append("categoryName", data.categoryName);
      formData.append("about", data.categoryAbout);
      formData.append("categoryImg", data.categoryImg);
      formData.append("parent_id", data.parentId);
      formData.append("is_parent", data.isParent);

      const accessToken = localStorage.getItem("access_token");

      if (accessToken) {
        const categoryadd = await axios.post("admin-main/category/", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log(categoryadd);

        navigate("/admin/category");
      } else {
        navigate("/admin/login");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <React.Fragment>
      <AdminHeader side={side} toggleSidebar={() => settoggleside((p) => !p)} />

      <div className={categorycss.maindiv}>
        <AdminSidebar side={side} />

        <div
          className={`${categorycss.content} ${
            side ? "" : categorycss.noSidebar
          }`}
        >
          <form
            onSubmit={(e) => handleSubmit(e)}
            style={{ paddingTop: "57px", backgroundColor: "transparent" }}
          >
            <h2 className="text-center mb-5  ">Add category</h2>
            <div className={addCategoryCss.mainFormdiv}>
              <div>
                {data.isParent ? (
                  <h4>Category name</h4>
                ) : (
                  <h4>Sub Category name</h4>
                )}
                <input
                  onChange={(e) => handleState(e)}
                  value={data.categoryName}
                  type="text"
                  name="categoryName"
                  id=""
                />
                {error.categoryName && (
                  <h5 className="text-danger fs-6">{error.categoryName}</h5>
                )}
              </div>

              <div>
                <h4>Is Subcategory</h4>
                <input
                  onClick={(e) =>
                    setdatadispatch({
                      type: "AddCategory",
                      field: e.target.name,
                      value: !data.isParent,
                    })
                  }
                  type="checkbox"
                  name="isParent"
                  id=""
                />{" "}
              </div>

              {!data.isParent && (
                <div>
                  <h4>Main category</h4>

                  <select onChange={(e) => handleState(e)} name="parentId">
                    <option value={0}>-----------</option>

                    {mainCategory.map((obj) => (
                      <option key={obj.id} value={obj.id}>
                        {obj.categoryName}
                      </option>
                    ))}
                  </select>
                  {error.categoryParent && (
                    <h5 className="text-danger fs-6">{error.categoryParent}</h5>
                  )}
                </div>
              )}

              <div>
                <h4>Category image</h4>
                <input
                  onChange={(e) =>
                    setdatadispatch({
                      type: "AddCategory",
                      field: e.target.name,
                      value: e.target.files[0],
                    })
                  }
                  accept="image/*"
                  type="file"
                  name="categoryImg"
                />
                {error.categoryImg && (
                  <h5 className="text-danger fs-6">{error.categoryImg}</h5>
                )}
              </div>

              <div>
                <h4>About</h4>

                <textarea
                  onChange={(e) => handleState(e)}
                  value={data.categoryAbout}
                  name="categoryAbout"
                  id=""
                >
                  {data.categoryAbout}
                </textarea>

                {error.categoryAbout && (
                  <h5 className="text-danger fs-6">{error.categoryAbout}</h5>
                )}
              </div>
            </div>
            <div className="m-auto col-10 col-sm-9 col-md-7 col-lg-5 col-xl-4">
              {" "}
              <button type="submit" className={addCategoryCss.button}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Category;
