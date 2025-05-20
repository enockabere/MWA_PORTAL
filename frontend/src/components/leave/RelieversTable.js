import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";

const RelieversTable = ({ data, selectedApplication, onRelieverAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReliever, setSelectedReliever] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReliever, setEditingReliever] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/selfservice/get_leave_employees/");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      await Swal.fire("Error", "Failed to load employees", "error");
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
      await Swal.fire("Warning", "Please select a reliever", "warning");
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

      await Swal.fire(
        "Success",
        editingReliever
          ? "Reliever updated successfully!"
          : "Reliever added successfully!",
        "success"
      );

      if (onRelieverAdded) onRelieverAdded();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving reliever:", error);
      await Swal.fire(
        "Error",
        `Failed to ${editingReliever ? "update" : "add"} reliever`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { name: "Staff No.", selector: (row) => row.StaffNo, sortable: true },
    { name: "Leave Code", selector: (row) => row.LeaveCode },
    { name: "Staff Name", selector: (row) => row.StaffName },
    { name: "Section", selector: (row) => row.Section },
  ];

  if (selectedApplication?.Status === "Open") {
    columns.push({
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => handleShowModal(row)}
          className="btn btn-sm btn-outline-primary"
        >
          Edit <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
    });
  }

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Leave Relievers</h5>
        {selectedApplication?.Status === "Open" && (
          <button
            onClick={() => handleShowModal()}
            className="btn btn-primary btn-sm ms-auto"
          >
            <FontAwesomeIcon icon={faPlus} /> Add Reliever
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data}
        pagination
        striped
        highlightOnHover
        responsive
        noDataComponent={<p className="text-center mb-0">No relievers found</p>}
      />
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content rounded-3 shadow">
              <div className="modal-header">
                <h5 className="modal-title  w-100 fw-semibold">
                  {editingReliever ? "Edit Reliever" : "Add Reliever"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body pt-2">
                <form onSubmit={handleSubmitReliever}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Select Reliever
                    </label>
                    <select
                      className="form-select"
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
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer border-0 pt-0 d-flex justify-content-end text-center">
                <button
                  type="submit"
                  className="btn btn-primary text-center"
                  disabled={loading}
                >
                  {loading
                    ? editingReliever
                      ? "Updating..."
                      : "Adding..."
                    : editingReliever
                    ? "Update Reliever"
                    : "Add Reliever"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelieversTable;
