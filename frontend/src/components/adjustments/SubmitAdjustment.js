import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubmitAdjustment = ({ Id, onApplicationSubmitted, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!csrfToken) {
      toast.error("CSRF token not found. Unable to submit.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Make the POST request to submit the adjustment
      const response = await axios.post(
        `/selfservice/FnRequestLeaveAdjustmentApproval/${Id}/`,
        null,
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      // Handle response
      if (response.status === 200 || response.status === 201) {
        toast.success("Submitted successfully!");
        if (onApplicationSubmitted) onApplicationSubmitted(); // Call parent callback if provided
        if (onClose) onClose(); // Close modal if provided
      } else {
        const errorMsg = response.data?.error || "Unexpected server response.";
        toast.error(errorMsg);
      }
    } catch (error) {
      // Handle network or server errors
      const errorMsg =
        error.response?.data?.error ||
        "Error submitting the adjustment. Please try again.";
      toast.error(errorMsg); // Error toast
      console.error("Error details:", error);
    } finally {
      setIsSubmitting(false); // Reset the submitting state
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
              className="spinner-border spinner-border-sm"
              style={{ marginRight: "8px" }}
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
