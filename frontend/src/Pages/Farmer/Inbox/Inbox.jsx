import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setToken, removetoken } from "../../../Slices/Access";
import axios from "../../../Config/Axios";
import { UserRegistered } from "../../../Slices/UserSlice";

import FarmerHeader from "../../../Components/FarmerHeader/FarmerHeader";
import style from "../../Customer/Profiles/Inbox/Message.module.css";

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
        console.log(message);
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
    console.log(data);
    setMessages((p) => [...p, data]);
  };
  return (
    <div>
      <FarmerHeader />

      <div className={style.mainflexdiv}>
        <Inboxsidebar id={state} />

        <section
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          {state ? (
            <>
              <div className={style.section}>
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
            <h5>sdfs</h5>
          )}
        </section>
      </div>
    </div>
  );
};

export default ChatRoom;
