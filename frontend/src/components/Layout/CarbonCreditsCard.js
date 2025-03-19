import React, { useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CarbonCreditsCard = () => {
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [leaderboardPage, setLeaderboardPage] = useState(0);

  const totalCredits = 200; // Example max credits
  const earnedCredits = 120; // Example earned credits
  const progress = (earnedCredits / totalCredits) * 100;

  // Header text based on the active slide
  const headerTexts = [
    "Sustainability Score",
    "Sustainability Activities",
    "Sustainability Levels",
    "Sustainability Leaderboard",
  ];

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // Remove left and right arrows
    afterChange: (index) => setSlideIndex(index),
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "-20px", // Move dots further down
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <ul style={{ margin: "0", padding: "0" }}>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: i === slideIndex ? "#ffc107" : "#ffff", // Yellow for active dot
        }}
      ></div>
    ),
  };

  // Example activities
  const activities = [
    { name: "Biking to work", credits: 20, emoji: "🚴‍♂️" },
    { name: "Using public transport", credits: 15, emoji: "🚆" },
    { name: "Planting a tree", credits: 30, emoji: "🌳" },
  ];

  // Example leaderboard
  const leaderboard = [
    { name: "Alice", credits: 150 },
    { name: "Bob", credits: 120 },
    { name: "Charlie", credits: 100 },
    { name: "David", credits: 90 },
    { name: "Eve", credits: 80 },
    { name: "Frank", credits: 70 },
  ];

  // Pagination for leaderboard
  const rowsPerPage = 3;
  const totalPages = Math.ceil(leaderboard.length / rowsPerPage);
  const paginatedLeaderboard = leaderboard.slice(
    leaderboardPage * rowsPerPage,
    (leaderboardPage + 1) * rowsPerPage
  );

  // Sustainability Levels
  const sustainabilityLevels = [
    {
      name: "Eco Warrior",
      range: "0 - 2000 Points",
      stars: "★★☆☆☆☆", // First two stars yellow
      emoji: "🌱", // Emoji for Eco Warrior
      backgroundColor: "#ffffff", // White background
      textColor: "#000000", // Black text
    },
    {
      name: "Green Innovator",
      range: "2000 - 4000 Points",
      stars: "★★★★☆☆", // First four stars yellow
      emoji: "🏆", // Emoji for Green Innovator
      benefits: ["Earn Free Eco Lunch"],
      redeemable: true,
    },
    {
      name: "Sustainability Champion",
      range: "Over 4000 Points",
      stars: "★★★★★★", // All stars yellow
      emoji: "🥇", // Emoji for Sustainability Champion
      benefits: ["Earn a Day Off"],
      redeemable: true,
    },
  ];

  return (
    <div
      className="card text-white p-4 shadow-lg"
      style={{
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        borderRadius: "15px",
        width: "300px",
        position: "relative",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center">
        <div style={{ width: "100%", textAlign: "center" }}>
          <h5 className="fw-bold" style={{ color: "#ffffff" }}>
            Carbon Credits
          </h5>
          <p className="small" style={{ color: "#e9ecef" }}>
            {headerTexts[slideIndex]} {/* Dynamic header text */}
          </p>
        </div>
      </div>

      {/* Slider */}
      <Slider {...sliderSettings}>
        {/* Slide 1: Circular Progress */}
        <div>
          <div className="text-center my-4">
            <div style={{ width: "120px", margin: "0 auto" }}>
              <CircularProgressbar
                value={progress}
                text={`${earnedCredits} pts`}
                styles={buildStyles({
                  pathColor: "#ffc107", // Yellow color for the progress
                  textColor: "#ffffff", // White color for the text
                  trailColor: "#e9ecef", // Light gray color for the trail
                  textSize: "16px",
                })}
              />
            </div>
          </div>
          <p className="text-center fw-bold fs-5">
            {earnedCredits} Credits Earned
          </p>
          <p className="text-center text-white-50 small">
            Yearly Challenge: Reach 500 credits for a reward! 🏆
          </p>
        </div>

        {/* Slide 2: Activities */}
        <div>
          <ul className="list-unstyled">
            {activities.map((activity, index) => (
              <li key={index} className="text-center my-2">
                <span style={{ fontSize: "24px" }}>{activity.emoji}</span>
                <br />
                <span style={{ color: "#ffffff" }}>{activity.name}</span>
                <span style={{ color: "#ffc107" }}>
                  {" "}
                  +{activity.credits} pts
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Slide 3: Sustainability Levels */}
        <div>
          <div style={{ textAlign: "center" }}>
            {sustainabilityLevels.map((level, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: level.backgroundColor || "transparent",
                  color: level.textColor || "#ffffff",
                  padding: "10px",
                  borderRadius: "10px",
                  marginBottom: "3px",
                }}
              >
                <h6
                  style={{
                    fontSize: "15px",
                    color: level.backgroundColor ? "#000000" : "#ffffff",
                  }}
                >
                  {level.emoji} {level.name}{" "}
                  <span style={{ color: "#ffc107" }}>{level.stars}</span>
                </h6>
                <p
                  style={{
                    fontSize: "12px",
                    color: level.backgroundColor ? "#000000" : "#ffffff",
                  }}
                >
                  {level.range}
                </p>
                {level.benefits?.map((benefit, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      color: "#ffc107",
                      textDecoration: "none",
                      fontSize: "10px",
                      display: "block",
                    }}
                  >
                    {benefit}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Slide 4: Leaderboard */}
        <div>
          <table style={{ width: "100%", textAlign: "center" }}>
            <thead>
              <tr>
                <th style={{ color: "#ffffff", fontSize: "14px" }}>Name</th>
                <th style={{ color: "#ffffff", fontSize: "14px" }}>Points</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeaderboard.map((user, index) => (
                <tr key={index}>
                  <td style={{ color: "#ffffff", fontSize: "14px" }}>
                    {user.name}
                  </td>
                  <td style={{ color: "#ffc107", fontSize: "14px" }}>
                    {user.credits} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <button
              onClick={() =>
                setLeaderboardPage((prev) => Math.max(prev - 1, 0))
              }
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "16px",
                marginRight: "10px",
              }}
            >
              ←
            </button>
            <button
              onClick={() =>
                setLeaderboardPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              →
            </button>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default CarbonCreditsCard;
