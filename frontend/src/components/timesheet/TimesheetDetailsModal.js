import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import TimesheetEntriesTable from "./TimesheetEntriesTable"; // Import the new component
import TimesheetProjects from "./TimesheetProjects";
import SubmitTimesheet from "./SubmitTimesheet";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date
    .toLocaleDateString("en-GB", options)
    .replace(/\b(\d{1,2})\b/, (match) => {
      const suffix = ["st", "nd", "rd"][((match % 100) - 20) % 10] || "th";
      return match + suffix;
    });
};

const TimesheetDetailsModal = ({ timesheet, onClose, onShowToast }) => {
  const [entries, setEntries] = useState([]);

  // Function to fetch entries
  const fetchEntries = () => {
    if (timesheet) {
      console.log("Fetching timesheet entries for:", timesheet.Code);

      fetch(`/selfservice/get-timesheet-entries/${timesheet.Code}/`)
        .then((res) => res.json())
        .then((data) => {
          setEntries(data);
        })
        .catch((error) => {
          console.error("Error fetching timesheet entries:", error);
        });
    }
  };

  useEffect(() => {
    fetchEntries(); // Fetch entries when timesheet is loaded
  }, [timesheet]);

  return (
    <Modal
      show={!!timesheet}
      onHide={onClose}
      size="lg"
      centered
      style={{ zIndex: 1050 }} // Add the z-index style here
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Timesheet Details for {formatDate(timesheet.PeriodStartDate)} -{" "}
          {formatDate(timesheet.PeriodEndDate)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-3">
            <strong>Employee Name:</strong> {timesheet?.EmployeeName}
          </div>
          <div className="col-md-3">
            <strong>Designation:</strong> {timesheet?.EmployeeDesignation}
          </div>
          <div className="col-md-3">
            <strong>Supervisor:</strong> {timesheet?.SupervisorName}
          </div>
          <div className="col-md-3">
            <strong>Period:</strong> {formatDate(timesheet?.PeriodStartDate)} -{" "}
            {formatDate(timesheet?.PeriodEndDate)}
          </div>
        </div>

        <TimesheetEntriesTable
          data={entries}
          onAddEntry={fetchEntries} // Optionally pass fetchEntries here if needed in the table
        />
        <div>
          <TimesheetProjects />
        </div>
        <div className="col-xl-3 box-col-12">
          <div className="file-sidebar">
            <div className="card">
              <div className="card-body custom-scrollbar">
                <ul>
                  {timesheet?.Submitted === false && (
                    <li>
                      <SubmitTimesheet
                        timesheetId={timesheet?.Code}
                        onHide={onClose}
                        onShowToast={onShowToast}
                      />
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TimesheetDetailsModal;
