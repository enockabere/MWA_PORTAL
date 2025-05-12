import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const CancelApproval = ({ Id, refreshApplications, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this approval request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, cancel it!",
    });

    if (!confirmation.isConfirmed) return;

    setIsSubmitting(true);

    try {
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
        await Swal.fire("Success", "Canceled successfully!", "success");
      } else {
        const errorMsg = response.data?.error || "Unexpected server response.";
        await Swal.fire("Error", errorMsg, "error");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred.";
      console.error("Error details:", error);
      await Swal.fire("Error", errorMsg, "error");
    } finally {
      setIsSubmitting(false);
      refreshApplications();
      onClose();
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
