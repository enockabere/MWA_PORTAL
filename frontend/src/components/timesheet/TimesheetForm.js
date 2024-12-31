import React, { useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarPlus,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const TimesheetForm = ({
  entries,
  setEntries,
  monthInitiated,
  setMonthInitiated,
  region: parentRegion, // Read-only region passed from parent
}) => {
  const today = new Date().toISOString().split("T")[0]; // Default to today's date
  const [date, setDate] = useState(today);
  const [hours, setHours] = useState("");
  const [region, setRegion] = useState(parentRegion); // Set region from parent, it should be read-only

  // Region-specific max hours
  const getMaxHours = () => {
    switch (region) {
      case "Nairobi":
        if (new Date(date).getDay() === 5) {
          return 5; // Limit to 5 hours on Friday
        }
        return 8.5;
      case "Ethiopia":
      case "Global":
        return 8;
      default:
        return 8;
    }
  };

  // Check if the selected date is a weekend
  const isWeekend = (selectedDate) => {
    const dateObj = new Date(selectedDate);
    return dateObj.getDay() === 6 || dateObj.getDay() === 0; // 6 = Saturday, 0 = Sunday
  };

  // Validate hours based on region and day
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

    // Validate input
    if (!date || !validateHours()) {
      return;
    }

    // Add the entry
    setEntries((prevEntries) => ({
      ...prevEntries,
      [date]: [
        ...(prevEntries[date] || []), // Keep existing entries for the day
        { task: "Custom Entry", hours: parseFloat(hours) },
      ],
    }));

    toast.success("Timesheet entry added!");
    setHours(""); // Reset hours input
  };

  const handleToggleInitiateTimesheet = () => {
    if (monthInitiated) {
      setMonthInitiated(false); // Mark the month as not initiated
      toast.info("Timesheet initiation reset.");
    } else {
      setMonthInitiated(true); // Mark the month as initiated
      toast.success("Timesheet initiated!");
    }
  };

  // Get the current month and year
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  return (
    <div>
      {!monthInitiated ? (
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
                max={today} // Prevent future dates
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
                disabled={isWeekend(date)} // Disable hours input if it's a weekend
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isWeekend(date)} // Disable submit if it's a weekend
            >
              <FontAwesomeIcon icon={faCalendarPlus} className="me-2" />
              Add Entry
            </button>
          </form>
        </div>
      ) : (
        <div>
          <button
            onClick={handleToggleInitiateTimesheet}
            className="btn btn-primary mb-3"
          >
            Initiate Timesheet for {currentMonth} {currentYear}{" "}
            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TimesheetForm;
