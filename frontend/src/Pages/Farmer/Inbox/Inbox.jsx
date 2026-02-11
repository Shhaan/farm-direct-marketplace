import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setToken, removetoken } from "../../../Slices/Access";
import axios from "../../../Config/Axios";
import { UserRegistered } from "../../../Slices/UserSlice";

import FarmerHeader from "../../../Components/FarmerHeader/FarmerHeader";
import FarmerSidebar from "../../../Components/FarmerSidebar/FarmerSidebar";
import style from "../Home/Home.module.css";
import msgStyle from "../../Customer/Profiles/Inbox/Message.module.css";

import Inboxsidebar from "../../../Components/InboxFarmerside/InboxFarmerside";
import Message from "../../Customer/Profiles/Inbox/Message";
import MessageInput from "../../../Components/MessageInput/MessageInput";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        const getuser = await axios.get(`currentuser/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        dispatch(UserRegistered(getuser.data));
      } catch (e) {
        console.log(e);
        navigate("/");
      }
    };

    fetchUser();

    const fetchMessage = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const message = await axios(`chat/get-message/${user.id}/${state}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMessages(message.data);
      } catch (e) {
        console.log(e);
      }
    };

    if (state && user) {
      fetchMessage();
    } else {
      navigate("/farmer/inbox");
    }
  }, [state]);

  const handleMessageReceived = (data) => {
    setMessages((p) => [...p, data]);
  };

  return (
    <div className={style.farmerDashboard}>
      <FarmerHeader />

      <div className={style.dashboardLayout}>
        <FarmerSidebar />
        <div className={style.content} style={{ padding: 0, display: 'flex' }}>
          <Inboxsidebar id={state} />

          <section style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            background: 'white',
            borderRadius: '0 20px 20px 0',
            overflow: 'hidden'
          }}>
            {state ? (
              <>
                <div style={{
                  padding: '16px 24px',
                  borderBottom: '1px solid #E5E7EB',
                  background: 'linear-gradient(135deg, #6BA368 0%, #4A7C47 100%)',
                  color: 'white'
                }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Chat</h3>
                </div>
                <div className={msgStyle.section} style={{
                  flex: 1,
                  padding: '20px',
                  overflowY: 'auto',
                  background: '#F4F1EA'
                }}>
                  {messages.map((msg, index) => (
                    <Message
                      key={index}
                      text={msg.message}
                      send={msg.sender == user.id}
                    />
                  ))}
                </div>
                <MessageInput
                  onMessageReceived={handleMessageReceived}
                  sender={user.id}
                  reciver={state}
                />
              </>
            ) : (
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: '#888',
                background: '#F4F1EA'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
                <h3 style={{ color: '#8A6E45', marginBottom: '8px' }}>Select a conversation</h3>
                <p>Choose a customer to start chatting</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
