import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import "./LeaveAdjustmentAccordion.css"; // Import the custom CSS

// Sub-components
import AdjustmentDetails from "./AdjustmentDetails";
import AdjustmentLines from "./AdjustmentLines";

const LeaveAdjustmentAccordion = ({ approvals, refreshApprovals }) => {
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [actionMessage, setActionMessage] = useState("");
  const [adjustmentData, setAdjustmentData] = useState({});
  const [adjustmentLinesData, setAdjustmentLinesData] = useState([]);

  // Fetch adjustment details and lines
  const fetchAdjustmentDetails = async (documentNo) => {
    setLoading(true);
    try {
      const [AdjustmentResponse, AdjustmentLinesResponse] = await Promise.all([
        axios.get(`/selfservice/ApproveAdjustmentDetails/${documentNo}/`),
        axios.get(`/selfservice/LeaveAdjustmentLine/${documentNo}/`),
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

      setAdjustmentLinesData(adjustmentLines);
    } catch (error) {
      console.error("Error fetching adjustment data:", error);
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
      await fetchAdjustmentDetails(documentNo); // Fetch data for the selected document
    }
  };

  // Handle approval or rejection
  const handleAction = async (documentNo, action) => {
    setActionLoading((prev) => ({ ...prev, [documentNo]: true }));
    try {
      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
      setActionMessage(
        `Leave adjustment ${
          action === "approve" ? "approved" : "rejected"
        } successfully!`
      );
      await refreshApprovals(); // Refresh the approvals list
      setExpandedDoc(null); // Close the accordion
    } catch (error) {
      console.error("Error handling leave adjustment action:", error);
      setActionMessage(
        `Failed to ${
          action === "approve" ? "approve" : "reject"
        } leave adjustment.`
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
                <p className="loading-text">Loading adjustment details...</p>
              ) : (
                <>
                  {/* Adjustment Details */}
                  <AdjustmentDetails data={adjustmentData} />

                  {/* Adjustment Lines */}
                  <AdjustmentLines data={adjustmentLinesData} />

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

export default LeaveAdjustmentAccordion;
