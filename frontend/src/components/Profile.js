import React from "react";
import Breadcrumb from "./Layout/Breadcrumb";
import { useDashboard } from "./context/DashboardContext";
import AvatarDetails from "./AvatarDetails";
import NextOfKin from "./NextKin/NextOfKin";
import { toast, ToastContainer } from "react-toastify";

const Profile = () => {
  const { dashboardData, setLoggedIn } = useDashboard();
  const handleToast = (message, type) => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    }
  };
  return (
    <div>
      <Breadcrumb pageTitle="My Profile" breadcrumb="My Profile" />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-4">
            <AvatarDetails onShowToast={handleToast} />
          </div>
          <div className="col-xl-8">
            <div className="card h-100">
              <div className="card-header pb-0">
                <h4 className="card-title mb-0">Profile Information</h4>
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
                        placeholder={dashboardData.user_data.Employee_No_}
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
                <NextOfKin />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
