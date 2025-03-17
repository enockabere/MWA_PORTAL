import React, { useState, useEffect } from "react";
import SimpleBar from "simplebar";
import SidebarLogo from "./Side/SidebarLogo";
import SidebarMenu from "./Side/SidebarMenu";
import { useDashboard } from "../context/DashboardContext";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("");
  const { dashboardData } = useDashboard();

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

  return (
    <div className="sidebar-wrapper" data-layout="stroke-svg">
      <SidebarLogo />
      <SidebarMenu
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        dashboardData={dashboardData}
      />
    </div>
  );
};

export default Sidebar;
