import React, { useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
import "./TimesheetCalendar.css"; // Custom styles for events

const TimesheetCalendar = ({ entries, leaveDays, publicHolidays }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Check if a date is a weekend (Saturday or Sunday)
  const isWeekend = (date) => {
    const day = moment(date).day(); // 0 = Sunday, 6 = Saturday
    return day === 0 || day === 6;
  };

  // Check if the date is a leave day or holiday
  const isLeaveOrHoliday = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    if (leaveDays.includes(formattedDate)) return "leave-day";
    if (publicHolidays.includes(formattedDate)) return "holiday";
    return null;
  };

  const getTimesheetEntries = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    return entries[formattedDate] || []; // Timesheet entries for the day
  };

  // Add class to weekend, leave days, and holidays
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      let dayClass = "";

      // Check if the date is a weekend
      if (isWeekend(date)) {
        dayClass += " weekend-day";
      }

      // Check if the date is a leave day or holiday
      const dayType = isLeaveOrHoliday(date);
      if (dayType) {
        dayClass += ` ${dayType}`;
      }

      return dayClass; // Return combined class names
    }
    return null;
  };

  // Show timesheet entries on the calendar tiles
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dayEntries = getTimesheetEntries(date);
      return dayEntries.length > 0 ? (
        <div className="timesheet-entries">
          {dayEntries.map((entry, index) => (
            <span key={index} className="entry">
              {entry.hours}h
            </span>
          ))}
        </div>
      ) : null;
    }
    return null;
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
      <div className="selected-date-details mt-3">
        <h4>Details for {moment(selectedDate).format("MMMM Do, YYYY")}</h4>
        <ul>
          {getTimesheetEntries(selectedDate).length > 0 ? (
            getTimesheetEntries(selectedDate).map((entry, index) => (
              <li key={index}>
                Task: {entry.task} - {entry.hours} hours
              </li>
            ))
          ) : (
            <li>No entries for this day</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TimesheetCalendar;
