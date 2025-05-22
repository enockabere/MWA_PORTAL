import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";

const RelieversTable = ({ data, selectedApplication, onRelieverAdded }) => {
  const [selectedReliever, setSelectedReliever] = useState("");
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/selfservice/get_leave_employees/");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      await Swal.fire("Error", "Failed to load employees", "error");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmitReliever = async () => {
    if (!selectedReliever) {
      await Swal.fire("Warning", "Please select a reliever", "warning");
      return;
    }

    setLoading(true);
    try {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

      const formData = new FormData();
      formData.append("reliever", selectedReliever);
      formData.append("myAction", data.length > 0 ? "modify" : "insert");

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
        data.length > 0
          ? "Reliever updated successfully!"
          : "Reliever added successfully!",
        "success"
      );

      setSelectedReliever("");
      setEditing(false);

      if (onRelieverAdded) onRelieverAdded();
    } catch (error) {
      console.error("Error saving reliever:", error);
      await Swal.fire("Error", "Failed to save reliever", "error");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: "Staff No.",
      selector: (row) => row.StaffNo,
      sortable: true,
    },
    {
      name: "Leave Code",
      selector: (row) => row.LeaveCode,
    },
    {
      name: "Staff Name",
      selector: (row) => row.StaffName,
    },
    {
      name: "Section",
      selector: (row) => row.Section,
    },
  ];

  if (selectedApplication?.Status === "Open") {
    columns.push({
      name: "Action",
      cell: () => (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => setEditing(true)}
        >
          Edit <FontAwesomeIcon icon={faEdit} />
        </button>
      ),
    });
  }

  return (
    <div className="p-3">
      <h5 className="mb-3">Leave Relievers</h5>

      {editing || data.length === 0 ? (
        <div className="border rounded p-3 mb-3 bg-light">
          <div className="mb-3">
            <label className="form-label fw-semibold">Select Reliever</label>
            <select
              className="form-select"
              value={selectedReliever}
              onChange={(e) => setSelectedReliever(e.target.value)}
              disabled={loading}
            >
              <option value="">-- Choose a reliever --</option>
              {employees.map((emp) => (
                <option key={emp.No_} value={emp.No_}>
                  {emp.First_Name} {emp.Last_Name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleSubmitReliever}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faSave} />{" "}
            {loading
              ? "Saving..."
              : data.length > 0
              ? "Update Reliever"
              : "Add Reliever"}
          </button>
        </div>
      ) : null}

      {data.length > 0 && (
        <DataTable
          columns={columns}
          data={data}
          pagination
          striped
          highlightOnHover
          responsive
          noHeader
        />
      )}
    </div>
  );
};

export default RelieversTable;
