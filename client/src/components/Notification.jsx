import React, { useEffect } from "react";
import { FiCheck, FiX } from "react-icons/fi";

const Notification = ({ message, type }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector(".notification").classList.add("fade-out");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`notification ${type}`}>
      {type === "success" ? <FiCheck className="icon" /> : <FiX className="icon" />}
      <span>{message}</span>
    </div>
  );
};

export default Notification;