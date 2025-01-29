import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const ApproveDocument = ({
  Id,
  TableID,
  Entry_No_,
  statusApproveRejectDelegate,
  approvalComment,
  DocumentType,
  onApplicationSubmitted,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null); // Reset error before submission

    const formData = {
      TableID,
      Entry_No_,
      statusApproveRejectDelegate,
      approvalComment,
    };

    try {
      await axios.post(`/selfservice/FnActionApprovals/${Id}/`, formData, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      });

      toast.success("Approved successfully!");
      onApplicationSubmitted(); // Notify parent of success
      navigate("/selfservice/dashboard");
    } catch (error) {
      setSubmitError("Error submitting the document. Please try again.");
      toast.error("Error submitting the document. Please try again.");
      console.error("Error details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine the button text dynamically based on DocumentType
  const getButtonText = () => {
    switch (DocumentType) {
      case "LeaveApplication":
        return "Approve Leave Application";
      case "LeaveAdjustment":
        return "Approve Leave Adjustment";
      case "Leave Recall":
        return "Approve Leave Recall";
      default:
        return "Approve Document";
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span
              className="spinner-border spinner-border-sm"
              style={{ marginRight: "8px" }}
            ></span>
            Submitting...
          </>
        ) : (
          <>
            {getButtonText()}
            <FontAwesomeIcon
              icon={faArrowRight}
              style={{ marginLeft: "8px" }}
            />
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

export default ApproveDocument;
