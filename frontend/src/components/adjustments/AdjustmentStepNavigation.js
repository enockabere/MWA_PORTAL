import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      toast.error("CSRF token not found.");
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
        toast.success("Adjustment request submitted successfully.");
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
          toast.success("Approvers fetched successfully.");
        } else {
          toast.error("Failed to fetch leave approvers.");
        }

        if (onStartCountdown) {
          onStartCountdown(20);
        }

        handleNextStep("successful-wizard");
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to submit adjustment: ${errorData.error || "Unknown error"}.`
        );
      }
    } catch (error) {
      toast.error(
        `An error occurred while submitting the adjustment: ${error.message}`
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
                style={{ marginLeft: "5px" }} // Align icon correctly after text
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AdjustmentStepNavigation;
