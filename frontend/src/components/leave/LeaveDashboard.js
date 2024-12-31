import React, { useState, useEffect } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import { useDashboard } from "../context/DashboardContext";
import Preloader from "../Layout/Preloader";
import "./leave_dashboard.css";
import { motion } from "framer-motion";
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "../planner/table.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

const LeaveDashboard = () => {
  const { dashboardData } = useDashboard();
  const [departmentLeaveData, setDepartmentLeaveData] = useState([]);
  const [startDatePassedLeaveData, setStartDatePassedLeaveData] = useState(0);
  const [plannedDepartmentLeaveData, setPlannedDepartmentLeaveData] =
    useState(0);
  const [unplannedDepartmentLeaveData, setUnplannedDepartmentLeaveData] =
    useState(0);
  const [futureDepartmentLeaveData, setFutureDepartmentLeaveData] = useState(0);
  const [loading, setLoading] = useState(true);

  const cardsData = [
    {
      title: "Absent Today",
      description: `Employees in ${dashboardData.user_data.Department} department who are on leave`,
      percentage: `${startDatePassedLeaveData}`,
      bgColor: "green-card",
    },
    {
      title: "Planned Leaves",
      description:
        "Leave requests systematically created using the leave planner tool",
      percentage: `${plannedDepartmentLeaveData}`,
      bgColor: "black-card",
    },
    {
      title: "Unplanned Leaves",
      description:
        "Leave requests that are initiated without utilizing the leave planner tool.",
      percentage: `${unplannedDepartmentLeaveData}`,
      bgColor: "purple-card",
    },
    {
      title: "Upcoming Leaves",
      description: `Total number of upcoming leave applications in the   ${dashboardData.user_data.Department} department.`,
      percentage: `${futureDepartmentLeaveData}`,
      bgColor: "yellow-card",
    },
  ];

  const fetchLeaveData = async () => {
    try {
      const response = await fetch("/selfservice/LeaveDashboard/");
      const data = await response.json();
      const upcomingLeaves = data["department_leave"];
      const departmentLeave = upcomingLeaves.map((item) => ({
        Application_No: item.Application_No,
        Employee_Name: item.Employee_Name,
        Leave_Type: item.Leave_Code,
        Application_Date: item.Application_Date,
        Leave_Code: item.Leave_Code,
        Start_Date: item.Start_Date,
        Resumption_Date: item.Resumption_Date,
        Status: item.Status,
      }));
      setDepartmentLeaveData(departmentLeave);
      setFutureDepartmentLeaveData(upcomingLeaves.length);

      setPlannedDepartmentLeaveData(data["planned_department_leave"].length);
      setUnplannedDepartmentLeaveData(
        data["un_planned_department_leave"].length
      );
      setStartDatePassedLeaveData(data["start_date_passed_leave"].length);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, []);

  useEffect(() => {
    // Initialize DataTable after data is fetched and rendered
    if (!loading && departmentLeaveData.length > 0) {
      $("#leaveTable").DataTable();
    }
    // Cleanup DataTable on component unmount
    return () => {
      if ($.fn.DataTable.isDataTable("#leaveTable")) {
        $("#leaveTable").DataTable().destroy();
      }
    };
  }, [loading, departmentLeaveData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <Breadcrumb
        pageTitle={`${dashboardData.user_data.Department} Leave Dashboard`}
        breadcrumb="Leave Dashboard"
      />

      <div className="container-fluid">
        {loading ? (
          <Preloader message="Loading page contents, please wait..." />
        ) : (
          <>
            <motion.div
              className="row my-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {cardsData.map((card, index) => (
                <motion.div
                  key={index}
                  className="col-md-3 mb-2"
                  variants={itemVariants}
                >
                  <div
                    className={`card h-100 border-0 custom-card ${card.bgColor}`}
                  >
                    <div>
                      <h5 className="card-title">{card.title}</h5>
                      <p className="card-text">{card.description}</p>
                      <hr />
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="percentage">{card.percentage}</p>
                        <FontAwesomeIcon icon={faUserPlus} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <div className="row project-cards">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <h4>All Upcoming Leaves</h4>
                    {departmentLeaveData.length > 0 ? (
                      <table
                        id="leaveTable"
                        className="table table-bordered display"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Application Date</th>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>Resumption Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {departmentLeaveData.map((leave) => (
                            <tr key={leave.Application_No}>
                              <td>{leave.Application_No}</td>
                              <td>{leave.Employee_Name}</td>
                              <td>{leave.Application_Date}</td>
                              <td>{leave.Leave_Code}</td>
                              <td>{leave.Start_Date}</td>
                              <td>{leave.Resumption_Date}</td>
                              <td>{leave.Status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-center">No data available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaveDashboard;
