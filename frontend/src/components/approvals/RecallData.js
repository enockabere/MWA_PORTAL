// LeaveData.js
import React from "react";

const RecallData = ({ data }) => {
  return (
    <form className="row">
      <div className="col-md-4 my-2">
        <label className="form-label">Recall ID</label>
        <input
          type="text"
          className="form-control"
          value={data.No || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Application Date</label>
        <input
          type="text"
          className="form-control"
          value={data.Date || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Leave Number</label>
        <input
          type="text"
          className="form-control"
          value={data.LeaveApplication || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Leave Start Date</label>
        <input
          type="text"
          className="form-control"
          value={data.LeaveStartDate || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Leave End Date</label>
        <input
          type="text"
          className="form-control"
          value={data.LeaveEndingDate || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Recall Date</label>
        <input
          type="text"
          className="form-control"
          value={data.RecallDate || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">No. of Off Days</label>
        <input
          type="text"
          className="form-control"
          value={data.NoofOffDays || ""}
          readOnly
        />
      </div>

      <div className="col-md-4 my-2">
        <label className="form-label">Recalled From</label>
        <input
          type="text"
          className="form-control"
          value={data.RecalledFrom || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Recalled To</label>
        <input
          type="text"
          className="form-control"
          value={data.RecalledTo || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Employee Name</label>
        <input
          type="text"
          className="form-control"
          value={data.EmployeeName || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Department Name</label>
        <input
          type="text"
          className="form-control"
          value={data.DepartmentName || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Recalled By</label>
        <input
          type="text"
          className="form-control"
          value={data.Name || ""}
          readOnly
        />
      </div>
    </form>
  );
};

export default RecallData;
