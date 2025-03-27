// TimesheetCalendar.js
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { Alert } from "react-bootstrap";
import "react-calendar/dist/Calendar.css";
import "./TimesheetCalendar.css";

// Import components
import {
  AddEntryModal,
  EditEntryModal,
  DeleteEntryModal,
} from "./ModalComponents";
import {
  DateDetails,
  CalendarLegend,
  ProjectHoursList,
} from "./CalendarInfoComponents";

const TimesheetCalendar = ({
  entries = [],
  Initiated,
  region,
  onAddEntry,
  projects = [],
  activeMonth,
}) => {
  // State management
  const [selectedDate, setSelectedDate] = useState(() => {
    if (activeMonth) {
      return new Date(activeMonth.year, activeMonth.month, 1);
    }
    return new Date();
  });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hoursWorked, setHoursWorked] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [popupDate, setPopupDate] = useState(null);
  const [maxHours, setMaxHours] = useState({
    HoursWorkedMonThur: 8.5,
    HoursWorkedFri: 8,
  });
  const [error, setError] = useState("");
  const [loadingAddEntry, setLoadingAddEntry] = useState(false);
  const [loadingEditEntry, setLoadingEditEntry] = useState(false);
  const [loadingDeleteEntry, setLoadingDeleteEntry] = useState(false);
  const [projectHours, setProjectHours] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);

  // Helper functions
  const getTimesheetEntries = (date) => {
    if (!Array.isArray(entries)) return [];
    const formattedDate = moment(date).format("YYYY-MM-DD");
    return entries.filter((entry) => entry.Date === formattedDate);
  };

  const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return day === 6 || day === 0;
  };

  const hasEntryWithHours = (date) => {
    return getTimesheetEntries(date).some((entry) => entry.HoursWorked > 0);
  };

  const getMaxHoursForDay = (date) => {
    const day = new Date(date).getDay();
    return day === 5 ? maxHours.HoursWorkedFri : maxHours.HoursWorkedMonThur;
  };

  // Event handlers
  const handleDateClick = async (date) => {
    setAlertMessage(null);

    if (!Initiated) return;
    if (moment(date).isAfter(moment(), "day")) return;

    if (isWeekend(date)) {
      setAlertMessage({
        variant: "warning",
        text: "Entries are not allowed on weekends.",
      });
      return;
    }

    const entriesForDate = getTimesheetEntries(date);
    const matchingEntry = entriesForDate.length > 0 ? entriesForDate[0] : null;

    if (hasEntryWithHours(date)) {
      if (region === "USA" && matchingEntry) {
        const projectHours = await fetchProjectHours(
          date,
          matchingEntry.DocumentNo
        );
        setProjectHours(projectHours);
      }
      return;
    }

    if (region === "USA" && matchingEntry) {
      const projectHours = await fetchProjectHours(
        date,
        matchingEntry.DocumentNo
      );
      setProjectHours(projectHours);
    }

    setPopupDate(date);
    setShowModal(true);
  };

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

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
  };

  // API functions
  const fetchProjectHours = async (date, documentNo) => {
    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const response = await fetch(
        `/selfservice/get-project-hours/?date=${formattedDate}&documentNo=${documentNo}`
      );
      if (!response.ok) throw new Error("Failed to fetch project hours");
      return await response.json();
    } catch (error) {
      console.error("Error fetching project hours:", error);
      return [];
    }
  };

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

  useEffect(() => {
    if (activeMonth) {
      setSelectedDate(new Date(activeMonth.year, activeMonth.month, 1));
    }
  }, [activeMonth]);

  // Calendar customization
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

  // Form submissions
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

    const payload = {
      DocumentNo: matchingEntry ? matchingEntry.DocumentNo : null,
      EntryNo: matchingEntry ? matchingEntry.EntryNo : null,
      Date: formattedDate,
      HoursWorked: parseFloat(hoursWorked),
      Project: region === "USA" ? selectedProject : "",
      Region: region,
    };

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

        if (region === "USA" && matchingEntry) {
          const projectHours = await fetchProjectHours(
            popupDate,
            matchingEntry.DocumentNo
          );
          setProjectHours(projectHours);
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const max = getMaxHoursForDay(
      new Date(editingProject.Timesheet_Entry_Date)
    );

    if (!hoursWorked || hoursWorked <= 0 || hoursWorked > max) {
      setError(`Please enter a valid number of hours (0 - ${max}).`);
      return;
    }

    if (region === "USA" && !selectedProject) {
      setError("Please select a project.");
      return;
    }

    const payload = {
      DocumentNo: editingProject.Document_No,
      EntryNo: editingProject.Document_Entry_No,
      Date: editingProject.Timesheet_Entry_Date,
      HoursWorked: parseFloat(hoursWorked),
      Project: region === "USA" ? selectedProject : "",
      Region: region,
      LineNo: editingProject.Entry_No,
      myAction: "modify",
    };

    try {
      setLoadingEditEntry(true);
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
          onAddEntry(editingProject.Document_No);
        }

        const projectHours = await fetchProjectHours(
          new Date(editingProject.Timesheet_Entry_Date),
          editingProject.Document_No
        );
        setProjectHours(projectHours);

        setShowEditModal(false);
        setHoursWorked("");
        setSelectedProject("");
        setEditingProject(null);
      } else {
        setError(result.error || "Failed to update entry. Please try again.");
      }
    } catch (error) {
      setError("Error updating timesheet entry. Please try again.");
    } finally {
      setLoadingEditEntry(false);
    }
  };

  const handleDeleteSubmit = async () => {
    const payload = {
      DocumentNo: deletingProject.Document_No,
      EntryNo: deletingProject.Document_Entry_No,
      Date: deletingProject.Timesheet_Entry_Date,
      HoursWorked: 0,
      Project: deletingProject.Project,
      Region: region,
      LineNo: deletingProject.Entry_No,
      myAction: "delete",
    };

    try {
      setLoadingDeleteEntry(true);
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
          onAddEntry(deletingProject.Document_No);
        }

        const projectHours = await fetchProjectHours(
          new Date(deletingProject.Timesheet_Entry_Date),
          deletingProject.Document_No
        );
        setProjectHours(projectHours);

        setShowDeleteModal(false);
        setDeletingProject(null);
      } else {
        setError(result.error || "Failed to delete entry. Please try again.");
      }
    } catch (error) {
      setError("Error deleting timesheet entry. Please try again.");
    } finally {
      setLoadingDeleteEntry(false);
    }
  };

  // Action handlers
  const handleEdit = (project) => {
    setEditingProject(project);
    setHoursWorked(project.Hours_Worked);
    setSelectedProject(project.Project);
    setShowEditModal(true);
  };

  const handleDelete = (project) => {
    setDeletingProject(project);
    setShowDeleteModal(true);
  };

  // Modal close handlers
  const handleClose = () => {
    setShowModal(false);
    setHoursWorked("");
    setSelectedProject("");
    setError("");
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setHoursWorked("");
    setSelectedProject("");
    setError("");
    setEditingProject(null);
  };

  const handleDeleteClose = () => {
    setShowDeleteModal(false);
    setDeletingProject(null);
    setError("");
  };

  // Calculate total hours
  // Calculate total hours for active month only
  const totalHoursWorked = entries.reduce((total, entry) => {
    if (!activeMonth) return total;

    const entryDate = moment(entry.Date);
    const entryYear = entryDate.year();
    const entryMonth = entryDate.month();

    // Only include entries from the active month that are on or before today
    if (
      entryYear === activeMonth.year &&
      entryMonth === activeMonth.month &&
      entryDate.isSameOrBefore(moment(), "day")
    ) {
      return total + (entry.HoursWorked || 0);
    }
    return total;
  }, 0);

  return (
    <div>
      <h3 className="mb-2">Timesheet Calendar</h3>

      {alertMessage && (
        <Alert
          variant={alertMessage.variant}
          className="mt-2"
          onClose={() => setAlertMessage(null)}
          dismissible
        >
          {alertMessage.text}
        </Alert>
      )}

      <Calendar
        onChange={setSelectedDate}
        onClickDay={handleDateClick}
        value={selectedDate}
        tileClassName={tileClassName}
        tileContent={tileContent}
      />

      <DateDetails selectedDate={selectedDate} entries={entries} />
      <CalendarLegend
        totalHoursWorked={totalHoursWorked}
        activeMonth={activeMonth}
      />
      <ProjectHoursList
        projectHours={projectHours}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        region={region}
      />

      {/* Modals */}
      <AddEntryModal
        show={showModal}
        onHide={handleClose}
        popupDate={moment(popupDate)}
        hoursWorked={hoursWorked}
        handleHoursWorkedChange={handleHoursWorkedChange}
        region={region}
        selectedProject={selectedProject}
        handleProjectChange={handleProjectChange}
        projects={projects}
        error={error}
        loadingAddEntry={loadingAddEntry}
        handleSubmit={handleSubmit}
        getMaxHoursForDay={getMaxHoursForDay}
      />

      <EditEntryModal
        show={showEditModal}
        onHide={handleEditClose}
        editingProject={editingProject}
        hoursWorked={hoursWorked}
        handleHoursWorkedChange={handleHoursWorkedChange}
        region={region}
        selectedProject={selectedProject}
        handleProjectChange={handleProjectChange}
        projects={projects}
        error={error}
        loadingEditEntry={loadingEditEntry}
        handleEditSubmit={handleEditSubmit}
        getMaxHoursForDay={getMaxHoursForDay}
      />

      <DeleteEntryModal
        show={showDeleteModal}
        onHide={handleDeleteClose}
        deletingProject={deletingProject}
        error={error}
        loadingDeleteEntry={loadingDeleteEntry}
        handleDeleteSubmit={handleDeleteSubmit}
        region={region}
      />
    </div>
  );
};

export default TimesheetCalendar;
