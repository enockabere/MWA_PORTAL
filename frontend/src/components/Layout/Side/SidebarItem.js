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
  const [isPinned, setIsPinned] = useState(false);
  const location = useLocation();
  const isActive = activeMenu === label || location.pathname === path;

  // Load pinned state from localStorage
  useEffect(() => {
    try {
      const pinnedItems = JSON.parse(localStorage.getItem("pins") || "[]");
      if (pinnedItems.includes(label)) {
        setIsPinned(true);
      }
    } catch (error) {
      console.error("Error parsing pins from localStorage:", error);
      localStorage.setItem("pins", JSON.stringify([])); // Reset to empty array if invalid
    }
  }, [label]);

  // Toggle submenu
  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  // Toggle pinned state
  const togglePinned = (event) => {
    event.stopPropagation(); // Prevent submenu toggle when pinning
    try {
      const pinnedItems = JSON.parse(localStorage.getItem("pins") || "[]");
      let updatedPins;

      if (isPinned) {
        updatedPins = pinnedItems.filter((item) => item !== label);
      } else {
        updatedPins = [...pinnedItems, label];
      }

      localStorage.setItem("pins", JSON.stringify(updatedPins));
      setIsPinned(!isPinned);
    } catch (error) {
      console.error("Error updating pins in localStorage:", error);
    }
  };

  return (
    <li className={`sidebar-list ${isPinned ? "pined" : ""}`}>
      <i
        className="fa fa-thumb-tack"
        onClick={togglePinned}
        style={{ cursor: "pointer" }}
      />
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
            color: "#2b5f60",
            stroke: "#2b5f60",
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
