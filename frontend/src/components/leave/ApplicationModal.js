import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import ApplicationHeader from "./ApplicationHeader";
import ApplicationSections from "./ApplicationSections";
import ApplicationActions from "./ApplicationActions";

const ApplicationModal = ({
  selectedApplication,
  onClose,
  refreshApplications,
}) => {
  const [relieverData, setRelieverData] = useState([]);
  const [attachments, setAttachmentsData] = useState([]);
  const [approversData, setApproversData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRelievers = () => {
    axios
      .get(
        `/selfservice/FnLeaveReliever/${selectedApplication.Application_No}/`
      )
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          LeaveCode: item.LeaveCode,
          StaffNo: item.StaffNo,
          StaffName: item.StaffName,
          Section: item.ShortcutDimension2Code,
        }));
        setRelieverData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching relievers:", error);
      });
  };

  const fetchAttachments = () => {
    axios
      .get(`/selfservice/FileUploadView/${selectedApplication.Application_No}/`)
      .then((response) => {
        const attachmentsData = response.data;
        setAttachmentsData(attachmentsData);
      })
      .catch((error) => {
        console.error("Error fetching attachments:", error);
      });
  };

  const fetchApprovers = () => {
    axios
      .get(`/selfservice/LeaveApprovers/${selectedApplication.Application_No}/`)
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          Name: item.ApproverID,
          Sequence: item.SequenceNo,
          ApprovalStatus: item.Status,
          ModifiedBy: item.Last_Modified_By_User_ID,
        }));
        setApproversData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching approvers:", error);
      });
  };

  useEffect(() => {
    if (selectedApplication) {
      setRelieverData([]);
      setAttachmentsData([]);
      setApproversData([]);
      setLoading(true);
      fetchRelievers();
      fetchAttachments();
      fetchApprovers();
    }
  }, [selectedApplication]);

  return (
    <div
      className="modal fade"
      id="bd-example-modal-xl"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="myLargeModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div
          className="modal-content"
          style={{ background: "linear-gradient(to right, #1c2833, #2b5e5e)" }}
        >
          <div className="modal-header border-0">
            <button
              className="btn-close btn-close-white py-0"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body dark-modal">
            <div className="row">
              <div
                className="row default-according style-1 faq-accordion"
                id="accordionoc"
              >
                <div className="col-xl-12 col-lg-12 col-md-12">
                  <ToastContainer />

                  {/* Header Section */}
                  <ApplicationHeader
                    selectedApplication={selectedApplication}
                  />

                  {/* Accordion Sections */}
                  <ApplicationSections
                    selectedApplication={selectedApplication}
                    relieverData={relieverData}
                    attachments={attachments}
                    approversData={approversData}
                    loading={loading}
                    onRelieverAdded={fetchRelievers}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <ApplicationActions
                selectedApplication={selectedApplication}
                refreshApplications={refreshApplications}
                onClose={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
