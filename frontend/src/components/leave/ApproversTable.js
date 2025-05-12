import React from "react";
import DataTable from "react-data-table-component";

const ApproversTable = ({ data, title = "Leave Approvers" }) => {
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
        padding: "10px 4px",
      },
    },
    cells: {
      style: {
        backgroundColor: "#ffffff",
        color: "#000000",
        padding: "7px 15px",
      },
    },
    rows: {
      style: {
        minHeight: "45px",
      },
    },
  };

  return (
    <div className="p-3">
      <DataTable
        title={title}
        columns={columns}
        data={data}
        customStyles={customStyles}
        pagination
        paginationPerPage={3}
        paginationRowsPerPageOptions={[3, 6, 9, 12, 15]}
        highlightOnHover
        striped
        responsive
        noHeader={false}
      />
    </div>
  );
};

export default ApproversTable;
