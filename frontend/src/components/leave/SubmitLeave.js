import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const SubmitLeave = ({ Id, refreshApplications, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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
        await Swal.fire("Success", "Submitted successfully!", "success");
        refreshApplications();
        onClose();
      } else {
        const errorMsg = response?.data?.error || "Unexpected server response.";
        await Swal.fire("Error", errorMsg, "error");
        refreshApplications();
        onClose();
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Error submitting the leave. Please try again.";
      console.error("Error details:", error);
      await Swal.fire("Error", errorMsg, "error");
      refreshApplications();
      onClose();
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
          "Request For Approval"
        )}
      </button>
    </form>
  );
};

export default SubmitLeave;
