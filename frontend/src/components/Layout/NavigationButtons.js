import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faParking,
  faKey,
  faChartBar,
  faPersonBooth,
} from "@fortawesome/free-solid-svg-icons";

const NavigationButtons = () => {
  const links = [
    { icon: faPlus, label: "Leave Planner", href: "#" },
    { icon: faPlus, label: "Leave Application", href: "#" },
    { icon: faKey, label: "Leave Adjustment", href: "#" },
    { icon: faParking, label: "Reports", href: "#" },
    { icon: faPersonBooth, label: "Leave Dashboard", href: "#" },
    { icon: faChartBar, label: "Approvals", href: "#" },
  ];

  return (
    <div className="d-flex flex-wrap gap-2">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="btn btn-info text-light px-3 py-2 rounded-pill shadow-sm d-inline-flex align-items-center"
          style={{ fontWeight: 600 }}
        >
          <FontAwesomeIcon icon={link.icon} className="me-2" />
          {link.label}
        </a>
      ))}
    </div>
  );
};

export default NavigationButtons;
