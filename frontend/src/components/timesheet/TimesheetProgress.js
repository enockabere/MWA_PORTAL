import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const TimesheetProgress = () => {
  const [remainingDays, setRemainingDays] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDue, setIsDue] = useState(false);

  useEffect(() => {
    const today = new Date();
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    const totalDaysInMonth = lastDayOfMonth.getDate();
    const daysPassed = today.getDate();
    const daysRemaining = totalDaysInMonth - daysPassed;

    setRemainingDays(daysRemaining);
    setProgress(((daysPassed / totalDaysInMonth) * 100).toFixed(2));
    setIsDue(daysRemaining <= 0); // Submission is due if remaining days is 0 or negative
  }, []);

  return (
    <div>
      {remainingDays > 0 ? (
        <>
          <h6 className="mt-3">Days Remaining To Submission</h6>
          <div className="progress mt-1" style={{ height: "30px" }}>
            <div
              className="progress-bar px-2 bg-warning"
              role="progressbar"
              style={{
                width: `${progress}%`,
                transition: "width 1s ease-in-out",
              }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {remainingDays} Days
            </div>
          </div>
        </>
      ) : (
        <p className="mt-3 text-danger">Timesheet submission is due today!</p>
      )}

      {isDue && (
        <div className="mt-3">
          <button className="btn btn-warning w-100">
            <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Submit
            Timesheet
          </button>
        </div>
      )}
    </div>
  );
};

export default TimesheetProgress;
