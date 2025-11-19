import React, { useEffect, useState } from "react";
import marketsidcss from "./Marketsidebar.module.css";
import axios from "../../Config/Axios";
const Marketsidebar = () => {
  const [search, setsearch] = useState("");
  const [parentcategory, setparentcategory] = useState([]);
  const [subcategory, setsubcategory] = useState([]);
  const [ischecked, setchecked] = useState({});
  const [issubchecked, setsubchecked] = useState([]);
  const [isubcategorychecked, setisubcategorychecked] = useState([]);
  const [crops, setcrops] = useState([]);
  useEffect(() => {
    const fetchcategory = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const data = await axios.post(
          "customer/profile/category/home/",

          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setparentcategory(data.data.filter((o) => o.is_parent));
        setsubcategory(data.data.filter((o) => !o.is_parent));
      } catch (e) {
        console.log(e);
      }
    };
    fetchcategory();
    const fetchcrop = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const data = await axios.get("customer/profile/crop/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setcrops(data.data);
        console.log(data.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchcrop();
  }, []);

  const categorycheck = (o) => {
    setchecked((prevState) => {
      const newCheckedState = { ...prevState, [o.id]: !prevState[o.id] };

      const checkedKeys = Object.keys(newCheckedState).filter(
        (key) => newCheckedState[key]
      );
      setsubchecked(
        subcategory.filter((e) => checkedKeys.includes(e.parent_id.toString()))
      );

      return newCheckedState;
    });
  };

  return (
    <aside className="col-5 col-md-4 col-lg-3   ">
      <div className={marketsidcss.mainflexdiv}>
        <div className="m-auto my-5">
          <input
            id={marketsidcss.inpsearch}
            type="search"
            value={search}
            onChange={(e) => setsearch((p) => (p = e.target.value))}
          />
        </div>

        <div>
          <h4 className={marketsidcss.mainheading}>Filter on category</h4>
          <div className={`text-center ${marketsidcss.griddivcategory}`}>
            {parentcategory.map((o) => (
              <div key={o.id} className={marketsidcss.parentcategorysubflexdiv}>
                <input
                  type="checkbox"
                  checked={ischecked[o.id] || false}
                  onChange={() => categorycheck(o)}
                  id=""
                />
                <h6>{o.categoryName}</h6>
              </div>
            ))}
          </div>
          <div className={marketsidcss.flexsubcategory}>
            {issubchecked.map((o) => (
              <>
                {" "}
                <div
                  onClick={() =>
                    setisubcategorychecked((prevState) => ({
                      ...prevState,
                      [o.id]: !prevState[o.id],
                    }))
                  }
                  className={marketsidcss.flexsubcategoryinner}
                >
                  <input
                    checked={isubcategorychecked[o.id] || false}
                    type="checkbox"
                    name=""
                    id=""
                  />
                  <h6>{o.categoryName}</h6>
                </div>
                <div className={marketsidcss.cropsgriddiv}>
                  <div className={marketsidcss.cropsList}>
                    {crops.map((object) => (
                      <div>{object.cropName}</div>
                    ))}
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
        <div>
          <h4 className={marketsidcss.mainheading}>Filter on Farmer</h4>
        </div>
      </div>
    </aside>
  );
};

export default Marketsidebar;
