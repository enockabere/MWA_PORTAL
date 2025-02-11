import React, { useState, useEffect } from "react";
import { useTable, usePagination } from "react-table";
import Pagination from "../Layout/Pagination";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "-";
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
  const [loading, setLoading] = useState(true); // New loading state

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
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
    fetchProjects();
  }, []);

  const columns = React.useMemo(
    () => [
      { Header: "Entry No", accessor: "EntryNo" },
      { Header: "Project", accessor: "ProjectTask" },
      {
        Header: "Start Date",
        accessor: "ProjectStartDate",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "End Date",
        accessor: "ProjectEndDate",
        Cell: ({ value }) => formatDate(value),
      },
      { Header: "Allocation", accessor: "Allocation" },
      { Header: "Supervisor Name", accessor: "SupervisorName" },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: projects,
      initialState: { pageIndex: 0, pageSize: 3 },
    },
    usePagination
  );

  return (
    <div className="card p-3">
      <h6 className="mb-3">{title}</h6>

      {/* Loading Indicator */}
      {loading ? (
        <div className="text-center p-3">
          <span className="spinner-border text-primary" role="status"></span>
          <p>Loading projects...</p>
        </div>
      ) : (
        <>
          <table
            {...getTableProps()}
            className="table table-bordered table-hover my-3"
          >
            <thead className="thead-light">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      key={column.id}
                      className="p-2 text-center"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.length > 0 ? (
                page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={row.original.EntryNo}>
                      {" "}
                      {/* Use EntryNo as key */}
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          key={cell.column.id}
                          className="p-2 text-center"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center p-3">
                    No projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Custom Pagination Component */}
          <Pagination
            currentPage={pageIndex + 1}
            totalPages={pageCount}
            onPageChange={(page) => gotoPage(page - 1)}
          />
        </>
      )}
    </div>
  );
};

export default TimesheetProjects;
