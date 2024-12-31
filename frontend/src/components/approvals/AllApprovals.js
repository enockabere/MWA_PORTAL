import React, { useState, useEffect } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faFolderOpen,
  faCheckCircle,
  faSquarePlus,
  faTable,
  faThLarge,
} from "@fortawesome/free-solid-svg-icons";
import Avatar from "../../../static/img/logo/pp.png";
import Pagination from "../Layout/Pagination";
import ApprovalModal from "./ApprovalModal";
import Preloader from "../Layout/Preloader";

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
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const [isTableView, setIsTableView] = useState(false);

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
    setSelectedApplication(item);
    const modal = new window.bootstrap.Modal(
      document.getElementById("bd-example-modal-xl")
    );
    modal.show();
  };

  const handleModalClose = () => {
    setSelectedApplication(null);
    const modal = new window.bootstrap.Modal(
      document.getElementById("bd-example-modal-xl")
    );
    modal.hide();
  };

  const refreshApplications = () => {
    fetchApplications();
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
                <div className="col-md-6 p-0 text-end">
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsTableView(!isTableView)}
                  >
                    <FontAwesomeIcon icon={isTableView ? faThLarge : faTable} />{" "}
                    {isTableView
                      ? "Switch to Card View"
                      : "Switch to Table View"}
                  </button>
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
                ) : isTableView ? (
                  <table className="table table-striped my-3">
                    <thead>
                      <tr>
                        <th>Document Type</th>
                        <th>Status</th>
                        <th>Sender Name</th>
                        <th>Due Date</th>
                        <th>Last Modified</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item) => (
                        <tr key={item.Entry_No_}>
                          <td>{item.DocumentType}</td>
                          <td>{item.Status}</td>
                          <td>{item.Sender_Name}</td>
                          <td>{item.Due_Date}</td>
                          <td>{item.Last_Date_Time_Modified}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="row">
                    {currentItems.map((item) => (
                      <div
                        key={item.Entry_No_}
                        className="col-xxl-4 col-lg-4 box-col-33 col-md-6"
                      >
                        <div
                          className="project-box"
                          onClick={() => handleItemClick(item)}
                        >
                          <span className="badge badge-secondary">
                            {item.Status}
                          </span>
                          <h3 className="f-w-600">{item.DocumentType}</h3>
                          <div className="d-flex">
                            <img
                              className="img-20 me-2 rounded-circle"
                              src={Avatar}
                              alt="team-member"
                            />
                            <div className="flex-grow-1">
                              <p className="mb-0">{item.Due_Date}</p>
                            </div>
                          </div>
                          <div className="row details">
                            <div className="col-6">Sender Name</div>
                            <div className="col-6 font-secondary">
                              {item.Sender_Name}
                            </div>
                            <div className="col-6">Last Modified</div>
                            <div className="col-6 font-secondary">
                              {item.Last_Date_Time_Modified}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
      <ApprovalModal
        selectedApplication={selectedApplication}
        onApplicationSubmitted={refreshApplications}
        onCancelSubmission={refreshApplications}
      />
    </div>
  );
};

export default AllApprovals;
