import React, { useEffect, useState, useRef } from "react";
import UserHeader from "../../../../Components/UserHeader/UserHeader";
import Message from "./Message";
import style from "./Message.module.css";
import MessageInput from "../../../../Components/MessageInput/MessageInput";
import Inboxsidebar from "../../../../Components/Inboxsidebar/Inboxsidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Userfooter from "../../../../Components/userFooter/UserFooter";
import axios from "../../../../Config/Axios";
import { UserRegistered } from "../../../../Slices/UserSlice";
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
      navigate("/inbox");
    }
  }, [state]);
  const handleMessageReceived = (data) => {
    console.log(data);
    setMessages((p) => [...p, data]);
  };
  return (
    <div>
      <UserHeader />

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
      <Userfooter />
    </div>
  );
};

export default ChatRoom;
