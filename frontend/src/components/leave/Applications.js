import React, { useState, useEffect } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faCheckCircle,
  faTable,
  faColumns,
} from "@fortawesome/free-solid-svg-icons";
import Avatar from "../../../static/img/logo/pp.png";
import { Link } from "react-router-dom";
import Pagination from "../Layout/Pagination";
import ApplicationModal from "./ApplicationModal";
import Preloader from "../Layout/Preloader";
import { toast, ToastContainer } from "react-toastify";

const CardItem = ({ item, onClick }) => (
  <div
    className="col-xxl-4 col-lg-4 box-col-33 col-md-6"
    onClick={() => onClick(item)}
  >
    <div className="project-box">
      <span className="badge badge-secondary">{item.Status}</span>
      <h3 className="f-w-600">{item.Leave_Code}</h3>
      <div className="d-flex">
        <img
          className="img-20 me-2 rounded-circle"
          src={Avatar}
          alt="team-member"
        />
        <div className="flex-grow-1">
          <p className="mb-0">{item.Date}</p>
        </div>
      </div>
      <div className="row details">
        <div className="col-6">
          <span>Leave Period</span>
        </div>
        <div className="col-6 font-secondary">{item.Leave_Period}</div>
        <div className="col-6">
          <span>Start Date</span>
        </div>
        <div className="col-6 font-secondary">{item.Planner_Start_Date}</div>
        <div className="col-6">
          <span>Resumption Date</span>
        </div>
        <div className="col-6 font-secondary">{item.Resumption_Date}</div>
      </div>
    </div>
  </div>
);

const TableView = ({ items, onClick }) => (
  <table className="table table-bordered my-3">
    <thead>
      <tr>
        <th>#</th>
        <th>Leave Code</th>
        <th>Status</th>
        <th>Start Date</th>
        <th>Resumption Date</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item) => (
        <tr key={item.Application_No} onClick={() => onClick(item)}>
          <td>{item.Application_No}</td>
          <td>{item.Leave_Code}</td>
          <td>{item.Status}</td>
          <td>{item.Planner_Start_Date}</td>
          <td>{item.Resumption_Date}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Applications = () => {
  const itemsPerPage = 3;
  const [activeTab, setActiveTab] = useState("open");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState({
    open: [],
    pending: [],
    approved: [],
    rejected: [],
  });
  const [loadingState, setLoadingState] = useState({
    general: true,
    tab: false,
    pagination: false,
  });
  const [viewMode, setViewMode] = useState("card");

  const fetchApplications = async () => {
    try {
      const response = await fetch("/selfservice/Leave/");
      const data = await response.json();
      const sortedApplications = data.reverse();

      setApplications({
        open: sortedApplications.filter((app) => app.Status === "Open"),
        pending: sortedApplications.filter(
          (app) => app.Status === "Pending Approval"
        ),
        approved: sortedApplications.filter((app) => app.Status === "Released"),
        rejected: sortedApplications.filter((app) => app.Status === "Rejected"),
      });
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoadingState((prev) => ({ ...prev, general: false }));
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const currentItems = applications[activeTab].slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTabClick = (tab) => {
    setLoadingState((prev) => ({ ...prev, tab: true }));
    setTimeout(() => {
      setActiveTab(tab);
      setCurrentPage(1);
      setLoadingState((prev) => ({ ...prev, tab: false }));
    }, 500);
  };

  const handlePageChange = (newPage) => {
    setLoadingState((prev) => ({ ...prev, pagination: true }));
    setTimeout(() => {
      setCurrentPage(newPage);
      setLoadingState((prev) => ({ ...prev, pagination: false }));
    }, 500);
  };

  const handleItemClick = (item) => {
    setSelectedApplication(item);
    new window.bootstrap.Modal(
      document.getElementById("bd-example-modal-xl")
    ).show();
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "card" ? "list" : "card"));
  };

  const handleModalClose = () => {
    setSelectedApplication(null);
    const modalElement = document.getElementById("bd-example-modal-xl");
    if (modalElement) {
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  };
  return (
    <div>
      <Breadcrumb
        pageTitle="My Leave Applications"
        breadcrumb="Leave Applications"
      />
      <ToastContainer />
      <div className="container-fluid">
        <div className="row project-cards">
          <div className="col-md-12 project-list">
            <div className="card">
              <div className="row">
                <div className="col-md-8 p-0">
                  <ul
                    className="nav nav-tabs border-tab d-flex"
                    id="top-tab"
                    role="tablist"
                  >
                    {["open", "pending", "approved", "rejected"].map((tab) => (
                      <li key={tab} className="nav-item">
                        <a
                          className={`nav-link ${
                            activeTab === tab ? "active" : ""
                          }`}
                          onClick={() => handleTabClick(tab)}
                        >
                          <FontAwesomeIcon
                            icon={
                              tab === "open" || tab === "pending"
                                ? faFolderOpen
                                : faCheckCircle
                            }
                            style={{
                              color: "#2b5f60",
                              strokeWidth: 4,
                              fill: "none",
                            }}
                          />{" "}
                          {tab.charAt(0).toUpperCase() + tab.slice(1)} (
                          {applications[tab].length})
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-4 p-0">
                  <button
                    className="btn btn-primary text-small mb-3"
                    onClick={toggleViewMode}
                  >
                    <FontAwesomeIcon
                      icon={viewMode === "card" ? faTable : faColumns}
                      className="me-2"
                    />
                    Switch to {viewMode === "card" ? "Table" : "Board"} View
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                {loadingState.general ? (
                  <Preloader message="Loading page, please wait..." />
                ) : loadingState.tab ? (
                  <Preloader message="Loading tab, please wait..." />
                ) : loadingState.pagination ? (
                  <Preloader message="Loading page, please wait..." />
                ) : viewMode === "card" ? (
                  <div className="row">
                    {currentItems.map((item) => (
                      <CardItem
                        key={item.Application_No}
                        item={item}
                        onClick={handleItemClick}
                      />
                    ))}
                  </div>
                ) : (
                  <TableView items={currentItems} onClick={handleItemClick} />
                )}
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(
                    applications[activeTab].length / itemsPerPage
                  )}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ApplicationModal
        selectedApplication={selectedApplication}
        onClose={handleModalClose}
        refreshApplications={fetchApplications}
      />
    </div>
  );
};

export default Applications;
