import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarPlus,
  faCheckCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const TimesheetForm = ({
  Initiated,
  region,
  currentTimesheet,
  entries,
  onInitiate,
  onAddEntry,
}) => {
  const today = new Date().toISOString().split("T")[0];
  const [loadingAddEntry, setLoadingAddEntry] = useState(false);
  const [date, setDate] = useState(today);
  const [hours, setHours] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [maxHours, setMaxHours] = useState({
    HoursWorkedMonThur: 8.5,
    HoursWorkedFri: 8,
  });
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isInitiatedLoading, setIsInitiatedLoading] = useState(true);
  const [initiationDate, setInitiationDate] = useState(today); // State for initiation date
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  useEffect(() => {
    const fetchMaxHours = async () => {
      try {
        const response = await fetch(`/selfservice/get-max-timesheet-entries/`);
        if (!response.ok) {
          console.error("Failed to fetch max timesheet entries");
          return;
        }
        const data = await response.json();
        setMaxHours({
          HoursWorkedMonThur: data.HoursWorkedMonThur,
          HoursWorkedFri: data.HoursWorkedFri,
        });
      } catch (error) {
        console.error("Error fetching max hours:", error);
      }
    };

    fetchMaxHours();
  }, [region]);

  useEffect(() => {
    const checkInitiatedStatus = async () => {
      setTimeout(() => {
        setIsInitiatedLoading(false);
      }, 2000);
    };

    checkInitiatedStatus();
  }, []);

  useEffect(() => {
    const entry = entries.find((entry) => entry.Date === date);
    setSelectedEntry(entry || null);
  }, [date, entries]);

  const isWeekend = (selectedDate) => {
    const day = new Date(selectedDate).getDay();
    return day === 6 || day === 0;
  };

  const getMaxHoursForDay = () => {
    const day = new Date(date).getDay();
    return day === 5 ? maxHours.HoursWorkedFri : maxHours.HoursWorkedMonThur;
  };

  const validateHours = () => {
    const max = getMaxHoursForDay();
    if (!hours || hours <= 0 || hours > max) {
      toast.error(`Please enter a valid number of hours (0 - ${max}).`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || isWeekend(date) || !validateHours()) return;

    const matchingEntry = entries.find((entry) => entry.Date === date);
    if (!matchingEntry) {
      toast.error("No matching entry found for the selected date.");
      return;
    }

    const payload = {
      DocumentNo: matchingEntry.DocumentNo,
      EntryNo: matchingEntry.EntryNo,
      Date: date,
      HoursWorked: parseFloat(hours),
    };

    try {
      setLoadingAddEntry(true);
      const response = await fetch("/selfservice/timesheet-entry/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        onAddEntry(matchingEntry.DocumentNo);
        setHours("");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      toast.error("Error submitting timesheet. Please try again.");
    } finally {
      setLoadingAddEntry(false);
    }
  };

  const handleInitiateTimesheet = async () => {
    try {
      setLoading(true);
      const response = await fetch("/selfservice/initiate-timesheet/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          initiationDate: initiationDate, // Pass the initiation date
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to initiate timesheet.");
      }

      toast.success("Timesheet initiated successfully!");
      if (onInitiate) onInitiate();
    } catch (error) {
      console.error("Error initiating timesheet:", error);
      toast.error("Error initiating timesheet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleHoursChange = (e) => {
    const value = parseFloat(e.target.value);
    const max = getMaxHoursForDay();

    if (isNaN(value) || value <= 0 || value > max) {
      setError(`Please enter a valid number of hours (0 - ${max}).`);
    } else {
      setError("");
    }

    setHours(e.target.value);
  };

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  return (
    <div>
      {isInitiatedLoading ? (
        <div className="text-center mb-3">
          <FontAwesomeIcon icon={faSpinner} spin size="1x" />
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {Initiated ? (
            <div>
              <h5 className="mb-2">Timesheet Entry</h5>
              <form onSubmit={handleSubmit} className="mb-4">
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
                    Hours Worked (Max {getMaxHoursForDay()})
                  </label>
                  <input
                    type="number"
                    id="hours"
                    value={hours}
                    onChange={handleHoursChange}
                    className="form-control"
                    step="0.1"
                    min="0"
                    max={getMaxHoursForDay()}
                    placeholder="Enter hours"
                    disabled={isWeekend(date)}
                  />
                  {error && <small className="text-danger">{error}</small>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isWeekend(date) || loadingAddEntry}
                >
                  {loadingAddEntry ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCalendarPlus} className="me-2" />
                      Add Entry
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-3">
                <label htmlFor="initiationDate" className="form-label">
                  Initiation Date
                </label>
                <input
                  type="date"
                  id="initiationDate"
                  value={initiationDate}
                  onChange={(e) => setInitiationDate(e.target.value)}
                  className="form-control"
                  max={today}
                />
              </div>
              <button
                onClick={handleInitiateTimesheet}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                    Initiating...
                  </>
                ) : (
                  <>
                    Initiate Timesheet for {currentMonth} {currentYear}{" "}
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TimesheetForm;
