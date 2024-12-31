import React from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const ApproversTable = ({ data, title = "Leave Approvers" }) => {
  const columns = [
    { name: "Name", label: "Name" },
    { name: "Sequence", label: "Sequence" },
    { name: "Status", label: "Status" },
    { name: "ModifiedBy", label: "Modified By" },
  ];

  const options = {
    selectableRows: "none", // Changed from boolean to string value "none"
    elevation: 0,
    rowsPerPage: 3,
    rowsPerPageOptions: [3, 6, 9, 12, 15],
    responsive: "standard",
  };

  const getMuiTheme = () =>
    createTheme({
      typography: { fontFamily: "Work Sans, sans-serif" },
      palette: {
        background: { paper: "#ffffff", default: "#ffffff" },
        mode: "light",
      },
      components: {
        MuiPaper: { styleOverrides: { root: { borderRadius: "12px" } } },
        MuiTableCell: {
          styleOverrides: {
            head: {
              backgroundColor: "#ffffff",
              color: "#000000",
              padding: "10px 4px",
              fontSize: "13px",
            },
            body: {
              backgroundColor: "#ffffff",
              color: "#000000",
              padding: "7px 15px",
            },
          },
        },
        MuiTypography: {
          styleOverrides: {
            root: {
              "&.MuiTypography-h6": {
                color: "#000000",
                fontWeight: "bold",
                fontSize: "1rem",
              },
            },
          },
        },
        MuiTablePagination: {
          styleOverrides: {
            toolbar: { paddingLeft: "10px", paddingRight: "10px" },
            actions: { marginBottom: "0px" },
            selectLabel: {
              fontSize: "0.675rem",
              lineHeight: "1.5rem",
              margin: "0 8px",
            },
            displayedRows: { margin: "0 8px" },
            select: { verticalAlign: "middle" },
          },
        },
      },
    });

  return (
    <div className="p-3">
      <ThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title={title}
          data={data}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
    </div>
  );
};

export default ApproversTable;
