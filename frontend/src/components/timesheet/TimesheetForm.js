import React, { useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarPlus,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const TimesheetForm = ({ Initiated, region, currentTimesheet, onInitiate }) => {
  const today = new Date().toISOString().split("T")[0]; // Default to today's date
  const [date, setDate] = useState(today);
  const [hours, setHours] = useState("");

  // Region-specific max hours
  const getMaxHours = () => {
    switch (region) {
      case "KENYA":
        return new Date(date).getDay() === 5 ? 5 : 8.5; // Limit to 5 hours on Friday
      case "Ethiopia":
      case "Global":
        return 8;
      default:
        return 8;
    }
  };

  const isWeekend = (selectedDate) => {
    const day = new Date(selectedDate).getDay();
    return day === 6 || day === 0; // Saturday or Sunday
  };

  const validateHours = () => {
    const maxHours = getMaxHours();
    if (!hours || hours <= 0 || hours > maxHours) {
      toast.error(`Please enter a valid number of hours (0 - ${maxHours}).`);
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !validateHours()) return;

    toast.success("Timesheet entry added!");
    setHours(""); // Reset hours input
  };

  const handleInitiateTimesheet = () => {
    if (onInitiate) onInitiate(); // Call parent function to update the state
  };

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  return (
    <div>
      {Initiated ? (
        <div>
          <h5 className="mb-2">Timesheet Entry</h5>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <label htmlFor="region" className="form-label">
                Region
              </label>
              <input
                type="text"
                id="region"
                value={region}
                readOnly
                className="form-control"
                disabled
              />
            </div>

            <div className="mb-3">
              <label htmlFor="date" className="form-label">
                Select Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-control"
                max={today}
              />
              {isWeekend(date) && (
                <small className="text-danger">
                  Weekends are not valid for timesheet entries.
                </small>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="hours" className="form-label">
                Hours Worked (Max {getMaxHours()})
              </label>
              <input
                type="number"
                id="hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="form-control"
                step="0.1"
                min="0"
                max={getMaxHours()}
                placeholder="Enter hours"
                disabled={isWeekend(date)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isWeekend(date)}
            >
              <FontAwesomeIcon icon={faCalendarPlus} className="me-2" />
              Add Entry
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center">
          <button onClick={handleInitiateTimesheet} className="btn btn-primary">
            Initiate Timesheet for {currentMonth} {currentYear}{" "}
            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TimesheetForm;
