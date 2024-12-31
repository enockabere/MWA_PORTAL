import React, { useState, useEffect } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faFolderOpen,
  faCheckCircle,
  faTable,
  faThLarge,
} from "@fortawesome/free-solid-svg-icons";
import Avatar from "../../../static/img/logo/pp.png";
import Pagination from "../Layout/Pagination";
import AdjustmentModal from "./AdjustmentModal";
import Preloader from "../Layout/Preloader";
import { ToastContainer } from "react-toastify";

const MyAdjustments = () => {
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
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const [isTableView, setIsTableView] = useState(false);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/selfservice/LeaveAdjustments/");
      const data = await response.json();

      const sortedApplications = data.reverse();
      const openApplications = sortedApplications.filter(
        (application) => application.Status === "Open"
      );
      const pendingApplications = sortedApplications.filter(
        (application) => application.Status === "Pending Approval"
      );
      const approvedApplications = sortedApplications.filter(
        (application) => application.Status === "Released"
      );

      const rejectedApplications = sortedApplications.filter(
        (application) => application.Status === "Rejected"
      );

      setApplications({
        open: openApplications,
        pending: pendingApplications,
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
    const modalElement = document.getElementById("bd-example-modal-xl");
    if (modalElement) {
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  };

  const refreshApplications = () => {
    fetchApplications();
  };

  return (
    <div>
      <Breadcrumb
        pageTitle="My Leave Adjustements"
        breadcrumb="Leave Adjustements"
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
                      <li className="nav-item" key={tab}>
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
                <div className="col-md-4 p-0 text-end">
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
                        <th>Transaction Type</th>
                        <th>Status</th>
                        <th>Posted Date</th>
                        <th>Maturity Date</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item) => (
                        <tr key={item.Code}>
                          <td>{item.TransactionType}</td>
                          <td>{item.Status}</td>
                          <td>{item.PostedDate}</td>
                          <td>{item.MaturityDate}</td>
                          <td>{item.Description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="row">
                    {currentItems.map((item) => (
                      <div
                        key={item.Code}
                        className="col-xxl-4 col-lg-4 box-col-33 col-md-6"
                      >
                        <div
                          className="project-box"
                          onClick={() => handleItemClick(item)}
                        >
                          <span className="badge badge-secondary mb-3">
                            {item.Status}
                          </span>
                          <h3 className="f-w-600 mt-4">
                            {item.TransactionType}
                          </h3>
                          <div className="d-flex">
                            <img
                              className="img-20 me-2 rounded-circle"
                              src={Avatar}
                              alt="team-member"
                            />
                            <div className="flex-grow-1">
                              <p className="mb-0">{item.PostedDate}</p>
                            </div>
                          </div>
                          <div className="row details">
                            <div className="col-6"> Maturity Date </div>
                            <div className="col-6 font-secondary">
                              {item.MaturityDate}
                            </div>
                            <div className="col-6"> Description </div>
                            <div className="col-6 font-secondary">
                              {item.Description}
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
      <AdjustmentModal
        selectedApplication={selectedApplication}
        onApplicationSubmitted={refreshApplications}
        onCancelSubmission={refreshApplications}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default MyAdjustments;
