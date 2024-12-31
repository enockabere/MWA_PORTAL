import React, { useState } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TimesheetCalendar from "./TimesheetCalendar";
import TimesheetForm from "./TimesheetForm";
import ProjectSummary from "./ProjectSummary";
import TimesheetProgress from "./TimesheetProgress";

const Timesheet = () => {
  const [entries, setEntries] = useState({
    "2024-12-02": [
      { task: "Team Meeting", hours: 2 },
      { task: "Code Review", hours: 6 },
    ],
    "2024-12-04": [{ task: "Bug Fixing", hours: 7 }],
    "2024-12-12": [{ task: "Leave Day", hours: 8 }],
    "2024-12-20": [{ task: "Leave Day", hours: 8 }],
    "2024-12-25": [{ task: "Public Holiday", hours: 8 }],
    "2024-12-26": [{ task: "Public Holiday", hours: 8 }],
    "2024-12-31": [{ task: "Public Holiday", hours: 8 }],
  });

  const [monthInitiated, setMonthInitiated] = useState(false); // Track whether the timesheet is initiated
  const [region, setRegion] = useState("Nairobi"); // Default region is Nairobi

  const leaveDays = ["2024-12-12", "2024-12-20"]; // Employee's leave dates

  const publicHolidays = [
    "2024-12-25", // Christmas
    "2024-12-26", // Boxing Day
    "2024-12-31", // New Year's Eve
  ]; // Public holidays

  return (
    <div>
      <Breadcrumb
        pageTitle="Timesheet Entries"
        breadcrumb="Timesheet Entries"
      />
      <div className="container-fluid">
        <div className="row">
          {/* First Column - Form and Calendar */}
          <div className="col-lg-8">
            <div className="card h-100">
              <div className="card-body">
                <TimesheetCalendar
                  entries={entries}
                  leaveDays={leaveDays}
                  publicHolidays={publicHolidays}
                  region={region} // Pass region to calendar
                  style={{
                    width: "100%",
                    maxWidth: "1200px",
                    margin: "0 auto",
                  }}
                />
                <div className="mt-3 border p-2">
                  <h5>Legend:</h5>
                  <div className="d-flex align-items-center mb-2">
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "yellow",
                        display: "inline-block",
                        marginRight: "10px",
                      }}
                    ></span>
                    <span>Leave Day</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "red",
                        display: "inline-block",
                        marginRight: "10px",
                      }}
                    ></span>
                    <span>Public Holiday</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "blue",
                        display: "inline-block",
                        marginRight: "10px",
                      }}
                    ></span>
                    <span>Timesheet Entry</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "gray",
                        display: "inline-block",
                        marginRight: "10px",
                      }}
                    ></span>
                    <span>Weekend</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Column - Project Summary and Progress */}
          <div className="col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <TimesheetForm
                  entries={entries}
                  setEntries={setEntries}
                  monthInitiated={monthInitiated}
                  setMonthInitiated={setMonthInitiated}
                  region={region} // Pass region to form
                  setRegion={setRegion} // Set region
                />
                <ProjectSummary />
                <TimesheetProgress entries={entries} />
              </div>
            </div>
          </div>
        </div>
        {/* Legend Section */}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Timesheet;
