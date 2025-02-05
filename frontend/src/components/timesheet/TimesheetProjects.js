import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

const TimesheetProjects = ({ title = "Assigned Projects" }) => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`/selfservice/get-user-projects/`);
        if (!response.ok) {
          console.error("Failed to fetch projects");
          return;
        }
        const projectList = await response.json();
        setProjects(projectList);
      } catch (error) {
        console.error("Error fetching max hours:", error);
      }
    };
    fetchProjects();
  }, []);

  const columns = [
    {
      name: "ProjectTask",
      label: "Project",
      options: {
        customBodyRender: (value) => value,
      },
    },
    {
      name: "ProjectStartDate",
      label: "Start Date",
      options: {
        customBodyRender: (value) => formatDate(value),
      },
    },
    {
      name: "ProjectEndDate",
      label: "End Date",
      options: {
        customBodyRender: (value) => formatDate(value),
      },
    },
    {
      name: "Allocation",
      label: "Allocation",
      options: {
        customBodyRender: (value) => value,
      },
    },
    {
      name: "SupervisorName",
      label: "Supervisor Name",
      options: {
        customBodyRender: (value) => value,
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
        noMatch: "No projects found",
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
    <div className="card p-3">
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={title}
          data={projects}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
    </div>
  );
};

export default TimesheetProjects;