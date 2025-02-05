import React, { useState, useEffect } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faFolderOpen,
  faCheckCircle,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Pagination from "../Layout/Pagination";
import Preloader from "../Layout/Preloader";
import { toast, ToastContainer } from "react-toastify";
import TimesheetDetailsModal from "./TimesheetDetailsModal";

const MyTimesheets = () => {
  const itemsPerPage = 3;
  const [activeTab, setActiveTab] = useState("open");
  const [currentPage, setCurrentPage] = useState(1);
  const [timesheets, setTimesheets] = useState({
    all: [],
    open: [],
    submitted: [],
  });
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [uniqueMonths, setUniqueMonths] = useState([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);

  const handleToast = (message, type) => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    }
  };

  const fetchTimesheets = async () => {
    try {
      const response = await fetch("/selfservice/get-timesheets/");
      const data = await response.json();

      const sortedTimesheets = data.reverse();

      const allTimesheets = sortedTimesheets;
      const openTimesheets = sortedTimesheets.filter(
        (timesheet) => !timesheet.Submitted
      );
      const submittedTimesheets = sortedTimesheets.filter(
        (timesheet) => timesheet.Submitted
      );

      setTimesheets({
        all: allTimesheets,
        open: openTimesheets,
        submitted: submittedTimesheets,
      });

      extractYearsAndMonths(sortedTimesheets);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
      toast.error("Error fetching timesheets");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  useEffect(() => {
    filterTimesheets();
  }, [timesheets, activeTab, selectedYear, selectedMonth]);

  const extractYearsAndMonths = (data) => {
    const years = new Set();
    const months = new Set();

    data.forEach((item) => {
      const date = new Date(item.PeriodStartDate);
      years.add(date.getFullYear());
      months.add(date.getMonth() + 1);
    });

    setUniqueYears([...years].sort((a, b) => b - a));
    setUniqueMonths([...months].sort((a, b) => a - b));
  };

  const filterTimesheets = () => {
    let filtered = timesheets[activeTab];

    // Apply year and month filters only for "open" and "submitted" tabs
    if (activeTab !== "all") {
      filtered = filtered.filter((item) => {
        const date = new Date(item.PeriodStartDate);
        return (
          date.getFullYear() === selectedYear &&
          date.getMonth() + 1 === selectedMonth
        );
      });
    }

    setFilteredTimesheets(filtered);
  };

  const getFilteredCount = (tab) => {
    if (tab === "all") {
      // For the "All" tab, return the total count without filtering
      return timesheets[tab].length;
    } else {
      // For "open" and "submitted" tabs, apply the year and month filters
      return timesheets[tab].filter((item) => {
        const date = new Date(item.PeriodStartDate);
        return (
          date.getFullYear() === selectedYear &&
          date.getMonth() + 1 === selectedMonth
        );
      }).length;
    }
  };

  const handleViewClick = (timesheet) => {
    setSelectedTimesheet(timesheet);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div>
      <Breadcrumb pageTitle="My Timesheets" breadcrumb="My Timesheets" />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container-fluid">
        <div className="row project-cards">
          <div className="col-md-12 project-list">
            <div className="card">
              <div className="row">
                <div className="col-md-6">
                  <ul className="nav nav-tabs border-tab d-flex" role="tablist">
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          activeTab === "open" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("open")}
                      >
                        <FontAwesomeIcon icon={faFolderOpen} /> Open (
                        {getFilteredCount("open")})
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          activeTab === "submitted" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("submitted")}
                      >
                        <FontAwesomeIcon icon={faCheckCircle} /> Submitted (
                        {getFilteredCount("submitted")})
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          activeTab === "all" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("all")}
                      >
                        <FontAwesomeIcon icon={faBullseye} /> All (
                        {getFilteredCount("all")})
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6 text-end">
                  <select
                    className="form-select d-inline w-auto mx-2"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    {uniqueYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-select d-inline w-auto mx-2"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  >
                    {uniqueMonths.map((month) => (
                      <option key={month} value={month}>
                        {new Date(0, month - 1).toLocaleString("en-US", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                {loading ? (
                  <Preloader message="Loading page, please wait..." />
                ) : (
                  <table className="table table-striped my-3">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Supervisor</th>
                        <th>Period Start Date</th>
                        <th>Period End Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTimesheets
                        .slice(
                          (currentPage - 1) * itemsPerPage,
                          currentPage * itemsPerPage
                        )
                        .map((item) => (
                          <tr key={item.Code}>
                            <td>{item.EmployeeName}</td>
                            <td>{item.EmployeeDesignation}</td>
                            <td>{item.SupervisorName}</td>
                            <td>{formatDate(item.PeriodStartDate)}</td>
                            <td>{formatDate(item.PeriodEndDate)}</td>
                            <td>{item.Submitted ? "Submitted" : "Open"}</td>
                            <td>
                              View{" "}
                              <FontAwesomeIcon
                                icon={faEye}
                                className="text-danger cursor-pointer"
                                onClick={() => handleViewClick(item)}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(
                    filteredTimesheets.length / itemsPerPage
                  )}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedTimesheet && (
        <TimesheetDetailsModal
          timesheet={selectedTimesheet}
          onClose={() => setSelectedTimesheet(null)}
          onShowToast={handleToast}
        />
      )}
    </div>
  );
};

export default MyTimesheets;
