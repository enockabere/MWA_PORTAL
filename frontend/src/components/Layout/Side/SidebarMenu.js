import React from "react";
import SidebarItem from "./SidebarItem";
import {
  faHouse,
  faFileAlt,
  faCalendar,
  faEnvelope,
  faEdit,
  faUser,
  faCog,
  faUsers,
  faChartBar,
  faClock,
  faClipboardList,
  faCheckCircle,
  faBook,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import dashboard from "../../../../static/img/logo/dashboard.png"; // Import the dashboard image

const SidebarMenu = ({ activeMenu, setActiveMenu, dashboardData }) => {
  return (
    <nav className="sidebar-main">
      <div className="left-arrow" id="left-arrow">
        <i className="fa fa-arrow-left" />
      </div>
      <div id="sidebar-menu">
        <ul className="sidebar-links" id="simple-bar">
          {/* Back Button */}
          <li className="back-btn">
            <a href="#">
              <img
                className="img-fluid"
                height="20"
                width="20"
                src={dashboard} // Use the imported dashboard image
                alt="Logo"
              />
            </a>
            <div className="mobile-back text-end">
              <span>Back</span>
              <i className="fa fa-angle-right ps-2" aria-hidden="true" />
            </div>
          </li>

          {/* Pinned Section */}
          <li className="pin-title sidebar-main-title">
            <div>
              <h6>Pinned</h6>
            </div>
          </li>

          {/* General Section */}
          <li className="sidebar-main-title">
            <div>
              <h6>General</h6>
            </div>
          </li>

          {/* Dashboard Menu Item */}
          <SidebarItem
            icon={faHouse}
            label="Dashboard"
            path="/selfservice/dashboard"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />

          {/* Leave Planner Menu Item */}
          <SidebarItem
            icon={faCalendar}
            label="Leave Planner"
            path="/selfservice/dashboard/leave-planner"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            submenus={[
              {
                label: "New Planner",
                path: "/selfservice/dashboard/leave-planner",
              },
              { label: "My Plans", path: "/selfservice/dashboard/my-plans" },
            ]}
          />

          {/* Leave Request Menu Item */}
          <SidebarItem
            icon={faEnvelope}
            label="Leave Request"
            path="/selfservice/dashboard/leave-dashboard"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            submenus={[
              {
                label: "Leave Dashboard",
                path: "/selfservice/dashboard/leave-dashboard",
              },
              {
                label: "New Application",
                path: "/selfservice/dashboard/new-leave",
              },
              {
                label: "My Applications",
                path: "/selfservice/dashboard/my-applications",
              },
              ...(dashboardData?.user_data?.HumanResourceManager ||
              dashboardData?.user_data?.HOD_User
                ? [
                    {
                      label: "Leave Balances",
                      path: "/selfservice/dashboard/balances",
                    },
                  ]
                : []),
            ]}
          />

          {/* Adjustments Menu Item */}
          <SidebarItem
            icon={faEdit}
            label="Adjustments"
            path="/selfservice/dashboard/new-adjustment"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            submenus={[
              {
                label: "New Adjustment",
                path: "/selfservice/dashboard/new-adjustment",
              },
              {
                label: "My Adjustments",
                path: "/selfservice/dashboard/my-adjustments",
              },
            ]}
          />

          {/* Reports Menu Item */}
          <SidebarItem
            icon={faFileAlt}
            label="Reports"
            path="/selfservice/dashboard/leave-reports"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            submenus={[
              {
                label: "My Reports",
                path: "/selfservice/dashboard/leave-reports",
              },
            ]}
          />

          {/* Approvals Menu Item */}
          <SidebarItem
            icon={faCheckCircle}
            label="Approvals"
            path="/selfservice/dashboard/approvals"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />

          {/* Timesheets Menu Item */}
          <SidebarItem
            icon={faBook}
            label="Timesheets"
            path="/selfservice/dashboard/timesheet-entries"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            submenus={[
              {
                label: "Entries",
                path: "/selfservice/dashboard/timesheet-entries",
              },
              {
                label: "My Timesheets",
                path: "/selfservice/dashboard/my-timesheets",
              },
            ]}
          />

          {/* Documentation Menu Item */}
          <SidebarItem
            icon={faBook}
            label="Documentation"
            path="/selfservice/dashboard/documentation"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />

          {/* Profile Menu Item */}
          <SidebarItem
            icon={faUser}
            label="Profile"
            path="/selfservice/dashboard/profile"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />

          {/* Logout Menu Item */}
          <SidebarItem
            icon={faSignOutAlt}
            label="Logout"
            path="/selfservice/logout"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
          />
        </ul>
      </div>
    </nav>
  );
};

export default SidebarMenu;
