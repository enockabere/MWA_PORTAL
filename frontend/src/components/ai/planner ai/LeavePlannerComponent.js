import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";
import "./LeavePlannerComponent.css"; // Ensure you have this CSS file for styling

const LeavePlannerComponent = ({ plannerNo, csrfToken, addBotMessage }) => {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split("T")[0], // Default to today
    endDate: new Date().toISOString().split("T")[0],
    lineNo: 0,
    MyAction: "insert",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if the planner is submitted

  // Fetch plans when the component mounts or when a plan is added/modified/deleted
  useEffect(() => {
    fetchPlans(plannerNo);
  }, [plannerNo]);

  // Fetch plans from the server
  const fetchPlans = async (pk) => {
    try {
      const response = await fetch(`/selfservice/FnLeavePlannerLine/${pk}/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      if (Array.isArray(result.data)) {
        setPlans(result.data);
      } else {
        toast.error("Fetched data is not in the expected format.");
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      toast.error("Failed to fetch plans.");
    }
  };

  // Handle adding, editing, or deleting a plan
  const handlePlanAction = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Submitting form data:", formData); // Debugging

      const response = await axios.post(
        `/selfservice/FnAddLeavePlannerLine/${plannerNo}/`,
        formData,
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      console.log("Response from server:", response.data); // Debugging

      // Check if the response contains an error
      if (response.data.error) {
        toast.error(response.data.error); // Display the error message from the backend
      } else {
        toast.success(
          `Plan ${
            formData.MyAction === "insert"
              ? "added"
              : formData.MyAction === "modify"
              ? "updated"
              : "deleted"
          } successfully!`
        );
        fetchPlans(plannerNo); // Refresh the plans list
        setFormData({
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date().toISOString().split("T")[0],
          lineNo: 0,
          MyAction: "insert",
        }); // Reset form
      }
    } catch (error) {
      console.error("Error handling plan action:", error); // Debugging
      toast.error("Error handling plan action. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle submitting the entire planner
  const handleSubmitPlanner = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await axios.post(
        `/selfservice/FnSubmitLeavePlanner/${plannerNo}/`,
        null,
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      // Hide the form and buttons
      setIsSubmitted(true);

      // Display a message in the chat
      addBotMessage("The leave planner has been submitted successfully.");
    } catch (error) {
      setSubmitError("Error submitting the plan. Please try again.");
      toast.error("Error submitting the plan. Please try again.");
      console.error("Error details:", error); // Debugging
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle editing a plan
  const handleEditPlan = (plan) => {
    console.log("Editing plan:", plan); // Debugging
    setFormData({
      startDate: plan.StartDate,
      endDate: plan.EndDate,
      lineNo: plan.LineNo,
      MyAction: "modify",
    });
    toast.info("Update the dates above to modify the plan."); // Notify user
  };

  // Handle deleting a plan
  const handleDeletePlan = async (lineNo) => {
    console.log("Deleting plan with LineNo:", lineNo); // Debugging
    try {
      setIsSubmitting(true);
      await axios.post(
        `/selfservice/FnAddLeavePlannerLine/${plannerNo}/`,
        {
          lineNo,
          MyAction: "delete",
        },
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      toast.success("Plan deleted successfully!");
      fetchPlans(plannerNo); // Refresh the plans list
    } catch (error) {
      console.error("Error deleting plan:", error); // Debugging
      toast.error("Error deleting plan. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="leave-planner-container">
      <h6 className="text-primary">Leave Planner: {plannerNo}</h6>

      {/* Form for adding/editing plans (hidden if submitted) */}
      {!isSubmitted && (
        <form onSubmit={handlePlanAction}>
          <label className="form-label">
            Start Date:
            <input
              type="date"
              className="form-control"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </label>
          <label className="form-label">
            End Date:
            <input
              className="form-control"
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              min={formData.startDate}
              required
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon={faPlus} />{" "}
            {isSubmitting ? "Submitting..." : "Add Plan"}
          </button>
        </form>
      )}

      {/* Display plans in a table (only if plans exist and not submitted) */}
      {!isSubmitted && plans.length > 0 && (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.LineNo}>
                  <td>{plan.StartDate}</td>
                  <td>{plan.EndDate}</td>
                  <td>{plan.Days}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEditPlan(plan)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeletePlan(plan.LineNo)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Submit the entire planner (only if plans exist and not submitted) */}
          <button
            className="btn btn-primary mt-3"
            onClick={handleSubmitPlanner}
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon={faCheck} />{" "}
            {isSubmitting ? "Submitting..." : "Submit Planner"}
          </button>
        </>
      )}

      {/* Display submission error */}
      {submitError && <p className="text-danger mt-3">{submitError}</p>}
    </div>
  );
};

export default LeavePlannerComponent;