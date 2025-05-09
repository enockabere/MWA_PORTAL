import React, { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const PlannerStepNavigation = ({
  handleNextStep,
  pk,
  onStartCountdown,
  myAction,
  setMyAction,
}) => {
  const [loading, setLoading] = useState(false);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleSubmit = async () => {
    if (!csrfToken) {
      await Swal.fire({
        icon: "error",
        title: "CSRF Token Missing",
        text: "Unable to submit because CSRF token was not found.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/selfservice/FnSubmitLeavePlanner/${pk}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Planner Submitted",
          text: "Your leave plan has been submitted successfully.",
        });

        if (onStartCountdown) {
          onStartCountdown(15);
        }

        handleNextStep("successful-wizard");
      } else {
        await Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text:
            result?.error || "An unexpected error occurred. Please try again.",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      await Swal.fire({
        icon: "error",
        title: "Error Submitting Plan",
        text: error.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (setMyAction) {
      setMyAction("modify");
    }
    handleNextStep("wizard-info", true);
  };

  return (
    <div className="row g-3 mt-3">
      <div className="col-12 text-end">
        <button
          className="btn btn-primary"
          type="button"
          onClick={handlePrevious}
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
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <>
              Submit Plan
              <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PlannerStepNavigation;
