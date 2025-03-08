import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faUmbrellaBeach,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import "react-calendar/dist/Calendar.css";
import "./TimesheetCalendar.css";

const TimesheetCalendar = ({
  entries,
  Initiated,
  region,
  onAddEntry,
  projects,
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

  // Fetch max hours for the region
  useEffect(() => {
    const fetchMaxHours = async () => {
      try {
        const response = await fetch(`/selfservice/get-max-timesheet-entries/`);
        if (!response.ok) {
          console.error("Failed to fetch max timesheet entries");
          return;
        }
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
      console.error("Entries is not an array:", entries);
      return [];
    }
    return entries.filter(
      (entry) => entry.Date === moment(date).format("YYYY-MM-DD")
    );
  };

  // Define tile content (hours worked) - Hide 0-hour entries
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const entry = getTimesheetEntries(date)[0];

      if (entry && entry.HoursWorked > 0) {
        return <p className="hours-worked">{entry.HoursWorked}h</p>;
      }
    }
    return null;
  };

  // Define tile class for styling weekends, holidays, leave days
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const entry = getTimesheetEntries(date)[0];
      if (!entry) return "";

      if (entry.Holiday) return "holiday-tile"; // Red color for holidays
      if (entry.LeaveDay) return "leave-day-tile"; // Yellow color for leave days
    }
    return "";
  };

  // Check if a date is a weekend
  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 6 || day === 0; // Saturday (6) or Sunday (0)
  };

  // Handle date click event
  const handleDateClick = (date) => {
    // Do not open the modal if Initiated is false, the date is in the future, or it's a weekend
    if (
      !Initiated ||
      moment(date).isAfter(moment(), "day") ||
      isWeekend(date)
    ) {
      return;
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
    setSelectedProject(e.target.value);
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

    // Validate hours worked
    if (!hoursWorked || hoursWorked <= 0 || hoursWorked > max) {
      setError(`Please enter a valid number of hours (0 - ${max}).`);
      return;
    }

    // Validate project selection for USA region
    if (region === "USA" && !selectedProject) {
      setError("Please select a project.");
      return;
    }

    // Find the matching entry for the selected date
    const matchingEntry = entries.find(
      (entry) => entry.Date === moment(popupDate).format("YYYY-MM-DD")
    );

    if (!matchingEntry) {
      setError("No matching entry found for the selected date.");
      return;
    }

    // Prepare payload based on region
    const payload =
      region === "USA"
        ? {
            Date: moment(popupDate).format("YYYY-MM-DD"),
            HoursWorked: parseFloat(hoursWorked),
            Project: selectedProject, // Include project for USA region
          }
        : {
            DocumentNo: matchingEntry.DocumentNo,
            EntryNo: matchingEntry.EntryNo,
            Date: moment(popupDate).format("YYYY-MM-DD"),
            HoursWorked: parseFloat(hoursWorked),
            Project: "", // Submit an empty string for non-USA regions
          };

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
        // Call the onAddEntry callback to update the parent component
        if (onAddEntry) {
          // Pass the DocumentNo to onAddEntry (similar to TimesheetForm)
          onAddEntry(matchingEntry.DocumentNo);
        }
        setShowModal(false);
        setHoursWorked("");
        setSelectedProject("");
      } else {
        setError(result.error || "Failed to add entry. Please try again.");
      }
    } catch (error) {
      console.error("Error adding timesheet entry:", error);
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

  // Calculate total hours worked to date
  const totalHoursWorked = entries.reduce((total, entry) => {
    if (moment(entry.Date).isSameOrBefore(moment(), "day")) {
      return total + (entry.HoursWorked || 0);
    }
    return total;
  }, 0);

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
