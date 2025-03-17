import React from "react";
import mwaLogo from "../../../../static/img/logo/favicon.jpg";
import dashboard from "../../../../static/img/logo/dashboard.png";

const SidebarLogo = () => {
  return (
    <div>
      <div className="logo-wrapper">
        <a href="#">
          <img className="img-fluid for-light" height="30" width="30" src={mwaLogo} alt="Logo" />
        </a>
        <div className="toggle-sidebar">
          <img className="img-fluid for-light" height="20" width="20" src={dashboard} alt="Logo" />
        </div>
      </div>
      <div className="logo-icon-wrapper">
        <a href="#">
          <img className="img-fluid" height="20" width="20" src={dashboard} alt="Logo" />
        </a>
      </div>
    </div>
  );
};

export default SidebarLogo;
