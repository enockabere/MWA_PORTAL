import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const DashboardContext = createContext();

// Custom hook to use the Dashboard context
export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  // Default dashboard data
  const [dashboardData, setDashboardData] = useState({
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
  });

  // Track the login status
  const [loggedIn, setLoggedIn] = useState(false);

  // Fetch dashboard data if logged in
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/selfservice/dashboard_data/");
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data); // Update the dashboard data state
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    if (loggedIn) {
      fetchData(); // Fetch data when logged in
    }
  }, [loggedIn]); // Trigger fetch when loggedIn changes to true

  // Provide the dashboard data, setLoggedIn, and setDashboardData to children
  return (
    <DashboardContext.Provider
      value={{ dashboardData, setLoggedIn, setDashboardData }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
