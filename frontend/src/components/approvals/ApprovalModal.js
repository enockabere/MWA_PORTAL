import React, { useEffect, useState } from "react";
import axios from "axios";
import LeaveData from "./LeaveData";
import AdjustmentData from "./AdjustmentData";
import RecallData from "./RecallData";
import ApproveDocument from "./ApproveDocument";
import RejectDocument from "./RejectDocument";
import TimesheetData from "./TimesheetData";
import TimesheetEntries from "./TimesheetEntries";
import LeaveRelieversAndAttachments from "./LeaveRelieversAndAttachments";
import LeaveAdjustmentLines from "./LeaveAdjustmentLines";
import { Modal, Button, Spinner } from "react-bootstrap";

const ApprovalModal = ({
  selectedApplication,
  onApplicationSubmitted,
  onCancelSubmission,
  show,
  onHide,
}) => {
  const [relieverData, setRelieverData] = useState([]);
  const [attachments, setAttachmentsData] = useState([]);
  const [leaveData, setLeaveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adjustmentData, setAdjustmentData] = useState([]);
  const [AdjustmentLinesData, setAdjustmentLinesData] = useState([]);
  const [recallData, setRecallData] = useState([]);
  const [timesheetData, setTimesheetData] = useState([]);
  const [timesheetLinesData, setTimesheetLinesData] = useState([]);

  // Reset all states when the modal is closed or when selectedApplication changes
  useEffect(() => {
    return () => {
      setRelieverData([]);
      setAttachmentsData([]);
      setLeaveData(null);
      setAdjustmentData([]);
      setAdjustmentLinesData([]);
      setRecallData([]);
      setTimesheetData([]);
      setTimesheetLinesData([]);
      setLoading(true);
    };
  }, [selectedApplication]);

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

  const fetchTimesheetDetails = async () => {
    try {
      const [TimesheetResponse, TimesheetLinesResponse] = await Promise.all([
        axios.get(
          `/selfservice/get-timesheet-header/${selectedApplication.DocumentNo}/`
        ),
        axios.get(
          `/selfservice/get-timesheet-entries/${selectedApplication.DocumentNo}/`
        ),
      ]);

      setTimesheetData(TimesheetResponse.data);

      const timesheetLines = Array.isArray(TimesheetLinesResponse.data)
        ? TimesheetLinesResponse.data.map((item) => ({
            Date: item.Date,
            Weekend: item.Weekend,
            Holiday: item.Holiday,
            LeaveDay: item.LeaveDay,
            HoursWorked: item.HoursWorked,
          }))
        : [];

      if (!timesheetLines.length) {
        console.warn("No timesheet lines found or data is not an array.");
      }

      setTimesheetLinesData(timesheetLines);
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
    if (selectedApplication) {
      setLoading(true); // Set loading to true when a new application is selected

      if (selectedApplication.DocumentType === "LeaveApplication") {
        fetchLeaveDetails();
      } else if (selectedApplication.DocumentType === "LeaveAdjustment") {
        fetchAdjustmentDetails();
      } else if (selectedApplication.DocumentType === "Leave Recall") {
        fetchRecallDetails();
      } else if (selectedApplication.DocumentType === "TimeSheet") {
        fetchTimesheetDetails();
      }
    }
  }, [selectedApplication]);

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header
        closeButton
        style={{ border: "none" }}
        className={
          selectedApplication?.Status === "Open"
            ? "bg-primary text-white"
            : selectedApplication?.Status === "Canceled"
            ? "bg-secondary text-white"
            : selectedApplication?.Status === "Approved"
            ? "bg-success text-white"
            : selectedApplication?.Status === "Rejected"
            ? "bg-danger text-white"
            : "bg-primary text-white"
        }
      >
        <Modal.Title>
          <h5 className="text-white">
            {selectedApplication?.DocumentType === "LeaveApplication"
              ? "Leave"
              : selectedApplication?.DocumentType === "LeaveAdjustment"
              ? "Leave Adjustment"
              : selectedApplication?.DocumentType === "TimeSheet"
              ? "TimeSheet"
              : selectedApplication?.DocumentType === "Leave Recall"
              ? "Leave Recall"
              : ""}{" "}
            Approval
          </h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="dark-modal">
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p>Loading data...</p>
            </div>
          ) : (
            <>
              <div className="row default-according style-1 faq-accordion">
                <div className="col-xl-12 col-lg-12 col-md-12">
                  <div
                    className={
                      selectedApplication?.Status === "Open"
                        ? "card border border-primary"
                        : selectedApplication?.Status === "Canceled"
                        ? "card border border-secondary"
                        : selectedApplication?.Status === "Approved"
                        ? "card border border-success"
                        : selectedApplication?.Status === "Rejected"
                        ? "card border border-danger"
                        : "card border border-primary"
                    }
                  >
                    <div
                      className={
                        selectedApplication?.Status === "Open"
                          ? "card-header text-white bg-primary"
                          : selectedApplication?.Status === "Canceled"
                          ? "card-header text-white bg-secondary"
                          : selectedApplication?.Status === "Approved"
                          ? "card-header text-white bg-success"
                          : selectedApplication?.Status === "Rejected"
                          ? "card-header text-white bg-danger"
                          : "card-header text-white bg-primary"
                      }
                    >
                      <h6 className="mb-0">
                        <Button
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
                            : selectedApplication?.DocumentType === "TimeSheet"
                            ? "TimeSheet"
                            : selectedApplication?.DocumentType ===
                              "Leave Recall"
                            ? "Leave Recall"
                            : ""}{" "}
                          Approval
                        </Button>
                      </h6>
                    </div>
                    <div
                      className="collapse show"
                      id="collapseicon"
                      aria-labelledby="collapseicon"
                      data-bs-parent="#accordionoc"
                    >
                      <div className="card-body">
                        {selectedApplication?.DocumentType ===
                          "LeaveApplication" && (
                          <div>
                            <div className="row">
                              <div className="col-md-12">
                                <LeaveData data={leaveData} />
                              </div>
                            </div>
                            <LeaveRelieversAndAttachments
                              relieverData={relieverData}
                              attachments={attachments}
                            />
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
                            <LeaveAdjustmentLines
                              AdjustmentLinesData={AdjustmentLinesData}
                            />
                          </div>
                        )}
                        {selectedApplication?.DocumentType === "TimeSheet" && (
                          <div>
                            <div className="row">
                              <div className="col-md-12">
                                <TimesheetData data={timesheetData} />
                              </div>
                            </div>
                            <TimesheetEntries
                              timesheetLinesData={timesheetLinesData}
                              loading={loading}
                            />
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
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ApprovalModal;
