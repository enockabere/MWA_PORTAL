import React from "react";
import mwaLogo from "../../../static/img/logo/logo.png";
import Avatar from "../../../static/img/logo/pp.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import dashboard from "../../../static/img/logo/dashboard.png";
import { useDashboard } from "../context/DashboardContext";

const Header = ({ notificationCount, avatarSrc }) => {
  const { dashboardData, setLoggedIn } = useDashboard();
  return (
    <div className="page-header">
      <div className="header-wrapper row m-0">
        <div className="header-logo-wrapper col-auto p-0">
          <div className="logo-wrapper">
            <a href="index.html">
              <img
                className="img-fluid for-light"
                height="20"
                width="20"
                src={dashboard}
                alt="Logo"
              />
              <img
                className="img-fluid for-light"
                height="20"
                width="20"
                src={dashboard}
                alt="Logo"
              />
            </a>
          </div>
          <div className="toggle-sidebar">
            <img
              className="img-fluid for-light"
              height="20"
              width="20"
              src={dashboard}
              alt="Logo"
            />
          </div>
        </div>
        <form
          className="col-sm-4 form-inline search-full d-none d-xl-block"
          action="#"
          method="get"
        >
          <div className="form-group">
            <div className="Typeahead Typeahead--twitterUsers">
              <div className="u-posRelative">
                <input
                  className="demo-input Typeahead-input form-control-plaintext w-100"
                  type="text"
                  placeholder="Type to Search .."
                  name="q"
                  autoFocus
                />
                <svg className="search-bg svg-color">
                  <use href={mwaLogo}></use>
                </svg>
              </div>
            </div>
          </div>
        </form>
        <div className="nav-right col-xl-8 col-lg-12 col-auto pull-right right-header p-0">
          <ul className="nav-menus">
            {/* Notification Dropdown */}
            <li className="onhover-dropdown">
              <div
                className="notification-box"
                style={{ position: "relative" }}
              >
                <div
                  className="notification-icon"
                  style={{ position: "relative" }}
                >
                  <FontAwesomeIcon icon={faBell} size="2x" />
                  {notificationCount > 0 && (
                    <span
                      className="badge"
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-10px",
                        backgroundColor: "red",
                        color: "white",
                        borderRadius: "50%",
                        padding: "5px 8px",
                        fontSize: "0.75rem",
                        zIndex: 10, // Ensure the badge is visible on top
                      }}
                    >
                      {notificationCount}
                    </span>
                  )}
                </div>
              </div>
              <div className="onhover-show-div notification-dropdown">
                <h6 className="f-18 mb-0 dropdown-title">Notifications</h6>
                <div className="notification-card">
                  <ul>
                    {/* Notification Items */}
                    {[
                      "You have new financial page design.",
                      "Congrats! you all tasks for today.",
                      "You have new in landing page design.",
                    ].map((notification, index) => (
                      <li key={index}>
                        <div className="user-notification">
                          <div>
                            <img src={Avatar} alt="avatar" />
                          </div>
                          <div className="user-description">
                            <a href="letter-box.html">
                              <h4>{notification}</h4>
                            </a>
                            <span>
                              Today{" "}
                              {new Date().toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="notification-btn">
                          <button
                            className="btn btn-pill btn-primary"
                            type="button"
                          >
                            Accept
                          </button>
                          <button
                            className="btn btn-pill btn-secondary"
                            type="button"
                          >
                            Decline
                          </button>
                        </div>
                        <div className="show-btn">
                          <a href="index.html">
                            <span>Show</span>
                          </a>
                        </div>
                      </li>
                    ))}
                    <li>
                      <a className="f-w-700" href="letter-box.html">
                        Check all
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
            <li className="profile-nav onhover-dropdown pe-0 py-0">
              <div className="d-flex align-items-center profile-media">
                <img
                  className="b-r-25"
                  src={Avatar}
                  height="50"
                  width="50"
                  alt="Profile"
                />
                <div className="flex-grow-1 user">
                  <span>
                    {dashboardData && dashboardData.user_data.full_name
                      ? `${dashboardData.user_data.full_name}`
                      : "John Doe"}
                  </span>
                  <p className="mb-0 font-nunito">
                    {dashboardData && dashboardData.user_data.sectionCode
                      ? `${dashboardData.user_data.sectionCode}`
                      : "Job Title"}
                  </p>
                </div>
              </div>
              <ul className="profile-dropdown onhover-show-div">
                <li>
                  <a href="user-profile.html">
                    <i data-feather="user"></i>
                    <span>Account </span>
                  </a>
                </li>
                <li>
                  <a href="letter-box.html">
                    <i data-feather="mail"></i>
                    <span>Inbox</span>
                  </a>
                </li>
                <li>
                  <a href="task.html">
                    <i data-feather="file-text"></i>
                    <span>Taskboard</span>
                  </a>
                </li>
                <li>
                  <a href="edit-profile.html">
                    <i data-feather="settings"></i>
                    <span>Settings</span>
                  </a>
                </li>
                <li>
                  <a href="login.html">
                    <i data-feather="log-in"></i>
                    <span>Log Out</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
