import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SidebarItem = ({
  icon,
  label,
  path,
  activeMenu,
  setActiveMenu,
  submenus = [],
}) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const location = useLocation();
  const isActive = activeMenu === label || location.pathname === path;

  // Toggle submenu
  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  return (
    <li className="sidebar-list">
      <Link
        to={path}
        className={`sidebar-link sidebar-title ${isActive ? "active" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => {
          setActiveMenu(label);
          if (submenus.length > 0) toggleSubmenu();
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            setActiveMenu(label);
            if (submenus.length > 0) toggleSubmenu();
          }
        }}
      >
        <FontAwesomeIcon
          icon={icon}
          style={{
            color: "#0c6cb4",
            stroke: "#0c6cb4",
            strokeWidth: 4,
            fill: "none",
          }}
        />
        <span>{label}</span>
        {submenus.length > 0 && (
          <div className="according-menu">
            <i className={`fa fa-angle-${isSubmenuOpen ? "down" : "right"}`} />
          </div>
        )}
      </Link>
      {submenus.length > 0 && (
        <ul
          className="sidebar-submenu"
          style={{
            maxHeight: isSubmenuOpen ? "500px" : "0",
            overflow: "hidden",
            transition: "max-height 0.3s ease-in-out",
          }}
        >
          {submenus.map((submenu, index) => (
            <li key={index}>
              <Link to={submenu.path}>{submenu.label}</Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarItem;
