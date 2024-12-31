// LeaveData.js
import React from "react";

const LeaveData = ({ data }) => {
  return (
    <form className="row">
      <div className="col-md-4 my-2">
        <label className="form-label">Leave Number</label>
        <input
          type="text"
          className="form-control"
          value={data.Application_No || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Application Date</label>
        <input
          type="text"
          className="form-control"
          value={data.Application_Date || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Start Date</label>
        <input
          type="text"
          className="form-control"
          value={data.Start_Date || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Resumption Date</label>
        <input
          type="text"
          className="form-control"
          value={data.Resumption_Date || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Leave Type</label>
        <input
          type="text"
          className="form-control"
          value={data.Leave_Code || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Sender</label>
        <input
          type="text"
          className="form-control"
          value={data.User_ID || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Start Date</label>
        <input
          type="text"
          className="form-control"
          value={data.Planner_Start_Date || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Return same day</label>
        <input
          type="text"
          className="form-control"
          value={data.Return_same_day ? "Yes" : "No" || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Days Applied</label>
        <input
          type="text"
          className="form-control"
          value={data.Days_Applied || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Leave Allowance Payable</label>
        <input
          type="text"
          className="form-control"
          value={data.Leave_Allowance_Payable ? "Yes" : "No" || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">End Date</label>
        <input
          type="text"
          className="form-control"
          value={data.End_Date || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Employment Type</label>
        <input
          type="text"
          className="form-control"
          value={data.Employment_Type || ""}
          readOnly
        />
      </div>
    </form>
  );
};

export default LeaveData;
