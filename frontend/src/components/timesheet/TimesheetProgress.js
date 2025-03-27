import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

const TimesheetProgress = ({ activeMonth }) => {
  const [remainingDays, setRemainingDays] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCurrentMonth, setIsCurrentMonth] = useState(false);

  useEffect(() => {
    if (activeMonth) {
      const today = moment();
      const activeMonthDate = moment()
        .month(activeMonth.month)
        .year(activeMonth.year);

      // Check if active month is current month
      const currentMonthCheck = today.isSame(activeMonthDate, "month");
      setIsCurrentMonth(currentMonthCheck);

      if (currentMonthCheck) {
        const lastDayOfMonth = activeMonthDate.endOf("month");
        const totalDaysInMonth = lastDayOfMonth.date();
        const daysPassed = today.date();
        const daysRemaining = totalDaysInMonth - daysPassed;

        setRemainingDays(daysRemaining);
        setProgress(((daysPassed / totalDaysInMonth) * 100).toFixed(2));
      }
    }
  }, [activeMonth]);

  return (
    <div>
      {isCurrentMonth ? (
        <>
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
            <p className="mt-3 text-danger">
              Timesheet submission is due today!
            </p>
          )}
        </>
      ) : (
        <p className="mt-3">Viewing past month timesheet</p>
      )}

      <div className="mt-3">
        <button className="btn btn-warning w-100">
          <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Submit
          Timesheet
        </button>
      </div>
    </div>
  );
};

export default TimesheetProgress;
