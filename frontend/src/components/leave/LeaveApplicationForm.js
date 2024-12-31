import React, { useState, useRef, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LeaveApplicationForm = ({ onApplicationNoRetrieved }) => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leavePlanners, setLeavePlanners] = useState([]);
  const [formData, setFormData] = useState({
    applicationNo: "",
    myAction: "insert",
    leaveType: "",
    leaveBalance: "0",
    basedOnPlanner: "",
    leaveStartDate: "",
    returnSameDay: "",
    plannerStartDate: "",
    daysApplied: "",
    halfOfDay: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  // Fetch leave types when the component is mounted
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await axios.get("/selfservice/get-leave-types/"); // Make sure the URL matches your Django endpoint
        setLeaveTypes(response.data); // Store the response data in state
      } catch (error) {
        console.error("Error fetching leave types:", error);
        toast.error("Failed to fetch leave types.");
      }
    };

    fetchLeaveTypes();
  }, []);

  useEffect(() => {
    const fetchLeavePlanners = async () => {
      try {
        const response = await axios.get("/selfservice/LeavePlanners/");
        console.log("Fetched planners:", response.data); // Check the response structure
        setLeavePlanners(response.data || []); // Use an empty array as fallback
      } catch (error) {
        console.error("Error fetching leave planners:", error);
        toast.error("Failed to fetch leave planners.");
      }
    };

    if (formData.basedOnPlanner === "True") {
      fetchLeavePlanners();
    } else {
      setLeavePlanners([]); // Clear planners if 'basedOnPlanner' is set to 'False'
    }
  }, [formData.basedOnPlanner]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Update the form data
    setFormData((prevData) => ({ ...prevData, [id]: value }));

    // If the leave type changes, fetch the leave balance
    if (id === "leaveType") {
      handleLeaveTypeChange(e); // Call handleLeaveTypeChange when leaveType is changed
    }
    if (id === "plannerStartDate" && value) {
      fetchPlannedDays(value);
    }

    // Conditionally validate fields (as before)
    if (id === "daysApplied") {
      if (
        formData.basedOnPlanner === "True" ||
        (formData.basedOnPlanner === "False" && formData.returnSameDay === "No")
      ) {
        if (value === "") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [id]: "This field is required.",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [id]: "",
          }));
        }
      } else if (formData.returnSameDay === "Yes") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [id]: "",
        }));
      }
    } else {
      if (value === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [id]: "This field is required.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [id]: "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors = {};
    if (!formData.leaveType) newErrors.leaveType = "Leave Type is required.";
    if (!formData.basedOnPlanner)
      newErrors.basedOnPlanner = "Please select an option.";
    if (formData.basedOnPlanner === "False" && !formData.leaveStartDate) {
      newErrors.leaveStartDate = "Leave Start Date is required.";
    }
    if (formData.basedOnPlanner === "True" && !formData.plannerStartDate) {
      newErrors.plannerStartDate = "Planner Start Date is required.";
    }
    if (formData.returnSameDay === "True" && !formData.halfOfDay) {
      newErrors.halfOfDay = "Which Half Of Day is required.";
    }
    if (formData.returnSameDay === "False" && !formData.daysApplied) {
      newErrors.daysApplied = "Days Applied is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/selfservice/Leave/", formData, {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.applicationNo) {
        toast.success("Application submitted successfully!");
        onApplicationNoRetrieved(response.data.applicationNo);
      } else if (response.data.error) {
        // Display the error returned by Django
        toast.error(response.data.error);
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (error) {
      // Check if the error response contains a message
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        // Default error message for unexpected errors
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Create refs for transitions
  const leaveStartDateRef = useRef(null);
  const plannerStartDateRef = useRef(null);
  const daysAppliedRef = useRef(null);
  const halfOfDayRef = useRef(null);
  const returnSameDayRef = useRef(null);

  const handleLeaveTypeChange = async (event) => {
    const selectedLeaveType = event.target.value;
    setFormData({ ...formData, leaveType: selectedLeaveType });

    if (selectedLeaveType) {
      try {
        const response = await axios.get("/selfservice/LeaveBalance/", {
          params: { leaveType: selectedLeaveType },
        });

        const leaveBalance = response.data.leaveBalance;
        setFormData({
          ...formData,
          leaveType: selectedLeaveType,
          leaveBalance: `${leaveBalance} days`, // Formatting the balance
        });
      } catch (error) {
        console.error("Error fetching leave balance:", error);
      }
    } else {
      // Reset leave balance if no type is selected
      setFormData({ ...formData, leaveBalance: "" });
    }
  };

  const fetchPlannedDays = async (startDate) => {
    try {
      const response = await axios.get("/selfservice/NumberOfDaysFilter/", {
        params: { start_date: startDate },
      });
      const plannedDays = response.data;

      console.log("Fetched planned days:", response.data);

      setFormData((prevData) => {
        const updatedData = { ...prevData, daysApplied: plannedDays };
        console.log("Updated formData with daysApplied:", updatedData);
        return updatedData;
      });
    } catch (error) {
      console.error("Error fetching planned days:", error);
      toast.error("Failed to fetch leave balance.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      className="row g-3 needs-validation"
      onSubmit={handleSubmit}
      noValidate
    >
      <input
        type="hidden"
        name="applicationNo"
        value={formData.applicationNo}
      />
      <input type="hidden" name="myAction" value={formData.myAction} />

      <div className="col-xl-4 col-sm-6">
        <label className="form-label" htmlFor="leaveType">
          Leave Type <span className="text-danger">*</span>
        </label>
        <select
          id="leaveType"
          name="leaveType"
          className="form-select"
          value={formData.leaveType}
          onChange={handleChange}
        >
          <option value="">Choose...</option>
          {leaveTypes.map((leave) => (
            <option key={leave.Code} value={leave.Code}>
              {leave.Description}
            </option>
          ))}
        </select>
        {errors.leaveType && (
          <div
            className="text-danger invalid-feedback"
            style={{ fontSize: "0.8rem" }}
          >
            {errors.leaveType}
          </div>
        )}
      </div>

      <div className="col-xl-4 col-sm-6">
        <label className="form-label" htmlFor="leaveBalance">
          Leave Balance
        </label>
        <input
          className="form-control"
          id="leaveBalance"
          type="text"
          placeholder="0"
          value={formData.leaveBalance}
          disabled
        />
      </div>

      <div className="col-xl-4 col-sm-6">
        <label className="form-label" htmlFor="basedOnPlanner">
          Leave Based on Planner? <span className="text-danger">*</span>
        </label>
        <select
          className={`form-select ${errors.basedOnPlanner ? "is-invalid" : ""}`}
          id="basedOnPlanner"
          value={formData.basedOnPlanner || ""}
          onChange={handleChange}
        >
          <option value="">Choose..</option>
          <option value="True">Yes</option>
          <option value="False">No</option>
        </select>
        {errors.basedOnPlanner && (
          <div
            className="text-danger invalid-feedback"
            style={{ fontSize: "0.8rem" }}
          >
            {errors.basedOnPlanner}
          </div>
        )}
      </div>

      <CSSTransition
        in={formData.basedOnPlanner === "False"}
        timeout={300}
        classNames="fade"
        unmountOnExit
        nodeRef={leaveStartDateRef}
      >
        <div ref={leaveStartDateRef} className="col-xl-4 col-sm-6">
          <label className="form-label" htmlFor="leaveStartDate">
            Leave Start Date
          </label>
          <input
            className={`form-control ${
              errors.leaveStartDate ? "is-invalid" : ""
            }`}
            id="leaveStartDate"
            type="date"
            name="leaveStartDate"
            value={formData.leaveStartDate || ""}
            onChange={handleChange}
            min={today} // Prevents selection of past dates
            style={{ borderColor: errors.leaveStartDate ? "red" : "" }}
          />
          {errors.leaveStartDate && (
            <div
              className="text-danger invalid-feedback"
              style={{ fontSize: "0.8rem" }}
            >
              {errors.leaveStartDate}
            </div>
          )}
        </div>
      </CSSTransition>

      {/* Hide plannerStartDate when "Leave Based on Planner?" is No */}
      {formData.basedOnPlanner === "True" && (
        <CSSTransition
          in={formData.basedOnPlanner === "True"}
          timeout={300}
          classNames="fade"
          unmountOnExit
          nodeRef={plannerStartDateRef}
        >
          <div ref={plannerStartDateRef} className="col-xl-4 col-sm-6">
            <label className="form-label" htmlFor="plannerStartDate">
              Planner Start Date
            </label>
            <select
              className={`form-select ${
                errors.plannerStartDate ? "is-invalid" : ""
              }`}
              id="plannerStartDate"
              value={formData.plannerStartDate || ""}
              onChange={handleChange}
            >
              <option value="">Choose...</option>
              {leavePlanners?.map((planner) => (
                <option key={planner.StartDate} value={planner.StartDate}>
                  {planner.StartDate} to {planner.EndDate}
                </option>
              ))}
            </select>
            {errors.plannerStartDate && (
              <div
                className="text-danger invalid-feedback"
                style={{ fontSize: "0.8rem" }}
              >
                {errors.plannerStartDate}
              </div>
            )}
          </div>
        </CSSTransition>
      )}

      {/* Show / Hide for returnSameDay */}
      {/* Conditionally render the "Return Same Day" dropdown */}
      {formData.basedOnPlanner !== "True" && (
        <CSSTransition
          in={formData.basedOnPlanner === "False"}
          timeout={300}
          classNames="fade"
          unmountOnExit
          nodeRef={returnSameDayRef}
        >
          <div ref={returnSameDayRef} className="col-xl-4 col-sm-6">
            <label className="form-label" htmlFor="returnSameDay">
              Return Same Day
            </label>
            <select
              className={`form-select ${
                errors.returnSameDay ? "is-invalid" : ""
              }`}
              id="returnSameDay"
              value={formData.returnSameDay || ""}
              onChange={handleChange}
            >
              <option value="">Choose..</option>
              <option value="True">Yes</option>
              <option value="False">No</option>
            </select>
            {errors.returnSameDay && (
              <div
                className="text-danger invalid-feedback"
                style={{ fontSize: "0.8rem" }}
              >
                {errors.returnSameDay}
              </div>
            )}
          </div>
        </CSSTransition>
      )}

      {/* Hide Half of Day and Days Applied based on "Return Same Day" */}
      <CSSTransition
        in={formData.returnSameDay === "True"}
        timeout={300}
        classNames="fade"
        unmountOnExit
        nodeRef={halfOfDayRef}
      >
        <div ref={halfOfDayRef} className="col-xl-4 col-sm-6">
          <label className="form-label" htmlFor="halfOfDay">
            Which Half Of Day?
          </label>
          <select
            className={`form-select ${errors.halfOfDay ? "is-invalid" : ""}`}
            id="halfOfDay"
            value={formData.halfOfDay || ""}
            onChange={handleChange}
          >
            <option value="0">Choose...</option>
            <option value="1">AM</option>
            <option value="2">PM</option>
          </select>
          {errors.halfOfDay && (
            <div
              className="text-danger invalid-feedback"
              style={{ fontSize: "0.8rem" }}
            >
              {errors.halfOfDay}
            </div>
          )}
        </div>
      </CSSTransition>

      {/* Conditionally render and disable the "Days Applied" input */}
      {formData.basedOnPlanner === "True" && (
        <CSSTransition
          in={formData.basedOnPlanner === "True"}
          timeout={300}
          classNames="fade"
          unmountOnExit
          nodeRef={daysAppliedRef}
        >
          <div ref={daysAppliedRef} className="col-xl-4 col-sm-6">
            <label className="form-label" htmlFor="daysApplied">
              Days Applied
            </label>
            <input
              type="number"
              className={`form-control ${
                errors.daysApplied ? "is-invalid" : ""
              }`}
              id="daysApplied"
              value={formData.daysApplied || ""}
              onChange={handleChange}
              disabled={true} // Always disable if "Based on Planner" is Yes
            />
            {errors.daysApplied && (
              <div
                className="text-danger invalid-feedback"
                style={{ fontSize: "0.8rem" }}
              >
                {errors.daysApplied}
              </div>
            )}
          </div>
        </CSSTransition>
      )}

      {formData.basedOnPlanner === "False" &&
        formData.returnSameDay === "False" && (
          <CSSTransition
            in={
              formData.basedOnPlanner === "False" &&
              formData.returnSameDay === "False"
            }
            timeout={300}
            classNames="fade"
            unmountOnExit
            nodeRef={daysAppliedRef}
          >
            <div ref={daysAppliedRef} className="col-xl-4 col-sm-6">
              <label className="form-label" htmlFor="daysApplied">
                Days Applied
              </label>
              <input
                type="number"
                className={`form-control ${
                  errors.daysApplied ? "is-invalid" : ""
                }`}
                id="daysApplied"
                value={formData.daysApplied || ""}
                onChange={handleChange}
                disabled={false} // Enable if "Return Same Day" is No
              />
              {errors.daysApplied && (
                <div
                  className="text-danger invalid-feedback"
                  style={{ fontSize: "0.8rem" }}
                >
                  {errors.daysApplied}
                </div>
              )}
            </div>
          </CSSTransition>
        )}

      {formData.basedOnPlanner === "False" &&
        formData.returnSameDay === "True" && (
          <CSSTransition
            in={
              formData.basedOnPlanner === "False" &&
              formData.returnSameDay === "True"
            }
            timeout={300}
            classNames="fade"
            unmountOnExit
            nodeRef={daysAppliedRef}
          >
            <div ref={daysAppliedRef} className="col-xl-4 col-sm-6">
              {/* Hidden completely when "Return Same Day" is Yes */}
            </div>
          </CSSTransition>
        )}

      <div className="col-xl-12 text-end mt-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span
              className="spinner-border spinner-border-sm"
              style={{ marginRight: "8px" }}
            ></span>
          ) : (
            <>
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{ marginRight: "5px" }}
              />
              Continue
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default LeaveApplicationForm;
