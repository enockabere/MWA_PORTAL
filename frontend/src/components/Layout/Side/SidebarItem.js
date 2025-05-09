import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SidebarItem = ({
  icon,
  label,
  path,
  activeMenu,
  setActiveMenu,
  submenus = [],
  openSubmenu,
  setOpenSubmenu,
}) => {
  const location = useLocation();

  const isSubmenuOpen = openSubmenu === label;
  const submenuPaths = submenus.map((s) => s.path);
  const isSubmenuPathActive = submenuPaths.includes(location.pathname);
  const isActive =
    activeMenu === label || location.pathname === path || isSubmenuPathActive;

  const handleClick = (e) => {
    if (submenus.length > 0) {
      e.preventDefault(); // Only prevent default if toggling submenu
      setActiveMenu(label);
      setOpenSubmenu(isSubmenuOpen ? null : label);
    } else {
      setActiveMenu(label);
      setOpenSubmenu(null);
    }
  };

  return (
    <li className="sidebar-list">
      {submenus.length > 0 ? (
        <a
          href="#"
          className={`sidebar-link sidebar-title ${isActive ? "active" : ""}`}
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={icon} style={{ color: "#0c6cb4" }} />
          <span>{label}</span>
          <div className="according-menu">
            <i className={`fa fa-angle-${isSubmenuOpen ? "down" : "right"}`} />
          </div>
        </a>
      ) : (
        <Link
          to={path}
          className={`sidebar-link sidebar-title ${isActive ? "active" : ""}`}
          onClick={handleClick}
        >
          <FontAwesomeIcon icon={icon} style={{ color: "#0c6cb4" }} />
          <span>{label}</span>
        </Link>
      )}

      {submenus.length > 0 && (
        <ul
          className="sidebar-submenu"
          style={{
            maxHeight: isSubmenuOpen ? "500px" : "0",
            overflow: "hidden",
            transition: "max-height 0.3s ease-in-out",
          }}
        >
          {submenus.map((submenu, index) => {
            const isSubmenuActive = location.pathname === submenu.path;
            return (
              <li key={index}>
                <Link
                  to={submenu.path}
                  className={isSubmenuActive ? "active" : ""}
                >
                  {submenu.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

export default SidebarItem;
