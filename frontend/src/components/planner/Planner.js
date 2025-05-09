import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import PlannerLineForm from "./PlannerLineForm";
import PlannerStepNavigation from "./PlannerStepNavigation";
import CreateLeavePlanForm from "./CreateLeavePlanForm";
import LinesTable from "./LinesTable";
import CountdownRedirect from "../Layout/CountdownRedirect";
import { ToastContainer, toast } from "react-toastify";
import successful from "../../../static/img/logo/successful.gif";
import "react-toastify/dist/ReactToastify.css";

const steps = [
  { key: "wizard-info", label: "Create Leave Plan" },
  { key: "bank-wizard", label: "Leave Planner Lines" },
  { key: "successful-wizard", label: "Completed" },
];

const Planner = () => {
  const [activeStep, setActiveStep] = useState("wizard-info");
  const [completedSteps, setCompletedSteps] = useState([]);
  const [myAction, setMyAction] = useState("insert");
  const [retrievedCode, setRetrievedCode] = useState(
    sessionStorage.getItem("retrievedCode") || ""
  );
  const [plans, setPlans] = useState([]);
  const [countdownTime, setCountdownTime] = useState(null);
  const inactivityRef = useRef(null);

  const fetchPlans = async (pk) => {
    try {
      const res = await fetch(`/selfservice/FnLeavePlannerLine/${pk}/`);
      const result = await res.json();
      if (Array.isArray(result.data)) {
        setPlans(result.data);
        sessionStorage.setItem("plans", JSON.stringify(result.data));
      } else {
        toast.error("Unexpected data format.");
      }
    } catch (err) {
      toast.error("Failed to fetch plans.");
    }
  };

  const handleCodeRetrieved = (code) => {
    setRetrievedCode(code);
    sessionStorage.setItem("retrievedCode", code);
    setActiveStep("bank-wizard");
  };

  const handleNext = (nextStep, isBack = false) => {
    if (!isBack) {
      setCompletedSteps((prev) => Array.from(new Set([...prev, activeStep])));
    }
    setActiveStep(nextStep);
  };

  const isStepEnabled = (step) =>
    completedSteps.includes(step) || step === activeStep;

  const resetInactivity = () => {
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(() => {
      sessionStorage.clear();
      setRetrievedCode("");
      setPlans([]);
      setActiveStep("wizard-info");
      toast.warning("Session expired due to inactivity.");
    }, 300000); // 5 minutes
  };

  useEffect(() => {
    const activityHandler = () => resetInactivity();
    ["mousemove", "keypress", "click"].forEach((evt) => {
      window.addEventListener(evt, activityHandler);
    });
    resetInactivity();
    return () => {
      clearTimeout(inactivityRef.current);
      ["mousemove", "keypress", "click"].forEach((evt) =>
        window.removeEventListener(evt, activityHandler)
      );
    };
  }, []);

  useEffect(() => {
    if (retrievedCode && activeStep === "bank-wizard") {
      fetchPlans(retrievedCode);
    }
    if (!retrievedCode) setActiveStep("wizard-info");
  }, [activeStep, retrievedCode]);

  useEffect(() => {
    if (countdownTime > 0) {
      const interval = setInterval(
        () => setCountdownTime((prev) => prev - 1),
        1000
      );
      return () => clearInterval(interval);
    }
  }, [countdownTime]);

  return (
    <div>
      <Breadcrumb pageTitle="New Leave Planner" breadcrumb="Leave Planner" />
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <div className="horizontal-wizard-wrapper">
              <div className="row g-3">
                <div className="col-12 main-horizontal-header">
                  <div className="nav nav-pills horizontal-options">
                    {steps.map(({ key, label }, i) => (
                      <a
                        key={key}
                        className={`nav-link ${
                          activeStep === key ? "active" : ""
                        }`}
                        onClick={() => isStepEnabled(key) && handleNext(key)}
                        style={{
                          pointerEvents: isStepEnabled(key) ? "auto" : "none",
                          cursor: isStepEnabled(key)
                            ? "pointer"
                            : "not-allowed",
                          opacity: activeStep === key ? 1 : 0.5,
                        }}
                      >
                        <div className="horizontal-wizard">
                          <div className="stroke-icon-wizard">
                            <i
                              className={`fa ${
                                completedSteps.includes(key)
                                  ? "fa-check-circle"
                                  : "fa-angle-double-right"
                              }`}
                            />
                          </div>
                          <div className="horizontal-wizard-content">
                            <h6>{label}</h6>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="col-12">
                  <div className="tab-content dark-field">
                    {activeStep === "wizard-info" && (
                      <CreateLeavePlanForm
                        retrievedCode={retrievedCode}
                        myAction={myAction}
                        onCodeRetrieved={handleCodeRetrieved}
                      />
                    )}

                    {activeStep === "bank-wizard" && (
                      <>
                        <PlannerLineForm
                          pk={retrievedCode}
                          onFetchSamples={fetchPlans}
                          onAddPlan={handleNext}
                        />
                        <div className="mt-3">
                          <LinesTable
                            plans={plans}
                            pk={retrievedCode}
                            onFetchSamples={fetchPlans}
                          />
                        </div>
                        <PlannerStepNavigation
                          activeTab={activeStep}
                          handleNextStep={handleNext}
                          pk={retrievedCode}
                          onStartCountdown={setCountdownTime}
                          myAction={myAction}
                          setMyAction={setMyAction}
                        />
                      </>
                    )}

                    {activeStep === "successful-wizard" && (
                      <div className="form-completed text-center">
                        <img src={successful} alt="successful" />
                        <h6>Successfully Completed</h6>
                        {countdownTime !== null && (
                          <CountdownRedirect countdownTime={countdownTime} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Planner;
