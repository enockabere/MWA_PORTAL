import React, { useState, useEffect } from "react";
import { useDashboard } from "../context/DashboardContext";
import { FaEnvelope, FaUser, FaPhone, FaBuilding, FaCalendarAlt } from "react-icons/fa";
import "./UserCard.css"; // Import the CSS file for styling

const UserCard = () => {
  const { dashboardData, profileImage, setLoggedIn } = useDashboard();
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const imageSrc =
    profileImage &&
    `data:image/${profileImage.image_format};base64,${profileImage.encoded_string}`;

  // Determine the full name based on the presence of a middle name
  const fullName = dashboardData?.user_data?.Middle_Name
    ? `${dashboardData.user_data.First_Name} ${dashboardData.user_data.Middle_Name} ${dashboardData.user_data.Last_Name}`
    : `${dashboardData?.user_data?.First_Name} ${dashboardData?.user_data?.Last_Name}`;

  // Format leave types (e.g., "ADOPTION" → "Adoption")
  const formatLeaveType = (type) => {
    return type
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Fetch leave balances
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch("/selfservice/all-leave-balance/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;
        const leaveTypes = Object.keys(parsedData);
        const leaveBalances = Object.values(parsedData);

        const newData = leaveTypes.map((type, index) => ({
          type: formatLeaveType(type), // Format leave type
          balance: leaveBalances[index],
        }));

        setLeaveBalances(newData);
      } catch (error) {
        console.error("Failed to fetch leave data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, []);

  // Check if dashboardData is available
  const isDashboardDataAvailable = dashboardData && dashboardData.user_data;

  return (
    <div className="user-card">
      <div className="gradient-background"></div>
      <div className="avatar-container">
        <img className="avatar-image" alt="User Avatar" src={imageSrc} />
      </div>
      <div className="user-info">
        {isDashboardDataAvailable ? (
          <>
            <h1>{fullName}</h1>
            <h2>{dashboardData.user_data.Job_Position || "UX Designer"}</h2>
          </>
        ) : (
          <div className="skeleton-loading">
            <div className="skeleton-line">
              <div className="skeleton-text" style={{ width: "150px" }}></div>
            </div>
            <div className="skeleton-line">
              <div className="skeleton-text" style={{ width: "100px" }}></div>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>Basic Information</h3>
          {isDashboardDataAvailable ? (
            <>
              <p>
                <FaEnvelope className="icon" /> <strong>Email:</strong>{" "}
                <span className="ellipses">......................</span>{" "}
                {dashboardData.user_data.E_Mail || "N/A"}
              </p>
              <p>
                <FaUser className="icon" /> <strong>Staff No.:</strong>{" "}
                <span className="ellipses">...........................</span>{" "}
                {dashboardData.user_data.Employee_No_ || "N/A"}
              </p>
              <p>
                <FaPhone className="icon" /> <strong>Phone No.:</strong>{" "}
                <span className="ellipses">...........................</span>{" "}
                {dashboardData.user_data.PhoneNo || "N/A"}
              </p>
              <p>
                <FaBuilding className="icon" /> <strong>Department:</strong>{" "}
                <span className="ellipses">................................</span>{" "}
                {dashboardData.user_data.Department || "N/A"}
              </p>
            </>
          ) : (
            <div className="skeleton-loading">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="skeleton-line">
                  <div className="skeleton-icon"></div>
                  <div className="skeleton-text"></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="leave-balances-section">
          <h3>Leave Balances</h3>
          {loading || !isDashboardDataAvailable ? (
            // Skeleton loading animation
            <div className="skeleton-loading">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="skeleton-line">
                  <div className="skeleton-icon"></div>
                  <div className="skeleton-text"></div>
                </div>
              ))}
            </div>
          ) : (
            leaveBalances.map((leave, index) => (
              <p key={index}>
                <FaCalendarAlt className="icon" /> <strong>{leave.type}:</strong>{" "}
                <span className="ellipses">......................</span>{" "}
                {leave.balance} days
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;