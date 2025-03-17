import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slider1 from "../../static/img/slider/1.png";
import slider2 from "../../static/img/slider/2.png";
import slider3 from "../../static/img/slider/3.png";
import slider4 from "../../static/img/slider/4.png";

const BentCard = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "-20px",
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
          backgroundColor: "white",
          margin: "0 5px",
          cursor: "pointer",
        }}
      ></div>
    ),
  };

  return (
    <div
      className="bent-card"
      style={{
        maxWidth: "80%",
        textAlign: "center",
        padding: "20px",
        borderRadius: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        margin: "20px",
      }}
    >
      <Slider {...sliderSettings}>
        <div>
          <img
            src={slider1}
            alt="Slide 1"
            style={{ width: "60%", margin: "0 auto 20px" }}
          />
          <div
            className="slider-caption"
            style={{ color: "white", marginTop: "20px" }}
          >
            <h3 className="text-white">
              Welcome to The Employee Self-Service Portal
            </h3>
            <p>
              Access leave management, timesheets, HR reports, approvals, and
              more—all in one place.
            </p>
          </div>
        </div>
        <div>
          <img
            src={slider2}
            alt="Slide 2"
            style={{ width: "60%", margin: "0 auto 20px" }}
          />
          <div
            className="slider-caption"
            style={{ color: "white", marginTop: "20px" }}
          >
            <h3 className="text-white">Easy to Use</h3>
            <p>Our portal is designed to be user-friendly and intuitive.</p>
          </div>
        </div>
        <div>
          <img
            src={slider3}
            alt="Slide 3"
            style={{ width: "60%", margin: "0 auto 20px" }}
          />
          <div
            className="slider-caption"
            style={{ color: "white", marginTop: "20px" }}
          >
            <h3 className="text-white">Secure & Reliable</h3>
            <p>
              We prioritize your data security with industry-standard
              protections.
            </p>
          </div>
        </div>
        <div>
          <img
            src={slider4}
            alt="Slide 4"
            style={{ width: "60%", margin: "0 auto 20px" }}
          />
          <div
            className="slider-caption"
            style={{ color: "white", marginTop: "20px" }}
          >
            <h3 className="text-white">AI-Powered Insights</h3>
            <p>Gain insights and analytics to optimize your HR processes.</p>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default BentCard;
