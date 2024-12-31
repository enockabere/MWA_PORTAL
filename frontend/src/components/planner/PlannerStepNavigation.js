import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const PlannerStepNavigation = ({
  handleNextStep,
  pk,
  onStartCountdown,
  myAction,
  setMyAction, // Function to update myAction in the parent component
}) => {
  const [loading, setLoading] = useState(false);

  // Fetch the CSRF token from the meta tag
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content"); // Add optional chaining for safety

  const handleSubmit = async () => {
    if (!csrfToken) {
      console.error("CSRF token not found.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/selfservice/FnSubmitLeavePlanner/${pk}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken, // Include the CSRF token in the headers
        },
        body: JSON.stringify({
          /* Add any additional data needed */
        }),
      });

      if (response.ok) {
        if (onStartCountdown) {
          onStartCountdown(15);
        }
        handleNextStep("successful-wizard"); // Move to the "successful-wizard" tab on successful submission
      } else {
        console.error("Failed to submit plan.");
      }
    } catch (error) {
      console.error("An error occurred while submitting the plan:", error);
    } finally {
      setLoading(false); // Ensure loading state is reset in both success and error cases
    }
  };

  const handlePrevious = () => {
    // Update myAction to "modify"
    if (setMyAction) {
      setMyAction("modify");
    }
    // Navigate to the previous step
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
              className="spinner-border spinner-border-sm"
              style={{ marginRight: "8px" }}
            ></span>
          ) : (
            <>
              Submit Plan
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

export default PlannerStepNavigation;
