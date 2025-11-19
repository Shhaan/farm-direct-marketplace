import React, { useState, useEffect, useRef } from "react";
import style from "./MessageInput.module.css";
import { base_django } from "../../Config/Constants";

const MessageInput = ({ sender, reciver, onMessageReceived }) => {
  const [message, setMessage] = useState({});
  const chatSocket = useRef(null);

  useEffect(() => {
    chatSocket.current = new WebSocket(
      `ws://${base_django}/ws/chat/${sender}/${reciver}/`
    );

    chatSocket.current.onopen = (e) => {
      console.log("WebSocket connection opened.");
    };

    chatSocket.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      const receivedMessage = data.message;

      onMessageReceived(receivedMessage);
    };

    chatSocket.current.onclose = (e) => {
      console.log("WebSocket connection closed.");
    };

    chatSocket.current.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    return () => {
      chatSocket.current.close();
      setMessage("");
    };
  }, [reciver, sender, onMessageReceived]);

  const handleSend = () => {
    if (message.trim()) {
      chatSocket.current.send(
        JSON.stringify({
          message: message,
        })
      );
      setMessage("");
    }
  };

  return (
    <div className={style.inputContainer}>
      <input
        type="text"
        className={style.input}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className={style.sendButton} onClick={handleSend}>
        Send
      </button>
    </div>
  );
};

export default MessageInput;
