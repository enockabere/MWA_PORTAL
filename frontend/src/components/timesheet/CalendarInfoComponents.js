import React from "react";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faUmbrellaBeach,
  faClock,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./Calendar.css";

export const DateDetails = ({ selectedDate, entries }) => {
  const getTimesheetEntries = (date) => {
    if (!Array.isArray(entries)) return [];
    const formattedDate = moment(date).format("YYYY-MM-DD");
    return entries.filter((entry) => entry.Date === formattedDate);
  };

  return (
    <div className="selected-date-details mt-3">
      <h6>Details for {moment(selectedDate).format("MMMM Do, YYYY")}</h6>
      <ul className="list-unstyled">
        {getTimesheetEntries(selectedDate).length > 0 ? (
          getTimesheetEntries(selectedDate).map((entry, index) => (
            <React.Fragment key={index}>
              {entry.Holiday && (
                <li style={{ color: "red", fontWeight: "bold" }}>
                  <FontAwesomeIcon icon={faCalendarDay} className="me-2" />{" "}
                  Holiday
                </li>
              )}
              {entry.LeaveDay && (
                <li style={{ color: "goldenrod", fontWeight: "bold" }}>
                  <FontAwesomeIcon icon={faUmbrellaBeach} className="me-2" />{" "}
                  Leave Day
                </li>
              )}
              {entry.HoursWorked > 0 && (
                <li>
                  <FontAwesomeIcon icon={faClock} className="me-2" /> Hours
                  Worked: {entry.HoursWorked} hours
                </li>
              )}
            </React.Fragment>
          ))
        ) : (
          <li>No entries for this day</li>
        )}
      </ul>
    </div>
  );
};

export const CalendarLegend = ({ totalHoursWorked, activeMonth }) => (
  <div className="mt-2" style={{ marginLeft: 0 }}>
    <h6 className="text-left">Legend</h6>
    <div className="legend-item legend-holiday text-left">
      <span className="legend-color" style={{ backgroundColor: "red" }}></span>{" "}
      Holiday
    </div>
    <div className="legend-item legend-leave text-left">
      <span
        className="legend-color"
        style={{ backgroundColor: "goldenrod" }}
      ></span>{" "}
      Leave Day
    </div>
    <div className="legend-item legend-total-hours text-left">
      <span className="legend-color" style={{ backgroundColor: "blue" }}></span>{" "}
      {activeMonth ? (
        <>
          Total Hours Worked for{" "}
          {moment().month(activeMonth.month).format("MMMM YYYY")}:{" "}
          <strong>{totalHoursWorked}</strong> hours
        </>
      ) : (
        <>
          Total Hours Worked: <strong>{totalHoursWorked}</strong> hours
        </>
      )}
    </div>
  </div>
);

export const ProjectHoursList = ({
  projectHours,
  handleEdit,
  handleDelete,
  region,
}) => {
  if (region !== "USA" || projectHours.length === 0) return null;

  return (
    <div className="project-hours mt-3">
      <h6>Hours Per Project</h6>
      <ul className="list-unstyled">
        {projectHours.map((project, index) => (
          <li
            key={index}
            className="d-flex justify-content-between align-items-center py-2"
          >
            <span className="font-weight-medium">
              {project.Project}: {project.Hours_Worked} hours
            </span>
            <div className="action-icons">
              <FontAwesomeIcon
                icon={faEdit}
                className="me-3 text-primary cursor-pointer hover-scale"
                onClick={() => handleEdit(project)}
                style={{ fontSize: "1.1rem", transition: "all 0.2s ease" }}
              />
              <FontAwesomeIcon
                icon={faTrash}
                className="text-danger cursor-pointer hover-scale"
                onClick={() => handleDelete(project)}
                style={{ fontSize: "1.1rem", transition: "all 0.2s ease" }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
