import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const AdjustmentStepNavigation = ({
  handleNextStep,
  pk,
  onStartCountdown,
  onFetchApprovers,
}) => {
  const [loading, setLoading] = useState(false);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleSubmit = async () => {
    if (!csrfToken) {
      await Swal.fire({
        icon: "error",
        title: "CSRF Error",
        text: "CSRF token not found.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/selfservice/FnRequestLeaveAdjustmentApproval/${pk}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({}),
        }
      );

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Submitted",
          text: "Adjustment request submitted successfully.",
        });

        const approversResponse = await fetch(
          `/selfservice/AdjustmentApprovers/${pk}/`,
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

          await Swal.fire({
            icon: "success",
            title: "Approvers Loaded",
            text: "Approvers fetched successfully.",
          });
        } else {
          await Swal.fire({
            icon: "warning",
            title: "Approvers Fetch Failed",
            text: "Failed to fetch leave approvers.",
          });
        }

        if (onStartCountdown) onStartCountdown(20);
        handleNextStep("successful-wizard");
      } else {
        const errorData = await response.json();
        await Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: `Failed to submit adjustment: ${errorData.error || "Unknown error"}.`,
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Network Error",
        text: `An error occurred while submitting the adjustment: ${error.message}`,
      });
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
          disabled={loading}
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          {loading ? (
            <span
              className="spinner-border spinner-border-sm"
              style={{ marginRight: "8px" }}
            ></span>
          ) : (
            <>
              Submit Adjustment
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{ marginLeft: "5px" }}
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdjustmentStepNavigation;
