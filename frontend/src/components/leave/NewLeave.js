import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LeaveReliever from "./LeaveReliever";
import successful from "../../../static/img/logo/successful.gif";
import LeaveApplicationForm from "./LeaveApplicationForm";
import RelieverList from "./RelieverList";
import DropzoneFileUpload from "./DropzoneFileUpload";
import AttachmentList from "./AttachmentList";
import LeaveNavigation from "./LeaveNavigation";
import LeaveApprovers from "./LeaveApprovers";

const NewLeave = () => {
  // Load initial state from sessionStorage, or default values
  const [activeTab, setActiveTab] = useState(
    sessionStorage.getItem("activeTab") || "wizard-info"
  );
  const [completedTabs, setCompletedTabs] = useState([]);
  const [retrievedCode, setRetrievedCode] = useState(
    sessionStorage.getItem("retrievedCode") || ""
  );
  const [relievers, setRelievers] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const inactivityTimer = useRef(null);

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

  const handleNextStep = (nextTab) => {
    setCompletedTabs((prev) => [...new Set([...prev, activeTab])]);
    setActiveTab(nextTab);
  };
  const getTabIcon = (tab) => {
    return completedTabs.includes(tab)
      ? "fa fa-check"
      : "fa fa-angle-double-right";
  };

  const handleCodeRetrieved = (applicationNo) => {
    setRetrievedCode(applicationNo);
    toast.success("Application saved successfully!", {
      position: "top-right",
      autoClose: 5000,
    });
    handleNextStep("bank-wizard"); // Move to the next tab after code retrieval
  };

  const handleFetchLines = (data) => {
    setRelievers(data);
  };

  const handleFetchAttachments = (data) => {
    setAttachments(data);
  };

  const handleFetchApprovers = (data) => {
    setApprovers(data);
  };

  return (
    <div>
      <Breadcrumb
        pageTitle="New Leave Application"
        breadcrumb="Leave Application"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <div className="horizontal-wizard-wrapper">
                  <div className="row g-3">
                    <div className="col-12 main-horizontal-header">
                      <div className="nav nav-pills horizontal-options">
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
                              <h6>Leave Application Form</h6>
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
                              <i className={getTabIcon("bank-wizard")} />
                            </div>
                            <div className="horizontal-wizard-content">
                              <h6>Reliever/Attachments</h6>
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
                              <i className={getTabIcon("successful-wizard")} />
                            </div>
                            <div className="horizontal-wizard-content">
                              <h6>Completed</h6>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="tab-content dark-field">
                        {/* Step 1: Create Plan */}
                        <div
                          className={`tab-pane fade ${
                            activeTab === "wizard-info" ? "show active" : ""
                          }`}
                        >
                          <LeaveApplicationForm
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
                            <div className="col-md-6">
                              <div className="card b-r-3 card-primary p-3 h-100 border border-info">
                                <h4>
                                  Part 1: Add Leave Reliever{" "}
                                  <span className="text-danger">*</span>
                                </h4>
                                <p className="f-m-light mt-3">
                                  Note: This section is compulsory. The
                                  employees available to select as relievers are
                                  filtered based on department.
                                </p>
                                <LeaveReliever
                                  pk={retrievedCode}
                                  onFetchRelievers={handleFetchLines}
                                />
                                <RelieverList
                                  relievers={relievers}
                                  pk={retrievedCode}
                                  onDeleteReliever={handleFetchLines}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="card b-r-3 card-primary p-3 h-100 border border-info">
                                <h4>Part 2: Upload Leave Attachment</h4>
                                <p className="f-m-light mt-3">
                                  Note: This section is Optional.
                                </p>
                                <DropzoneFileUpload
                                  pk={retrievedCode}
                                  onFetchAttachments={handleFetchAttachments}
                                />
                                <AttachmentList attachments={attachments} />
                              </div>
                            </div>
                          </div>
                          <LeaveNavigation
                            activeTab={activeTab}
                            handleNextStep={handleNextStep}
                            pk={retrievedCode}
                            onFetchApprovers={handleFetchApprovers}
                            disabled={relievers.length === 0}
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
                                <LeaveApprovers
                                  approvers={approvers}
                                  pk={retrievedCode}
                                />
                              </div>
                              <div className="col-md-6">
                                <img src={successful} alt="successful" />
                                <h6>Successfully Completed</h6>
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

export default NewLeave;
