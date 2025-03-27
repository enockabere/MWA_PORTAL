import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const WeeklyHoursCard = () => {
  const [hoursWorked, setHoursWorked] = useState(0);
  const [loading, setLoading] = useState(true);
  const maxHours = 40; // Standard full-time work week

  // Get current week start and end dates (Monday to Sunday)
  const getCurrentWeekDates = () => {
    const now = new Date();
    const day = now.getDay(); // 0 (Sunday) to 6 (Saturday)
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(now.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
      start: monday.toISOString().split("T")[0],
      end: sunday.toISOString().split("T")[0],
    };
  };

  // Fetch hours worked data for current week
  const fetchHoursWorked = async () => {
    try {
      const { start, end } = getCurrentWeekDates();
      const response = await fetch(
        `/api/hours-worked?start=${start}&end=${end}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch hours data");
      }

      const data = await response.json();
      setHoursWorked(data.totalHours || 0);
    } catch (error) {
      console.error("Error fetching hours data:", error);
      // Set to 0 if API fails
      setHoursWorked(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoursWorked();
  }, []);

  // Calculate current week's progress percentage
  const progress = Math.min((hoursWorked / maxHours) * 100, 100);

  return (
    <div
      className="card text-white p-4 shadow-lg h-100"
      style={{
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
        borderRadius: "15px",
        position: "relative",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center">
        <div style={{ width: "100%", textAlign: "center" }}>
          <h5 className="fw-bold" style={{ color: "#ffffff" }}>
            Timesheet Weekly Hours
          </h5>
          <p className="small" style={{ color: "#e9ecef" }}>
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Progress Circle */}
      <div className="text-center my-4">
        <div style={{ width: "120px", margin: "0 auto" }}>
          {loading ? (
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
              }}
            >
              Loading...
            </div>
          ) : (
            <CircularProgressbar
              value={progress}
              text={`${hoursWorked}h`}
              styles={buildStyles({
                pathColor: progress >= 100 ? "#4CAF50" : "#ffc107", // Green if completed, yellow otherwise
                textColor: "#ffffff",
                trailColor: "rgba(233, 236, 239, 0.2)",
                textSize: "16px",
                pathTransitionDuration: 0.5,
              })}
            />
          )}
        </div>
      </div>

      {/* Progress Text */}
      <p className="text-center fw-bold fs-5" style={{ marginBottom: "4px" }}>
        {hoursWorked} Hours Worked
      </p>
      <p className="text-center text-white-50 small" style={{ marginTop: "0" }}>
        Weekly Target: {maxHours} hours
      </p>

      {/* Additional Info */}
      <div
        style={{
          marginTop: "16px",
          padding: "8px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            margin: "0",
            color: "#ffffff",
          }}
        >
          {hoursWorked >= maxHours
            ? "🎉 Weekly target achieved!"
            : `${maxHours - hoursWorked} hours remaining (${Math.round(
                progress
              )}%)`}
        </p>
      </div>

      {/* Refresh Button */}
      <button
        onClick={fetchHoursWorked}
        style={{
          marginTop: "12px",
          background: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          color: "#ffffff",
          borderRadius: "20px",
          padding: "4px 12px",
          fontSize: "12px",
          cursor: "pointer",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Refresh Data
      </button>
    </div>
  );
};

export default WeeklyHoursCard;
