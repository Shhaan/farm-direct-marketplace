import React from "react";
import adminheadcss from "./AdminHeader.module.css";
import { useNavigate } from "react-router-dom";
const AdminHeader = ({ toggleSidebar, side }) => {
  const navigator = useNavigate();
  return (
    <div className={adminheadcss.head}>
      <div className={adminheadcss.flexdiv}>
        <div className={adminheadcss.flexsubdiv} onClick={toggleSidebar}>
          {side ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="21"
              fill="currentColor"
              className="text-white bi bi-x-lg"
              viewBox="0 0 16 16"
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="21"
              fill="currentColor"
              className="text-white bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
              />
            </svg>
          )}
        </div>
        <div>
          <h2 className={adminheadcss.mainHead}>FarmAid</h2>
        </div>
        <div onClick={() => navigator("/")}>
          <h2
            style={{ cursor: "pointer" }}
            className={adminheadcss.homeElement}
          >
            Home
          </h2>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
