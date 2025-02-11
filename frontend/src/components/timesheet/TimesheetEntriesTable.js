import React, { useState, useEffect, useMemo } from "react";
import { useTable, usePagination } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faArrowRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import Pagination from "../Layout/Pagination";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;
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
  const [loadingRows, setLoadingRows] = useState({});
  const [loading, setLoading] = useState(true);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  useEffect(() => {
    const fetchMaxHours = async () => {
      try {
        const response = await fetch(`/selfservice/get-max-timesheet-entries/`);
        if (response.ok) {
          const data = await response.json();
          setMaxHours({
            HoursWorkedMonThur: data.HoursWorkedMonThur,
            HoursWorkedFri: data.HoursWorkedFri,
          });
        }
      } catch (error) {
        console.error("Error fetching max hours:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaxHours();
  }, []);

  const handleEditClick = (entry) => {
    setSelectedEntry(entry);
    setUpdatedHours(entry.HoursWorked.toString());
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedEntry(null);
  };

  const handleSave = async () => {
    if (!validateHours()) return;

    const payload = {
      DocumentNo: selectedEntry.DocumentNo,
      EntryNo: selectedEntry.EntryNo,
      Date: selectedEntry.Date,
      HoursWorked: parseFloat(updatedHours),
    };

    try {
      const response = await fetch("/selfservice/timesheet-entry/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        onAddEntry(selectedEntry.DocumentNo);
        handleClose();
      }
    } catch (error) {
      console.error("Error submitting timesheet:", error);
    }
  };

  const handleSubmitEntry = async (entry) => {
    setLoadingRows((prev) => ({ ...prev, [entry.EntryNo]: true })); // Start loading

    const payload = { DocumentNo: entry.DocumentNo, EntryNo: entry.EntryNo };

    try {
      const response = await fetch("/selfservice/submit-timesheet-entry/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        alert("Timesheet entry submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting entry:", error);
    } finally {
      setLoadingRows((prev) => ({ ...prev, [entry.EntryNo]: false })); // Stop loading
    }
  };

  const validateHours = () => {
    const hours = parseFloat(updatedHours);
    const maxHoursForDay = getMaxHoursForDay(selectedEntry?.Date);
    return !(isNaN(hours) || hours < 0 || hours > maxHoursForDay);
  };

  const getMaxHoursForDay = (dateString) => {
    const date = new Date(dateString);
    return date.getDay() >= 1 && date.getDay() <= 4
      ? maxHours.HoursWorkedMonThur
      : maxHours.HoursWorkedFri;
  };

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "Date",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "Weekend",
        accessor: "Weekend",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
      {
        Header: "Holiday",
        accessor: "Holiday",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
      {
        Header: "Leave Day",
        accessor: "LeaveDay",
        Cell: ({ value }) => (value ? "Yes" : "No"),
      },
      {
        Header: "Hours Worked",
        accessor: "HoursWorked",
        Cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>{row.original.HoursWorked}</span>
            {!row.original.Holiday &&
              !row.original.Weekend &&
              !row.original.LeaveDay &&
              (row.original.TimeSheetStatus === "Open" ||
                row.original.TimeSheetStatus === "Rejected") && (
                <FontAwesomeIcon
                  icon={faEdit}
                  style={{
                    color: "#1976D2",
                    cursor: "pointer",
                    fontSize: "6px",
                  }}
                  onClick={() => handleEditClick(row.original)}
                />
              )}
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "TimeSheetStatus",
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <Button
            variant="success"
            size="sm"
            onClick={() => handleSubmitEntry(row.original)}
            disabled={
              loadingRows[row.original.EntryNo] ||
              !(
                row.original.TimeSheetStatus === "Open" ||
                row.original.TimeSheetStatus === "Rejected"
              )
            }
          >
            {loadingRows[row.original.EntryNo] ? (
              <span>
                <i className="fa fa-spinner fa-spin" /> Submitting...
              </span>
            ) : (
              <span>
                Submit{" "}
                <i
                  className="fa fa-arrow-right "
                  style={{ marginLeft: "3px" }}
                />
              </span>
            )}
          </Button>
        ),
      },
    ],
    [data]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state: { pageIndex },
    pageCount,
    gotoPage,
  } = useTable({ columns, data, initialState: { pageSize: 3 } }, usePagination);

  return (
    <div className="card mt-3 p-3">
      <h6>{title}</h6>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <table
            {...getTableProps()}
            className="table table-bordered table-responsive table-hover my-3"
            style={{ borderRadius: "5px" }}
          >
            <thead className="thead-dark">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Pagination
            currentPage={pageIndex + 1}
            totalPages={pageCount}
            onPageChange={(page) => gotoPage(page - 1)}
          />
        </>
      )}

      {/* Edit Hours Modal */}
      <Modal show={openModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h6>
              Edit Hours Worked on{" "}
              <span className="text-primary">
                {selectedEntry && formatDate(selectedEntry.Date)}
              </span>
            </h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Hours Worked</Form.Label>
            <Form.Control
              type="number"
              value={updatedHours}
              onChange={(e) => setUpdatedHours(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel <FontAwesomeIcon icon={faTimes} />
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TimesheetEntriesTable;
