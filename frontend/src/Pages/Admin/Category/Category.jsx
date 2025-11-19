import React, { useCallback, useEffect, useState } from "react";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import AdminSidebar from "../../../Components/AdminSidebar/AdminSidebar";
import categorycss from "./Category.module.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../../../Config/Axios";
import { Api_base_without_append } from "../../../Config/Constants";
const Category = () => {
  const [side, settoggleside] = useState(true);
  const [search, setsearch] = useState("");
  const [categories, setcategories] = useState([]);
  const [isdelete, setisDelete] = useState(false);
  const [categoryparamId, setcategoryparmId] = useState("");
  const [isedited, setisedited] = useState(false);
  const navigate = useNavigate("");
  const location = useLocation();

  const parm = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const user = await axios("admin/get-admin/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log(user);
      } catch (e) {
        console.log(e);
        if (e.response.status == 401 || e.response.status == 403) {
          navigate("/admin/login");
        }
      }
    };
    fetchUser();

    if (parm) {
      setcategoryparmId(parm.categoryId);
    }

    console.log(categoryparamId);

    if (window.location.pathname.includes(`/admin/category/delete/`)) {
      setisDelete(true);
    } else {
      setisDelete(false);
    }

    const fetchCategory = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) {
        try {
          const categories = await axios.get("admin-main/category/", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          setcategories(categories.data);
        } catch (e) {
          navigate("/admin/login");
        }
      } else {
        navigate("/admin/login");
      }
    };

    fetchCategory();
    console.log(parm.categoryId);
  }, []);

  const handledelete = async (id, is_blocked) => {
    try {
      const accessToken = localStorage.getItem("access_token");

      const blockcategories = await axios.patch(
        `admin-main/category/partial-delete/${parseInt(id)}/`,
        { is_blocked: is_blocked },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (blockcategories.status === 200) {
        const updatedCategory = blockcategories.data;

        setisedited(true);
        setcategories((e) => [...updatedCategory]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <React.Fragment>
      <div
        onClick={() => {
          return setisDelete(false), navigate(`/admin/category`);
        }}
      >
        <AdminHeader
          onClick
          side={side}
          toggleSidebar={() => settoggleside((p) => !p)}
        />
      </div>

      <div className={categorycss.maindiv}>
        <AdminSidebar side={side} />

        <div
          className={`${categorycss.content} ${
            side ? "" : categorycss.noSidebar
          }`}
        >
          {isdelete && (
            <div className={`${categorycss.deleteDiv} col-8`}>
              <div
                onClick={() => {
                  return setisDelete(false), navigate(`/admin/category`);
                }}
                className="text-end"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  fill="currentColor"
                  class="bi bi-x-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>{" "}
              </div>

              {categories
                .filter((obj) => parseInt(obj.id) === parseInt(categoryparamId))
                .map((cat) => {
                  return (
                    <>
                      <h1 className="text-center">
                        Are you sure to Block {cat.categoryName}?
                      </h1>
                      {cat.is_parent && (
                        <h3>The Sub category also will be Blocked</h3>
                      )}

                      {!cat.is_blocked ? (
                        <button
                          onClick={() => handledelete(cat.id, cat.is_blocked)}
                          className="btn btn-outline-danger m-auto p-2"
                          style={{ display: "block" }}
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          onClick={() => handledelete(cat.id, cat.is_blocked)}
                          className="btn btn-outline-success m-auto p-2"
                          style={{ display: "block" }}
                        >
                          Unblock
                        </button>
                      )}
                    </>
                  );
                })}
            </div>
          )}

          <div className={categorycss.divsearchcat}>
            <button
              className={` col-md-3 col-6 col-sm-3 col-lg-2 ${categorycss.addCategory}`}
            >
              <Link
                style={{ color: "white", textDecoration: "none" }}
                to={"/admin/category/add"}
              >
                {" "}
                Add Category
              </Link>
            </button>
            <div>
              <input
                type="search"
                placeholder="Search"
                className={categorycss.searchinp}
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h2 className="my-4">Main Category</h2>

            <div>
              {categories
                .filter((o) => o.is_parent)
                .map((obj) => (
                  <>
                    <div
                      key={obj.id}
                      className={` ${categorycss.flexdiv}   col-11 col-sm-10 col-md-9`}
                    >
                      <img
                        style={{
                          height: "40px",
                          width: "43px",
                          borderRadius: "48px",
                        }}
                        src={
                          isedited
                            ? Api_base_without_append + obj.categoryImg
                            : obj.categoryImg
                        }
                        alt="category"
                      />
                      <h3>{obj.categoryName}</h3>

                      <div>
                        <Link to={`/admin/category/edit/${obj.id}`}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="text-primary bi bi-pencil-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                          </svg>
                        </Link>

                        {obj.is_blocked ? (
                          <button
                            onClick={() => {
                              return (
                                setisDelete((e) => (e = true)),
                                navigate(
                                  `/admin/category/delete/${obj.id}`,
                                  setcategoryparmId(obj.id)
                                )
                              );
                            }}
                            type="button"
                            class="btn btn-outline-success ms-2 p-2"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              return (
                                setisDelete((e) => (e = true)),
                                navigate(
                                  `/admin/category/delete/${obj.id}`,
                                  setcategoryparmId(obj.id)
                                )
                              );
                            }}
                            type="button"
                            class="btn btn-outline-danger ms-2 p-2"
                          >
                            Block
                          </button>
                        )}
                      </div>
                    </div>
                    <br />
                  </>
                ))}
            </div>
          </div>

          <div>
            <h2 className="my-4">Sub Category</h2>

            <div>
              {categories
                .filter((o) => !o.is_parent)
                .map((obj) => (
                  <>
                    <div
                      key={obj.id}
                      className={` ${categorycss.flexdiv}   col-11 col-sm-10 col-md-9`}
                    >
                      <img
                        style={{
                          height: "40px",
                          width: "43px",
                          borderRadius: "48px",
                        }}
                        src={
                          isedited
                            ? Api_base_without_append + obj.categoryImg
                            : obj.categoryImg
                        }
                        alt="category"
                      />
                      <h3>{obj.categoryName}</h3>

                      <div>
                        <Link to={`/admin/category/edit/${obj.id}`}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="text-primary bi bi-pencil-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z" />
                          </svg>
                        </Link>

                        {obj.is_blocked ? (
                          <button
                            onClick={() => {
                              return (
                                setisDelete((e) => (e = true)),
                                navigate(
                                  `/admin/category/delete/${obj.id}`,
                                  setcategoryparmId(obj.id)
                                )
                              );
                            }}
                            type="button"
                            class="btn btn-outline-success ms-2 p-2"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              return (
                                setisDelete((e) => (e = true)),
                                navigate(
                                  `/admin/category/delete/${obj.id}`,
                                  setcategoryparmId(obj.id)
                                )
                              );
                            }}
                            type="button"
                            class="btn btn-outline-danger ms-2 p-2"
                          >
                            Block
                          </button>
                        )}
                      </div>
                    </div>
                    <br />
                  </>
                ))}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Category;
