import React, { useState, useEffect } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TimesheetCalendar from "./TimesheetCalendar";
import TimesheetForm from "./TimesheetForm";
import ProjectSummary from "./ProjectSummary";
import TimesheetProgress from "./TimesheetProgress";
import { useDashboard } from "../context/DashboardContext";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const Timesheet = () => {
  const { dashboardData } = useDashboard();
  const [region, setRegion] = useState(dashboardData.user_data.sectionCode);
  const [Initiated, setInitiated] = useState(false);
  const [currentTimesheet, setCurrentTimesheet] = useState(null);
  const [timesheetEntries, setTimesheetEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchTimesheet = async () => {
    try {
      const response = await fetch("/selfservice/get-current-timesheet/");
      if (!response.ok) {
        console.error("Failed to fetch timesheet");
        return;
      }
      const data = await response.json();
      if (Object.keys(data).length > 0) {
        setCurrentTimesheet(data);
        setInitiated(true);
        fetchTimesheetByPk(data.Code);
      } else {
        setInitiated(false);
      }
    } catch (error) {
      console.error("Error fetching timesheet:", error);
    }
  };

  const fetchTimesheetByPk = async (pk) => {
    try {
      const response = await fetch(`/selfservice/get-timesheet-entries/${pk}/`);
      const entries = await response.json();
      setTimesheetEntries(entries);
      setInitiated(true);
    } catch (error) {
      console.error(`Error fetching timesheet with pk=${pk}:`, error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("/selfservice/get-user-projects/");
      if (!response.ok) {
        console.error("Failed to fetch projects");
        return;
      }
      const projectList = await response.json();
      setProjects(projectList);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchTimesheet();
    fetchProjects();
  }, []);

  const refreshTimesheets = () => {
    fetchTimesheet();
  };

  return (
    <div>
      <Breadcrumb
        pageTitle="Timesheet Entries"
        breadcrumb="Timesheet Entries"
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-8">
            <div className="card h-100">
              <div className="card-body">
                <TimesheetCalendar
                  entries={timesheetEntries}
                  style={{
                    width: "100%",
                    maxWidth: "1200px",
                    margin: "0 auto",
                  }}
                />
                <div className="my-3">
                  <Button variant="primary" onClick={() => setShowModal(true)}>
                    <FontAwesomeIcon icon={faEye} className="me-2" /> View
                    Assigned Projects
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <TimesheetForm
                  Initiated={Initiated}
                  region={region}
                  currentTimesheet={currentTimesheet}
                  entries={timesheetEntries}
                  onInitiate={refreshTimesheets}
                  onAddEntry={fetchTimesheetByPk}
                />
                {Initiated && <TimesheetProgress />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Project Summary */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header className="bg-primary text-white" closeButton>
          <Modal.Title>
            <h5 className="text-white">Assigned Projects</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProjectSummary projects={projects} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close{" "}
            <i className="fa fa-times-circle" style={{ marginLeft: "3px" }} />
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Timesheet;
