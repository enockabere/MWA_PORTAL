import React, { useState, useEffect } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faFolderOpen,
  faCheckCircle,
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
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [availableYears, setAvailableYears] = useState([]); // State to store available years
  const { profileImage } = useDashboard();

  const imageSrc =
    profileImage &&
    `data:image/${profileImage.image_format};base64,${profileImage.encoded_string}`;

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

      // Extract unique years from the Leave_Period field
      const uniqueYears = [...new Set(data.map((plan) => plan.Leave_Period))];
      setAvailableYears(uniqueYears.sort()); // Sort years and store in state

      // Filter plans based on the selected year
      const sortedPlans = data.reverse();
      const allPlans = sortedPlans.filter(
        (plan) => plan.Leave_Period === selectedYear
      );
      const openPlans = allPlans.filter((plan) => !plan.Submitted);
      const submittedPlans = allPlans.filter((plan) => plan.Submitted);

      setPlans({ all: allPlans, open: openPlans, submitted: submittedPlans });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [selectedYear]); // Refetch plans when the selected year changes

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

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
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
                <div className="col-md-9 p-0">
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
                <div className="col-md-3 p-0 text-end">
                  <select
                    className="form-select"
                    value={selectedYear}
                    onChange={handleYearChange}
                  >
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
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
                ) : tabLoading ? (
                  <Preloader message="Loading tab, please wait..." />
                ) : paginationLoading ? (
                  <Preloader message="Loading page, please wait..." />
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
                              className="me-2 rounded-circle"
                              src={imageSrc}
                              style={{
                                borderRadius: "50%",
                                width: "30px",
                                height: "30px",
                              }}
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
