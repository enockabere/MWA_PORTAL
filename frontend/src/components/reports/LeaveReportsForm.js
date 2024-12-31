import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bars } from "react-loader-spinner";
import ReportModal from "./ReportModal";

const LeaveReportsForm = () => {
  const [documentType, setDocumentType] = useState("0");
  const [showDocumentIDRow, setShowDocumentIDRow] = useState(false);
  const [showLeaveTypeRow, setShowLeaveTypeRow] = useState(false);
  const [isDocumentIDDisabled, setIsDocumentIDDisabled] = useState(true);
  const [isLeaveTypeDisabled, setIsLeaveTypeDisabled] = useState(true);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveDocuments, setLeaveDocuments] = useState([]);
  const [pdfData, setPdfData] = useState(null);
  const [documentID, setDocumentID] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleDocumentTypeChange = async (e) => {
    const selectedType = e.target.value;
    setDocumentType(selectedType);

    if (selectedType === "1") {
      try {
        const response = await axios.get("/selfservice/get-leave-types/", {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        });
        setLeaveTypes(response.data);
        toast.success("Leave types loaded successfully!");
        setShowDocumentIDRow(false);
        setIsDocumentIDDisabled(true);
        setShowLeaveTypeRow(true);
        setIsLeaveTypeDisabled(false);
      } catch (error) {
        console.error("Error fetching leave types:", error);
        toast.error("Failed to load leave types.");
        setLeaveTypes([]);
      }
    } else if (selectedType === "2") {
      try {
        const response = await axios.get("/selfservice/Leave/", {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        });
        const releasedLeaves = response.data.filter(
          (leave) => leave.Status === "Released"
        );
        setLeaveDocuments(releasedLeaves);
        toast.success("Leave documents loaded successfully!");
        setShowDocumentIDRow(true);
        setIsDocumentIDDisabled(false);
        setShowLeaveTypeRow(false);
        setIsLeaveTypeDisabled(true);
      } catch (error) {
        console.error("Error fetching leave documents:", error);
        toast.error("Failed to load leave documents.");
        setLeaveDocuments([]);
      }
    } else {
      setShowDocumentIDRow(false);
      setIsDocumentIDDisabled(true);
      setShowLeaveTypeRow(false);
      setIsLeaveTypeDisabled(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader
    try {
      const response = await axios.post(
        "/selfservice/HRLeaveReports/",
        {
          document_type: documentType,
          documentID,
        },
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false); // Hide loader
      if (response.data.success) {
        setPdfData(response.data.pdf_data);
        setIsModalOpen(true); // Open modal
        toast.success("Report generated successfully!");
      } else {
        throw new Error(response.data.error || "Unknown error occurred");
      }
    } catch (error) {
      setLoading(false); // Hide loader
      console.error("Error generating report:", error);
      toast.error("Failed to generate report.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPdfData(null);
  };

  const downloadPdf = () => {
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${pdfData}`;
    link.download = "report.pdf";
    link.click();
  };

  return (
    <div>
      <ToastContainer />
      {/* Loader */}
      {loading && (
        <div className="d-flex justify-content-center mt-5">
          <Bars color="#00BFFF" height={30} width={30} />
        </div>
      )}

      {/* Form */}
      <form method="POST" id="myForm" noValidate className="pb-5">
        <div className="row">
          <div className="form-group col-12">
            <label>
              Report Type<span className="text-danger">*</span>
            </label>
            <select
              className="form-control"
              value={documentType}
              onChange={handleDocumentTypeChange}
              required
            >
              <option selected disabled value="0">
                --select--
              </option>
              <option value="1">Leave Statement Report</option>
              <option value="2">Leave Report</option>
              <option value="3">Leave Summary Report</option>
            </select>
          </div>
        </div>

        {/* Document ID Row */}
        {showDocumentIDRow && (
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>
                  Leave Document <span className="text-danger">*</span>
                </label>
                <select
                  className="form-control"
                  name="documentID"
                  required
                  disabled={isDocumentIDDisabled}
                  value={documentID}
                  onChange={(e) => setDocumentID(e.target.value)}
                >
                  <option value="0" disabled>
                    --Select--
                  </option>
                  {leaveDocuments.length > 0 ? (
                    leaveDocuments.map((leave) => (
                      <option
                        key={leave.Application_No}
                        value={leave.Application_No}
                      >
                        Start Date ({leave.Start_Date}) - Resumption Date (
                        {leave.Resumption_Date})
                      </option>
                    ))
                  ) : (
                    <option disabled value="0">
                      You have not taken any leave
                    </option>
                  )}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Leave Type Row */}
        {showLeaveTypeRow && (
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>
                  Leave Type<span className="text-danger">*</span>
                </label>
                <select
                  className="form-control"
                  required
                  disabled={isLeaveTypeDisabled}
                >
                  <option value="">Choose...</option>
                  {leaveTypes.map((leave) => (
                    <option key={leave.Code} value={leave.Code}>
                      {leave.Description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="row mt-3 pb-5">
          <div className="col-md-12">
            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              onClick={handleSubmit}
            >
              Preview Report
            </button>
          </div>
        </div>
      </form>

      {/* Report Modal */}
      <ReportModal
        pdfData={pdfData}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        downloadPdf={downloadPdf}
      />
    </div>
  );
};

export default LeaveReportsForm;
