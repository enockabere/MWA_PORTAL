import React from "react";

const TimesheetProgress = ({ entries }) => {
  const today = new Date();
  const currentMonth = today.getMonth(); // Current month (0-based index)
  const currentYear = today.getFullYear();

  // Get the last day of the current month
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

  // Calculate remaining days until the end of the month
  const remainingDays = Math.ceil(
    (lastDayOfMonth - today) / (1000 * 60 * 60 * 24)
  );

  // Calculate the number of days the user has already filled entries for
  const filledEntries = Object.keys(entries).filter((date) => {
    const entryDate = new Date(date);
    return (
      entryDate.getMonth() === currentMonth &&
      entryDate.getFullYear() === currentYear
    );
  }).length;

  // Calculate total days in the current month
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const progress = Math.min((filledEntries / totalDaysInMonth) * 100, 100); // Calculate progress percentage

  return (
    <div>
      <h6>Timesheet Days Remaining To Submission</h6>
      <div className="progress mt-1" style={{ height: "30px" }}>
        <div
          className={`progress-bar px-2 bg-primary`} // Add bg-success for green color
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {remainingDays} Days
        </div>
      </div>
      {filledEntries === totalDaysInMonth && (
        <div className="mt-3">
          <button className="btn btn-success">Submit Timesheet</button>
        </div>
      )}
    </div>
  );
};

export default TimesheetProgress;
