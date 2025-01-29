import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Breadcrumb = ({ pageTitle = "Dashboard", breadcrumb = "Dashboard" }) => {
  return (
    <div className="container-fluid">
      <div className="page-title">
        <div className="row">
          <div className="col-xl-4 col-sm-7 box-col-3">
            <h3>{pageTitle}</h3>
          </div>
          <div className="col-5 d-none d-xl-block">
            <div className="left-header main-sub-header p-0">
              <div className="left-menu-header">
                <ul className="header-left"></ul>
              </div>
            </div>
            {/* Page Sub Header end
             */}
          </div>
          <div className="col-xl-3 col-sm-5 box-col-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">
                  <FontAwesomeIcon icon={faHouse} />
                </a>
              </li>
              <li className="breadcrumb-item">{breadcrumb}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
