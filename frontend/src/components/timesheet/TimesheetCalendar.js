import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faUmbrellaBeach,
  faClock,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import "react-calendar/dist/Calendar.css";
import "./TimesheetCalendar.css";

const TimesheetCalendar = ({
  entries = [],
  Initiated,
  region,
  onAddEntry,
  projects = [],
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [hoursWorked, setHoursWorked] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [popupDate, setPopupDate] = useState(null);
  const [maxHours, setMaxHours] = useState({
    HoursWorkedMonThur: 8.5,
    HoursWorkedFri: 8,
  });
  const [error, setError] = useState("");
  const [loadingAddEntry, setLoadingAddEntry] = useState(false);
  const [projectHours, setProjectHours] = useState([]);

  // Fetch max hours for the region
  useEffect(() => {
    const fetchMaxHours = async () => {
      try {
        const response = await fetch(`/selfservice/get-max-timesheet-entries/`);
        if (!response.ok) throw new Error("Failed to fetch max hours");
        const data = await response.json();
        setMaxHours({
          HoursWorkedMonThur: data.HoursWorkedMonThur,
          HoursWorkedFri: data.HoursWorkedFri,
        });
      } catch (error) {
        console.error("Error fetching max hours:", error);
      }
    };

    fetchMaxHours();
  }, [region]);

  // Get timesheet entries for the selected date
  const getTimesheetEntries = (date) => {
    if (!Array.isArray(entries)) {
      return [];
    }

    const formattedDate = moment(date).format("YYYY-MM-DD");
    const filteredEntries = entries.filter(
      (entry) => entry.Date === formattedDate
    );

    return filteredEntries;
  };

  // Define tile content (hours worked) - Hide 0-hour entries
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const entriesForDate = getTimesheetEntries(date);
      if (entriesForDate.length > 0) {
        const entry = entriesForDate[0];
        if (entry.HoursWorked > 0) {
          return <p className="hours-worked">{entry.HoursWorked}h</p>;
        }
      }
    }
    return null;
  };

  // Define tile class for styling weekends, holidays, leave days
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const entriesForDate = getTimesheetEntries(date);
      if (entriesForDate.length > 0) {
        const entry = entriesForDate[0];
        if (entry.Holiday) return "holiday-tile";
        if (entry.LeaveDay) return "leave-day-tile";
      }
    }
    return "";
  };

  // Check if a date is a weekend
  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 6 || day === 0; // Saturday (6) or Sunday (0)
  };

  // Handle date click event
  const handleDateClick = async (date) => {
    if (
      !Initiated ||
      moment(date).isAfter(moment(), "day") ||
      isWeekend(date)
    ) {
      return;
    }

    const entriesForDate = getTimesheetEntries(date);
    const matchingEntry = entriesForDate.length > 0 ? entriesForDate[0] : null;

    if (region === "USA" && matchingEntry) {
      const projectHours = await fetchProjectHours(
        date,
        matchingEntry.DocumentNo
      );
      setProjectHours(projectHours); // Store project hours in state
    }

    setPopupDate(date);
    setShowModal(true);
  };

  // Handle hours worked input change
  const handleHoursWorkedChange = (e) => {
    const value = parseFloat(e.target.value);
    const max = getMaxHoursForDay(popupDate);

    if (isNaN(value) || value <= 0 || value > max) {
      setError(`Please enter a valid number of hours (0 - ${max}).`);
    } else {
      setError("");
    }

    setHoursWorked(e.target.value);
  };

  // Handle project selection change
  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value); // Set the selected project EntryNo
  };

  // Get max hours for the selected day
  const getMaxHoursForDay = (date) => {
    const day = new Date(date).getDay();
    return day === 5 ? maxHours.HoursWorkedFri : maxHours.HoursWorkedMonThur;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const max = getMaxHoursForDay(popupDate);

    if (!hoursWorked || hoursWorked <= 0 || hoursWorked > max) {
      setError(`Please enter a valid number of hours (0 - ${max}).`);
      return;
    }

    if (region === "USA" && !selectedProject) {
      setError("Please select a project.");
      return;
    }

    const formattedDate = moment(popupDate).format("YYYY-MM-DD");
    const matchingEntry = entries.find((entry) => entry.Date === formattedDate);

    // Prepare the base payload
    const payload = {
      DocumentNo: matchingEntry ? matchingEntry.DocumentNo : null,
      EntryNo: matchingEntry ? matchingEntry.EntryNo : null,
      Date: formattedDate,
      HoursWorked: parseFloat(hoursWorked),
      Project: region === "USA" ? selectedProject : "",
      Region: region,
    };

    // Add additional payloads if necessary
    if (!matchingEntry || (matchingEntry && matchingEntry.HoursWorked === 0)) {
      payload.LineNo = 0;
      payload.myAction = "insert";
    }

    try {
      setLoadingAddEntry(true);
      const response = await fetch("/selfservice/timesheet-entry/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content"),
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        if (onAddEntry) {
          onAddEntry(matchingEntry ? matchingEntry.DocumentNo : null);
        }

        // Fetch project hours after successful submission (for USA users)
        if (region === "USA" && matchingEntry) {
          const projectHours = await fetchProjectHours(
            popupDate,
            matchingEntry.DocumentNo
          );
          setProjectHours(projectHours); // Update project hours in state
        }

        setShowModal(false);
        setHoursWorked("");
        setSelectedProject("");
      } else {
        setError(result.error || "Failed to add entry. Please try again.");
      }
    } catch (error) {
      setError("Error adding timesheet entry. Please try again.");
    } finally {
      setLoadingAddEntry(false);
    }
  };

  // Close modal
  const handleClose = () => {
    setShowModal(false);
    setHoursWorked("");
    setSelectedProject("");
    setError("");
  };

  // Fetch project hours for a specific date and document number
  const fetchProjectHours = async (date, documentNo) => {
    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const response = await fetch(
        `/selfservice/get-project-hours/?date=${formattedDate}&documentNo=${documentNo}`
      );
      if (!response.ok) throw new Error("Failed to fetch project hours");
      const data = await response.json();
      return data; // Assuming the response is an array of project hours
    } catch (error) {
      console.error("Error fetching project hours:", error);
      return [];
    }
  };

  // Calculate total hours worked to date
  const totalHoursWorked = entries.reduce((total, entry) => {
    if (moment(entry.Date).isSameOrBefore(moment(), "day")) {
      return total + (entry.HoursWorked || 0);
    }
    return total;
  }, 0);

  // Handle delete action for a project hour entry
  const handleDelete = (entryNo) => {
    console.log("Delete entry with EntryNo:", entryNo);
    // Implement delete logic here
  };

  // Handle edit action for a project hour entry
  const handleEdit = (entryNo) => {
    console.log("Edit entry with EntryNo:", entryNo);
    // Implement edit logic here
  };

  return (
    <div>
      <h3 className="mb-2">Timesheet Calendar</h3>
      <Calendar
        onChange={setSelectedDate}
        onClickDay={handleDateClick}
        value={selectedDate}
        tileClassName={tileClassName}
        tileContent={tileContent}
      />

      {/* Selected Date Details */}
      <div className="selected-date-details mt-3">
        <h6>Details for {moment(selectedDate).format("MMMM Do, YYYY")}</h6>
        <ul className="list-unstyled">
          {getTimesheetEntries(selectedDate).length > 0 ? (
            getTimesheetEntries(selectedDate).map((entry, index) => (
              <React.Fragment key={index}>
                {entry.Holiday && (
                  <li style={{ color: "red", fontWeight: "bold" }}>
                    <FontAwesomeIcon icon={faCalendarDay} className="me-2" />{" "}
                    Holiday
                  </li>
                )}
                {entry.LeaveDay && (
                  <li style={{ color: "goldenrod", fontWeight: "bold" }}>
                    <FontAwesomeIcon icon={faUmbrellaBeach} className="me-2" />{" "}
                    Leave Day
                  </li>
                )}
                {entry.HoursWorked > 0 && (
                  <li>
                    <FontAwesomeIcon icon={faClock} className="me-2" /> Hours
                    Worked: {entry.HoursWorked} hours
                  </li>
                )}
              </React.Fragment>
            ))
          ) : (
            <li>No entries for this day</li>
          )}
        </ul>
      </div>

      {/* Legend for Holidays & Leave Days */}
      <div className="calendar-legend border-2 border-t-primary p-2 b-r-2">
        <h6>Legend</h6>
        <div className="legend-item legend-holiday">
          <span
            className="legend-color"
            style={{ backgroundColor: "red" }}
          ></span>{" "}
          Holiday
        </div>
        <div className="legend-item legend-leave">
          <span
            className="legend-color"
            style={{ backgroundColor: "goldenrod" }}
          ></span>{" "}
          Leave Day
        </div>
        <div className="legend-item legend-total-hours">
          <span
            className="legend-color"
            style={{ backgroundColor: "blue" }}
          ></span>{" "}
          Total Hours Worked: {totalHoursWorked} hours
        </div>
      </div>

      {/* Display Project Hours for USA Users */}
      {region === "USA" && projectHours.length > 0 && (
        <div className="project-hours mt-3">
          <h6>Hours Per Project</h6>
          <ul className="list-unstyled">
            {projectHours.map((project, index) => (
              <li
                key={index}
                className="d-flex justify-content-between align-items-center"
              >
                <span>
                  {project.Project}: {project.Hours_Worked} hours
                </span>
                <div>
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="me-2 text-primary cursor-pointer"
                    onClick={() => handleEdit(project.Entry_No)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-danger cursor-pointer"
                    onClick={() => handleDelete(project.Entry_No)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* React-Bootstrap Modal for entering hours worked */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Enter Hours Worked for {moment(popupDate).format("MMMM Do, YYYY")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Hours Worked (Max: {getMaxHoursForDay(popupDate)} hours)
              </Form.Label>
              <Form.Control
                type="number"
                value={hoursWorked}
                onChange={handleHoursWorkedChange}
                placeholder="Enter hours worked"
                required
              />
            </Form.Group>
            {region === "USA" && (
              <Form.Group className="mb-3">
                <Form.Label>Project</Form.Label>
                <Form.Select
                  value={selectedProject}
                  onChange={handleProjectChange}
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map((project, index) => (
                    <option key={index} value={project.ProjectTask}>
                      {project.ProjectTask}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            {error && <Alert variant="danger">{error}</Alert>}
            <Button type="submit" variant="primary" disabled={loadingAddEntry}>
              {loadingAddEntry ? "Submitting..." : "Submit"}
            </Button>
            <Button variant="secondary" onClick={handleClose} className="ms-2">
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TimesheetCalendar;
