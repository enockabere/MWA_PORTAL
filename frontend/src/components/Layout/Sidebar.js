import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import mwaLogo from "../../../static/img/logo/favicon.jpg";
import dashboard from "../../../static/img/logo/dashboard.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faFileAlt,
  faCheckCircle,
  faUser,
  faBook,
  faSignOutAlt,
  faCalendar,
  faEnvelope,
  faEdit,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";
import SimpleBar from "simplebar";
import { useDashboard } from "../context/DashboardContext";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("");
  const { dashboardData } = useDashboard();

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  useEffect(() => {
    const myElement = document.getElementById("simple-bar");
    if (myElement) {
      new SimpleBar(myElement, { autoHide: true });
    }
    // Set the active menu based on the current path
    const path = window.location.pathname;
    if (path.includes("leave-request")) {
      setActiveMenu("Leave Request");
    } else if (path.includes("leave-planner")) {
      setActiveMenu("Leave Planner");
    } else if (path.includes("adjustments")) {
      setActiveMenu("Adjustments");
    } else if (path.includes("dashboard")) {
      setActiveMenu("Dashboard");
    }
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    const simpleBarElement = document.querySelector("[data-simplebar]");
    if (simpleBarElement) {
      new SimpleBar(simpleBarElement);
    }
  }, []);

  return (
    <div className="sidebar-wrapper" data-layout="stroke-svg">
      <div>
        <div className="logo-wrapper">
          <a href="#">
            <img
              className="img-fluid for-light"
              height="30"
              width="30"
              src={mwaLogo}
              alt="Logo"
            />
          </a>
          <div className="toggle-sidebar">
            <img
              className="img-fluid for-light"
              height="20"
              width="20"
              src={dashboard}
              alt="Logo"
            />
          </div>
        </div>
        <div className="logo-icon-wrapper">
          <a href="#">
            <img
              className="img-fluid"
              height="20"
              width="20"
              src={dashboard}
              alt="Logo"
            />
          </a>
        </div>
        <nav className="sidebar-main">
          <div className="left-arrow" id="left-arrow">
            <i className="fa fa-arrow-left" />
          </div>
          <div id="sidebar-menu">
            <ul className="sidebar-links" id="simple-bar">
              <li className="back-btn">
                <a href="#">
                  <img
                    className="img-fluid"
                    height="20"
                    width="20"
                    src={dashboard}
                    alt="Logo"
                  />
                </a>
                <div className="mobile-back text-end">
                  <span>Back</span>
                  <i className="fa fa-angle-right ps-2" aria-hidden="true" />
                </div>
              </li>
              <li className="pin-title sidebar-main-title">
                <div>
                  <h6>Pinned</h6>
                </div>
              </li>
              <li className="sidebar-main-title">
                <div>
                  <h6 className="lan-1">General</h6>
                </div>
              </li>

              {/* Dashboard Menu Item */}
              <li className="sidebar-list">
                <i className="fa fa-thumb-tack" />
                <Link
                  className={`sidebar-link sidebar-title ${
                    activeMenu === "Dashboard" ? "active" : ""
                  }`}
                  to="/selfservice/dashboard" // Use to for navigation
                  onClick={() => handleMenuClick("Dashboard")}
                >
                  <FontAwesomeIcon
                    icon={faHouse}
                    style={{
                      color: "#2b5f60",
                      stroke: "#2b5f60",
                      strokeWidth: 4,
                      fill: "none",
                    }}
                  />
                  <span>Dashboard</span>
                </Link>
              </li>

              {/* Leave Planner Menu Item */}
              <li className="sidebar-list">
                <i className="fa fa-thumb-tack" />
                <a
                  className={`sidebar-link sidebar-title ${
                    activeMenu === "Leave Planner" ? "active" : ""
                  }`}
                  role="button" // Makes it clear that this is interactive
                  tabIndex={0} // Makes it focusable
                  onClick={() => handleMenuClick("Leave Planner")}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleMenuClick("Leave Planner");
                    }
                  }} // Allows toggling with keyboard
                >
                  <FontAwesomeIcon
                    icon={faCalendar}
                    style={{
                      color: "#2b5f60",
                      stroke: "#2b5f60",
                      strokeWidth: 4,
                      fill: "none",
                    }}
                  />{" "}
                  <span>Leave Planner</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to="/selfservice/dashboard/leave-planner">
                      New Planner
                    </Link>
                  </li>
                  <li>
                    <Link to="/selfservice/dashboard/my-plans">My Plans</Link>
                  </li>
                </ul>
              </li>
              {/* Leave Request Menu Item */}
              <li className="sidebar-list">
                <i className="fa fa-thumb-tack" />
                <a
                  className={`sidebar-link sidebar-title ${
                    activeMenu === "Leave Request" ? "active" : ""
                  }`}
                  onClick={() => handleMenuClick("Leave Request")}
                  role="button" // Makes it clear that this is interactive
                  tabIndex={0} // Makes it focusable
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleMenuClick("Leave Request");
                    }
                  }} // Allows toggling with keyboard
                >
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    style={{
                      color: "#2b5f60",
                      stroke: "#2b5f60",
                      strokeWidth: 4,
                      fill: "none",
                    }}
                  />{" "}
                  <span>Leave Request</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to="/selfservice/dashboard/leave-dashboard">
                      Leave Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/selfservice/dashboard/new-leave">
                      New Application
                    </Link>
                  </li>
                  <li>
                    <Link to="/selfservice/dashboard/my-applications">
                      My Applications
                    </Link>
                  </li>
                  {(dashboardData.user_data.HumanResourceManager ||
                    dashboardData.user_data.HOD_User) && (
                    <li>
                      <Link to="/selfservice/dashboard/balances">
                        Leave Balances
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
              {/* Adjustments Menu Item */}
              <li className="sidebar-list">
                <i className="fa fa-thumb-tack" />
                <a
                  className={`sidebar-link sidebar-title ${
                    activeMenu === "Adjustments" ? "active" : ""
                  }`}
                  role="button" // Makes it clear that this is interactive
                  tabIndex={0} // Makes it focusable
                  onClick={() => handleMenuClick("Adjustments")}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleMenuClick("Adjustments");
                    }
                  }} // Allows toggling with keyboard
                >
                  <FontAwesomeIcon
                    icon={faEdit}
                    style={{
                      color: "#2b5f60",
                      stroke: "#2b5f60",
                      strokeWidth: 4,
                      fill: "none",
                    }}
                  />{" "}
                  <span>Adjustments</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to="/selfservice/dashboard/new-adjustment">
                      New Adjustment
                    </Link>
                  </li>
                  <li>
                    <Link to="/selfservice/dashboard/my-adjustments">
                      My Adjustments
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="sidebar-list">
                <i className="fa fa-thumb-tack" />
                <a
                  className={`sidebar-link sidebar-title ${
                    activeMenu === "Reports" ? "active" : ""
                  }`}
                  role="button" // Makes it clear that this is interactive
                  tabIndex={0} // Makes it focusable
                  onClick={() => handleMenuClick("Reports")}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleMenuClick("Reports");
                    }
                  }} // Allows toggling with keyboard
                >
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    style={{
                      color: "#2b5f60",
                      stroke: "#2b5f60",
                      strokeWidth: 4,
                      fill: "none",
                    }}
                  />{" "}
                  {/* FontAwesome icon for policies */}
                  <span>Reports</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to="/selfservice/dashboard/leave-reports">
                      My Reports
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="sidebar-list">
                <i className="fa fa-thumb-tack" />
                <Link
                  className={`sidebar-link sidebar-title ${
                    activeMenu === "Approvals" ? "active" : ""
                  }`}
                  to="/selfservice/dashboard/approvals" // Use to for navigation
                  onClick={() => handleMenuClick("Approvals")}
                >
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    style={{
                      color: "#2b5f60",
                      stroke: "#2b5f60",
                      strokeWidth: 4,
                      fill: "none",
                    }}
                  />{" "}
                  {/* FontAwesome icon for approvals */}
                  <span>Approvals</span>
                </Link>
              </li>
              <li className="sidebar-list">
                <i className="fa fa-thumb-tack" />
                <a
                  className={`sidebar-link sidebar-title ${
                    activeMenu === "Policies" ? "active" : ""
                  }`}
                  role="button" // Makes it clear that this is interactive
                  tabIndex={0} // Makes it focusable
                  onClick={() => handleMenuClick("Policies")}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleMenuClick("Policies");
                    }
                  }} // Allows toggling with keyboard
                >
                  <FontAwesomeIcon
                    icon={faBook}
                    style={{
                      color: "#2b5f60",
                      stroke: "#2b5f60",
                      strokeWidth: 4,
                      fill: "none",
                    }}
                  />{" "}
                  {/* FontAwesome icon for policies */}
                  <span>Timesheets</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to="/selfservice/dashboard/timesheet-entries">
                      Entries
                    </Link>
                  </li>
                  <li>
                    <Link to="/selfservice/dashboard/my-timesheets">
                      My Timesheets
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="sidebar-list">
                <i className="fa fa-thumb-tack" />
                <Link
                  className={`sidebar-link sidebar-title ${
                    activeMenu === "Profile" ? "active" : ""
                  }`}
                  to="/selfservice/dashboard/profile" // Use to for navigation
                  onClick={() => handleMenuClick("Profile")}
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    style={{
                      color: "#2b5f60",
                      stroke: "#2b5f60",
                      strokeWidth: 4,
                      fill: "none",
                    }}
                  />{" "}
                  {/* FontAwesome icon for profile */}
                  <span>Profile</span>
                </Link>
              </li>
              <li className="sidebar-list">
                <i className="fa fa-thumb-tack" />
                <Link
                  className={`sidebar-link sidebar-title ${
                    activeMenu === "Documentation" ? "active" : ""
                  }`}
                  to="/selfservice/dashboard/documentation" // Use to for navigation
                  onClick={() => handleMenuClick("Documentation")}
                >
                  <FontAwesomeIcon
                    icon={faBook}
                    style={{
                      color: "#2b5f60",
                      stroke: "#2b5f60",
                      strokeWidth: 4,
                      fill: "none",
                    }}
                  />{" "}
                  {/* FontAwesome icon for documentation */}
                  <span>Documentation</span>
                </Link>
              </li>
              <li className="sidebar-list">
                <i className="fa fa-thumb-tack" />
                <Link
                  className={`sidebar-link sidebar-title ${
                    activeMenu === "Logout" ? "active" : ""
                  }`}
                  to="/selfservice/logout" // Redirect to the Logout route
                >
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    style={{
                      color: "#2b5f60",
                      stroke: "#2b5f60",
                      strokeWidth: 4,
                      fill: "none",
                    }}
                  />
                  <span>Logout</span>
                </Link>
              </li>
              {/* <li className="sidebar-list mt-3">
                <button className="btn btn-primary text-small mb-3">
                  <FontAwesomeIcon icon={faBrain} className="me-2" />
                  Request Using AI
                </button>
              </li> */}
            </ul>
          </div>
          <div className="right-arrow" id="right-arrow">
            <i className="fa fa-arrow-right" />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
