import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ReOpenPlanner = ({ planId, onReOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`/selfservice/FnReOpenLeavePlanner/${planId}/`, null, {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Planner Reopened",
        text: "The leave planner has been successfully reopened.",
      });

      onReOpen();
      onClose();
    } catch (error) {
      console.error("Reopen error:", error);
      await Swal.fire({
        icon: "error",
        title: "Failed to Reopen Planner",
        text:
          error?.response?.data?.error ||
          "Error reopening the planner. Please try again.",
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
          "Reopen Plan"
        )}
      </button>
    </form>
  );
};

export default ReOpenPlanner;
