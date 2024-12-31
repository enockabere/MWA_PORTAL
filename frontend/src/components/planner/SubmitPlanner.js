import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const SubmitPlanner = ({ planId, onPlanSubmitted, onClose, onShowToast }) => {
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
      await axios.post(`/selfservice/FnSubmitLeavePlanner/${planId}/`, null, {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      onShowToast("Planner submitted successfully!", "success");
      onPlanSubmitted();
      onClose();
    } catch (error) {
      setSubmitError("Error submitting the plan. Please try again.");
      onShowToast("Error submitting the plan. Please try again.", "error");
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
            Submit Planner{" "}
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

export default SubmitPlanner;
