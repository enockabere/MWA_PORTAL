import React, { useState } from "react";
import { Table, Spinner, Button } from "react-bootstrap"; // Import React Bootstrap components
import Pagination from "../Layout/Pagination";

const TimesheetEntries = ({ timesheetLinesData, loading }) => {
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [approving, setApproving] = useState(false); // State for approving action
  const rowsPerPage = 5; // Number of rows per page
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  // Calculate total number of pages
  const totalPages = Math.ceil(timesheetLinesData.length / rowsPerPage);

  // Slice the data to display only the rows for the current page
  const currentRows = timesheetLinesData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    // Determine the suffix (st, nd, rd, th)
    const suffix = (day) => {
      if (day > 3 && day < 21) return "th"; // Catch 4th-20th
      switch (day % 10) {
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

    const formattedDate = `${date.toLocaleString("default", {
      weekday: "short",
    })}, ${day}${suffix(day)} ${month}, ${year}`;
    return formattedDate;
  };

  // Handle approve action
  const handleApprove = async (line) => {
    setApproving(true); // Show loader
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
      setApproving(false); // Hide loader
    }
  };

  return (
    <div className="row my-3">
      <div className="col-xl-12">
        <div className="card bg-primary">
          <div className="card-body">
            <div className="d-flex faq-widgets">
              <div className="flex-grow-1">
                <h6>Timesheet Entries</h6>
                {loading ? ( // Show loading spinner if data is still loading
                  <div className="text-center">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p>Loading timesheet entries...</p>
                  </div>
                ) : timesheetLinesData.length === 0 ? ( // Show message if no data is available
                  <p>No timesheet entries found.</p>
                ) : (
                  <>
                    <Table striped bordered hover responsive className="my-3">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Weekend</th>
                          <th>Holiday</th>
                          <th>Leave Day</th>
                          <th>Hours Worked</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRows.map((line, index) => (
                          <tr key={index}>
                            <td>{formatDate(line.Date)}</td>
                            <td>{line.Weekend ? "Yes" : "No"}</td>
                            <td>{line.Holiday ? "Yes" : "No"}</td>
                            <td>{line.LeaveDay ? "Yes" : "No"}</td>
                            <td>{line.HoursWorked}</td>
                            <td>{line.TimeSheetStatus}</td>
                            <td>
                              <Button
                                variant="success"
                                onClick={() => handleApprove(line)}
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {/* Pagination Component */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimesheetEntries;
