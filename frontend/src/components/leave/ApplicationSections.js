import React from "react";
import Skeleton from "@mui/material/Skeleton";
import RelieversTable from "./RelieversTable";
import AttachmentsTable from "./AttachmentsTable";
import ApproversTable from "./ApproversTable";
import Preloader from "../Layout/Preloader";

const ApplicationSections = ({
  selectedApplication,
  relieverData,
  attachments,
  approversData,
  loading,
  onRelieverAdded,
}) => {
  return (
    <>
      {/* First Accordion */}
      <div className="card border border-primary my-3">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            <button
              className="btn btn-link ps-0 text-white"
              data-bs-toggle="collapse"
              data-bs-target="#collapseRelievers"
              aria-expanded="false"
              aria-controls="collapseRelievers"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-help-circle"
              >
                <circle cx={12} cy={12} r={10} />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1={12} y1={17} x2={12} y2={17} />
              </svg>{" "}
              Leave Relievers
            </button>
          </h5>
        </div>
        <div
          id="collapseRelievers"
          className="collapse"
          aria-labelledby="collapseRelievers"
          data-bs-parent="#accordion"
        >
          <div className="card-body">
            {loading ? (
              <Preloader message="Loading page contents, please wait..." />
            ) : (
              <RelieversTable
                data={relieverData}
                selectedApplication={selectedApplication}
                onRelieverAdded={onRelieverAdded}
              />
            )}
          </div>
        </div>
      </div>

      {/* Second Accordion */}
      {attachments && attachments.length > 0 && (
        <div className="card border border-primary">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <button
                className="btn btn-link ps-0 text-white"
                data-bs-toggle="collapse"
                data-bs-target="#collapseAttachments"
                aria-expanded="false"
                aria-controls="collapseAttachments"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-help-circle"
                >
                  <circle cx={12} cy={12} r={10} />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1={12} y1={17} x2={12} y2={17} />
                </svg>{" "}
                Leave Attachments
              </button>
            </h5>
          </div>
          <div
            id="collapseAttachments"
            className="collapse"
            aria-labelledby="collapseAttachments"
            data-bs-parent="#accordion"
          >
            <div className="card-body">
              {loading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <AttachmentsTable
                  attachments={attachments}
                  selectedApplication={selectedApplication}
                />
              )}
            </div>
          </div>
        </div>
      )}
      {selectedApplication?.Status === "Pending Approval" && (
        <div className="card border border-primary">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <button
                className="btn btn-link ps-0 text-white"
                data-bs-toggle="collapse"
                data-bs-target="#collapseApprover"
                aria-expanded="false"
                aria-controls="collapseApprover"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-help-circle"
                >
                  <circle cx={12} cy={12} r={10} />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1={12} y1={17} x2={12} y2={17} />
                </svg>{" "}
                Leave Approver
              </button>
            </h5>
          </div>
          <div
            id="collapseApprover"
            className="collapse"
            aria-labelledby="collapseApprover"
            data-bs-parent="#accordion"
          >
            <div className="card-body">
              {loading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <ApproversTable data={approversData} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationSections;
