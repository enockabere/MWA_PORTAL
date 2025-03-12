import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";

const TimesheetForm = ({ Initiated, onInitiate }) => {
  const [loading, setLoading] = useState(false);
  const [isInitiatedLoading, setIsInitiatedLoading] = useState(true);
  const [initiationDate, setInitiationDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  useEffect(() => {
    const checkInitiatedStatus = async () => {
      setTimeout(() => {
        setIsInitiatedLoading(false);
      }, 2000);
    };

    checkInitiatedStatus();
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      // Create the date object
      const date = new Date(selectedYear, selectedMonth - 1, 1);

      // Format it manually as YYYY-MM-DD
      const firstDateOfMonth = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-01`;

      console.log("Computed firstDateOfMonth:", firstDateOfMonth);
      setInitiationDate(firstDateOfMonth);
    }
  }, [selectedMonth, selectedYear]);

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
          initiationDate: initiationDate,
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
          {!Initiated && (
            <div className="">
              <div className="mb-3">
                <label htmlFor="month" className="form-label">
                  Month
                </label>
                <select
                  id="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="form-select"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {new Date(selectedYear, month - 1).toLocaleString(
                        "default",
                        { month: "long" }
                      )}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="year" className="form-label">
                  Year
                </label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="form-select"
                >
                  {Array.from(
                    { length: 10 },
                    (_, i) => currentYear - 5 + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
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
                    Initiate Timesheet for{" "}
                    {new Date(selectedYear, selectedMonth - 1).toLocaleString(
                      "default",
                      { month: "long" }
                    )}{" "}
                    {selectedYear}{" "}
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
