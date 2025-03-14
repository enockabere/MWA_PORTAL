import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slider1 from "../../../static/img/slider/1.png";
import slider2 from "../../../static/img/slider/2.png";
import slider3 from "../../../static/img/slider/3.png";
import slider4 from "../../../static/img/slider/4.png"; // Add a new slider image

const HangingBentCard = () => {
  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Remove slider arrows
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "-20px", // Adjust this value to move dots further down
          width: "100%",
          textAlign: "center",
        }}
      >
        <ul style={{ margin: "0", padding: "0", color: "white" }}>{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "white", // White dots
          margin: "0 5px",
          cursor: "pointer",
        }}
      ></div>
    ),
  };
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {/* String (Rope Effect) */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "50%",
          width: "2px",
          height: "50px", // Length of the string
          backgroundColor: "white",
          transform: "translateX(-50%)",
          zIndex: "10",
        }}
      ></div>

      {/* Bent Card */}
      <div className="bent-card">
        {/* Bent Corner SVG */}
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            transform: "translate(10px, -10px)", // Adjust position
            zIndex: "10",
          }}
        >
          <path
            d="M0 0 L50 0 L50 50 Z"
            fill="rgba(255, 255, 255, 0.2)" // Light overlay for transparency
          />
          <path
            d="M50 0 L50 50 L0 50"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        {/* Slider Content */}
        <Slider {...sliderSettings}>
          <div>
            <img
              src={slider1}
              alt="Slide 1"
              style={{ width: "60%", margin: "0 auto 20px" }}
            />
            <div className="slider-caption">
              <h3 className="text-white">
                Welcome to The Employee Self-Service Portal
              </h3>
              <p>
                Access leave management, timesheets, HR reports, approvals, and
                more—all in one place.
              </p>
            </div>
          </div>
        </Slider>
      </div>

      {/* CSS */}
      <style>
        {`
          .bent-card {
            position: relative;
            max-width: 80%;
            text-align: center;
            padding: 20px;
            border-radius: 20px;
            background-color: rgba(255, 255, 255, 0.1);
            margin: 20px;
            animation: floating 3s ease-in-out infinite;
          }

          @keyframes floating {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(-1deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
        `}
      </style>
    </div>
  );
};

export default HangingBentCard;
