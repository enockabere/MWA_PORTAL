import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useTable } from "react-table";
import { Modal } from "react-bootstrap"; // For the modal
import { toast } from "react-toastify";

const LinesTable = ({ plans, pk, onFetchSamples }) => {
  const [formattedData, setFormattedData] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [selectedPlan, setSelectedPlan] = useState(null); // Store the plan being deleted
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  const formatDateWithSuffix = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
        ? "rd"
        : "th";

    return `${day}${suffix} ${month}, ${year}`;
  };

  useEffect(() => {
    if (plans) {
      const newData = plans
        .map((plan) => {
          return {
            Line_No: plan.LineNo,
            Leave_Period: plan.LeavePeriod,
            Start_Date: formatDateWithSuffix(plan.StartDate),
            End_Date: plan.EndDate ? formatDateWithSuffix(plan.EndDate) : "N/A",
            Raw_Start_Date: plan.StartDate,
            Raw_End_Date: plan.EndDate,
            Days_Planned: plan.Days,
            Document_No: plan.DocumentNo,
          };
        })
        .reverse(); // Reverse data to display the latest first

      setFormattedData(newData); // Update state with the new data
    }
  }, [plans]);

  const handleDeleteClick = (plan) => {
    setSelectedPlan(plan); // Set the plan that will be deleted
    setShowModal(true); // Show confirmation modal
  };

  const handleDeleteConfirm = async () => {
    setLoading(true); // Show the loading spinner

    try {
      await axios.post(
        `/selfservice/FnLeavePlannerLine/${selectedPlan.Document_No}/`,
        {
          lineNo: selectedPlan.Line_No,
          MyAction: "delete",
          startDate: "2025-01-01T00:00:00.000Z", // Dummy date
          endDate: "2025-01-01T00:00:00.000Z",
        },
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      setShowModal(false); // Close the modal
      onFetchSamples(selectedPlan.Document_No); // Refresh data
      toast.success("Plan deleted successfully!");
    } catch (error) {
      toast.error(
        "Error deleting plan:",
        error.response?.data || error.message
      );
      alert(
        "Error deleting plan: " +
          (error.response?.data?.error || "Unknown error")
      );
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  // Define columns for React Table
  const columns = React.useMemo(
    () => [
      { Header: "Document No", accessor: "Document_No" },
      { Header: "Leave Period", accessor: "Leave_Period" },
      { Header: "Start Date", accessor: "Start_Date" },
      { Header: "End Date", accessor: "End_Date" },
      { Header: "Days Planned", accessor: "Days_Planned" },
      {
        Header: "Action",
        accessor: "Action",
        Cell: ({ row }) => (
          <button
            onClick={() => handleDeleteClick(row.original)}
            className="delete-button text-white btn btn-danger"
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <div className="spinner-border text-light" role="status"></div> // Show loading spinner
            ) : (
              <FontAwesomeIcon icon={faTrashAlt} />
            )}
          </button>
        ),
      },
    ],
    [loading]
  );

  // Use React Table hook
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: formattedData,
    });

  return (
    <div className="card p-3">
      <h4 className="my-3">Leave Planner Lines</h4>
      <table
        {...getTableProps()}
        className="table table-striped table-bordered"
        style={{ width: "100%" }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal for delete confirmation */}
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
            disabled={loading} // Disable when loading
          >
            {loading ? (
              <div className="spinner-border text-light" role="status"></div> // Show spinner in the button
            ) : (
              "Delete"
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LinesTable;
