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
      HumanResourceManager: false,
    },
    leave_data: {
      openLeave: 0,
      pendingLeave: 0,
      approvedLeave: 0,
      Rejected: 0,
    },
    open_approvals: 0,
  };

  // Retrieve profile image from localStorage or default to null
  const storedProfileImage =
    JSON.parse(localStorage.getItem("profileImage")) || null;

  const [dashboardData, setDashboardData] = useState(storedData);
  const [profileImage, setProfileImage] = useState(storedProfileImage); // Initialize with stored profile image
  const [loggedIn, setLoggedIn] = useState(false);

  // Save to localStorage whenever dashboardData or profileImage changes
  useEffect(() => {
    localStorage.setItem("dashboardData", JSON.stringify(dashboardData));
  }, [dashboardData]);

  useEffect(() => {
    localStorage.setItem("profileImage", JSON.stringify(profileImage));
  }, [profileImage]);

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
          setProfileImage(profileData); // Update profile image state
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
