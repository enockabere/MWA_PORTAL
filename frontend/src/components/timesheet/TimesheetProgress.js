import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TimesheetProgress = ({ activeMonth, pk, onInitiate }) => {
  const [remainingDays, setRemainingDays] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCurrentMonth, setIsCurrentMonth] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  useEffect(() => {
    if (activeMonth) {
      const today = moment();
      const activeMonthDate = moment()
        .month(activeMonth.month)
        .year(activeMonth.year);

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

  const handleSubmit = async () => {
    console.log("Submitting timesheet with pk:", pk); // Log pk
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `/selfservice/submit-timesheet/${pk}/`,
        null,
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Timesheet submitted successfully!"
        );
        onInitiate();
      } else {
        toast.error(response.data.error || "Failed to submit timesheet.");
      }
    } catch (err) {
      toast.error("An error occurred while submitting the timesheet.");
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <button
          className="btn btn-warning w-100"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
              Submitting...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faArrowRight} className="me-2" />
              Submit Timesheet
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TimesheetProgress;
