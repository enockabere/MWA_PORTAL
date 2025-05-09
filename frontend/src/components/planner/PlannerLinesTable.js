import React, { useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const PlannerLinesTable = ({ data, onFetchSamples }) => {
  const [loading, setLoading] = useState(false);
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleDelete = async (plan) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this plan line.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      setLoading(true);
      try {
        await axios.post(
          `/selfservice/FnLeavePlannerLine/${plan.DocumentNo}/`,
          {
            lineNo: plan.LineNo,
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
          title: "Deleted!",
          text: "Planner line has been deleted.",
        });

        onFetchSamples();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: error.response?.data?.error || "Failed to delete planner line.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
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
        <FontAwesomeIcon
          icon={faTrashAlt}
          className="text-danger"
          style={{ cursor: "pointer" }}
          onClick={() => handleDelete(row)}
        />
      ),
      button: true,
    },
  ];

  return (
    <div className="card p-3">
      <h6 className="mb-2">Leave Planner Lines</h6>
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        striped
        highlightOnHover
        responsive
      />
    </div>
  );
};

export default PlannerLinesTable;
