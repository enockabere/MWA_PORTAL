import React from "react";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const AdjustmentLinesTable = ({ lines = [] }) => {
  const columns = [
    {
      name: "Leave Type",
      selector: (row) => row.LeaveType || row.LeaveCode,
      sortable: true,
    },
    {
      name: "Adjustment Entry Type",
      selector: (row) => row.AdjustmentEntryType || row.LeaveAdjEntryType,
    },
    {
      name: "New Entitlement",
      selector: (row) => row.NewEntitlement,
    },
    {
      name: "Transaction Type",
      selector: (row) => row.TransactionType,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => console.log("Delete", row)}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="card">
      <div className="card-body">
        <DataTable
          title="Leave Adjustment Lines"
          columns={columns}
          data={lines}
          pagination
          highlightOnHover
          striped
          responsive
          noDataComponent="No adjustment lines added yet."
        />
      </div>
    </div>
  );
};

export default AdjustmentLinesTable;
