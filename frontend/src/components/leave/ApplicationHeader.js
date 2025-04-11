import React from "react";

const ApplicationHeader = ({ selectedApplication }) => {
  return (
    <div className="card">
      <div className="card-header">
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
                  <label className="form-label" htmlFor="leaveBalance">
                    Application No.
                  </label>
                  <input
                    className="form-control"
                    id="leaveBalance"
                    type="text"
                    placeholder={
                      selectedApplication
                        ? selectedApplication.Application_No
                        : "N/A"
                    }
                    disabled
                  />
                </div>
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label" htmlFor="leaveBalance">
                    Application Date
                  </label>
                  <input
                    className="form-control"
                    id="leaveBalance"
                    type="text"
                    placeholder={
                      selectedApplication
                        ? selectedApplication.Application_Date
                        : "N/A"
                    }
                    disabled
                  />
                </div>
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label" htmlFor="leaveBalance">
                    Employee Name
                  </label>
                  <input
                    className="form-control"
                    id="leaveBalance"
                    type="text"
                    value={
                      selectedApplication
                        ? selectedApplication.Employee_Name
                        : "N/A"
                    }
                    disabled
                  />
                </div>
              </div>
              <div className="row my-2">
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label" htmlFor="leaveBalance">
                    Leave Period
                  </label>
                  <input
                    className="form-control"
                    id="leaveBalance"
                    type="text"
                    value={
                      selectedApplication
                        ? selectedApplication.Leave_Period
                        : "N/A"
                    }
                    disabled
                  />
                </div>
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label" htmlFor="leaveBalance">
                    Leave Code
                  </label>
                  <input
                    className="form-control"
                    id="leaveBalance"
                    type="text"
                    value={
                      selectedApplication
                        ? selectedApplication.Leave_Code
                        : "N/A"
                    }
                    disabled
                  />
                </div>
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label" htmlFor="leaveBalance">
                    Status
                  </label>
                  <input
                    className="form-control"
                    id="leaveBalance"
                    type="text"
                    value={
                      selectedApplication ? selectedApplication.Status : "N/A"
                    }
                    disabled
                  />
                </div>
              </div>
              <div className="row my-2">
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label" htmlFor="leaveBalance">
                    Leave Start Date
                  </label>
                  <input
                    className="form-control"
                    id="leaveBalance"
                    type="text"
                    value={
                      selectedApplication
                        ? selectedApplication.Planner_Start_Date
                        : "N/A"
                    }
                    disabled
                  />
                </div>
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label" htmlFor="leaveBalance">
                    Days Applied
                  </label>
                  <input
                    className="form-control"
                    id="leaveBalance"
                    type="text"
                    value={
                      selectedApplication
                        ? selectedApplication.Days_Applied
                        : "N/A"
                    }
                    disabled
                  />
                </div>
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label" htmlFor="leaveBalance">
                    Resumption Date
                  </label>
                  <input
                    className="form-control"
                    id="leaveBalance"
                    type="text"
                    value={
                      selectedApplication
                        ? selectedApplication.Resumption_Date
                        : "N/A"
                    }
                    disabled
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label" htmlFor="leaveBalance">
                    Leave balance
                  </label>
                  <input
                    className="form-control"
                    id="leaveBalance"
                    type="text"
                    value={
                      selectedApplication
                        ? selectedApplication.Leave_balance
                        : "N/A"
                    }
                    disabled
                  />
                </div>
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label" htmlFor="leaveBalance">
                    Staff Name Relievers
                  </label>
                  <input
                    className="form-control"
                    id="leaveBalance"
                    type="text"
                    value={
                      selectedApplication
                        ? selectedApplication.Staff_Name_Relievers
                        : "N/A"
                    }
                    disabled
                  />
                </div>
                <div className="col-xl-4 col-sm-6">
                  <label className="form-label" htmlFor="leaveBalance">
                    Staff No Relievers
                  </label>
                  <input
                    className="form-control"
                    id="leaveBalance"
                    type="text"
                    value={
                      selectedApplication
                        ? selectedApplication.Staff_No_Relievers
                        : "N/A"
                    }
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationHeader;
