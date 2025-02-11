import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const DashboardContext = createContext();

// Custom hook to use the Dashboard context
export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  // Retrieve stored data from localStorage or use default values
  const storedData = JSON.parse(localStorage.getItem("dashboardData")) || {
    user_data: {
      full_name: "John Doe",
      open_leave_count: 0,
      Employee_No_: "EMP00001",
      E_Mail: "enock.maeba@mwawater.org",
      PhoneNo: "0743332560",
      HOD_User: false,
      First_Name: "Enock",
      Middle_Name: "Maeba",
      Last_Name: "Abere",
      sectionCode: "KENYA",
      Department: "IT",
      Supervisor_Title: "Digital Consultant",
      Supervisor: "Nehemiah Makau",
      Job_Position: "Web Developer",
      Job_Title: "Web Developer",
    },
    leave_data: {
      openLeave: 0,
      pendingLeave: 0,
      approvedLeave: 0,
      Rejected: 0,
    },
    open_approvals: 0,
  };

  const [dashboardData, setDashboardData] = useState(storedData);

  // Save to localStorage whenever dashboardData changes
  useEffect(() => {
    localStorage.setItem("dashboardData", JSON.stringify(dashboardData));
  }, [dashboardData]);

  // State for profile image (not stored persistently)
  const [profileImage, setProfileImage] = useState(null);

  // Track the login status
  const [loggedIn, setLoggedIn] = useState(false);

  // Fetch dashboard data and profile image if logged in
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardResponse = await fetch("/selfservice/dashboard_data/");
        if (dashboardResponse.ok) {
          const dashboardData = await dashboardResponse.json();
          setDashboardData(dashboardData); // Update state
        } else {
          console.error("Failed to fetch dashboard data");
        }

        const profileResponse = await fetch("/selfservice/profile_picture/");
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfileImage(profileData);
        } else {
          console.error("Failed to fetch profile image");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (loggedIn) {
      fetchData(); // Fetch data only when logged in
    }
  }, [loggedIn]);

  return (
    <DashboardContext.Provider
      value={{ dashboardData, profileImage, setLoggedIn, setDashboardData }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
