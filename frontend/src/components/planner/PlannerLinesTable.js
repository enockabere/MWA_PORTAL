import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

const PlannerLinesTable = ({ data, onFetchSamples }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  const handleDeleteClick = (plan) => {
    console.log("Data:", data); // Log the entire data object
    console.log("Document_No:", plan.DocumentNo, "Line_No:", plan.LineNo); // Use the correct property names
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      // Use the DocumentNo and LineNo from the selectedPlan object
      const { DocumentNo, LineNo } = selectedPlan;

      // Pass the correct data in the POST request
      await axios.post(
        `/selfservice/FnLeavePlannerLine/${DocumentNo}/`,
        {
          lineNo: LineNo,
          MyAction: "delete",
          startDate: "2025-01-01T00:00:00.000Z",
          endDate: "2025-01-01T00:00:00.000Z",
        },
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      // Close the modal and fetch the updated data
      setShowModal(false);
      onFetchSamples(); // Use DocumentNo to fetch samples after deletion
      toast.success("Plan deleted successfully!");
    } catch (error) {
      toast.error(
        "Error deleting plan: " +
          (error.response?.data?.error || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3">
      <h4 className="my-3">Leave Planner Lines</h4>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Leave Period</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Days Planned</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.Leave_Period}</td>
              <td>{row.Start_Date}</td>
              <td>{row.End_Date}</td>
              <td>{row.Days_Planned}</td>
              <td>
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="text-danger cursor-pointer"
                  onClick={() => handleDeleteClick(row)}
                  style={{ cursor: "pointer" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this plan?</Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDeleteConfirm}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-border text-light" role="status"></div>
            ) : (
              "Delete"
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PlannerLinesTable;
