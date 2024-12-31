import React, { useEffect } from "react";
import $ from "jquery";
import "datatables.net"; // Ensure DataTables is imported
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "../planner/table.css";

const RelieversTable = ({ data, selectedApplication }) => {
  const columns = [
    { name: "StaffNo", label: "Staff No." },
    { name: "LeaveCode", label: "Leave Code" },
    { name: "StaffName", label: "Staff Name" },
    { name: "Section", label: "Section" },
    { name: "action", label: "Action" },
  ];

  const handleDeleteClick = (id) => {
    console.log("Delete clicked for ID:", id);
    // Add your delete logic here
  };

  useEffect(() => {
    const $table = $("#datatable");
    if ($table.length) {
      // Initialize DataTable here
      $table.DataTable({
        responsive: true, // Make the table responsive
      });

      // Cleanup DataTable on component unmount
      return () => {
        if ($table.length) {
          $table.DataTable().destroy(true); // Destroy DataTable on cleanup
        }
      };
    }
  }, []);

  return (
    <div className="p-3">
      <table id="datatable" className="display responsive">
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
              {columns.map((column) => (
                <td key={column.name}>
                  {column.name === "action" ? (
                    <button
                      onClick={() => handleDeleteClick(row.Leave_Period)}
                      className="delete-button"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  ) : (
                    row[column.name]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RelieversTable;
