import React, { useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faUmbrellaBeach,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import "react-calendar/dist/Calendar.css";
import "./TimesheetCalendar.css";

const TimesheetCalendar = ({ entries }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get timesheet entries for the selected date
  const getTimesheetEntries = (date) => {
    if (!Array.isArray(entries)) {
      console.error("Entries is not an array:", entries);
      return [];
    }
    return entries.filter(
      (entry) => entry.Date === moment(date).format("YYYY-MM-DD")
    );
  };

  // Define tile content (hours worked) - Hide 0-hour entries
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const entry = getTimesheetEntries(date)[0];

      if (entry && entry.HoursWorked > 0) {
        return <p className="hours-worked">{entry.HoursWorked}h</p>;
      }
    }
    return null;
  };

  // Define tile class for styling weekends, holidays, leave days
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const entry = getTimesheetEntries(date)[0];
      if (!entry) return "";

      if (entry.Holiday) return "holiday-tile"; // Red color for holidays
      if (entry.LeaveDay) return "leave-day-tile"; // Yellow color for leave days
    }
    return "";
  };

  return (
    <div>
      <h3 className="mb-2">Timesheet Calendar</h3>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileClassName={tileClassName}
        tileContent={tileContent}
      />

      {/* Selected Date Details */}
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

      {/* Legend for Holidays & Leave Days */}
      <div className="calendar-legend border-2 border-t-primary p-2 b-r-2">
        <h6>Legend</h6>
        <div className="legend-item legend-holiday">
          <span
            className="legend-color"
            style={{ backgroundColor: "red" }}
          ></span>{" "}
          Holiday
        </div>
        <div className="legend-item legend-leave">
          <span
            className="legend-color"
            style={{ backgroundColor: "goldenrod" }}
          ></span>{" "}
          Leave Day
        </div>
      </div>
    </div>
  );
};

export default TimesheetCalendar;
