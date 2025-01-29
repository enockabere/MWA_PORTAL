import React, { useEffect, useState } from "react";
import axios from "axios";
import LeaveData from "./LeaveData";
import AdjustmentData from "./AdjustmentData";
import RecallData from "./RecallData";
import ApproveDocument from "./ApproveDocument";
import RejectDocument from "./RejectDocument";

const ApprovalModal = ({
  selectedApplication,
  onApplicationSubmitted,
  onCancelSubmission,
}) => {
  const [relieverData, setRelieverData] = useState([]);
  const [attachments, setAttachmentsData] = useState([]);
  const [leaveData, setLeaveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adjustmentData, setAdjustmentData] = useState([]);
  const [AdjustmentLinesData, setAdjustmentLinesData] = useState([]);
  const [recallData, setRecallData] = useState([]);

  const fetchLeaveDetails = async () => {
    try {
      const [leaveResponse, attachmentsResponse, relieversResponse] =
        await Promise.all([
          axios.get(
            `/selfservice/ApproveLeaveDetails/${selectedApplication.DocumentNo}/`
          ),
          axios.get(
            `/selfservice/FileUploadView/${selectedApplication.DocumentNo}/`
          ),
          axios.get(
            `/selfservice/FnLeaveReliever/${selectedApplication.DocumentNo}/`
          ),
        ]);

      setLeaveData(leaveResponse.data);
      setAttachmentsData(attachmentsResponse.data);
      const relievers = relieversResponse.data.map((item) => ({
        LeaveCode: item.LeaveCode,
        StaffNo: item.StaffNo,
        StaffName: item.StaffName,
        Section: item.ShortcutDimension2Code,
      }));
      setRelieverData(relievers);
      console.log("Reliever Data:", relievers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchAdjustmentDetails = async () => {
    try {
      const [AdjustmentResponse, AdjustmentLinesResponse] = await Promise.all([
        axios.get(
          `/selfservice/ApproveAdjustmentDetails/${selectedApplication.DocumentNo}/`
        ),
        axios.get(
          `/selfservice/LeaveAdjustmentLine/${selectedApplication.DocumentNo}/`
        ),
      ]);

      setAdjustmentData(AdjustmentResponse.data);

      const adjustmentLines = Array.isArray(AdjustmentLinesResponse.data.data)
        ? AdjustmentLinesResponse.data.data.map((item) => ({
            EmployeeName: item.EmployeeName,
            LeaveCode: item.LeaveCode,
            LeaveAdjEntryType: item.LeaveAdjEntryType,
            NewEntitlement: item.NewEntitlement,
            TransactionType: item.TransactionType,
          }))
        : [];

      if (!adjustmentLines.length) {
        console.warn("No adjustment lines found or data is not an array.");
      }

      setAdjustmentLinesData(adjustmentLines);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchRecallDetails = async () => {
    try {
      const RecallResponse = await axios.get(
        `/selfservice/ApproveRecallDetails/${selectedApplication.DocumentNo}/`
      );

      setRecallData(RecallResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedApplication?.DocumentType === "LeaveApplication") {
      setLoading(true);
      setRelieverData([]);
      setAttachmentsData([]);
      setLeaveData(null);
      fetchLeaveDetails();
    } else if (selectedApplication?.DocumentType === "LeaveAdjustment") {
      setLoading(true);
      setAdjustmentData(null);
      setAdjustmentLinesData([]);
      fetchAdjustmentDetails();
    } else if (selectedApplication?.DocumentType === "Leave Recall") {
      setLoading(true);
      setRecallData(null);
      fetchRecallDetails();
    }
  }, [selectedApplication]);

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
                        {selectedApplication?.DocumentType ===
                        "LeaveApplication"
                          ? "Leave"
                          : selectedApplication?.DocumentType ===
                            "LeaveAdjustment"
                          ? "Leave Adjustment"
                          : selectedApplication?.DocumentType === "Leave Recall"
                          ? "Leave Recall"
                          : ""}{" "}
                        Approval
                      </button>
                    </h5>
                  </div>
                  <div
                    className="collapse show"
                    id="collapseicon"
                    aria-labelledby="collapseicon"
                    data-bs-parent="#accordionoc"
                  >
                    <div className="card-body">
                      {loading ? (
                        <p>Loading...</p>
                      ) : (
                        <div className="container">
                          {selectedApplication?.DocumentType ===
                            "LeaveApplication" && (
                            <div>
                              <div className="row">
                                <div className="col-md-12">
                                  <LeaveData data={leaveData} />
                                </div>
                              </div>
                              <div className="row my-3">
                                <div className="col-xl-4 col-md-6 box-col-4">
                                  <div className="card bg-primary">
                                    <div className="card-body">
                                      <div className="d-flex faq-widgets">
                                        <div className="flex-grow-1">
                                          <h4>Leave Relievers</h4>
                                          <ul className="list-group list-group-flush">
                                            {relieverData.map(
                                              (reliever, index) => (
                                                <li
                                                  className="list-group-item"
                                                  key={index}
                                                >
                                                  <i className="icofont icofont-arrow-right">
                                                    {" "}
                                                  </i>
                                                  {reliever.StaffName}
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        </div>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="feather feather-user"
                                        >
                                          <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                          <circle cx="12" cy="7" r="4"></circle>
                                          <path d="M16 3h6a2 2 0 0 1 2 2v6h-8z"></path>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {attachments && attachments.length > 0 && (
                                  <div className="col-xl-4 col-md-6 box-col-4">
                                    <div className="card bg-primary">
                                      <div className="card-body">
                                        <div className="d-flex faq-widgets">
                                          <div className="flex-grow-1">
                                            <h4>Leave Attachments</h4>
                                            <ul>
                                              {attachments.map(
                                                (attachment, index) => (
                                                  <li key={index}>
                                                    {attachment}
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-paperclip"
                                          >
                                            <path d="M15.621 9.379l-6.97 6.97a3 3 0 0 1-4.242-4.243L8.9 8.9a1 1 0 0 1 1.414 1.414l-4.95 4.95a1 1 0 0 0 1.414 1.415l6.97-6.97a5 5 0 0 1 7.071 7.071l-6.97 6.97a5 5 0 0 1-7.071-7.071z"></path>
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {selectedApplication?.DocumentType ===
                            "LeaveAdjustment" && (
                            <div>
                              <div className="row">
                                <div className="col-md-12">
                                  <AdjustmentData data={adjustmentData} />
                                </div>
                              </div>
                              <div className="row my-3">
                                <div className="col-xl-12">
                                  <div className="card bg-primary">
                                    <div className="card-body">
                                      <div className="d-flex faq-widgets">
                                        <div className="flex-grow-1">
                                          <h4>Leave Adjusment Lines</h4>
                                          <table className="table table-striped">
                                            <thead>
                                              <tr>
                                                <th>Employee Name</th>
                                                <th>Leave Code</th>
                                                <th>Entry Type</th>
                                                <th>New Entitlement</th>
                                                <th>Transaction Type</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {AdjustmentLinesData.map(
                                                (line, index) => (
                                                  <tr key={index}>
                                                    <td>{line.EmployeeName}</td>
                                                    <td>{line.LeaveCode}</td>
                                                    <td>
                                                      {line.LeaveAdjEntryType}
                                                    </td>
                                                    <td>
                                                      {line.NewEntitlement}
                                                    </td>
                                                    <td>
                                                      {line.TransactionType}
                                                    </td>
                                                  </tr>
                                                )
                                              )}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {selectedApplication?.DocumentType ===
                            "Leave Recall" && (
                            <div>
                              <div className="row">
                                <div className="col-md-12">
                                  <RecallData data={recallData} />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xl-12 box-col-12">
                <div className="card">
                  <div className="card-body">
                    {selectedApplication?.Status === "Open" && (
                      <div className="row">
                        <div className="col-md-3">
                          <ApproveDocument
                            Id={selectedApplication?.DocumentNo}
                            TableID={selectedApplication?.TableID}
                            Entry_No_={selectedApplication?.Entry_No_}
                            statusApproveRejectDelegate="Approve"
                            approvalComment=""
                            DocumentType={selectedApplication?.DocumentType}
                            onApplicationSubmitted={onApplicationSubmitted}
                          />
                        </div>
                        <div className="col-md-5">
                          <RejectDocument
                            Id={selectedApplication?.DocumentNo}
                            TableID={selectedApplication?.TableID}
                            Entry_No_={selectedApplication?.Entry_No_}
                            statusApproveRejectDelegate="Reject"
                            DocumentType={selectedApplication?.DocumentType}
                            onCancelSubmission={onCancelSubmission}
                          />
                        </div>
                        <div className="col-md-4"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Additional Content */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
