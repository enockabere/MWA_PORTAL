import React, { useMemo } from "react";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const AdjLinesTable = ({
  data,
  selectedApplication,
  title = "Adjustment Lines",
}) => {
  const handleDeleteClick = (id) => {
    console.log("Delete clicked for ID:", id);
  };

  const handleEditClick = (id) => {
    console.log("Edit clicked for ID:", id);
  };

  const columns = useMemo(
    () => [
      {
        name: "Name",
        selector: (row) => row.Name,
        sortable: true,
      },
      {
        name: "Leave Type",
        selector: (row) => row.LeaveType,
        sortable: true,
      },
      {
        name: "Adjustment Entry Type",
        selector: (row) => row.AdjEntryType,
        sortable: true,
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {selectedApplication?.Status === "Open" ? (
              <>
                <button
                  onClick={() => handleEditClick(row.Name)}
                  className="btn btn-sm btn-outline-primary"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDeleteClick(row.Name)}
                  className="btn btn-sm btn-outline-danger"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </>
            ) : (
              <span style={{ color: "gray", fontSize: "0.875rem" }}>
                Actions Disabled
              </span>
            )}
          </div>
        ),
      },
    ],
    [selectedApplication]
  );

  return (
    <div className="p-3">
      <h5 className="mb-3">{title}</h5>
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        responsive
        striped
        dense
        customStyles={{
          table: {
            style: { border: "none" },
          },
        }}
      />
    </div>
  );
};

export default AdjLinesTable;
