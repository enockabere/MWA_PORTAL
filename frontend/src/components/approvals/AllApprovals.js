import React, { useState, useEffect } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faCheckCircle,
  faTimesCircle,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import ApprovalModal from "./ApprovalModal";
import Preloader from "../Layout/Preloader";
import DataTable from "react-data-table-component";

const AllApprovals = () => {
  const [activeTab, setActiveTab] = useState("open");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState({
    open: [],
    approved: [],
    rejected: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/selfservice/Approve/");
      const data = await response.json();
      const sorted = data.reverse();
      setApplications({
        open: sorted.filter((app) => app.Status === "Open"),
        approved: sorted.filter((app) => app.Status === "Approved"),
        rejected: sorted.filter((app) => app.Status === "Rejected"),
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleItemClick = (item) => {
    setSelectedApplication(item);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };

  const refreshApplications = () => {
    fetchApplications();
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const suffix = (d) =>
      d > 3 && d < 21 ? "th" : ["th", "st", "nd", "rd"][d % 10] || "th";
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${date.toLocaleString("default", {
      weekday: "short",
    })}, ${day}${suffix(day)} ${month}, ${year}`;
  };

  const getStatusBadge = (status) => {
    const badgeMap = {
      Open: "warning",
      Approved: "success",
      Rejected: "danger",
    };
    return (
      <span className={`badge bg-${badgeMap[status] || "secondary"}`}>
        {status}
      </span>
    );
  };

  const columns = [
    {
      name: "Document No.",
      selector: (row) => row.DocumentNo || "-",
      sortable: true,
    },
    {
      name: "Document Type",
      selector: (row) => row.DocumentType,
      sortable: true,
    },
    { name: "Status", cell: (row) => getStatusBadge(row.Status) },
    { name: "Sender Name", selector: (row) => row.Sender_Name },
    { name: "Due Date", selector: (row) => formatDate(row.Due_Date) },
    {
      name: "Last Modified",
      selector: (row) => formatDate(row.Last_Date_Time_Modified),
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleItemClick(row)}
        >
          <FontAwesomeIcon icon={faEye} className="me-1" /> View
        </button>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumb pageTitle="Document Approvals" breadcrumb="Approvals" />
      <div className="container-fluid">
        <div className="row project-cards">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                {/* Tabs inside card */}
                <ul className="nav nav-tabs mb-3">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "open" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("open")}
                    >
                      <FontAwesomeIcon icon={faFolderOpen} className="me-1" />
                      Open ({applications.open.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "approved" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("approved")}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                      Approved ({applications.approved.length})
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "rejected" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("rejected")}
                    >
                      <FontAwesomeIcon icon={faTimesCircle} className="me-1" />
                      Rejected ({applications.rejected.length})
                    </button>
                  </li>
                </ul>

                {/* Table inside same card */}
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
        </div>
      </div>

      <ApprovalModal
        show={showModal}
        onHide={handleModalClose}
        selectedApplication={selectedApplication}
        onApplicationSubmitted={refreshApplications}
        onCancelSubmission={refreshApplications}
      />
    </div>
  );
};

export default AllApprovals;
