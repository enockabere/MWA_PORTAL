import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const LeaveNavigation = ({ handleNextStep, pk, onFetchApprovers }) => {
  const [loading, setLoading] = useState(false);
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/selfservice/LeaveApprove/${pk}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        await Swal.fire(
          "Success",
          "Leave request submitted successfully!",
          "success"
        );

        // Fetch the leave approvers
        const approversResponse = await fetch(
          `/selfservice/LeaveApprovers/${pk}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (approversResponse.ok) {
          const approversData = await approversResponse.json();
          if (onFetchApprovers) {
            onFetchApprovers(approversData);
          }
        } else {
          console.error("Failed to fetch leave approvers.");
        }

        handleNextStep("successful-wizard");
      } else {
        const errorData = await response.json();
        await Swal.fire(
          "Error",
          errorData.error || "Failed to submit leave.",
          "error"
        );
      }
    } catch (error) {
      console.error("An error occurred while submitting the plan:", error);
      await Swal.fire(
        "Error",
        "An unexpected error occurred. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row g-3 mt-3">
      <div className="col-12 text-end">
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => handleNextStep("wizard-info")}
          style={{ marginRight: "10px" }}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Previous
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              style={{ marginRight: "8px" }}
            ></span>
          ) : (
            <>
              Submit Leave{" "}
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{ marginRight: "5px" }}
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LeaveNavigation;
