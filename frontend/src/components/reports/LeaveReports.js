import React, { useState, useEffect } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import LeaveReportsForm from "./LeaveReportsForm";

const LeaveReports = () => {
  return (
    <div>
      <Breadcrumb pageTitle="Leave Reports" breadcrumb="Leave Reports" />
      <div className="container-fluid">
        <div className="row project-cards">
          <div className="col-md-12 project-list">
            <div className="card">
              <LeaveReportsForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LeaveReports;
