import React from "react";
import DataTable from "react-data-table-component";

const LeaveAdjustmentLines = ({ AdjustmentLinesData }) => {
  const columns = [
    {
      name: "Employee Name",
      selector: (row) => row.EmployeeName,
      sortable: true,
    },
    {
      name: "Leave Code",
      selector: (row) => row.LeaveCode,
    },
    {
      name: "Entry Type",
      selector: (row) => row.LeaveAdjEntryType,
    },
    {
      name: "New Entitlement",
      selector: (row) => row.NewEntitlement,
    },
    {
      name: "Transaction Type",
      selector: (row) => row.TransactionType,
    },
  ];

  return (
    <div className="row my-3">
      <div className="col-xl-12">
        <div className="card bg-primary text-white">
          <div className="card-body">
            <h6 className="text-white">Leave Adjustment Lines</h6>
            <DataTable
              columns={columns}
              data={AdjustmentLinesData}
              pagination
              striped
              highlightOnHover
              responsive
              theme="default"
              customStyles={{
                headCells: {
                  style: {
                    backgroundColor: "#2e86c1",
                    color: "white",
                    fontWeight: "bold",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveAdjustmentLines;
