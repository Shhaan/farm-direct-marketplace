import React from "react";
import style from "./Message.module.css";
const Message = ({ text, send }) => {
  return (
    <div className={`${style.message} ${send ? style.send : style.receive}`}>
      {text}
    </div>
  );
};

export default Message;
