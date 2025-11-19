import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken, removetoken } from "../../../Slices/Access";
import axios from "../../../Config/Axios";
import { UserRegistered } from "../../../Slices/UserSlice";
import FarmerHeader from "../../../Components/FarmerHeader/FarmerHeader";
import FarmerSidebar from "../../../Components/FarmerSidebar/FarmerSidebar";
import style from "../Home/Home.module.css";
import toast from "react-hot-toast";
import styles from "./Follower.module.css";

const Follower = () => {
  const dispatch = useDispatch();
  const { access, refresh } = useSelector((state) => state.Token);
  const [followers, setFollowers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
            console.log("hi");
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
    fetchFollowers(currentPage);
  }, [access, currentPage]);

  const fetchFollowers = async (page) => {
    try {
      const response = await axios.get(`farmer-main/follower/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (response.status === 200) {
        setFollowers(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        navigate("/farmer/dashboard");
      }
    }
  };

  const handleRemoveFollower = async (e, followerId) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `farmer-main/follower/${followerId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.status === 204) {
        toast.success("Follower removed successfully");
        fetchFollowers(currentPage); // Refresh the current page
      }
    } catch (error) {
      toast.error("Failed to remove follower");
      console.error("Error removing follower:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <FarmerHeader />
      <div style={{ display: "flex" }}>
        <FarmerSidebar />
        <div className={style.content}>
          <h2>Followers</h2>
          <div className={styles.followersContainer}>
            <div className={styles.followersList}>
              <div className={`${styles.followerItem} ${styles.header}`}>
                <div className={styles.followerName}>Name</div>
                <div className={styles.followerInfo}>Email</div>
                <div className={styles.followerInfo}>Phone</div>
                <div className={styles.followerDate}>Followed since</div>
                <div className={styles.followerAction}>Action</div>
              </div>
              {followers.map((follower) => (
                <div key={follower.id} className={styles.followerItem}>
                  <div className={styles.followerName}>
                    {follower.user.First_name} {follower.user.Last_name}
                  </div>
                  <div className={styles.followerInfo}>
                    {follower.user.Email}
                  </div>
                  <div className={styles.followerInfo}>
                    {follower.user.Phone_number}
                  </div>
                  <div className={styles.followerDate}>
                    {follower.followed_at}
                  </div>
                  <div className={styles.followerAction}>
                    <button
                      onClick={(e) => handleRemoveFollower(e, follower.id)}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              <span
                className={styles.pageInfo}
              >{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Follower;
