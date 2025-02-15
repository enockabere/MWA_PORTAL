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
  // Remove session storage for activeTab
  const [activeTab, setActiveTab] = useState("wizard-info");
  const [completedTabs, setCompletedTabs] = useState([]);

  // Don't persist retrievedCode in sessionStorage
  const [retrievedCode, setRetrievedCode] = useState("");

  const [relievers, setRelievers] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const inactivityTimer = useRef(null);

  // Function to reset session on inactivity
  const handleSessionTimeout = () => {
    setRetrievedCode(""); // Clear retrieved code on timeout
    toast.info("Session expired due to inactivity.", {
      position: "top-right",
      autoClose: 5000,
    });
  };

  // Inactivity Timer
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
      handleSessionTimeout();
    }, 300000); // 5 minutes
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

  // Function to handle code retrieval
  const handleCodeRetrieved = (applicationNo) => {
    setRetrievedCode(applicationNo);
    handleNextStep("bank-wizard");
  };

  const handleNextStep = (nextTab) => {
    setCompletedTabs((prev) => [...new Set([...prev, activeTab])]);
    setActiveTab(nextTab);
  };

  const getTabIcon = (tab) => {
    return completedTabs.includes(tab)
      ? "fa fa-check"
      : "fa fa-angle-double-right";
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
                        <div
                          className={`tab-pane fade ${
                            activeTab === "wizard-info" ? "show active" : ""
                          }`}
                        >
                          <LeaveApplicationForm
                            onApplicationNoRetrieved={handleCodeRetrieved}
                          />
                        </div>

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
                                  onFetchRelievers={setRelievers}
                                />
                                <RelieverList
                                  relievers={relievers}
                                  pk={retrievedCode}
                                  onDeleteReliever={setRelievers}
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
                                  onFetchAttachments={setAttachments}
                                />
                                <AttachmentList attachments={attachments} />
                              </div>
                            </div>
                          </div>
                          <LeaveNavigation
                            activeTab={activeTab}
                            handleNextStep={handleNextStep}
                            pk={retrievedCode}
                            onFetchApprovers={setApprovers}
                            disabled={relievers.length === 0}
                          />
                        </div>

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
