import React, { useState, useEffect } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer } from "react-toastify";
import DataTable from "react-data-table-component";
import ApplicationModal from "./ApplicationModal";
import Preloader from "../Layout/Preloader";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const Applications = () => {
  const [activeTab, setActiveTab] = useState("open");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState({
    open: [],
    pending: [],
    approved: [],
  });
  const [loading, setLoading] = useState(true);

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
      });
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleTabClick = (tab) => setActiveTab(tab);
  const handleItemClick = (item) => {
    setSelectedApplication(item);
    new window.bootstrap.Modal(
      document.getElementById("bd-example-modal-xl")
    ).show();
  };
  const handleModalClose = () => {
    setSelectedApplication(null);
    const modalElement = document.getElementById("bd-example-modal-xl");
    if (modalElement) {
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const columns = [
    {
      name: "Document No.",
      selector: (row) => row.Application_No,
      sortable: true,
    },
    {
      name: "Leave Code",
      selector: (row) => row.Leave_Code,
    },
    {
      name: "Status",
      selector: (row) => row.Status,
      cell: (row) => (
        <span
          className={`badge bg-${
            row.Status === "Open"
              ? "warning"
              : row.Status === "Pending Approval"
              ? "info"
              : "success"
          }`}
        >
          {row.Status}
        </span>
      ),
    },
    {
      name: "Start Date",
      selector: (row) => formatDate(row.Planner_Start_Date),
    },
    {
      name: "Resumption Date",
      selector: (row) => formatDate(row.Resumption_Date),
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
          onClick={() => handleItemClick(row)}
        >
          <FontAwesomeIcon icon={faEye} />
          View
        </button>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb
        pageTitle="My Leave Applications"
        breadcrumb="Leave Applications"
      />
      <ToastContainer />
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <ul className="nav nav-tabs mb-3">
              {Object.keys(applications).map((tab) => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link ${activeTab === tab ? "active" : ""}`}
                    onClick={() => handleTabClick(tab)}
                  >
                    <FontAwesomeIcon
                      icon={
                        tab === "open" || tab === "pending"
                          ? faFolderOpen
                          : faCheckCircle
                      }
                      className="me-1"
                    />
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} (
                    {applications[tab].length})
                  </button>
                </li>
              ))}
            </ul>

            {loading ? (
              <Preloader message="Loading page, please wait..." />
            ) : (
              <DataTable
                columns={columns}
                data={applications[activeTab]}
                pagination
                striped
                highlightOnHover
                responsive
              />
            )}
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
