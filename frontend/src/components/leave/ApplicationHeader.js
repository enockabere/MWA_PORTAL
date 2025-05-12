import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ApplicationHeader = ({ selectedApplication }) => {
  const [formData, setFormData] = useState({
    applicationNo: "",
    myAction: "modify",
    leaveType: "",
    leaveBalance: "",
    basedOnPlanner: "False",
    leaveStartDate: "",
    returnSameDay: "False",
    plannerStartDate: "",
    daysApplied: "",
    halfOfDay: "0",
  });

  const [isLoading, setIsLoading] = useState(false);
  const isEditable = selectedApplication?.Status === "Open";
  useEffect(() => {
    if (selectedApplication) {
      const plannerDate = selectedApplication.Planner_Start_Date || "";

      setFormData({
        applicationNo: selectedApplication.Application_No || "",
        myAction: "modify",
        leaveType: selectedApplication.Leave_Code || "",
        leaveBalance: selectedApplication.Leave_balance || "",
        basedOnPlanner: selectedApplication.Use_Planner ? "True" : "False",
        plannerStartDate: plannerDate,
        leaveStartDate: plannerDate,
        returnSameDay: selectedApplication.Return_same_day ? "True" : "False",
        daysApplied: selectedApplication.Days_Applied || "",
        halfOfDay: selectedApplication.Half_Of_Day || "0",
      });
    }
  }, [selectedApplication]);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => {
      if (id === "plannerStartDate") {
        return {
          ...prev,
          plannerStartDate: value,
          leaveStartDate: value,
        };
      }

      return {
        ...prev,
        [id]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      Swal.fire({
        title: "Updating...",
        text: "Updating leave application...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post("/selfservice/Leave/", formData, {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
      });
      const resData = response.data;

      if (response.status === 200 && resData.status === "success") {
        Swal.fire(
          "Success",
          resData.message || "Application updated successfully!",
          "success"
        );
      } else if (resData.status === "error") {
        Swal.fire("Error", resData.message || "Update failed.", "error");
      } else {
        Swal.fire("Error", "Unexpected response from server.", "error");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "An unexpected error occurred. Please try again.",
        "error"
      );
      console.error("Submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <button
            className="btn btn-link collapsed ps-0"
            data-bs-toggle="collapse"
            data-bs-target="#collapseicon4"
            aria-expanded="true"
            aria-controls="collapseicon2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-help-circle"
            >
              <circle cx={12} cy={12} r={10} />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1={12} y1={17} x2={12} y2={17} />
            </svg>{" "}
            Leave Header Details
          </button>
        </h5>
      </div>
      <div
        className="collapse show"
        id="collapseicon4"
        data-bs-parent="#accordionoc"
      >
        <div className="card-body">
          <div className="row">
            <div className="col-md-12 p-2">
              <div className="row my-2">
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label">Application No.</label>
                  <input
                    className="form-control"
                    type="text"
                    value={formData.applicationNo}
                    disabled
                  />
                </div>
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label">Application Date</label>
                  <input
                    className="form-control"
                    type="text"
                    value={selectedApplication?.Application_Date || "N/A"}
                    disabled
                  />
                </div>
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label">Employee Name</label>
                  <input
                    className="form-control"
                    type="text"
                    value={selectedApplication?.Employee_Name || "N/A"}
                    disabled
                  />
                </div>
              </div>

              <div className="row my-2">
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label">Leave Period</label>
                  <input
                    className="form-control"
                    type="text"
                    value={selectedApplication?.Leave_Period || "N/A"}
                    disabled
                  />
                </div>
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label">Leave Code</label>
                  <input
                    className="form-control"
                    type="text"
                    value={formData.leaveType}
                    disabled
                  />
                </div>
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label">Status</label>
                  <input
                    className="form-control"
                    type="text"
                    value={selectedApplication?.Status || "N/A"}
                    disabled
                  />
                </div>
              </div>

              <div className="row my-2">
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label" htmlFor="plannerStartDate">
                    Leave Start Date
                  </label>
                  <input
                    className={`form-control ${isEditable ? "" : "disabled"}`}
                    id="plannerStartDate"
                    type={isEditable ? "date" : "text"}
                    value={formData.plannerStartDate}
                    onChange={handleChange}
                    disabled={!isEditable}
                  />
                </div>
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label" htmlFor="daysApplied">
                    Days Applied
                  </label>
                  <input
                    className={`form-control ${isEditable ? "" : "disabled"}`}
                    id="daysApplied"
                    type="number"
                    value={formData.daysApplied}
                    onChange={handleChange}
                    disabled={!isEditable}
                  />
                </div>
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label">Resumption Date</label>
                  <input
                    className="form-control"
                    type="text"
                    value={selectedApplication?.Resumption_Date || "N/A"}
                    disabled
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label">Leave balance</label>
                  <input
                    className="form-control"
                    type="text"
                    value={formData.leaveBalance}
                    disabled
                  />
                </div>
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label">Staff Name Relievers</label>
                  <input
                    className="form-control"
                    type="text"
                    value={selectedApplication?.Staff_Name_Relievers || "N/A"}
                    disabled
                  />
                </div>
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label">Staff No Relievers</label>
                  <input
                    className="form-control"
                    type="text"
                    value={selectedApplication?.Staff_No_Relievers || "N/A"}
                    disabled
                  />
                </div>
              </div>

              {isEditable && (
                <div className="row mt-4  text-center">
                  <div className="col-md-12 text-center">
                    <button
                      className="btn btn-primary  text-center"
                      onClick={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          />
                          Updating...
                        </>
                      ) : (
                        "Update Leave Application"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationHeader;
