import React, { useEffect } from "react";
import $ from "jquery"; // Ensure jQuery is imported
import "datatables.net"; // Ensure DataTables is imported
import "datatables.net-dt/css/dataTables.dataTables.min.css"; // DataTables CSS
import "./table.css"; // Import the table CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const LinesTable = ({ plans }) => {
  const defaultData = [];
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

  const data =
    plans && plans.data && Array.isArray(plans.data) && plans.data.length > 0
      ? plans.data
          .map((plan) => ({
            Leave_Period: plan.LeavePeriod,
            Start_Date: formatDateWithSuffix(plan.StartDate),
            End_Date: plan.EndDate ? formatDateWithSuffix(plan.EndDate) : "N/A",
            Days_Planned: plan.Days,
          }))
          .reverse()
      : defaultData;

  const columns = [
    { name: "Leave_Period", label: "Leave Period" },
    { name: "Start_Date", label: "Start Date" },
    { name: "End_Date", label: "End Date" },
    { name: "Days_Planned", label: "Days Planned" },
    { name: "action", label: "Action" },
  ];

  const handleDeleteClick = (id) => {
    // Add your delete logic here
  };

  useEffect(() => {
    const $table = $("#datatable");

    if ($table.length && data.length > 0) {
      const dataTable = $table.DataTable({
        responsive: true,
        destroy: true,
      });

      return () => {
        if ($table.length) {
          dataTable.destroy();
        }
      };
    }
  }, [data]);

  return (
    <div className="card p-3">
      <h4>Leave Planner Lines</h4>
      <table id="datatable" className="display responsive">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.name}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.Leave_Period}>
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

export default LinesTable;
