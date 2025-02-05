import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form } from "react-bootstrap";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button as MUIButton } from "@mui/material";

// Format date as MM/DD/YYYY
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
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

  const dayOfMonth = date.getDate();
  const suffix = getDaySuffix(dayOfMonth);
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const weekday = date.toLocaleString("default", { weekday: "short" });

  return `${weekday}, ${dayOfMonth}${suffix} ${month}, ${year}`;
};

const TimesheetEntriesTable = ({
  data,
  onAddEntry,
  title = "Timesheet Entries",
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [updatedHours, setUpdatedHours] = useState("");
  const [maxHours, setMaxHours] = useState({
    HoursWorkedMonThur: 0,
    HoursWorkedFri: 0,
  });
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

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
  }, []);

  const getMaxHoursForDay = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();

    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      return maxHours.HoursWorkedMonThur; // Monday to Thursday
    } else if (dayOfWeek === 5) {
      return maxHours.HoursWorkedFri; // Friday
    }
    return 0;
  };

  const handleEditClick = (entry) => {
    setSelectedEntry(entry);
    setUpdatedHours(entry.HoursWorked.toString()); // Ensure it's a string for input
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedEntry(null);
  };

  const handleSave = async () => {
    // Prevent further action if it's a weekend or validation fails
    if (!validateHours()) return;

    const payload = {
      DocumentNo: selectedEntry.DocumentNo,
      EntryNo: selectedEntry.EntryNo,
      Date: selectedEntry.Date,
      HoursWorked: parseFloat(updatedHours), // Ensure hours are passed as a decimal
    };

    try {
      const response = await fetch("/selfservice/timesheet-entry/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken, // CSRF token for protection
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        onAddEntry(selectedEntry.DocumentNo);
        handleClose();
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error submitting timesheet:", error);
    }
  };

  useEffect(() => {
    if (openModal) {
      // Focus the input field when modal is open
      const inputElement = document.querySelector("input");
      if (inputElement) inputElement.focus();
    }
  }, [openModal]);

  const validateHours = () => {
    const hours = parseFloat(updatedHours);
    const maxHoursForDay = getMaxHoursForDay(selectedEntry?.Date);
    if (isNaN(hours) || hours < 0 || hours > maxHoursForDay) {
      console.error("Invalid hours input");
      return false;
    }
    return true;
  };

  const columns = [
    {
      name: "Date",
      label: "Date",
      options: {
        customBodyRender: (value) => formatDate(value),
      },
    },
    {
      name: "Weekend",
      label: "Weekend",
      options: {
        customBodyRender: (value) => (value ? "Yes" : "No"),
      },
    },
    {
      name: "Holiday",
      label: "Holiday",
      options: {
        customBodyRender: (value) => (value ? "Yes" : "No"),
      },
    },
    {
      name: "LeaveDay",
      label: "Leave Day",
      options: {
        customBodyRender: (value) => (value ? "Yes" : "No"),
      },
    },
    {
      name: "HoursWorked",
      label: "Hours Worked",
      options: {
        customBodyRender: (value, tableMeta) => {
          const rowData = data[tableMeta.rowIndex];
          const isEditable =
            !rowData.Holiday && !rowData.Weekend && !rowData.LeaveDay;

          return (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>{value}</span>
              {isEditable && (
                <IconButton
                  onClick={() => handleEditClick(rowData)}
                  color="primary"
                  sx={{ padding: "4px" }}
                >
                  <FontAwesomeIcon icon={faEdit} style={{ color: "#1976D2" }} />
                </IconButton>
              )}
            </div>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 3, // Show only 3 rows per page
    rowsPerPageOptions: [3], // Only allow 3 rows per page
    responsive: "standard",
    textLabels: {
      body: {
        noMatch: "No entries found",
        toolTip: "Sort",
      },
      pagination: {
        next: "Next Page",
        previous: "Previous Page",
        rowsPerPage: "Rows per page:",
        displayRows: "of",
      },
      toolbar: {
        search: "Search",
        downloadCsv: "Download CSV",
        print: "Print",
        viewColumns: "View Columns",
        filterTable: "Filter Table",
      },
      filter: {
        all: "All",
        title: "FILTERS",
        reset: "RESET",
      },
      viewColumns: {
        title: "Show Columns",
        titleAria: "Show/Hide Columns",
      },
    },
    setRowProps: (row, dataIndex, rowIndex) => {
      return {
        style: {
          fontSize: "12px", // Smaller font size for rows
        },
      };
    },
    setCellHeaderProps: () => ({
      style: {
        fontSize: "12px", // Smaller font size for headers
        fontWeight: "600", // Semi-bold headers
        backgroundColor: "#f0f0f0", // Light gray background for headers
        color: "#333", // Darker text color for headers
      },
    }),
  };

  const getMuiTheme = () =>
    createTheme({
      typography: {
        fontFamily: "Work Sans, sans-serif",
        fontSize: 12, // Default font size for the table
      },
      palette: {
        background: { paper: "#ffffff", default: "#ffffff" },
        mode: "light",
      },
      components: {
        MUIDataTable: {
          styleOverrides: {
            root: {
              boxShadow: "none", // Remove shadow
              border: "1px solid #e0e0e0", // Add a light border
            },
            paper: {
              boxShadow: "none", // Remove shadow
            },
          },
        },
        MUIDataTableHeadCell: {
          styleOverrides: {
            root: {
              padding: "8px 12px", // Adjust header cell padding
            },
          },
        },
        MUIDataTableBodyCell: {
          styleOverrides: {
            root: {
              padding: "8px 12px", // Adjust body cell padding
            },
          },
        },
      },
    });

  return (
    <div className="card mt-3 p-3">
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={title}
          data={data}
          columns={columns}
          options={options}
        />
      </ThemeProvider>

      <Modal
        show={openModal}
        onHide={handleClose}
        aria-labelledby="modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="modal-title">
            <h6>
              Edit Hours Worked on{" "}
              {selectedEntry && formatDate(selectedEntry.Date)}
            </h6>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Box
            sx={{
              width: 450,
              margin: "auto",
              padding: 3,
              backgroundColor: "white",
              borderRadius: 2,
              overflow: "auto", // Ensures no layout shift issues
            }}
          >
            <TextField
              autoFocus
              label={`Hours Worked (Max - ${getMaxHoursForDay(
                selectedEntry?.Date
              )} hours)`}
              type="number"
              fullWidth
              value={updatedHours}
              onChange={(e) => setUpdatedHours(e.target.value)}
              margin="normal"
              inputProps={{
                max: getMaxHoursForDay(selectedEntry?.Date),
                min: 0,
              }}
            />

            <MUIButton
              variant="contained"
              color="success"
              onClick={handleSave}
              sx={{ mt: 2 }}
            >
              Save
            </MUIButton>
          </Box>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TimesheetEntriesTable;