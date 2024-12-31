import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CancelApproval = ({ Id, refreshApplications, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get CSRF token from meta tag
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Making the POST request to cancel approval
      const response = await axios.post(
        `/selfservice/LeaveCancel/${Id}/`,
        null,
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Success toast
        toast.success("Canceled successfully!");
        refreshApplications(); // Call parent callback to update plan status
        onClose(); // Close the modal or dialog
      } else {
        // Handle unexpected status codes
        const errorMsg = response.data?.error || "Unexpected server response.";
        toast.error(errorMsg); // Error toast
        refreshApplications(); // Call parent callback to update plan status
        onClose();
      }
    } catch (error) {
      // Extract real error message from the response
      const errorMsg =
        error.response?.data?.error || // Check if server returned an error message
        error.response?.data?.message || // Fallback to another key
        error.message || // Network or Axios error
        "An unknown error occurred.";
      toast.error(errorMsg); // Display real error message in toast
      console.error("Error details:", error);
      refreshApplications(); // Call parent callback to update plan status
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
          "Cancel Request for Approval"
        )}
      </button>
    </form>
  );
};

export default CancelApproval;
