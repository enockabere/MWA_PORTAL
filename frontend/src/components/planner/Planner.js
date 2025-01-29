import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import premium from "../../../static/img/bg/premium.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import PlannerLineForm from "./PlannerLineForm";
import PlannerStepNavigation from "./PlannerStepNavigation";
import CreateLeavePlanForm from "./CreateLeavePlanForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LinesTable from "./LinesTable";
import successful from "../../../static/img/logo/successful.gif";
import CountdownRedirect from "../Layout/CountdownRedirect";

const Planner = () => {
  const [activeTab, setActiveTab] = useState(
    sessionStorage.getItem("activeTab") || "wizard-info"
  );
  const [completedTabs, setCompletedTabs] = useState([]);
  const [myAction, setMyAction] = useState("insert");

  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const [retrievedCode, setRetrievedCode] = useState(
    sessionStorage.getItem("retrievedCode") || ""
  );
  const [plans, setPlans] = useState([]);
  const [countdownTime, setCountdownTime] = useState(null);
  const inactivityTimeout = useRef(null);

  const handleCountdownStart = (time) => {
    setCountdownTime(time);
  };

  useEffect(() => {
    sessionStorage.setItem("retrievedCode", retrievedCode);
    sessionStorage.setItem("activeTab", activeTab);
  }, [retrievedCode, activeTab]);

  const handleNextStep = (nextTab, isPrevious = false) => {
    setCompletedTabs((prev) => {
      if (!isPrevious) {
        return [...new Set([...prev, activeTab])];
      }
      return prev;
    });
    setActiveTab(nextTab);
  };

  const handleCodeRetrieved = (code) => {
    setRetrievedCode(code);
    handleNextStep("bank-wizard");
  };

  // Fetch plans for the given retrievedCode (pk)
  const fetchPlans = async (pk) => {
    try {
      const response = await fetch(`/selfservice/FnLeavePlannerLine/${pk}/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      if (Array.isArray(result.data)) {
        // If no plans exist, set new ones, otherwise append
        setPlans(result.data);
        sessionStorage.setItem("plans", JSON.stringify(result.data)); // Save to sessionStorage
      } else {
        toast.error("Fetched data is not in the expected format.");
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      toast.error("Failed to fetch plans.");
    }
  };

  const isTabClickable = (tab) => {
    return completedTabs.includes(tab) || activeTab === tab;
  };

  const resetInactivityTimeout = () => {
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }
    inactivityTimeout.current = setTimeout(() => {
      sessionStorage.clear();
      setActiveTab("wizard-info");
      setRetrievedCode("");
      setPlans([]);
      toast.warning("Session has expired due to inactivity.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }, 300000);
  };

  useEffect(() => {
    const handleUserActivity = () => resetInactivityTimeout();
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keypress", handleUserActivity);
    window.addEventListener("click", handleUserActivity);

    resetInactivityTimeout();

    return () => {
      clearTimeout(inactivityTimeout);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keypress", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
    };
  }, []);

  useEffect(() => {
    if (countdownTime > 0) {
      const timer = setInterval(() => {
        setCountdownTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdownTime]);

  useEffect(() => {
    if (activeTab === "wizard-info") {
      sessionStorage.removeItem("retrievedCode");
      setRetrievedCode("");
    } else if (retrievedCode) {
      fetchPlans(retrievedCode);
    }

    if (!retrievedCode) {
      setActiveTab("wizard-info");
    }
  }, [activeTab, retrievedCode]);

  useEffect(() => {
    // Log whenever retrievedCode changes
    if (retrievedCode) {
      fetchPlans(retrievedCode); // Fetch plans whenever retrievedCode changes
    }
  }, [retrievedCode]);

  return (
    <div>
      <Breadcrumb pageTitle="New Leave Planner" breadcrumb="Leave Planner" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <div className="horizontal-wizard-wrapper">
                  <div className="row g-3">
                    <div className="col-12 main-horizontal-header">
                      <div
                        className="nav nav-pills horizontal-options"
                        id="horizontal-wizard-tab"
                        role="tablist"
                        aria-orientation="vertical"
                      >
                        {[
                          "wizard-info",
                          "bank-wizard",
                          "successful-wizard",
                        ].map((tab, index) => (
                          <a
                            key={tab}
                            className={`nav-link ${
                              activeTab === tab ? "active" : ""
                            }`}
                            role="tab"
                            style={{
                              pointerEvents: isTabClickable(tab)
                                ? "auto"
                                : "none",
                              cursor: isTabClickable(tab)
                                ? "pointer"
                                : "not-allowed",
                              opacity: activeTab === tab ? 1 : 0.5,
                            }}
                            onClick={() => handleNextStep(tab)}
                          >
                            <div className="horizontal-wizard">
                              <div className="stroke-icon-wizard">
                                <i
                                  className={
                                    completedTabs.includes(tab)
                                      ? "fa fa-check-circle"
                                      : "fa fa-angle-double-right"
                                  }
                                />
                              </div>
                              <div className="horizontal-wizard-content">
                                <h6>
                                  {index === 0
                                    ? "Create Leave Plan"
                                    : index === 1
                                    ? "Leave Planner Lines"
                                    : "Completed"}
                                </h6>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="col-12">
                      <div
                        className="tab-content dark-field"
                        id="horizontal-wizard-tabContent"
                      >
                        {/* Step 1: Create Plan */}
                        <div
                          className={`tab-pane fade ${
                            activeTab === "wizard-info" ? "show active" : ""
                          }`}
                          id="wizard-info"
                        >
                          <CreateLeavePlanForm
                            retrievedCode={retrievedCode}
                            myAction={myAction}
                            onCodeRetrieved={handleCodeRetrieved}
                          />
                        </div>
                        {/* Step 2: Leave Planner Lines */}
                        <div
                          className={`tab-pane fade ${
                            activeTab === "bank-wizard" ? "show active" : ""
                          }`}
                          id="bank-wizard"
                        >
                          <div className="row g-3">
                            <div className="col-md-12">
                              <PlannerLineForm
                                pk={retrievedCode}
                                onFetchSamples={fetchPlans}
                                onAddPlan={handleNextStep}
                              />
                            </div>
                            <div className="mt-3">
                              <LinesTable
                                plans={plans}
                                pk={retrievedCode}
                                onFetchSamples={fetchPlans}
                              />
                            </div>
                          </div>
                          <PlannerStepNavigation
                            activeTab={activeTab}
                            handleNextStep={handleNextStep}
                            pk={retrievedCode}
                            onStartCountdown={handleCountdownStart}
                            myAction={myAction}
                            setMyAction={setMyAction}
                          />
                        </div>
                        {/* Step 3: Completed */}
                        <div
                          className={`tab-pane fade ${
                            activeTab === "successful-wizard"
                              ? "show active"
                              : ""
                          }`}
                          id="successful-wizard"
                        >
                          <div className="form-completed">
                            <img src={successful} alt="successful" />
                            <h6>Successfully Completed</h6>
                            <div className="mt-3">
                              {countdownTime !== null && (
                                <CountdownRedirect
                                  countdownTime={countdownTime}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Planner;
