import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import RelieversTable from "./RelieversTable";
import AttachmentsTable from "./AttachmentsTable";
import ApproversTable from "./ApproversTable";
import SubmitLeave from "./SubmitLeave";
import CancelApproval from "./CancelApproval";
import Preloader from "../Layout/Preloader";
import { ToastContainer } from "react-toastify";

const ApplicationModal = ({
  selectedApplication,
  onClose,
  refreshApplications,
}) => {
  const [relieverData, setRelieverData] = useState([]);
  const [attachments, setAttachmentsData] = useState([]);
  const [approversData, setApproversData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRelievers = () => {
    axios
      .get(
        `/selfservice/FnLeaveReliever/${selectedApplication.Application_No}/`
      )
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          LeaveCode: item.LeaveCode,
          StaffNo: item.StaffNo,
          StaffName: item.StaffName,
          Section: item.ShortcutDimension2Code,
        }));
        setRelieverData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching relievers:", error);
      });
  };

  const fetchAttachments = () => {
    axios
      .get(`/selfservice/FileUploadView/${selectedApplication.Application_No}/`)
      .then((response) => {
        const attachmentsData = response.data;
        setAttachmentsData(attachmentsData);
      })
      .catch((error) => {
        console.error("Error fetching relievers:", error);
      });
  };

  const fetchApprovers = () => {
    axios
      .get(`/selfservice/LeaveApprovers/${selectedApplication.Application_No}/`)
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
      setRelieverData([]);
      setAttachmentsData([]);
      setApproversData;
      setLoading(true);
      fetchRelievers();
      fetchAttachments();
      fetchApprovers();
    }
  }, [selectedApplication]);

  const onRelieverAdded = () => {
    fetchRelievers(); // Refresh table data after adding a new line
  };

  const onAttachmentAdd = () => {
    fetchAttachments();
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
          <div className="modal-header  border-0">
            <button
              className="btn-close btn-close-white py-0"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body dark-modal">
            <div className="row">
              <div
                className="row default-according style-1 faq-accordion"
                id="accordionoc"
              >
                <div className="col-xl-12 col-lg-12 col-md-12">
                  <ToastContainer />
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
                                <label
                                  className="form-label"
                                  htmlFor="leaveBalance"
                                >
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
                                <label
                                  className="form-label"
                                  htmlFor="leaveBalance"
                                >
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
                                      ? selectedApplication.Employee_Name
                                      : "N/A"
                                  }
                                  disabled
                                />
                              </div>
                            </div>
                            <div className="row my-2">
                              <div className="col-xl-4 col-sm-6">
                                <label
                                  className="form-label"
                                  htmlFor="leaveBalance"
                                >
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
                                <label
                                  className="form-label"
                                  htmlFor="leaveBalance"
                                >
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
                                <label
                                  className="form-label"
                                  htmlFor="leaveBalance"
                                >
                                  Status
                                </label>
                                <input
                                  className="form-control"
                                  id="leaveBalance"
                                  type="text"
                                  value={
                                    selectedApplication
                                      ? selectedApplication.Status
                                      : "N/A"
                                  }
                                  disabled
                                />
                              </div>
                            </div>
                            <div className="row my-2">
                              <div className="col-xl-4 col-sm-6">
                                <label
                                  className="form-label"
                                  htmlFor="leaveBalance"
                                >
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
                                <label
                                  className="form-label"
                                  htmlFor="leaveBalance"
                                >
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
                                <label
                                  className="form-label"
                                  htmlFor="leaveBalance"
                                >
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
                                <label
                                  className="form-label"
                                  htmlFor="leaveBalance"
                                >
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
                                <label
                                  className="form-label"
                                  htmlFor="leaveBalance"
                                >
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
                                <label
                                  className="form-label"
                                  htmlFor="leaveBalance"
                                >
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
                  {/* First Accordion */}
                  <div className="card border border-primary my-3">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">
                        <button
                          className="btn btn-link ps-0 text-white"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseRelievers"
                          aria-expanded="false"
                          aria-controls="collapseRelievers"
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
                          Leave Relievers
                        </button>
                      </h5>
                    </div>
                    <div
                      id="collapseRelievers"
                      className="collapse"
                      aria-labelledby="collapseRelievers"
                      data-bs-parent="#accordion"
                    >
                      <div className="card-body">
                        {loading ? (
                          <Preloader message="Loading page contents, please wait..." />
                        ) : (
                          <RelieversTable
                            data={relieverData}
                            selectedApplication={selectedApplication}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Second Accordion */}
                  {attachments && attachments.length > 0 && (
                    <div className="card border border-primary">
                      <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">
                          <button
                            className="btn btn-link ps-0 text-white"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseAttachments"
                            aria-expanded="false"
                            aria-controls="collapseAttachments"
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
                            Leave Attachments
                          </button>
                        </h5>
                      </div>
                      <div
                        id="collapseAttachments"
                        className="collapse"
                        aria-labelledby="collapseAttachments"
                        data-bs-parent="#accordion"
                      >
                        <div className="card-body">
                          {loading ? (
                            <Skeleton variant="rectangular" height={300} />
                          ) : (
                            <AttachmentsTable
                              attachments={attachments}
                              selectedApplication={selectedApplication}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedApplication?.Status === "Pending Approval" && (
                    <div className="card border border-primary">
                      <div className="card-header bg-primary text-white">
                        <h5 className="mb-0">
                          <button
                            className="btn btn-link ps-0 text-white"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseApprover"
                            aria-expanded="false"
                            aria-controls="collapseApprover"
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
                            Leave Approver
                          </button>
                        </h5>
                      </div>
                      <div
                        id="collapseApprover"
                        className="collapse"
                        aria-labelledby="collapseApprover"
                        data-bs-parent="#accordion"
                      >
                        <div className="card-body">
                          {loading ? (
                            <Skeleton variant="rectangular" height={300} />
                          ) : (
                            <ApproversTable data={approversData} />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-xl-12 box-col-12">
                <div className="file-sidebar">
                  <div className="card">
                    <div className="card-body custom-scrollbar">
                      <ul>
                        {selectedApplication?.Status === "Open" && (
                          <li>
                            <SubmitLeave
                              Id={selectedApplication?.Application_No}
                              refreshApplications={refreshApplications}
                              onClose={onClose}
                            />
                          </li>
                        )}
                        {selectedApplication?.Status === "Rejected" && (
                          <li>
                            <SubmitLeave
                              Id={selectedApplication?.Application_No}
                              refreshApplications={refreshApplications}
                              onClose={onClose}
                            />
                          </li>
                        )}
                        {selectedApplication?.Status === "Pending Approval" && (
                          <li>
                            <CancelApproval
                              Id={selectedApplication?.Application_No}
                              refreshApplications={refreshApplications}
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

export default ApplicationModal;
