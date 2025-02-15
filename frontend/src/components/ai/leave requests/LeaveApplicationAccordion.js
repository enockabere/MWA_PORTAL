import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faSpinner,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import "./LeaveApplicationAccordion.css"; // Import the custom CSS

// Sub-components
import LeaveDetails from "./LeaveDetails";
import RelieversList from "./RelieversList";
import AttachmentsList from "./AttachmentsList";

const LeaveApplicationAccordion = ({ approvals, refreshApprovals }) => {
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [actionMessage, setActionMessage] = useState("");
  const [leaveData, setLeaveData] = useState({});
  const [attachmentsData, setAttachmentsData] = useState([]);
  const [relieverData, setRelieverData] = useState([]);

  // Fetch leave details, attachments, and relievers
  const fetchLeaveDetails = async (documentNo) => {
    setLoading(true);
    try {
      const [leaveResponse, attachmentsResponse, relieversResponse] =
        await Promise.all([
          axios.get(`/selfservice/ApproveLeaveDetails/${documentNo}/`),
          axios.get(`/selfservice/FileUploadView/${documentNo}/`),
          axios.get(`/selfservice/FnLeaveReliever/${documentNo}/`),
        ]);

      setLeaveData(leaveResponse.data);
      setAttachmentsData(attachmentsResponse.data);
      const relievers = relieversResponse.data.map((item) => ({
        StaffName: item.StaffName,
      }));
      setRelieverData(relievers);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle accordion toggle
  const handleToggle = async (documentNo) => {
    if (expandedDoc === documentNo) {
      setExpandedDoc(null); // Collapse the accordion
    } else {
      setExpandedDoc(documentNo); // Expand the accordion
      await fetchLeaveDetails(documentNo); // Fetch data for the selected document
    }
  };

  // Handle approval or rejection
  const handleAction = async (documentNo, action) => {
    setActionLoading((prev) => ({ ...prev, [documentNo]: true }));
    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
      setActionMessage(
        `Leave application ${
          action === "approve" ? "approved" : "rejected"
        } successfully!`
      );
      await refreshApprovals(); // Refresh the approvals list
      setExpandedDoc(null); // Close the accordion
    } catch (error) {
      console.error("Error handling leave application action:", error);
      setActionMessage(
        `Failed to ${
          action === "approve" ? "approve" : "reject"
        } leave application.`
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [documentNo]: false }));
    }
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
              onClick={() => handleToggle(doc.DocumentNo)}
            >
              <span className="icon">
                {expandedDoc === doc.DocumentNo ? "▼" : "▶"}
              </span>
              <strong>{doc.DocumentType}</strong> | {doc.Sender_Name}
            </button>
          </p>
          {expandedDoc === doc.DocumentNo && (
            <div className="accordion-content">
              {loading ? (
                <p className="loading-text">Loading leave details...</p>
              ) : (
                <>
                  {/* Leave Details */}
                  <LeaveDetails data={leaveData} />

                  {/* Relievers List */}
                  <RelieversList data={relieverData} />

                  {/* Attachments List */}
                  <AttachmentsList data={attachmentsData} />

                  {/* Approve and Reject Buttons */}
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
                      onClick={() => handleAction(doc.DocumentNo, "reject")}
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

                  {/* Action Message */}
                  {actionMessage && (
                    <p className="action-message">{actionMessage}</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LeaveApplicationAccordion;
