import React, { useState, useEffect } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faCheckCircle,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import Pagination from "../Layout/Pagination";
import ApprovalModal from "./ApprovalModal";
import Preloader from "../Layout/Preloader";
import { Modal, Button } from "react-bootstrap"; // Import React Bootstrap components

const AllApprovals = () => {
  const itemsPerPage = 3;
  const [activeTab, setActiveTab] = useState("open");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState({
    open: [],
    approved: [],
    rejected: [],
  });
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/selfservice/Approve/");
      const data = await response.json();

      const sortedApplications = data.reverse();
      const openApplications = sortedApplications.filter(
        (application) => application.Status === "Open"
      );
      const approvedApplications = sortedApplications.filter(
        (application) => application.Status === "Approved"
      );

      const rejectedApplications = sortedApplications.filter(
        (application) => application.Status === "Rejected"
      );

      setApplications({
        open: openApplications,
        approved: approvedApplications,
        rejected: rejectedApplications,
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

  const currentItems = applications[activeTab].slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTabClick = (tab) => {
    setTabLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setCurrentPage(1);
      setTabLoading(false);
    }, 500);
  };

  const handlePageChange = (newPage) => {
    setPaginationLoading(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setPaginationLoading(false);
    }, 500);
  };

  const handleItemClick = (item) => {
    setSelectedApplication(item || null);
    setShowModal(true); // Show the modal
  };

  const handleModalClose = () => {
    setShowModal(false); // Hide the modal
    setSelectedApplication(null);
  };

  const refreshApplications = () => {
    fetchApplications();
  };

  // Date formatting function
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    // Determine the suffix (st, nd, rd, th)
    const suffix = (day) => {
      if (day > 3 && day < 21) return "th"; // Catch 4th-20th
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

    const formattedDate = `${date.toLocaleString("default", {
      weekday: "short",
    })}, ${day}${suffix(day)} ${month}, ${year}`;
    return formattedDate;
  };

  return (
    <div>
      <Breadcrumb pageTitle="Document Approvals" breadcrumb="Approvals" />
      <div className="container-fluid">
        <div className="row project-cards">
          <div className="col-md-12 project-list">
            <div className="card">
              <div className="row">
                <div className="col-md-6 p-0">
                  <ul
                    className="nav nav-tabs border-tab d-flex"
                    id="top-tab"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          activeTab === "open" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("open")}
                      >
                        <FontAwesomeIcon icon={faFolderOpen} /> Open (
                        {applications.open.length})
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          activeTab === "approved" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("approved")}
                      >
                        <FontAwesomeIcon icon={faCheckCircle} /> Approved (
                        {applications.approved.length})
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          activeTab === "rejected" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("rejected")}
                      >
                        <FontAwesomeIcon icon={faCheckCircle} /> Rejected (
                        {applications.rejected.length})
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                {loading ? (
                  <Preloader message="Loading page, please wait..." />
                ) : tabLoading ? (
                  <Preloader message="Loading tab, please wait..." />
                ) : paginationLoading ? (
                  <Preloader message="Loading page, please wait..." />
                ) : (
                  <table className="table table-striped my-3">
                    <thead>
                      <tr>
                        <th>Document Type</th>
                        <th>Status</th>
                        <th>Sender Name</th>
                        <th>Due Date</th>
                        <th>Last Modified</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item) => (
                        <tr key={item.Entry_No_}>
                          <td>{item.DocumentType}</td>
                          <td>{item.Status}</td>
                          <td>{item.Sender_Name}</td>
                          <td>{formatDate(item.Due_Date)}</td>
                          <td>{formatDate(item.Last_Date_Time_Modified)}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleItemClick(item)}
                            >
                              <FontAwesomeIcon
                                icon={faEye}
                                style={{ marginRight: "3px" }}
                              />{" "}
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

      {/* React Bootstrap Modal */}
      <ApprovalModal
        show={showModal} // Pass the show state
        onHide={handleModalClose} // Pass the function to hide the modal
        selectedApplication={selectedApplication}
        onApplicationSubmitted={refreshApplications}
        onCancelSubmission={refreshApplications}
      />
    </div>
  );
};

export default AllApprovals;
