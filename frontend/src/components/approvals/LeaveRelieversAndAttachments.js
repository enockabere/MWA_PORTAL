// LeaveRelieversAndAttachments.js
import React from "react";

const LeaveRelieversAndAttachments = ({ relieverData, attachments }) => {
  return (
    <div className="row my-3">
      {/* Leave Relievers Section */}
      <div className="col-xl-4 col-md-6 box-col-4">
        <div className="card bg-primary">
          <div className="card-body">
            <div className="d-flex faq-widgets">
              <div className="flex-grow-1">
                <h4>Leave Relievers</h4>
                <ul className="list-group list-group-flush">
                  {relieverData.map((reliever, index) => (
                    <li className="list-group-item" key={index}>
                      <i className="icofont icofont-arrow-right"> </i>
                      {reliever.StaffName}
                    </li>
                  ))}
                </ul>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-user"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
                <path d="M16 3h6a2 2 0 0 1 2 2v6h-8z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Attachments Section (Conditional Rendering) */}
      {attachments && attachments.length > 0 && (
        <div className="col-xl-4 col-md-6 box-col-4">
          <div className="card bg-primary">
            <div className="card-body">
              <div className="d-flex faq-widgets">
                <div className="flex-grow-1">
                  <h4>Leave Attachments</h4>
                  <ul>
                    {attachments.map((attachment, index) => (
                      <li key={index}>{attachment}</li>
                    ))}
                  </ul>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-paperclip"
                >
                  <path d="M15.621 9.379l-6.97 6.97a3 3 0 0 1-4.242-4.243L8.9 8.9a1 1 0 0 1 1.414 1.414l-4.95 4.95a1 1 0 0 0 1.414 1.415l6.97-6.97a5 5 0 0 1 7.071 7.071l-6.97 6.97a5 5 0 0 1-7.071-7.071z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRelieversAndAttachments;
