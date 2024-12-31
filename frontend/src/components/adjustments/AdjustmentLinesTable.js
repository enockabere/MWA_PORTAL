import React from "react";
import MUIDataTable from "mui-datatables";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const AdjustmentLinesTable = ({ lines, title = "Leave Adjustment Lines" }) => {
  const defaultData = [];
  const data =
    lines && lines.data && Array.isArray(lines.data) && lines.data.length > 0
      ? lines.data
          .map((line) => ({
            LeaveType: line.LeaveCode,
            AdjustmentEntryType: line.LeaveAdjEntryType,
            NewEntitlement: line.NewEntitlement,
            TransactionType: line.TransactionType,
          }))
          .reverse() // Reverse to have last items first
      : defaultData;

  const columns = [
    { name: "LeaveType", label: "Leave Type" },
    { name: "AdjustmentEntryType", label: "Adjustment Entry Type" },
    { name: "NewEntitlement", label: "New Entitlement" },
    { name: "TransactionType", label: "Transaction Type" },
    {
      name: "action",
      label: "Action",
      options: {
        customBodyRender: (value, tableMeta) => (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <IconButton
              onClick={() => handleDeleteClick(tableMeta.rowData[0])}
              color="inherit"
              sx={{
                padding: "4px 8px",
                fontSize: "0.75rem",
                borderRadius: "50%",
                color: "red",
              }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </IconButton>
          </div>
        ),
      },
    },
  ];

  const options = {
    selectableRows: false,
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

  const handleDeleteClick = (id) => {
    console.log("Delete clicked for ID:", id);
  };

  return (
    <div className="card">
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

export default AdjustmentLinesTable;
