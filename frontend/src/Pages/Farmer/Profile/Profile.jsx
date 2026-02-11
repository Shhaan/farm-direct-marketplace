import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken, removetoken } from "../../../Slices/Access";
import axios from "../../../Config/Axios";
import { UserRegistered } from "../../../Slices/UserSlice";
import FarmerHeader from "../../../Components/FarmerHeader/FarmerHeader";
import FarmerSidebar from "../../../Components/FarmerSidebar/FarmerSidebar";
import style from "../Home/Home.module.css";

const Profile = () => {
  const dispatch = useDispatch();
  const { access, refresh } = useSelector((state) => state.Token);
  const { user } = useSelector((state) => state.user);
  const [profile, setProfile] = useState(null);
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
        console.log(e);
        navigate("/");
      }
    };

    const fetchProfile = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`farmer-main/profile/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setProfile(response.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchUser();
    fetchProfile();
  }, [access]);

  return (
    <div className={style.farmerDashboard}>
      <FarmerHeader />

      <div className={style.dashboardLayout}>
        <FarmerSidebar />
        <div className={style.content}>
          <div className={style.welcomeSection} style={{ marginBottom: '24px' }}>
            <div className={style.welcomeContent}>
              <h1 className={style.welcomeTitle}>My Profile</h1>
              <p className={style.welcomeSubtitle}>Manage your farm profile information</p>
            </div>
          </div>

          <div className={style.chartCard}>
            <div className={style.cardTitle}>Profile Information</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#F4F1EA', borderRadius: '12px' }}>
                  <label style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#444', margin: '4px 0 0' }}>
                    {user?.First_name} {user?.Last_name}
                  </p>
                </div>
                <div style={{ padding: '16px', background: '#F4F1EA', borderRadius: '12px' }}>
                  <label style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#444', margin: '4px 0 0' }}>{user?.Email}</p>
                </div>
                <div style={{ padding: '16px', background: '#F4F1EA', borderRadius: '12px' }}>
                  <label style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone</label>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#444', margin: '4px 0 0' }}>{user?.Phone_number || 'Not provided'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#F4F1EA', borderRadius: '12px' }}>
                  <label style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</label>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#444', margin: '4px 0 0' }}>{profile?.Location || 'Not set'}</p>
                </div>
                <div style={{ padding: '16px', background: '#F4F1EA', borderRadius: '12px' }}>
                  <label style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bio</label>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#444', margin: '4px 0 0' }}>{profile?.Bio || 'No bio added'}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/farmer/edit/profile')}
              style={{
                marginTop: '24px',
                background: 'linear-gradient(135deg, #6BA368, #4A7C47)',
                color: 'white',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
