import React, { useState, useEffect } from "react";
import "./LeaveCalendarCard.css";

const LeaveCalendarCard = ({ month, year }) => {
  const [leaveDays, setLeaveDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/selfservice/Leave/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Only include "Released" (approved) leaves
        const approvedLeaves = data.filter((app) => app.Status === "Released");

        const leaveDates = approvedLeaves.map((app) => ({
          date: formatDate(new Date(app.StartDate)),
          reason: app.Reason || app.LeaveType || "",
        }));

        setLeaveDays(leaveDates);
      } catch (err) {
        console.error("Error fetching leave applications:", err);
        setError("Failed to load leave data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveApplications();
  }, [month, year]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const renderCalendarDays = () => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = 42; // 6 weeks * 7 days
    const leaveDaysSet = new Set(leaveDays.map((day) => day.date));

    let days = [];
    let dayCounter = 1;

    for (let i = 0; i < totalCells; i++) {
      if (i < firstDayOfMonth || dayCounter > daysInMonth) {
        days.push(
          <div key={`empty-${i}`} className="calendar-day empty"></div>
        );
      } else {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
          dayCounter
        ).padStart(2, "0")}`;
        const isLeaveDay = leaveDaysSet.has(dateStr);
        const leaveInfo = leaveDays.find((day) => day.date === dateStr);

        days.push(
          <div
            key={`day-${dayCounter}`}
            className={`calendar-day ${isLeaveDay ? "leave-day" : ""}`}
            title={isLeaveDay ? leaveInfo?.reason || "On leave" : ""}
          >
            {dayCounter}
            {isLeaveDay && <div className="leave-indicator"></div>}
          </div>
        );
        dayCounter++;
      }
    }
    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (loading) {
    return (
      <div className="leave-calendar-card loading">
        <div className="calendar-header skeleton"></div>
        <div className="calendar-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={`weekday-${day}`} className="weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-days">
          {[...Array(42)].map((_, i) => (
            <div
              key={`skeleton-day-${i}`}
              className="calendar-day skeleton"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leave-calendar-card error">
        <div className="error-message">{error}</div>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="leave-calendar-card card h-100">
      <div className="calendar-header">
        <h6 className="text-info">
          Approved Leaves for {monthNames[month]} {year}
        </h6>
      </div>
      <div className="calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-days">{renderCalendarDays()}</div>
    </div>
  );
};

export default LeaveCalendarCard;
