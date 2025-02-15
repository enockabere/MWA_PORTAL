import React from "react";

const LeaveDetails = ({ data }) => {
  return (
    <div className="leave-details">
      <h6>Leave Details</h6>
      <hr />
      <p>
        <strong>Application No:</strong> {data.Application_No}
      </p>
      <p>
        <strong>Employee Name:</strong> {data.Employee_Name}
      </p>
      <p>
        <strong>Leave Code:</strong> {data.Leave_Code}
      </p>
      <p>
        <strong>Start Date:</strong> {data.Start_Date}
      </p>
      <p>
        <strong>End Date:</strong> {data.End_Date}
      </p>
      <p>
        <strong>Days Applied:</strong> {data.Days_Applied}
      </p>
      <p>
        <strong>Leave Balance:</strong> {data.Leave_balance}
      </p>
    </div>
  );
};

export default LeaveDetails;
