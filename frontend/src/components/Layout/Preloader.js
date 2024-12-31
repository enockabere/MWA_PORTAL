// Preloader.js
import React from "react";
import { Bars } from "react-loader-spinner";
import "./preloader.css";

const Preloader = ({ message = "Loading..." }) => {
  return (
    <div className="preloader-container">
      <Bars height="50" width="50" color="#4caf50" ariaLabel="loading" />
      <p className="preloader-text">{message}</p>
    </div>
  );
};

export default Preloader;
