import React, { useState } from "react";
import axios from "axios"; // Import axios for making HTTP requests
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons"; // Import specific icons
import "./PendingApprovalsAccordion.css"; // Import the custom CSS

const PendingApprovalsAccordion = ({ approvals, refreshApprovals }) => {
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [timesheetData, setTimesheetData] = useState({});
  const [timesheetLinesData, setTimesheetLinesData] = useState({}); // State for timesheet entries
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [actionLoading, setActionLoading] = useState({}); // Loading state for approve/reject actions
  const [rejectionComment, setRejectionComment] = useState(""); // State for rejection comments
  const [actionMessage, setActionMessage] = useState(""); // State for action success/error messages
  const [showRejectInput, setShowRejectInput] = useState(false); // State to control visibility of reject input

  // Fetch timesheet data and entries when an accordion is opened
  const fetchTimesheetData = async (documentNo) => {
    setLoading(true);
    try {
      console.log(`Fetching data for DocumentNo: ${documentNo}`); // Log the document number

      // Fetch both timesheet header and entries concurrently
      const [timesheetResponse, timesheetLinesResponse] = await Promise.all([
        axios.get(`/selfservice/get-timesheet-header/${documentNo}/`),
        axios.get(`/selfservice/get-timesheet-entries/${documentNo}/`),
      ]);

      console.log("Timesheet Header Response:", timesheetResponse.data); // Log the header response
      console.log("Timesheet Entries Response:", timesheetLinesResponse.data); // Log the entries response

      // Set timesheet header data
      setTimesheetData((prev) => ({
        ...prev,
        [documentNo]: timesheetResponse.data || null,
      }));

      // Process and set timesheet entries
      const timesheetLines = Array.isArray(timesheetLinesResponse.data)
        ? timesheetLinesResponse.data.map((item) => ({
            Date: item.Date,
            Weekend: item.Weekend,
            Holiday: item.Holiday,
            LeaveDay: item.LeaveDay,
            HoursWorked: item.HoursWorked,
          }))
        : [];

      setTimesheetLinesData((prev) => ({
        ...prev,
        [documentNo]: timesheetLines,
      }));

      if (!timesheetLines.length) {
        console.warn("No timesheet lines found or data is not an array.");
      }
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle accordion toggle
  const handleToggle = async (document) => {
    const { DocumentNo } = document;

    if (expandedDoc === DocumentNo) {
      // Collapse the currently expanded accordion
      setExpandedDoc(null);
      sessionStorage.removeItem("selectedDocument");
    } else {
      // Expand the new accordion
      setExpandedDoc(DocumentNo);
      sessionStorage.setItem(
        "selectedDocument",
        JSON.stringify({ DocumentNo, DocumentType: document.DocumentType })
      );

      // Fetch timesheet details and entries if not already fetched
      if (!timesheetData[DocumentNo] || !timesheetLinesData[DocumentNo]) {
        await fetchTimesheetData(DocumentNo);
      }
    }
  };

  // Handle approval or rejection
  const handleAction = async (documentNo, action) => {
    const selectedApproval = approvals.find(
      (approval) => approval.DocumentNo === documentNo
    );

    if (!selectedApproval) {
      console.error("Selected approval not found.");
      return;
    }

    const formData = {
      TableID: selectedApproval.TableID,
      Entry_No_: selectedApproval.Entry_No_,
      statusApproveRejectDelegate: action === "approve" ? "approve" : "reject",
      approvalComment: action === "reject" ? rejectionComment : "",
    };

    try {
      setActionLoading((prev) => ({ ...prev, [documentNo]: true })); // Set loading state for this document
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];

      const response = await axios.post(
        `/selfservice/FnActionApprovals/${documentNo}/`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        }
      );

      if (response.data) {
        setActionMessage(
          `Timesheet ${
            action === "approve" ? "approved" : "rejected"
          } successfully!`
        );
        // Refresh the approvals list
        await refreshApprovals();
        // Close the accordion
        setExpandedDoc(null);
        // Reset rejection input and visibility
        setRejectionComment("");
        setShowRejectInput(false);
      }
    } catch (error) {
      console.error(
        `Error ${action === "approve" ? "approving" : "rejecting"} timesheet:`,
        error
      );
      setActionMessage(
        `Failed to ${action === "approve" ? "approve" : "reject"} timesheet.`
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [documentNo]: false })); // Reset loading state for this document
    }
  };

  // Toggle rejection comments input
  const toggleRejectInput = () => {
    setShowRejectInput((prev) => !prev);
  };

  return (
    <div className="accordion-container">
      {approvals.map((doc, index) => (
        <div className="accordion-item" key={index}>
          <p className="accordion-header">
            <button
              className={`accordion-button ${
                expandedDoc === doc.DocumentNo ? "open" : ""
              }`}
              type="button"
              onClick={() => handleToggle(doc)}
            >
              <span className="icon">
                {expandedDoc === doc.DocumentNo ? "▼" : "▶"}
              </span>
              <strong>{doc.DocumentType}</strong> | {doc.Sender_Name}
            </button>
          </p>
          {expandedDoc === doc.DocumentNo && (
            <div className="accordion-content">
              <p>
                <strong>Document No:</strong> {doc.DocumentNo}
              </p>
              <p>
                <strong>Due Date:</strong> {doc.Due_Date}
              </p>

              {loading ? (
                <p className="loading-text">Loading timesheet details...</p>
              ) : timesheetData[doc.DocumentNo] ? (
                <div className="timesheet-details">
                  <h6>Timesheet Details</h6>
                  <hr />
                  <p>
                    <strong>Employee Name:</strong>{" "}
                    {timesheetData[doc.DocumentNo].EmployeeName}
                  </p>
                  <p>
                    <strong>Designation:</strong>{" "}
                    {timesheetData[doc.DocumentNo].EmployeeDesignation}
                  </p>
                  <p>
                    <strong>Department:</strong>{" "}
                    {timesheetData[doc.DocumentNo].Global_Dimension_2_Code}
                  </p>
                  <p>
                    <strong>Supervisor:</strong>{" "}
                    {timesheetData[doc.DocumentNo].SupervisorName}
                  </p>
                  <p>
                    <strong>Period:</strong>{" "}
                    {timesheetData[doc.DocumentNo].PeriodStartDate} -{" "}
                    {timesheetData[doc.DocumentNo].PeriodEndDate}
                  </p>

                  {/* Display Timesheet Entries */}
                  <h6>Timesheet Entries</h6>
                  <hr />
                  {timesheetLinesData[doc.DocumentNo]?.length > 0 ? (
                    <table className="timesheet-entries-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Weekend</th>
                          <th>Holiday</th>
                          <th>Leave Day</th>
                          <th>Hours Worked</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timesheetLinesData[doc.DocumentNo].map(
                          (entry, idx) => (
                            <tr key={idx}>
                              <td>{entry.Date}</td>
                              <td>{entry.Weekend ? "Yes" : "No"}</td>
                              <td>{entry.Holiday ? "Yes" : "No"}</td>
                              <td>{entry.LeaveDay ? "Yes" : "No"}</td>
                              <td>{entry.HoursWorked}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <p className="error-text">
                      No timesheet entries available.
                    </p>
                  )}

                  {/* Approve and Reject Buttons */}
                  {doc.Status === "Open" && (
                    <div className="action-buttons">
                      <button
                        className="btn btn-primary approve-button"
                        onClick={() => handleAction(doc.DocumentNo, "approve")}
                        disabled={actionLoading[doc.DocumentNo]}
                      >
                        {actionLoading[doc.DocumentNo] ? (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faCheck} /> Approve
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-danger reject-button"
                        onClick={toggleRejectInput}
                        disabled={actionLoading[doc.DocumentNo]}
                      >
                        {actionLoading[doc.DocumentNo] ? (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faTimes} /> Reject
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Rejection Comments Input (Conditional) */}
                  {showRejectInput && (
                    <div className="reject-section">
                      <input
                        type="text"
                        placeholder="Enter rejection comments"
                        value={rejectionComment}
                        onChange={(e) => setRejectionComment(e.target.value)}
                      />
                      <button
                        className="btn btn-danger reject-confirm-button"
                        onClick={() => handleAction(doc.DocumentNo, "reject")}
                        disabled={actionLoading[doc.DocumentNo]}
                      >
                        {actionLoading[doc.DocumentNo] ? (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faTimes} /> Confirm Reject
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Action Message */}
                  {actionMessage && (
                    <p className="action-message">{actionMessage}</p>
                  )}
                </div>
              ) : (
                <p className="error-text">No data available.</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PendingApprovalsAccordion;
