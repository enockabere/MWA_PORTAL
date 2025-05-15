import React, { useState } from "react";
import SidebarItem from "./SidebarItem";
import {
  faHouse,
  faFileAlt,
  faCalendar,
  faEnvelope,
  faEdit,
  faUser,
  faCheckCircle,
  faBook,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import dashboard from "../../../../static/img/logo/dashboard.png";
import { useDashboard } from "../../context/DashboardContext";

const SidebarMenu = ({ activeMenu, setActiveMenu }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const { dashboardData } = useDashboard();

  const user = dashboardData?.user_data || {};
  const approvalsCount = dashboardData?.open_approvals?.length || 0;
  const showLeaveMenus =
    user.sectionCode !== "USA" || user.Employee_No_ === "MWAK 123";

  return (
    <nav className="sidebar-main">
      <div className="left-arrow" id="left-arrow">
        <i className="fa fa-arrow-left" />
      </div>
      <div id="sidebar-menu">
        <ul className="sidebar-links" id="simple-bar">
          <li className="back-btn">
            <a href="#">
              <img
                className="img-fluid"
                height="20"
                width="20"
                src={dashboard}
                alt="Logo"
              />
            </a>
            <div className="mobile-back text-end">
              <span>Back</span>
              <i className="fa fa-angle-right ps-2" aria-hidden="true" />
            </div>
          </li>

          <li className="pin-title sidebar-main-title">
            <div>
              <h6>Pinned</h6>
            </div>
          </li>

          <li className="sidebar-main-title">
            <div>
              <h6>General</h6>
            </div>
          </li>

          <SidebarItem
            icon={faHouse}
            label="Dashboard"
            path="/selfservice/dashboard"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            openSubmenu={openSubmenu}
            setOpenSubmenu={setOpenSubmenu}
          />

          {showLeaveMenus && (
            <>
              <SidebarItem
                icon={faCalendar}
                label="Leave Planner"
                path="/selfservice/dashboard/leave-planner"
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                openSubmenu={openSubmenu}
                setOpenSubmenu={setOpenSubmenu}
                submenus={[
                  {
                    label: "New Planner",
                    path: "/selfservice/dashboard/leave-planner",
                  },
                  {
                    label: "My Plans",
                    path: "/selfservice/dashboard/my-plans",
                  },
                ]}
              />

              <SidebarItem
                icon={faEnvelope}
                label="Leave Request"
                path="/selfservice/dashboard/leave-dashboard"
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                openSubmenu={openSubmenu}
                setOpenSubmenu={setOpenSubmenu}
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
                  ...(user.HumanResourceManager || user.HOD_User
                    ? [
                        {
                          label: "Leave Balances",
                          path: "/selfservice/dashboard/balances",
                        },
                      ]
                    : []),
                ]}
              />

              <SidebarItem
                icon={faEdit}
                label="Adjustments"
                path="/selfservice/dashboard/new-adjustment"
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                openSubmenu={openSubmenu}
                setOpenSubmenu={setOpenSubmenu}
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
            </>
          )}

          <SidebarItem
            icon={faFileAlt}
            label="Reports"
            path="/selfservice/dashboard/leave-reports"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            openSubmenu={openSubmenu}
            setOpenSubmenu={setOpenSubmenu}
            submenus={[
              {
                label: "My Reports",
                path: "/selfservice/dashboard/leave-reports",
              },
            ]}
          />

          <SidebarItem
            icon={faCheckCircle}
            label="Approvals"
            path="/selfservice/dashboard/approvals"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            openSubmenu={openSubmenu}
            setOpenSubmenu={setOpenSubmenu}
            badgeCount={approvalsCount > 0 ? approvalsCount : undefined}
          />

          <SidebarItem
            icon={faBook}
            label="Timesheets"
            path="/selfservice/dashboard/timesheet-entries"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            openSubmenu={openSubmenu}
            setOpenSubmenu={setOpenSubmenu}
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

          <SidebarItem
            icon={faUser}
            label="Profile"
            path="/selfservice/dashboard/profile"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            openSubmenu={openSubmenu}
            setOpenSubmenu={setOpenSubmenu}
          />

          <SidebarItem
            icon={faSignOutAlt}
            label="Logout"
            path="/selfservice/logout"
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            openSubmenu={openSubmenu}
            setOpenSubmenu={setOpenSubmenu}
          />
        </ul>
      </div>
    </nav>
  );
};

export default SidebarMenu;
