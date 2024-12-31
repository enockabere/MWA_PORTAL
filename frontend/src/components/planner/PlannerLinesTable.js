import React, { useEffect } from "react";
import $ from "jquery"; // Ensure jQuery is imported
import "datatables.net"; // Ensure DataTables is imported
import "datatables.net-dt/css/dataTables.dataTables.min.css"; // DataTables CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"; // Import the trash icon
import "./table.css"; // Import the table CSS file

const PlannerLinesTable = ({ data }) => {
  const columns = [
    { name: "Leave_Period", label: "Leave Period" },
    { name: "Start_Date", label: "Start Date" },
    { name: "End_Date", label: "End Date" },
    { name: "Days_Planned", label: "Days Planned" },
    { name: "action", label: "Action" },
  ];

  const handleDeleteClick = (id) => {};

  const handleDownload = () => {
    const table = document.getElementById("datatable");
    let csv = [];
    const rows = table.querySelectorAll("tr");

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td, th");
      let rowData = [];
      cells.forEach((cell) => {
        rowData.push(cell.innerText);
      });
      csv.push(rowData.join(","));
    });

    const csvString = csv.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "planner_lines.csv";
    link.click();
  };

  const handlePrint = () => {
    const table = document.getElementById("datatable");
    const printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Print Table</title>");
    printWindow.document.write(
      "<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } </style>"
    );
    printWindow.document.write("</head><body>");
    printWindow.document.write(table.outerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  // Initialize DataTable on component mount
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
      {/* <div className="table-controls">
        <button onClick={handleDownload} className="btn btn-secondary">
          Download CSV
        </button>
        <button onClick={handlePrint} className="btn btn-primary">
          Print
        </button>
      </div> */}
    </div>
  );
};

export default PlannerLinesTable;
