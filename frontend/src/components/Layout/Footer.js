import React from "react";
import mwaLogo from "../../../static/img/logo/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6 p-0 footer-copyright">
            <p className="mb-0">Copyright 2024 © Millenium Water Alliance.</p>
          </div>
          <div className="col-md-6 p-0">
            <p className="heart mb-0">
              Powered by <span className="text-primary">Sy-intelli</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
