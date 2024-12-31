import React from "react";
import Breadcrumb from "./Layout/Breadcrumb";
import Avatar from "../../static/img/logo/pp.png";
import { useDashboard } from "./context/DashboardContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit, faUserCog } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const { dashboardData, setLoggedIn } = useDashboard();
  return (
    <div>
      <Breadcrumb pageTitle="My Profile" breadcrumb="My Profile" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-4">
            <div className="card">
              <div className="card-header pb-0">
                <h4 className="card-title mb-0">My Profile</h4>
                <div className="card-options">
                  <a
                    className="card-options-collapse"
                    href="#"
                    data-bs-toggle="card-collapse"
                  >
                    <i className="fe fe-chevron-up" />
                  </a>
                  <a
                    className="card-options-remove"
                    href="#"
                    data-bs-toggle="card-remove"
                  >
                    <i className="fe fe-x" />
                  </a>
                </div>
              </div>
              <div className="card-body">
                <form>
                  <div className="row mb-2">
                    <div className="profile-title">
                      <div className="d-flex">
                        {" "}
                        <img
                          className="img-70 rounded-circle"
                          alt=""
                          src={Avatar}
                        />
                        <div
                          className="flex-grow-2"
                          style={{ marginLeft: "1rem" }}
                        >
                          <h3 className="mb-1 f-w-600">{`${dashboardData.user_data.full_name}`}</h3>
                          <p>{`${dashboardData.user_data.Job_Title}`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email-Address</label>
                    <input
                      className="form-control"
                      placeholder={`${dashboardData.user_data.E_Mail}`}
                      readOnly
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      className="form-control"
                      type="password"
                      defaultValue="password"
                    />
                  </div>
                  <div className="form-footer">
                    <button className="btn btn-primary btn-block" disabled>
                      <FontAwesomeIcon
                        icon={faUserCog}
                        style={{ marginRight: "8px" }}
                      />
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-xl-8">
            <form className="card">
              <div className="card-header pb-0">
                <h4 className="card-title mb-0">Edit Profile</h4>
                <div className="card-options">
                  <a
                    className="card-options-collapse"
                    href="#"
                    data-bs-toggle="card-collapse"
                  >
                    <i className="fe fe-chevron-up" />
                  </a>
                  <a
                    className="card-options-remove"
                    href="#"
                    data-bs-toggle="card-remove"
                  >
                    <i className="fe fe-x" />
                  </a>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-6 col-md-4">
                    <div className="mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={dashboardData.user_data.First_Name}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Middle Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={dashboardData.user_data.Middle_Name}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={dashboardData.user_data.Last_Name}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Employee No.</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={dashboardData.user_data.Employee}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Phone No.</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={dashboardData.user_data.PhoneNo}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Head of Department</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={
                          dashboardData.user_data.HOD_User ? "Yes" : "No" || ""
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Department</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={dashboardData.user_data.Department || ""}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Job Position</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={dashboardData.user_data.Job_Position || ""}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Supervisor</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={dashboardData.user_data.Supervisor || ""}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Supervisor Title</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder={
                          dashboardData.user_data.Supervisor_Title || ""
                        }
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer text-end">
                <button className="btn btn-primary" type="submit" disabled>
                  <FontAwesomeIcon
                    icon={faUserEdit}
                    style={{ marginRight: "8px" }}
                  />
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
