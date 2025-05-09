import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const SubmitPlanner = ({ planId, onPlanSubmitted, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`/selfservice/FnSubmitLeavePlanner/${planId}/`, null, {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Planner Submitted",
        text: "The leave planner was submitted successfully.",
      });

      onPlanSubmitted?.();
      onClose?.();
    } catch (error) {
      console.error("Error submitting planner:", error);

      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error?.response?.data?.error ||
          error?.message ||
          "Something went wrong while submitting the planner.",
      });
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
          />
        ) : (
          <>
            Submit Planner{" "}
            <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
          </>
        )}
      </button>
    </form>
  );
};

export default SubmitPlanner;
