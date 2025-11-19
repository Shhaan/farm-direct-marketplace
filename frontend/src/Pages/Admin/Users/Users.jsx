import React, { useEffect, useState } from "react";
import AdminHeader from "../../../Components/AdminHeader/AdminHeader";
import AdminSidebar from "../../../Components/AdminSidebar/AdminSidebar";
import categorycss from "../Category/Category.module.css";
import axios from "../../../Config/Axios";
import { useNavigate, useSearchParams } from "react-router-dom";
const Users = () => {
  const [side, settoggleside] = useState(true);
  const [users, setfarmer] = useState([]);
  const [search, setsearch] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fectchusers = async () => {
      try {
        const access = localStorage.getItem("access_token");
        const users = await axios.get("admin-main/customer/", {
          headers: {
            Authorization: `Bearer ${access} `,
          },
        });

        setfarmer(users.data);
      } catch (e) {
        console.log(e);
        if (e.response.status == 401 || e.response.status == 403) {
          navigate("/admin/login");
        }
      }
    };
    fectchusers();
  }, []);
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
          <div>
            <div className={categorycss.divsearchcat}>
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
            <div style={{ marginTop: "60px" }}>
              {users
                .filter(
                  (user) =>
                    user.Email.toLowerCase().includes(search.toLowerCase()) &&
                    user.is_staff === false
                )
                .map((obj, i) => (
                  <>
                    <div
                      key={obj.id}
                      className={` ${categorycss.flexdiv}   col-11 col-sm-10 col-md-9`}
                    >
                      <h3>{i + 1}</h3>

                      <h3>{obj.Email}</h3>

                      <div>
                        {obj.is_blocked ? (
                          <button
                            type="button"
                            class="btn btn-outline-danger ms-2 p-2"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
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

export default Users;
