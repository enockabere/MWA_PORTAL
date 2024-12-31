import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SubmitLeave = ({ Id, refreshApplications, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get CSRF token from meta tag
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Making the POST request to submit the plan
      const response = await axios.post(
        `/selfservice/LeaveApprove/${Id}/`,
        null,
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Success toast
        toast.success("Submitted successfully!");
        refreshApplications(); // Call parent callback to update plan status
        onClose();
      } else {
        // Handle unexpected status codes
        const errorMsg = response.data?.error || "Unexpected server response.";
        toast.error(errorMsg); // Error toast
        refreshApplications();
        onClose();
      }
    } catch (error) {
      // Handle network or server errors
      const errorMsg =
        error.response?.data?.error ||
        "Error submitting the leave. Please try again.";
      toast.error(errorMsg); // Error toast
      console.error("Error details:", error);
      refreshApplications();
      onClose();
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
          "Request For Approval"
        )}
      </button>
    </form>
  );
};

export default SubmitLeave;
