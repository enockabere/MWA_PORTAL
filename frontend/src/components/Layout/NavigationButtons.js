import React from "react";
import { Link } from "react-router-dom";
import { FiDownload } from "react-icons/fi"; // Import download icon

const NavigationButtons = () => {
  const links = [
    {
      emoji: "🆕",
      label: "New Leave",
      path: "/selfservice/dashboard/new-leave",
    },
    {
      emoji: "✅",
      label: "Approvals",
      path: "/selfservice/dashboard/approvals",
      approvals: 5,
    },

    {
      emoji: "⏱️",
      label: "Timesheets",
      path: "/selfservice/dashboard/timesheet-entries",
    },
    {
      emoji: "📊",
      label: "Reports",
      path: "/selfservice/dashboard/leave-reports",
    },
    {
      emoji: <FiDownload size={16} />,
      label: "Payslip",
      path: "#",
      isDownload: true,
    },
    {
      emoji: <FiDownload size={16} />,
      label: "Leave Summary",
      path: "#",
      isDownload: true,
    },
    { emoji: "👤", label: "Profile", path: "/selfservice/dashboard/profile" },
    { emoji: "🚪", label: "Logout", path: "/selfservice/logout" },
  ];

  return (
    <div
      className="card h-100 p-3 shadow-sm"
      style={{
        borderRadius: "15px",
        maxWidth: "350px",
        background: "#f8f9fa",
      }}
    >
      <h5 className="fw-bold mb-3" style={{ fontSize: "0.9rem" }}>
        Quick Links
      </h5>
      <div className="row g-2">
        {links.map((link, index) => (
          <div key={index} className="col-6">
            <Link
              to={link.path}
              className="d-flex flex-column align-items-center justify-content-center p-2 position-relative"
              style={{
                background: "#ffffff",
                borderRadius: "8px",
                fontWeight: 500,
                color: "#000",
                border: link.isDownload
                  ? "1px dotted #28a745"
                  : link.label === "Logout"
                  ? "1px dotted #dc3545"
                  : "1px dotted #0d6efd",
                transition: "all 0.2s ease",
                textDecoration: "none",
                height: "80px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                fontSize: "0.8rem",
                cursor: link.path === "#" ? "default" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (link.path !== "#") {
                  e.currentTarget.style.background = "#f0f7ff";
                  e.currentTarget.style.border = link.isDownload
                    ? "1px solid #218838"
                    : link.label === "Logout"
                    ? "1px solid #dc3545"
                    : "1px solid #0a58ca";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.border = link.isDownload
                  ? "1px dotted #28a745"
                  : link.label === "Logout"
                  ? "1px dotted #dc3545"
                  : "1px dotted #0d6efd";
              }}
              onClick={(e) => {
                if (link.path === "#") {
                  e.preventDefault();
                }
              }}
            >
              <span
                className="d-flex justify-content-center align-items-center mb-2"
                style={{
                  fontSize: "1.2rem",
                  width: "30px",
                  height: "30px",
                  background: link.isDownload
                    ? "#e6f7eb"
                    : link.label === "Logout"
                    ? "#feeaea"
                    : "#f0f7ff",
                  borderRadius: "6px",
                }}
              >
                {link.emoji}
              </span>
              <span>{link.label}</span>
              {link.approvals && (
                <span
                  className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-danger"
                  style={{
                    fontSize: "0.6rem",
                    padding: "0.2em 0.35em",
                    transform: "translate(30%, -30%)",
                  }}
                >
                  {link.approvals}
                </span>
              )}
              {link.isDownload && (
                <span
                  className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-secondary"
                  style={{
                    fontSize: "0.5rem",
                    padding: "0.15em 0.3em",
                    transform: "translate(10%, -30%)",
                  }}
                >
                  Coming Soon
                </span>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationButtons;
