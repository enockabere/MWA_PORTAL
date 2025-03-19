import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPlus,
  faListCheck,
  faFileAlt,
  faChartBar,
  faUser,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

const QuickLinks = () => {
  const links = [
    { icon: faHome, label: "Leave Dashboard", href: "#" },
    { icon: faPlus, label: "New Leave Plans", href: "#" },
    { icon: faListCheck, label: "My Leave Plans", href: "#" },
    { icon: faChartBar, label: "Reports", href: "#" },
    { icon: faChartBar, label: "Approvals", href: "#" },
    { icon: faUser, label: "Profile", href: "#" },
    { icon: faBook, label: "Documentation", href: "#" },
  ];

  return (
    <div
      className="card p-4 shadow-sm"
      style={{ borderRadius: "15px", maxWidth: "350px" }}
    >
      <h5 className="fw-bold">Quick Links</h5>
      <div className="d-flex flex-wrap gap-2 mt-2">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="btn d-inline-flex align-items-center px-3 py-2 shadow-sm"
            style={{
              background: "#eceefb",
              borderRadius: "50px",
              fontWeight: 600,
              color: "#000",
              border: "none",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0c6cb4";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#eceefb";
              e.currentTarget.style.color = "#000";
            }}
          >
            <span
              className="d-flex justify-content-center align-items-center me-2"
              style={{
                width: "28px",
                height: "28px",
                background: "#f7fcfc",
                borderRadius: "50%",
              }}
            >
              <FontAwesomeIcon icon={link.icon} />
            </span>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
