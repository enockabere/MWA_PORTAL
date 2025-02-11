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
import Pagination from "../Layout/Pagination";
import Avatar from "../../../static/img/logo/pp.png";
import PlanDetailsModal from "./PlanDetailsModal";
import Preloader from "../Layout/Preloader";
import { toast, ToastContainer } from "react-toastify";
import { useDashboard } from "../context/DashboardContext";

const Plans = () => {
  const itemsPerPage = 3;
  const [activeTab, setActiveTab] = useState("open");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState({ all: [], open: [], submitted: [] });
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const [isTableView, setIsTableView] = useState(false);
  const { profileImage } = useDashboard();

  const imageSrc = profileImage
    ? `data:image/${profileImage.image_format};base64,${profileImage.encoded_string}`
    : Avatar;

  const handleToast = (message, type) => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch("/selfservice/LeavePlanner/");
      const data = await response.json();

      const sortedPlans = data.reverse();
      const allPlans = sortedPlans;
      const openPlans = sortedPlans.filter((plan) => !plan.Submitted);
      const submittedPlans = sortedPlans.filter((plan) => plan.Submitted);

      setPlans({ all: allPlans, open: openPlans, submitted: submittedPlans });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const currentItems = plans[activeTab].slice(
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
    setSelectedPlan(item);
    const modal = new window.bootstrap.Modal(
      document.getElementById("bd-example-modal-xl")
    );
    modal.show();
  };

  const handleModalClose = () => {
    setSelectedPlan(null);
    const modalElement = document.getElementById("bd-example-modal-xl");
    if (modalElement) {
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  };

  const refreshPlans = () => {
    fetchPlans();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle empty or null dates
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    const options = { month: "long", year: "numeric" };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return `${day}${suffix} ${formattedDate}`;
  };

  return (
    <div>
      <Breadcrumb pageTitle="My Leave Plans" breadcrumb="Leave Plans" />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container-fluid">
        <div className="row project-cards">
          <div className="col-md-12 project-list">
            <div className="card">
              <div className="row">
                <div className="col-md-6 p-0">
                  <ul className="nav nav-tabs border-tab d-flex" role="tablist">
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          activeTab === "open" ? "active" : ""
                        }`}
                        onClick={() => handleTabClick("open")}
                      >
                        <FontAwesomeIcon icon={faFolderOpen} /> Open (
                        {plans.open.length})
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
                        {plans.submitted.length})
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
                        {plans.all.length})
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
                        <th>Name</th>
                        <th>Date</th>
                        <th>Leave Period</th>
                        <th>Days Planned</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item) => (
                        <tr key={item.No_}>
                          <td>{item.Employee_Name}</td>
                          <td>{formatDate(item.Date)}</td>
                          <td>{item.Leave_Period}</td>
                          <td>{item.Days_Planned}</td>
                          <td>{item.Submitted ? "Submitted" : "Open"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="row">
                    {currentItems.map((item) => (
                      <div
                        key={item.No_}
                        className="col-xxl-4 col-lg-4 box-col-33 col-md-6"
                      >
                        <div
                          className="project-box"
                          onClick={() => handleItemClick(item)}
                        >
                          <span className="badge badge-secondary">
                            {item.Submitted ? "Submitted" : "Open"}
                          </span>
                          <h3 className="f-w-600">{item.Employee_Name}</h3>
                          <div className="d-flex">
                            <img
                              className="img-20 me-2 rounded-circle"
                              src={imageSrc}
                              alt="team-member"
                            />
                            <div className="flex-grow-1">
                              <p className="mb-0">{formatDate(item.Date)}</p>
                            </div>
                          </div>
                          <div className="row details">
                            <div className="col-6"> Leave Period </div>
                            <div className="col-6 font-secondary">
                              {item.Leave_Period}
                            </div>
                            <div className="col-6"> Days Planned </div>
                            <div className="col-6 font-secondary">
                              {item.Days_Planned}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(plans[activeTab].length / itemsPerPage)}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <PlanDetailsModal
        selectedPlan={selectedPlan}
        onPlanSubmitted={refreshPlans}
        onReOpen={refreshPlans}
        onClose={handleModalClose}
        onShowToast={handleToast}
      />
    </div>
  );
};

export default Plans;
