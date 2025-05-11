import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const SubmitAdjustment = ({ Id, onApplicationSubmitted, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!csrfToken) {
      await Swal.fire({
        icon: "error",
        title: "CSRF Error",
        text: "CSRF token not found. Unable to submit.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `/selfservice/FnRequestLeaveAdjustmentApproval/${Id}/`,
        null,
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        await Swal.fire({
          icon: "success",
          title: "Submitted",
          text: "Submitted successfully!",
        });
        if (onApplicationSubmitted) onApplicationSubmitted();
        if (onClose) onClose();
      } else {
        const errorMsg = response.data?.error || "Unexpected server response.";
        await Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: errorMsg,
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Error submitting the adjustment. Please try again.";
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
      });
      console.error("Error details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
            ></span>
          ) : (
            "Request For Approval"
          )}
        </button>
      </form>
    </div>
  );
};

export default SubmitAdjustment;
