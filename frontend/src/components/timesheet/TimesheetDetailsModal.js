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
      size="xl"
      centered
      style={{ zIndex: 1050 }} // Add the z-index style here
    >
      <Modal.Header
        closeButton
        className={
          timesheet?.Status === "Open"
            ? "bg-primary"
            : timesheet?.Status === "Pending Approval"
            ? "bg-secondary"
            : timesheet?.Status === "Approved"
            ? "bg-success"
            : timesheet?.Status === "Rejected"
            ? "bg-danger"
            : "bg-primary" 
        }
      >
        <Modal.Title>
          <h4 className=" text-white">
            Timesheet Details for {formatDate(timesheet.PeriodStartDate)} -{" "}
            {formatDate(timesheet.PeriodEndDate)}
          </h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          className="row default-according style-1 faq-accordion"
          id="accordionoc"
        >
          <div className="col-xl-12 col-lg-12 col-md-12">
            <div
              className={
                timesheet?.Status === "Open"
                  ? "border-primary card border"
                  : timesheet?.Status === "Pending Approval"
                  ? "border-secondary card border"
                  : timesheet?.Status === "Approved"
                  ? "border-success card border"
                  : timesheet?.Status === "Rejected"
                  ? "border-danger card border"
                  : "border-primary card border" // Default class in case Status is undefined
              }
            >
              <div
                className={
                  timesheet?.Status === "Open"
                    ? "bg-primary card-header text-white"
                    : timesheet?.Status === "Pending Approval"
                    ? "bg-secondary card-header text-white"
                    : timesheet?.Status === "Approved"
                    ? "bg-success card-header text-white"
                    : timesheet?.Status === "Rejected"
                    ? "bg-danger card-header text-white"
                    : "bg-primary card-header text-white" // Default class in case Status is undefined
                }
              >
                <h5 className="mb-0">
                  <button
                    className="btn btn-link ps-0 text-white"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseicon"
                    aria-expanded="true"
                    aria-controls="collapseicon"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-help-circle"
                    >
                      <circle cx={12} cy={12} r={10} />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1={12} y1={17} x2={12} y2={17} />
                    </svg>{" "}
                    Timesheet Details
                  </button>
                </h5>
              </div>
              <div
                className="collapse show"
                id="collapseicon"
                aria-labelledby="collapseicon"
                data-bs-parent="#accordionoc"
                style={{}}
              >
                <div className="card-body">
                  <div className="card p-3">
                    <div className="row">
                      <div className="col-md-3">
                        <strong>Employee Name:</strong>{" "}
                        {timesheet?.EmployeeName}
                      </div>
                      <div className="col-md-3">
                        <strong>Designation:</strong>{" "}
                        {timesheet?.EmployeeDesignation}
                      </div>
                      <div className="col-md-3">
                        <strong>Supervisor:</strong> {timesheet?.SupervisorName}
                      </div>
                      <div className="col-md-3">
                        <strong>Timesheet Status:</strong>{" "}
                        <span
                          className={
                            timesheet?.Status === "Open"
                              ? "text-primary "
                              : timesheet?.Status === "Pending Approval"
                              ? "text-secondary"
                              : timesheet?.Status === "Approved"
                              ? "text-success "
                              : timesheet?.Status === "Rejected"
                              ? "text-danger"
                              : "text-primary" // Default class in case Status is undefined
                          }
                        >
                          {timesheet?.Status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <TimesheetEntriesTable
                    data={entries}
                    onAddEntry={fetchEntries} // Optionally pass fetchEntries here if needed in the table
                  />
                </div>
              </div>
            </div>
            <div
              className={
                timesheet?.Status === "Open"
                  ? "card border border-primary  "
                  : timesheet?.Status === "Pending Approval"
                  ? "card border border-secondary"
                  : timesheet?.Status === "Approved"
                  ? "card border border-success"
                  : timesheet?.Status === "Rejected"
                  ? "card border border-danger"
                  : "card border border-primary" // Default class in case Status is undefined
              }
            >
              <div className="card-header ">
                <h5 className="mb-0">
                  <button
                    className={
                      timesheet?.Status === "Open"
                        ? "bg-primary card-header btn btn-link text-white collapsed ps-0"
                        : timesheet?.Status === "Pending Approval"
                        ? "bg-secondary card-header btn btn-link text-white collapsed ps-0"
                        : timesheet?.Status === "Approved"
                        ? "bg-success card-header btn btn-link text-white collapsed ps-0"
                        : timesheet?.Status === "Rejected"
                        ? "bg-danger card-header btn btn-link text-white collapsed ps-0"
                        : "bg-primary card-header btn btn-link text-white collapsed ps-0" // Default class in case Status is undefined
                    }
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseicon4"
                    aria-expanded="false"
                    aria-controls="collapseicon2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-help-circle"
                    >
                      <circle cx={12} cy={12} r={10} />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1={12} y1={17} x2={12} y2={17} />
                    </svg>{" "}
                    Assigned Projects
                  </button>
                </h5>
              </div>
              <div
                className="collapse"
                id="collapseicon4"
                data-bs-parent="#accordionoc"
              >
                <div className="card-body">
                  <div>
                    <TimesheetProjects />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 mt-3 box-col-12">
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
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close{" "}
          <i
            className="fa fa-times-circle"
            style={{ marginLeft: "3px" }}
            aria-hidden="true"
          />
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TimesheetDetailsModal;
