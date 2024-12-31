import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import premium from "../../../static/img/bg/premium.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import successful from "../../../static/img/logo/successful.gif";
import AdjustmentHeader from "./AdjustmentHeader";
import AdjustmentLinesForm from "./AdjustmentLinesForm";
import CountdownRedirect from "../Layout/CountdownRedirect";
import AdjustmentLinesTable from "./AdjustmentLinesTable";
import AdjustmentStepNavigation from "./AdjustmentStepNavigation";
import AdjustmentApprovers from "./AdjustmentApprovers";

const NewAdjustment = () => {
  const [activeTab, setActiveTab] = useState(
    sessionStorage.getItem("activeTab") || "wizard-info"
  );
  const [completedTabs, setCompletedTabs] = useState([]);
  const [retrievedCode, setRetrievedCode] = useState(
    sessionStorage.getItem("retrievedCode") || ""
  );
  const [lines, setLines] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const inactivityTimer = useRef(null);
  const [lastCompletedTab, setLastCompletedTab] = useState(null);

  const [countdownTime, setCountdownTime] = useState(null);
  const handleCountdownStart = (time) => {
    setCountdownTime(time);
  };

  useEffect(() => {
    sessionStorage.setItem("retrievedCode", retrievedCode);
    sessionStorage.setItem("activeTab", activeTab);
  }, [retrievedCode, activeTab]);

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
      handleSessionTimeout();
    }, 300000);
  };

  const handleSessionTimeout = () => {
    sessionStorage.clear();
    toast.info("Session expired due to inactivity.", {
      position: "top-right",
      autoClose: 5000,
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    window.addEventListener("click", resetInactivityTimer);
    resetInactivityTimer();
    return () => {
      clearTimeout(inactivityTimer.current);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      window.removeEventListener("click", resetInactivityTimer);
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem("activeTab", activeTab);
    sessionStorage.setItem("completedTabs", JSON.stringify(completedTabs));
  }, [activeTab, completedTabs]);

  const getTabIcon = (tab) => {
    // If the tab is in completedTabs, show the check icon
    if (completedTabs.includes(tab)) {
      return "fa fa-check";
    }
    return "fa fa-angle-double-right"; // Default icon for incomplete tabs
  };

  const handleNextStep = (nextTab) => {
    setCompletedTabs((prevTabs) => {
      // Add the current activeTab to completedTabs if not already included
      if (!prevTabs.includes(activeTab)) {
        return [...prevTabs, activeTab];
      }
      return prevTabs;
    });
    setActiveTab(nextTab); // Move to the next tab
  };

  const handleCodeRetrieved = (applicationNo) => {
    setRetrievedCode(applicationNo);
    handleNextStep("bank-wizard");
  };

  const handleAddLines = (newLine) => {
    setLines((prevLines) => {
      const updatedLines = [...prevLines, newLine];
      return updatedLines;
    });

    toast.success("Adjustment Line added successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleFetchLines = (data) => {
    setLines(data);
  };

  const handleFetchApprovers = (data) => {
    setApprovers(data);
  };

  // Decrease countdownTime every second
  useEffect(() => {
    if (countdownTime > 0) {
      const timer = setInterval(() => {
        setCountdownTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdownTime]);

  return (
    <div>
      <Breadcrumb
        pageTitle="New Leave Adjustment"
        breadcrumb="Leave Adjustment"
      />
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
                        {/* Tab Links */}
                        <a
                          className={`nav-link ${
                            activeTab === "wizard-info" ? "active" : ""
                          }`}
                          role="tab"
                        >
                          <div className="horizontal-wizard">
                            <div className="stroke-icon-wizard">
                              <i className={getTabIcon("wizard-info")} />
                            </div>
                            <div className="horizontal-wizard-content ml-2">
                              <h6>Leave Adjustment Form</h6>
                            </div>
                          </div>
                        </a>
                        <a
                          className={`nav-link ${
                            activeTab === "bank-wizard" ? "active" : ""
                          }`}
                          role="tab"
                        >
                          <div className="horizontal-wizard">
                            <div className="stroke-icon-wizard">
                              <i className={getTabIcon("wizard-info")} />
                            </div>
                            <div className="horizontal-wizard-content">
                              <h6>Adjustment Lines</h6>
                            </div>
                          </div>
                        </a>
                        <a
                          className={`nav-link ${
                            activeTab === "successful-wizard" ? "active" : ""
                          }`}
                          role="tab"
                        >
                          <div className="horizontal-wizard">
                            <div className="stroke-icon-wizard">
                              <i className={getTabIcon("wizard-info")} />
                            </div>
                            <div className="horizontal-wizard-content">
                              <h6>Completed</h6>
                            </div>
                          </div>
                        </a>
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
                        >
                          <AdjustmentHeader
                            onApplicationNoRetrieved={handleCodeRetrieved}
                          />
                        </div>

                        {/* Step 2: Leave Planner Lines */}
                        <div
                          className={`tab-pane fade ${
                            activeTab === "bank-wizard" ? "show active" : ""
                          }`}
                        >
                          <div className="row g-3">
                            <div className="col-md-12">
                              <AdjustmentLinesForm
                                onAddLine={handleAddLines}
                                pk={retrievedCode}
                                onFetchLines={handleFetchLines}
                              />
                              <div className="mt-3">
                                <AdjustmentLinesTable lines={lines} />
                              </div>
                            </div>
                          </div>
                          <AdjustmentStepNavigation
                            activeTab={activeTab}
                            handleNextStep={handleNextStep}
                            pk={retrievedCode}
                            onStartCountdown={handleCountdownStart}
                            onFetchApprovers={handleFetchApprovers}
                          />
                        </div>

                        {/* Step 3: Completed */}
                        <div
                          className={`tab-pane fade ${
                            activeTab === "successful-wizard"
                              ? "show active"
                              : ""
                          }`}
                        >
                          <div className="form-completed">
                            <div className="row">
                              <div className="col-md-6">
                                <AdjustmentApprovers
                                  approvers={approvers}
                                  pk={retrievedCode}
                                />
                              </div>
                              <div className="col-md-6">
                                <img src={successful} alt="successful" />
                                <h6>Successfully Completed</h6>
                              </div>
                              <div className="col-md-12">
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
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NewAdjustment;
