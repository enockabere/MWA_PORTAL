import React from "react";
import DataTable from "react-data-table-component";

const ApproversTable = ({ data = [], title = "Adjustment Approvers" }) => {
  console.log(data);
  const columns = [
    {
      name: "Name",
      selector: (row) => row.Name,
      sortable: true,
    },
    {
      name: "Sequence",
      selector: (row) => row.Sequence,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.Status,
      sortable: true,
    },
    {
      name: "Modified By",
      selector: (row) => row.ModifiedBy,
      sortable: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#ffffff",
        color: "#000000",
        fontSize: "13px",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        backgroundColor: "#ffffff",
        color: "#000000",
        padding: "10px",
      },
    },
    rows: {
      style: {
        minHeight: "50px",
      },
    },
  };

  return (
    <div className="card p-3">
      <h5 className="mb-3">{title}</h5>
      <DataTable
        columns={columns}
        data={data}
        pagination
        striped
        highlightOnHover
        responsive
        customStyles={customStyles}
      />
    </div>
  );
};

export default ApproversTable;
