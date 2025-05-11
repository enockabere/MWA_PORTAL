import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Spinner, Button } from "react-bootstrap";

const TimesheetEntries = ({ timesheetLinesData, loading }) => {
  const [approving, setApproving] = useState(false);
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const suffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    return `${date.toLocaleString("default", {
      weekday: "short",
    })}, ${day}${suffix(day)} ${month}, ${year}`;
  };

  const handleApprove = async (line) => {
    setApproving(true);
    try {
      const response = await fetch("/api/approve-timesheet-entry/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          EntryNo: line.EntryNo,
          DocumentNo: line.DocumentNo,
        }),
      });

      if (response.ok) {
        alert("Timesheet entry approved successfully!");
      } else {
        alert("Failed to approve timesheet entry.");
      }
    } catch (error) {
      console.error("Error approving timesheet entry:", error);
      alert("An error occurred while approving the timesheet entry.");
    } finally {
      setApproving(false);
    }
  };

  const columns = [
    {
      name: "Date",
      selector: (row) => formatDate(row.Date),
      sortable: true,
    },
    {
      name: "Weekend",
      selector: (row) => (row.Weekend ? "Yes" : "No"),
    },
    {
      name: "Holiday",
      selector: (row) => (row.Holiday ? "Yes" : "No"),
    },
    {
      name: "Leave Day",
      selector: (row) => (row.LeaveDay ? "Yes" : "No"),
    },
    {
      name: "Hours Worked",
      selector: (row) => row.HoursWorked,
    },
    {
      name: "Status",
      selector: (row) => row.TimeSheetStatus,
    },
    {
      name: "Action",
      cell: (row) => (
        <Button
          variant="success"
          size="sm"
          onClick={() => handleApprove(row)}
          disabled={approving}
        >
          {approving ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            "Approve"
          )}
        </Button>
      ),
    },
  ];

  return (
    <div className="row my-3">
      <div className="col-xl-12">
        <div className="card bg-primary">
          <div className="card-body">
            <h6 className="text-white">Timesheet Entries</h6>
            {loading ? (
              <div className="text-center text-white">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>Loading timesheet entries...</p>
              </div>
            ) : timesheetLinesData.length === 0 ? (
              <p className="text-white">No timesheet entries found.</p>
            ) : (
              <DataTable
                columns={columns}
                data={timesheetLinesData}
                pagination
                highlightOnHover
                striped
                responsive
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimesheetEntries;
