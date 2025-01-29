import React, { useState, useEffect } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TimesheetCalendar from "./TimesheetCalendar";
import TimesheetForm from "./TimesheetForm";
import ProjectSummary from "./ProjectSummary";
import TimesheetProgress from "./TimesheetProgress";
import { useDashboard } from "../context/DashboardContext";

const Timesheet = () => {
  const { dashboardData, setLoggedIn } = useDashboard();
  const [entries, setEntries] = useState({});
  const [leaveDays, setLeaveDays] = useState([]);
  const [region, setRegion] = useState(dashboardData.user_data.sectionCode);
  const publicHolidays = ["2024-12-25", "2024-12-26", "2024-12-31"]; // Public holidays
  const [monthInitiated, setMonthInitiated] = useState(null);

  useEffect(() => {
    const fetchLeaveDays = async () => {
      try {
        const response = await fetch("/selfservice/fetch-leave-days/");
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            "Expected JSON response but received: " + contentType
          );
        }
        if (response.ok) {
          const data = await response.json();
          console.log("Leave days data:", data);
          setLeaveDays(data);
        } else {
          console.error("Failed to fetch leave days, status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching leave days:", error);
      }
    };

    fetchLeaveDays();
  }, []);

  useEffect(() => {
    if (leaveDays.length > 0) {
      const updatedEntries = { ...entries };

      leaveDays.forEach(({ start_date, end_date }) => {
        let currentDate = new Date(start_date);
        const endDate = new Date(end_date);

        while (currentDate <= endDate) {
          const day = currentDate.toISOString().split("T")[0];
          const isWeekend =
            currentDate.getDay() === 0 || currentDate.getDay() === 6;
          const isPublicHoliday = publicHolidays.includes(day);

          if (!isWeekend && !isPublicHoliday) {
            const hours =
              region === "Nairobi"
                ? currentDate.getDay() === 5
                  ? 5 // Friday in Nairobi
                  : 8.5 // Weekday in Nairobi
                : 8; // Weekday in other regions

            if (!updatedEntries[day]) {
              updatedEntries[day] = [];
            }

            updatedEntries[day].push({ task: "Leave Day", hours });
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }
      });

      setEntries(updatedEntries);
    }
  }, [leaveDays, region]);

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
                  leaveDays={leaveDays.map((ld) => ld.start_date)}
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
