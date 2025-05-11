import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const CancelApproval = ({ Id, onCancelSubmission, onClose }) => {
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
        `/selfservice/FnCancelLeaveAdjustmentApproval/${Id}/`,
        null,
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Cancelled",
        text: "Request for approval was successfully cancelled.",
      });

      if (onCancelSubmission) onCancelSubmission();
      if (onClose) onClose();
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Error submitting the leave. Please try again.";
      setSubmitError(errorMsg);

      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: errorMsg,
      });

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
            className="spinner-border spinner-border-sm me-2"
            role="status"
          ></span>
        ) : (
          "Cancel Request for Approval"
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

export default CancelApproval;
