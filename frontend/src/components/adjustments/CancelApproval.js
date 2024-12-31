import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CancelApproval = ({ Id, onCancelSubmission, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null); // For error message

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null); // Reset error before submission

    try {
      // Making the post request to submit the plan
      await axios.post(
        `/selfservice/FnCancelLeaveAdjustmentApproval/${Id}/`,
        null,
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      toast.success("Canceled successfully!");
      onCancelSubmission(); // Call parent callback to update plan status
      onClose();
    } catch (error) {
      setSubmitError("Error submitting the leave. Please try again.");
      toast.error("Error submitting the leave. Please try again.");
      console.error("Error details:", error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
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
