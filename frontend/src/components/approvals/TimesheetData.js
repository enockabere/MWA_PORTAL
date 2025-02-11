import React from "react";

const TimesheetData = ({ data }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    // Determine the suffix (st, nd, rd, th)
    const suffix = (day) => {
      if (day > 3 && day < 21) return "th"; // Catch 4th-20th
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const formattedDate = `${date.toLocaleString("default", {
      weekday: "short",
    })}, ${day}${suffix(day)} ${month}, ${year}`;
    return formattedDate;
  };

  return (
    <form className="row">
      <div className="col-md-4 my-2">
        <label className="form-label">Timesheet Number</label>
        <input
          type="text"
          className="form-control"
          value={data.Code || ""}
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
        <label className="form-label">Employee Designation</label>
        <input
          type="text"
          className="form-control"
          value={data.EmployeeDesignation || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Supervisor Name</label>
        <input
          type="text"
          className="form-control"
          value={data.SupervisorName || ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Period Start Date</label>
        <input
          type="text"
          className="form-control"
          value={data.PeriodStartDate ? formatDate(data.PeriodStartDate) : ""}
          readOnly
        />
      </div>
      <div className="col-md-4 my-2">
        <label className="form-label">Period End Date</label>
        <input
          type="text"
          className="form-control"
          value={data.PeriodEndDate ? formatDate(data.PeriodEndDate) : ""}
          readOnly
        />
      </div>
    </form>
  );
};

export default TimesheetData;
