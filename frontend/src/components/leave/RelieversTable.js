import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const RelieversTable = ({ data, selectedApplication, onRelieverAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReliever, setSelectedReliever] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReliever, setEditingReliever] = useState(null);

  const baseColumns = [
    { name: "StaffNo", label: "Staff No." },
    { name: "LeaveCode", label: "Leave Code" },
    { name: "StaffName", label: "Staff Name" },
    { name: "Section", label: "Section" },
  ];

  // Add action column only when status is "Open"
  const columns =
    selectedApplication?.Status === "Open"
      ? [...baseColumns, { name: "action", label: "Action" }]
      : baseColumns;

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/selfservice/get_leave_employees/");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees");
    }
  };

  const handleShowModal = (reliever = null) => {
    fetchEmployees();
    setShowModal(true);
    if (reliever) {
      setEditingReliever(reliever);
      setSelectedReliever(reliever.StaffNo);
    } else {
      setEditingReliever(null);
      setSelectedReliever("");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReliever("");
    setEditingReliever(null);
  };

  const handleSubmitReliever = async (e) => {
    e.preventDefault();
    if (!selectedReliever) {
      toast.error("Please select a reliever");
      return;
    }

    setLoading(true);
    try {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

      const formData = new FormData();
      formData.append("reliever", selectedReliever);
      formData.append("myAction", editingReliever ? "modify" : "insert");

      await axios.post(
        `/selfservice/FnLeaveReliever/${selectedApplication.Application_No}/`,
        formData,
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        editingReliever
          ? "Reliever updated successfully!"
          : "Reliever added successfully!"
      );

      if (onRelieverAdded) {
        onRelieverAdded();
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving reliever:", error);
      toast.error(`Failed to ${editingReliever ? "update" : "add"} reliever`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Leave Relievers</h5>
        {selectedApplication?.Status === "Open" && (
          <button
            onClick={() => handleShowModal()}
            className="btn btn-primary btn-sm ms-auto"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        )}
      </div>

      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.name}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.StaffNo}</td>
              <td>{row.LeaveCode}</td>
              <td>{row.StaffName}</td>
              <td>{row.Section}</td>
              {selectedApplication?.Status === "Open" && (
                <td>
                  <button
                    onClick={() => handleShowModal(row)}
                    className="btn btn-sm btn-outline-primary"
                    title="Edit Reliever"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Reliever Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingReliever ? "Edit Reliever" : "Add Reliever"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitReliever}>
            <Form.Group className="mb-3">
              <Form.Label>Select Reliever</Form.Label>
              <Form.Select
                value={selectedReliever}
                onChange={(e) => setSelectedReliever(e.target.value)}
                required
              >
                <option value="">Choose a reliever</option>
                {employees.map((employee) => (
                  <option key={employee.No_} value={employee.No_}>
                    {employee.First_Name} {employee.Last_Name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading
                  ? editingReliever
                    ? "Updating..."
                    : "Adding..."
                  : editingReliever
                  ? "Update Reliever"
                  : "Add Reliever"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RelieversTable;
