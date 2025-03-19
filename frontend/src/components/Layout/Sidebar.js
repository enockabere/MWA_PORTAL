import React, { useState, useEffect } from "react";
import SimpleBar from "simplebar";
import SidebarLogo from "./Side/SidebarLogo";
import SidebarMenu from "./Side/SidebarMenu";
import { useDashboard } from "../context/DashboardContext";
import "./Side/sidebar.css";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { dashboardData } = useDashboard();

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Set active menu based on URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("leave-request")) setActiveMenu("Leave Request");
    else if (path.includes("leave-planner")) setActiveMenu("Leave Planner");
    else if (path.includes("adjustments")) setActiveMenu("Adjustments");
    else if (path.includes("dashboard")) setActiveMenu("Dashboard");
  }, []);

  // Initialize SimpleBar
  useEffect(() => {
    const myElement = document.getElementById("simple-bar");
    if (myElement) new SimpleBar(myElement, { autoHide: true });

    const simpleBarElement = document.querySelector("[data-simplebar]");
    if (simpleBarElement) new SimpleBar(simpleBarElement);
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(true); // Open sidebar by default on mobile
      } else {
        setIsSidebarOpen(false); // Close sidebar on larger screens
      }
    };

    handleResize(); // Set initial state based on screen size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`sidebar-wrapper ${isSidebarOpen ? "" : "close_icon"} ${
        !isSidebarOpen ? "closed" : ""
      }`}
      data-layout="stroke-svg"
      onMouseEnter={() => {
        if (!isSidebarOpen) setIsSidebarOpen(true); // Expand on hover
      }}
      onMouseLeave={() => {
        if (!isSidebarOpen) setIsSidebarOpen(false); // Collapse on mouse leave
      }}
    >
      <SidebarLogo
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      <SidebarMenu
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        dashboardData={dashboardData}
      />
    </div>
  );
};

export default Sidebar;
