import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import Breadcrumb from "../Layout/Breadcrumb";
import PlanDetailsModal from "./PlanDetailsModal";
import Preloader from "../Layout/Preloader";
import Swal from "sweetalert2";

const Plans = () => {
  const [activeTab, setActiveTab] = useState("open");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState({ all: [], open: [], submitted: [] });
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [availableYears, setAvailableYears] = useState([]);

  const fetchPlans = async () => {
    try {
      const response = await fetch("/selfservice/LeavePlanner/");
      const data = await response.json();

      const uniqueYears = [...new Set(data.map((plan) => plan.Leave_Period))];
      setAvailableYears(uniqueYears.sort());

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
      Swal.fire({
        icon: "error",
        title: "Failed to Fetch",
        text: "There was an error loading your plans.",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [selectedYear]);

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

  const columns = useMemo(
    () => [
      {
        name: "Planner No.",
        selector: (row) => row.No_,
        sortable: true,
      },
      {
        name: "Employee",
        selector: (row) => row.Employee_Name,
        sortable: true,
      },
      {
        name: "Date",
        selector: (row) => new Date(row.Date).toLocaleDateString(),
        sortable: true,
      },
      {
        name: "Leave Period",
        selector: (row) => row.Leave_Period,
      },
      {
        name: "Days Planned",
        selector: (row) => row.Days_Planned,
      },
      {
        name: "Status",
        cell: (row) => (
          <span
            className={`badge ${row.Submitted ? "bg-success" : "bg-warning"}`}
          >
            {row.Submitted ? "Submitted" : "Open"}
          </span>
        ),
      },
      {
        name: "Actions",
        cell: (row) => (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleItemClick(row)}
          >
            <i className="fa fa-eye me-1" /> View
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <Breadcrumb pageTitle="My Leave Plans" breadcrumb="Leave Plans" />

      <div className="container-fluid">
        <div className="card py-3">
          <div className="card-body">
            {/* Tabs + Year Filter */}
            <div className="row mb-3">
              <div className="col-md-9">
                <ul className="nav nav-tabs">
                  {["open", "submitted", "all"].map((tab) => (
                    <li className="nav-item" key={tab}>
                      <button
                        className={`nav-link ${
                          activeTab === tab ? "active" : ""
                        }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)} (
                        {plans[tab].length})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-3 text-end">
                <select
                  className="form-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {availableYears.map((year) => (
                    <option key={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <Preloader message="Loading data, please wait..." />
            ) : (
              <DataTable
                columns={columns}
                data={plans[activeTab]}
                pagination
                highlightOnHover
                responsive
                striped
              />
            )}
          </div>
        </div>
      </div>

      <PlanDetailsModal
        selectedPlan={selectedPlan}
        onPlanSubmitted={fetchPlans}
        onReOpen={fetchPlans}
        onClose={handleModalClose}
        onShowToast={(msg, type) =>
          Swal.fire({
            icon: type,
            title: type === "success" ? "Success" : "Error",
            text: msg,
          })
        }
      />
    </div>
  );
};

export default Plans;
