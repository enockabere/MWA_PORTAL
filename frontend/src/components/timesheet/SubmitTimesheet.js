import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const SubmitTimesheet = ({ timesheetId, onHide, onShowToast }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await axios.post(
        `/selfservice/FnSubmitLeavePlanner/${timesheetId}/`,
        null,
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      onShowToast("Timesheet submitted successfully!", "success");
      onHide();
    } catch (error) {
      setSubmitError("Error submitting the timesheet. Please try again.");
      onShowToast("Error submitting the timesheet. Please try again.", "error");
      console.error("Error details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? (
          <span
            className="spinner-border spinner-border-sm"
            style={{ marginRight: "8px" }}
          ></span>
        ) : (
          <>
            Submit Timesheet{" "}
            <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
          </>
        )}
      </button>

      {submitError && (
        <div className="alert alert-danger mt-2" role="alert">
          {submitError}
        </div>
      )}
    </form>
  );
};

export default SubmitTimesheet;
