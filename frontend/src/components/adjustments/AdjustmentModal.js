import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import ApproversTable from "./ApproversTable";
import AdjLinesTable from "./AdjLinesTable";
import SubmitAdjustment from "./SubmitAdjustment";
import CancelApproval from "./CancelApproval";

const AdjustmentModal = ({
  selectedApplication,
  onClose,
  onApplicationSubmitted,
  onCancelSubmission,
}) => {
  const [linesData, setLinesData] = useState([]);
  const [approversData, setApproversData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLines = () => {
    axios
      .get(`/selfservice/LeaveAdjustmentLine/${selectedApplication.Code}/`)
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          Name: item.EmployeeName,
          LeaveType: item.LeaveCode,
          AdjEntryType: item.LeaveAdjEntryType,
          NewEntitlement: item.NewEntitlement,
          TransactionType: item.TransactionType,
        }));
        setLinesData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching relievers:", error);
      });
  };

  const fetchApprovers = () => {
    axios
      .get(`/selfservice/AdjustmentApprovers/${selectedApplication.Code}/`)
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          Name: item.ApproverID,
          Sequence: item.SequenceNo,
          ApprovalStatus: item.Status,
          ModifiedBy: item.Last_Modified_By_User_ID,
        }));
        setApproversData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching relievers:", error);
      });
  };

  useEffect(() => {
    if (selectedApplication) {
      setLinesData([]);
      setApproversData;
      setLoading(true);
      fetchLines();
      fetchApprovers();
    }
  }, [selectedApplication]);

  const onRelieverAdded = () => {
    fetchLines(); // Refresh table data after adding a new line
  };

  return (
    <div
      className="modal fade"
      id="bd-example-modal-xl"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="myLargeModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div
          className="modal-content"
          style={{ background: "linear-gradient(to right, #1c2833, #2b5e5e)" }}
        >
          <div className="modal-header border-0">
            <button
              className="btn-close btn-close-white py-0"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body dark-modal">
            <div
              className="row default-according style-1 faq-accordion"
              id="accordionoc"
            >
              <div className="col-xl-12 col-lg-12 col-md-12">
                <div className="card border border-primary">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                      <button
                        className="btn btn-link ps-0 text-white"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseicon"
                        aria-expanded="true"
                        aria-controls="collapseicon"
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
                        Leave Adjustment Details
                      </button>
                    </h5>
                  </div>
                  <div
                    className="collapse show"
                    id="collapseicon"
                    aria-labelledby="collapseicon"
                    data-bs-parent="#accordionoc"
                    style={{}}
                  >
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-12 p-2">
                          <div className="row my-2">
                            <div className="col-xl-4 col-sm-6">
                              <label
                                className="form-label"
                                htmlFor="leaveBalance"
                              >
                                Adjustment No.
                              </label>
                              <input
                                className="form-control"
                                id="leaveBalance"
                                type="text"
                                placeholder={
                                  selectedApplication
                                    ? selectedApplication.Code
                                    : "N/A"
                                }
                                disabled
                              />
                            </div>
                            <div className="col-xl-4 col-sm-6">
                              <label
                                className="form-label"
                                htmlFor="leaveBalance"
                              >
                                Maturity Date
                              </label>
                              <input
                                className="form-control"
                                id="leaveBalance"
                                type="text"
                                placeholder={
                                  selectedApplication
                                    ? selectedApplication.MaturityDate
                                    : "N/A"
                                }
                                disabled
                              />
                            </div>
                            <div className="col-xl-4 col-sm-6">
                              <label
                                className="form-label"
                                htmlFor="leaveBalance"
                              >
                                Employee Name
                              </label>
                              <input
                                className="form-control"
                                id="leaveBalance"
                                type="text"
                                value={
                                  selectedApplication
                                    ? selectedApplication.EnteredBy
                                    : "N/A"
                                }
                                disabled
                              />
                            </div>
                          </div>
                          <div className="row my-2">
                            <div className="col-xl-12 col-sm-12">
                              <label
                                className="form-label"
                                htmlFor="leaveBalance"
                              >
                                Description
                              </label>
                              <input
                                className="form-control"
                                id="leaveBalance"
                                type="text"
                                value={
                                  selectedApplication
                                    ? selectedApplication.Description
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
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <button
                        className="btn btn-link collapsed ps-0"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseicon4"
                        aria-expanded="false"
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
                        Leave Adjustment Lines
                      </button>
                    </h5>
                  </div>
                  <div
                    className="collapse"
                    id="collapseicon4"
                    data-bs-parent="#accordionoc"
                  >
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="card custom-statistics h-100">
                            {loading ? (
                              <Skeleton variant="rectangular" height={300} />
                            ) : (
                              <AdjLinesTable
                                data={linesData}
                                selectedApplication={selectedApplication}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {selectedApplication?.Status === "Pending Approval" && (
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">
                        <button
                          className="btn btn-link collapsed ps-0"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseicon3"
                          aria-expanded="false"
                          aria-controls="collapseicon2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="feather feather-help-circle"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12" y2="17"></line>
                          </svg>
                          Adjustment Approvers
                        </button>
                      </h5>
                    </div>
                    <div
                      className="collapse"
                      id="collapseicon3"
                      data-bs-parent="#accordionoc"
                    >
                      <div className="card-body">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="card custom-statistics h-100">
                              {loading ? (
                                <Skeleton variant="rectangular" height={300} />
                              ) : (
                                <ApproversTable data={approversData} />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-xl-3 mt-3 box-col-12">
                <div className="file-sidebar">
                  <div className="card">
                    <div className="card-body custom-scrollbar">
                      <ul>
                        {selectedApplication?.Status === "Open" && (
                          <li>
                            <SubmitAdjustment
                              Id={selectedApplication?.Code}
                              onApplicationSubmitted={onApplicationSubmitted}
                              onClose={onClose}
                            />
                          </li>
                        )}
                        {selectedApplication?.Status === "Pending Approval" && (
                          <li>
                            <CancelApproval
                              Id={selectedApplication?.Code}
                              onCancelSubmission={onCancelSubmission}
                              onClose={onClose}
                            />
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentModal;
