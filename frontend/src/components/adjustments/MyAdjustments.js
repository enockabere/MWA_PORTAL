import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import Breadcrumb from "../Layout/Breadcrumb";
import AdjustmentModal from "./AdjustmentModal";
import Preloader from "../Layout/Preloader";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const MyAdjustments = () => {
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
      const response = await fetch("/selfservice/LeaveAdjustments/");
      const data = await response.json();
      const sortedApplications = data.reverse();

      setApplications({
        open: sortedApplications.filter((a) => a.Status === "Open"),
        pending: sortedApplications.filter(
          (a) => a.Status === "Pending Approval"
        ),
        approved: sortedApplications.filter((a) => a.Status === "Released"),
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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const columns = useMemo(
    () => [
      {
        name: "Adjustment No.",
        selector: (row) => row.Code,
        sortable: true,
      },
      {
        name: "Transaction Type",
        selector: (row) => row.TransactionType,
        sortable: true,
      },
      {
        name: "Status",
        selector: (row) => row.Status,
        sortable: true,
      },
      {
        name: "Posted Date",
        selector: (row) => formatDate(row.PostedDate),
      },
      {
        name: "Maturity Date",
        selector: (row) => formatDate(row.MaturityDate),
      },
      {
        name: "Description",
        selector: (row) => row.Description,
      },
      {
        name: "Actions",
        cell: (row) => (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleItemClick(row)}
          >
            <FontAwesomeIcon icon={faEye} className="me-1" /> View
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <Breadcrumb
        pageTitle="My Leave Adjustments"
        breadcrumb="Leave Adjustments"
      />
      <ToastContainer />

      <div className="container-fluid">
        <div className="card py-3">
          <div className="card-body">
            <ul className="nav nav-tabs mb-3">
              {["open", "pending", "approved"].map((tab) => (
                <li className="nav-item" key={tab}>
                  <button
                    className={`nav-link ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} (
                    {applications[tab].length})
                  </button>
                </li>
              ))}
            </ul>

            {loading ? (
              <Preloader message="Loading applications, please wait..." />
            ) : (
              <DataTable
                columns={columns}
                data={applications[activeTab]}
                pagination
                highlightOnHover
                responsive
                striped
                customStyles={{
                  table: {
                    style: {
                      border: "none",
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>

      <AdjustmentModal
        selectedApplication={selectedApplication}
        onApplicationSubmitted={fetchApplications}
        onCancelSubmission={fetchApplications}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default MyAdjustments;
