import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const LinesTable = ({ plans, pk, onFetchSamples }) => {
  const [formattedData, setFormattedData] = useState([]);
  const [loading, setLoading] = useState(false);
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
        .map((plan) => ({
          Line_No: plan.LineNo,
          Leave_Period: plan.LeavePeriod,
          Start_Date: formatDateWithSuffix(plan.StartDate),
          End_Date: plan.EndDate ? formatDateWithSuffix(plan.EndDate) : "N/A",
          Days_Planned: plan.Days,
          Document_No: plan.DocumentNo,
        }))
        .reverse();

      setFormattedData(newData);
    }
  }, [plans]);

  const handleDeleteClick = async (plan) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete Planner Line?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it",
    });

    if (confirm.isConfirmed) {
      setLoading(true);
      try {
        await axios.post(
          `/selfservice/FnLeavePlannerLine/${plan.Document_No}/`,
          {
            lineNo: plan.Line_No,
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

        await Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Planner line deleted successfully.",
        });

        onFetchSamples(plan.Document_No);
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error?.response?.data?.error ||
            "Failed to delete the planner line.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        name: "Document No",
        selector: (row) => row.Document_No,
        sortable: true,
      },
      {
        name: "Leave Period",
        selector: (row) => row.Leave_Period,
        sortable: true,
      },
      {
        name: "Start Date",
        selector: (row) => row.Start_Date,
      },
      {
        name: "End Date",
        selector: (row) => row.End_Date,
      },
      {
        name: "Days Planned",
        selector: (row) => row.Days_Planned,
      },
      {
        name: "Action",
        cell: (row) => (
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteClick(row)}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-border spinner-border-sm text-light" />
            ) : (
              <FontAwesomeIcon icon={faTrashAlt} />
            )}
          </button>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ],
    [loading]
  );

  return (
    <div className="card p-3">
      <h6 className="mb-3">Leave Planner Lines</h6>
      <DataTable
        columns={columns}
        data={formattedData}
        pagination
        striped
        highlightOnHover
        responsive
        progressPending={loading}
      />
    </div>
  );
};

export default LinesTable;
