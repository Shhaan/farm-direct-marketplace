import React, { useEffect, useState } from "react";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import AdminSidebar from "../../../Components/AdminSidebar/AdminSidebar";
import categorycss from "../Category/Category.module.css";
import editCategoryCss from "./EditCategory.module.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../Config/Axios";
import addCategoryCss from "../AddCategory/AddCategory.module.css";

const Category = () => {
  const [side, settoggleside] = useState(true);
  const [error, setErrors] = useState({});
  const [category, setcategory] = useState({});
  const [categories, setcategories] = useState([]);

  const navigate = useNavigate("");
  const { categoryId } = useParams();
  useEffect(() => {
    const fetchCategory = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) {
        try {
          const fetchedcategory = await axios.get(`admin-main/category/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          setcategory(
            ...fetchedcategory.data.filter((obj) => categoryId == obj.id)
          );

          setcategories(
            fetchedcategory.data.filter((obj) => categoryId != obj.id)
          );
        } catch (e) {
          console.log(e);
        }
      }
    };
    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationerror = {};
    if (!category.categoryName) {
      validationerror.categoryName = "Must enter name of category";
    }

    if (!category.categoryImg) {
      validationerror.categoryImg = "Must enter Image of category";
    }

    if (!category.about) {
      validationerror.categoryAbout = "Must enter discription of category";
    }
    if (!category.is_parent && category.parent_id == 0) {
      validationerror.categoryparent = "Select a parent for the category";
    }

    if (Object.keys(validationerror).length > 0) {
      setErrors(validationerror);
      return;
    }

    try {
      const formData = new FormData();
      console.log(category.imageFile);
      if (category.imageFile) {
        formData.append("categoryImg", category.imageFile);
      }
      formData.append("about", category.about);
      formData.append("categoryName", category.categoryName);
      formData.append("parent_id", category.parent_id);
      formData.append("is_parent", category.is_parent);

      const accessToken = localStorage.getItem("access_token");

      console.log(formData.is_parent);
      if (accessToken) {
        const categoryadd = await axios.patch(
          `admin-main/category/${category.id}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log(categoryadd);

        navigate("/admin/category");
      } else {
        navigate("/admin/login");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleimage = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      setcategory((prevCategory) => ({
        ...prevCategory,
        categoryImg: reader.result,
        imageFile: file,
      }));
    };
    reader.readAsDataURL(file);
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
            onSubmit={handleSubmit}
            style={{ paddingTop: "57px", backgroundColor: "transparent" }}
          >
            <div className={editCategoryCss.mainFormdiv}>
              <div>
                <h4>Category name</h4>

                <input
                  type="text"
                  name="categoryName"
                  value={category.categoryName}
                  onChange={(e) =>
                    setcategory((p) => ({ ...p, categoryName: e.target.value }))
                  }
                  id=""
                />
              </div>

              <div>
                <h4>Is Sub category</h4>
                <input
                  type="checkbox"
                  onClick={() =>
                    setcategory((p) => ({ ...p, is_parent: !p.is_parent }))
                  }
                  checked={!category.is_parent}
                  name="isParent"
                  id=""
                />{" "}
              </div>

              {!category.is_parent && (
                <div>
                  <h4>Main category</h4>

                  <select
                    onChange={(e) =>
                      setcategory((p) => ({ ...p, parent_id: e.target.value }))
                    }
                    name="parentId"
                  >
                    {category.parent_id ? (
                      categories
                        .filter((s) => s.id == category.parent_id)
                        .map((obj) => (
                          <option value={obj.id}>{obj.categoryName}</option>
                        ))
                    ) : (
                      <option value={0}>-----------</option>
                    )}

                    {categories
                      .filter((s) => !s.parent_id && s.id != category.parent_id)
                      .map((obj) => (
                        <option value={obj.id}>{obj.categoryName}</option>
                      ))}
                  </select>
                </div>
              )}

              <div>
                <h4>Category img</h4>
                <input
                  type="file"
                  accept="image/*"
                  className={editCategoryCss.imgfileinp}
                  onChange={(e) => handleimage(e)}
                  name="categoryImg"
                  id=""
                />

                <div style={{ position: "relative" }}>
                  <img
                    className={editCategoryCss.imginp}
                    src={category.categoryImg}
                    alt=""
                  />
                  <h6 className={editCategoryCss.imginph6}>Select new image</h6>
                </div>
              </div>

              <div>
                <h4>About</h4>

                <textarea
                  onChange={(e) =>
                    setcategory((p) => ({ ...p, about: e.target.value }))
                  }
                  value={category.about}
                  name="categoryAbout"
                  id=""
                >
                  {category.about}
                </textarea>
              </div>

              <div className="m-auto col-10 col-sm-9 col-md-7 col-lg-5 col-xl-4">
                {" "}
                <button type="submit" className={addCategoryCss.button}>
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Category;
