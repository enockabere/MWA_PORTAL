import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashboardProvider } from "./components/context/DashboardContext"; // Import DashboardProvider
import LoginForm from "./components/LoginForm";
import ForgetPassword from "./components/ForgetPassword";
import DashboardComponent from "./components/Layout/DashboardComponent";
import UserDashboard from "./components/UserDashboard";
import Planner from "./components/planner/Planner";
import Plans from "./components/planner/Plans";
import Applications from "./components/leave/Applications";
import MyAdjustments from "./components/adjustments/MyAdjustments";
import PlanDetails from "./components/planner/PlanDetailsModal";
import Profile from "./components/Profile";
import Documentation from "./components/Documentation";
import NewLeave from "./components/leave/NewLeave";
import NewAdjustment from "./components/adjustments/NewAdjustment";
import LeaveReports from "./components/reports/LeaveReports";
import AllApprovals from "./components/approvals/AllApprovals";
import DPTBalances from "./components/leave/DPTBalances";
import LeaveDashboard from "./components/leave/LeaveDashboard";
import Logout from "./components/Layout/Logout";
import Timesheet from "./components/timesheet/Timesheet";

const App = () => {
  return (
    <DashboardProvider>
      {" "}
      {/* Wrap everything in DashboardProvider */}
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/selfservice" element={<LoginForm />} />
          <Route
            path="/selfservice/forgot-password"
            element={<ForgetPassword />}
          />
          <Route path="/selfservice/logout" element={<Logout />} />

          {/* Protected routes under /selfservice/dashboard */}
          <Route path="/selfservice/dashboard" element={<UserDashboard />}>
            <Route index element={<DashboardComponent />} />
            <Route path="leave-planner" element={<Planner />} />
            <Route path="my-plans" element={<Plans />} />
            <Route path=":id" element={<PlanDetails />} />
            <Route path="new-leave" element={<NewLeave />} />
            <Route path="my-applications" element={<Applications />} />
            <Route path="my-adjustments" element={<MyAdjustments />} />
            <Route path="new-adjustment" element={<NewAdjustment />} />
            <Route path="leave-reports" element={<LeaveReports />} />
            <Route path="profile" element={<Profile />} />
            <Route path="documentation" element={<Documentation />} />
            <Route path="approvals" element={<AllApprovals />} />
            <Route path="balances" element={<DPTBalances />} />
            <Route path="leave-dashboard" element={<LeaveDashboard />} />
            <Route path="timesheet-entries" element={<Timesheet />} />
          </Route>
        </Routes>
      </Router>
    </DashboardProvider>
  );
};

export default App;
