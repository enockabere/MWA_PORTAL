import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
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
  const navigate = useNavigate();

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Approved successfully!",
        confirmButtonColor: "#3085d6",
      });

      if (onApplicationSubmitted) onApplicationSubmitted();
      navigate("/selfservice/dashboard");
    } catch (error) {
      console.error("Error details:", error);
      await Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Error submitting the document. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
    </form>
  );
};

export default ApproveDocument;
