import React from "react";
import SubmitLeave from "./SubmitLeave";
import CancelApproval from "./CancelApproval";

const ApplicationActions = ({
  selectedApplication,
  refreshApplications,
  onClose,
}) => {
  return (
    <div className="col-xl-12 box-col-12">
      <div className="file-sidebar">
        <div className="card">
          <div className="card-body custom-scrollbar">
            <ul>
              {(selectedApplication?.Status === "Open" ||
                selectedApplication?.Status === "Rejected") && (
                <li>
                  <SubmitLeave
                    Id={selectedApplication?.Application_No}
                    refreshApplications={refreshApplications}
                    onClose={onClose}
                  />
                </li>
              )}
              {selectedApplication?.Status === "Pending Approval" && (
                <li>
                  <CancelApproval
                    Id={selectedApplication?.Application_No}
                    refreshApplications={refreshApplications}
                    onClose={onClose}
                  />
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationActions;
