import React, { useEffect, useState } from "react";
import UserHeader from "../../../Components/UserHeader/UserHeader";
import axios from "../../../Config/Axios";
import Userfooter from "../../../Components/userFooter/UserFooter";
import style from "./Aboutproduct.module.css";
import { Api_base } from "../../../Config/Constants";
const Aboutproduct = () => {
  const [category, setCategory] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await axios.get("customer/profile/category/home/");
        setCategory(data);
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchCategory();
  }, []);

  const handleParentClick = (id) => {
    setSelectedParent((p) => (p == id ? null : id));
  };

  return (
    <div>
      <UserHeader />
      <div
        className="py-4 pt-5 text-center"
        style={{
          width: "100%",
          background: "#77E87B",
          opacity: "0.8",
        }}
      >
        {category
          .filter((o) => o.is_parent)
          .map((obj) => (
            <div key={obj.id}>
              <div
                className={style.divs}
                onClick={() => handleParentClick(obj.id)}
                style={{ cursor: "pointer" }}
              >
                <img
                  style={{ height: "51px", width: "72px" }}
                  src={Api_base + obj.categoryImg}
                  alt=""
                />

                <div className="text-start">
                  <h5>{obj.categoryName}</h5>
                  <h6>{obj.about}</h6>
                </div>
              </div>
              {selectedParent && selectedParent === obj.id && (
                <div style={{ marginLeft: "20px" }}>
                  {category
                    .filter((sub) => sub.parent_id === obj.id)
                    .map((sub) => (
                      <div className={style.sdivs} key={sub.id}>
                        <img
                          style={{ height: "51px", width: "72px" }}
                          src={Api_base + sub.categoryImg}
                          alt=""
                        />

                        <div className="text-start">
                          <h5>{sub.categoryName}</h5>
                          <h6>{sub.about}</h6>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
      </div>
      <Userfooter />
    </div>
  );
};

export default Aboutproduct;
