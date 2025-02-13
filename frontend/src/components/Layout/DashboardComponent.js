import React, { useEffect, useState } from "react";
import message from "../../../static/img/bg/massage.gif";
import books from "../../../static/img/bg/books.gif";
import {
  faEye,
  faArrowRight,
  faPlus,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breadcrumb from "./Breadcrumb";
import open_doc from "../../../static/img/bg/open.png";
import wall_clock from "../../../static/img/bg/wall-clock.png";
import reject from "../../../static/img/bg/reject.png";
import tick_mark from "../../../static/img/bg/tick-mark.png";
import FileSidebar from "./FileSidebar";
import NavigationButtons from "./NavigationButtons";
import LeaveBalances from "./LeaveBalances";
import { useDashboard } from "../context/DashboardContext";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import LeaveBalanceChart from "./LeaveBalanceChart";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const DashboardComponent = () => {
  const { dashboardData, setLoggedIn } = useDashboard();
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Simulate logging in after 2 seconds
    const loginTimer = setTimeout(() => setLoggedIn(true), 200);
    return () => clearTimeout(loginTimer);
  }, [setLoggedIn]);
  useEffect(() => {
    // Show toast if redirected with `showWelcomeToast`
    if (location.state?.showWelcomeToast) {
      toast.success("Welcome back!");
    }
  }, [location.state]);

  const renderActivityItem = (imgSrc, count, label, linkClass, linkTo) => (
    <li>
      <div className="recent-activity-data">
        <div className="activity-name">
          <span>
            <img
              className="img-fluid for-light"
              height="32"
              width="32"
              src={imgSrc}
              alt={label}
            />
          </span>
          <Link to={linkTo} className={linkClass}>
            <span className={linkClass}>{count ?? "0"}</span> {label}
          </Link>
        </div>
        <div className="view-btn">
          <Link to={linkTo}>
            View
            <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
          </Link>
        </div>
      </div>
    </li>
  );

  return (
    <div>
      <Breadcrumb pageTitle="Dashboard" breadcrumb="Dashboard" />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container-fluid default-dashboard">
        <div className="row">
          {/* Premium Card */}
          <motion.div
            className="col-xl-6 box-col-7 mb-3 proorder-md-1"
            initial={{ opacity: 0, y: 20 }} // Initial state (invisible and slightly down)
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }} // Duration of the animation
          >
            <div className="card h-100">
              <div className="card-body premium-card">
                <div className="row premium-courses-card">
                  <div className="col-md-5">
                    <h1 className="f-w-700">
                      Welcome,{" "}
                      {dashboardData?.user_data?.full_name ||
                        "Welcome to the dashboard"}
                    </h1>
                    <span className="f-light f-w-400 f-14">
                      <strong className="text-bold text-warning">
                        Reminder:
                      </strong>{" "}
                      You currently have{" "}
                      <span>
                        {dashboardData?.user_data?.open_leave_count || "0"}
                      </span>{" "}
                      open leave documents awaiting to be sent for approval.
                    </span>
                    <Link
                      to="/selfservice/dashboard/my-applications"
                      className="btn btn-square btn-primary mt-5 f-w-700"
                    >
                      View All <FontAwesomeIcon icon={faEye} className="me-2" />
                    </Link>
                  </div>
                  <div className="col-md-7 premium-course-img">
                    <div className="premium-message">
                      <img className="img-fluid" src={message} alt="massage" />
                    </div>
                    <div className="premium-books">
                      <img className="img-fluid" src={books} alt="books" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Leave Statistics */}
          <motion.div
            className="col-xl-3 box-col-5 mb-3 col-md-6 proorder-md-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="card h-100">
              <div className="card-header pb-0">
                <div className="header-top">
                  <h4>Leave Statistics</h4>
                </div>
              </div>
              <div className="card-body">
                <div className="activity-day">
                  <h6>Today</h6>
                </div>
                <div className="recent-activity-card">
                  <ul>
                    {renderActivityItem(
                      open_doc,
                      dashboardData?.user_data?.open_leave_count,
                      "Open Requests",
                      "text-dark",
                      "/selfservice/dashboard/my-applications"
                    )}
                    {renderActivityItem(
                      wall_clock,
                      dashboardData?.leave_data?.pendingLeave,
                      "Pending Requests",
                      "text-warning",
                      "/selfservice/dashboard/my-applications"
                    )}
                    {renderActivityItem(
                      tick_mark,
                      dashboardData?.leave_data?.approvedLeave,
                      "Approved Requests",
                      "text-success",
                      "/selfservice/dashboard/my-applications"
                    )}
                    {renderActivityItem(
                      reject,
                      dashboardData?.leave_data?.Rejected,
                      "Rejected Requests",
                      "text-danger",
                      "/selfservice/dashboard/my-applications"
                    )}
                  </ul>
                  <button className="btn mt-3 btn-outline-light txt-dark active w-100">
                    <Link
                      className="d-flex gap-2 align-items-center"
                      to="/selfservice/dashboard/new-leave"
                    >
                      <FontAwesomeIcon icon={faPlus} className="ms-2" /> New
                      Request
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Reports */}
          <motion.div
            className="col-xl-3 col-md-6 mb-3 proorder-md-3 box-col-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <div className="card h-100">
              <div className="card-header custom-border-bottom">
                <div className="header-top">
                  <h4>Reports</h4>
                </div>
              </div>
              <div>
                <FileSidebar />
              </div>
            </div>
          </motion.div>
          {/* Leave Balances */}
          <motion.div
            className="col-xl-7 mb-3 col-md-12 box-col-12 proorder-md-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <LeaveBalances />
          </motion.div>
          {/* Leave Balances Overview */}
          <motion.div
            className="col-xl-5 mb-3 col-md-12 proorder-md-5 box-col-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
          >
            <div className="card h-100">
              <div className="card-header">
                <div className="header-top">
                  <h4>Leave Balances Overview</h4>
                </div>
              </div>
              <div>
                <LeaveBalanceChart />
              </div>
            </div>
          </motion.div>
        </div>
        <div className="row">
          <NavigationButtons />
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
