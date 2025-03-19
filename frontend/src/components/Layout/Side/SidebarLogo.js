import React from "react";
import mwaLogo from "../../../../static/img/logo/favicon.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons"; // Icons for toggle

const SidebarLogo = ({ toggleSidebar, isSidebarOpen }) => {
  return (
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
        <div className="toggle-sidebar" onClick={toggleSidebar}>
          {/* Use different icons for open/close states */}
          <FontAwesomeIcon
            icon={isSidebarOpen ? faTimes : faBars} // Close (X) icon when open, Hamburger icon when closed
            style={{ fontSize: "20px", color: "#2b5f60", cursor: "pointer" }}
          />
        </div>
      </div>
      <div className="logo-icon-wrapper">
        <a href="#">
          <img
            className="img-fluid"
            height="20"
            width="20"
            src={mwaLogo} // Use the same logo or another icon
            alt="Logo"
          />
        </a>
      </div>
    </div>
  );
};

export default SidebarLogo;
