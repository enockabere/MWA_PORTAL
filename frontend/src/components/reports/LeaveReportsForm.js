import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bars } from "react-loader-spinner";
import ReportModal from "./ReportModal";

const LeaveReportsForm = () => {
  const [reportType, setReportType] = useState("0");
  const [documentType, setDocumentType] = useState("0");
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveDocuments, setLeaveDocuments] = useState([]);
  const [documentID, setDocumentID] = useState("");
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  ); // For Payslip Year
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString()
  ); // For Payslip Month
  const [startDate, setStartDate] = useState(""); // For P9
  const [endDate, setEndDate] = useState(""); // For P9

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  // Generate the first day of the selected month and year in UTC
  const generateDate = (year, month) => {
    const date = new Date(Date.UTC(year, month - 1, 1)); // Use Date.UTC to avoid timezone issues
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  // Generate a list of years starting from 2025 up to the current year
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2025; // Start from 2025
    const years = [];
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }
    return years;
  };

  const handleReportTypeChange = async (e) => {
    const selectedType = e.target.value;
    setReportType(selectedType);
    setDocumentType("0"); // Reset document type when changing report type
    setDocumentID(""); // Reset document ID

    if (selectedType === "1") {
      // Fetch leave types
      try {
        const response = await axios.get("/selfservice/get-leave-types/", {
          headers: { "X-CSRFToken": csrfToken },
        });
        setLeaveTypes(response.data);
      } catch (error) {
        toast.error("Failed to load leave types.");
        setLeaveTypes([]);
      }
    } else if (selectedType === "2") {
      // Fetch leave documents
      try {
        const response = await axios.get("/selfservice/Leave/", {
          headers: { "X-CSRFToken": csrfToken },
        });
        setLeaveDocuments(
          response.data.filter((leave) => leave.Status === "Released")
        );
      } catch (error) {
        toast.error("Failed to load leave documents.");
        setLeaveDocuments([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let requestData = {
      report_type: reportType,
    };

    if (reportType === "1") {
      requestData.document_type = parseInt(documentType); // Leave reports (1, 2, 3)
      requestData.documentID = documentID;
    } else if (reportType === "2") {
      requestData.document_type = 4; // Payslip
      requestData.date = generateDate(
        parseInt(selectedYear),
        parseInt(selectedMonth)
      ); // Automatically generate the date in UTC
    } else if (reportType === "3") {
      requestData.document_type = 5; // P9 Report
      requestData.startDate = startDate;
      requestData.endDate = endDate;
    }

    try {
      const response = await axios.post(
        "/selfservice/HRLeaveReports/",
        requestData,
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);
      if (response.data.success) {
        setPdfData(response.data.pdf_data);
        setIsModalOpen(true);
        toast.success("Report generated successfully!");
      } else {
        throw new Error(response.data.error || "Unknown error occurred");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to generate report.");
    }
  };

  return (
    <div>
      <ToastContainer />
      {loading && (
        <div className="d-flex justify-content-center mt-5">
          <Bars color="#00BFFF" height={30} width={30} />
        </div>
      )}

      <form method="POST" id="myForm" noValidate className="pb-5">
        <div className="row">
          {/* Report Type */}
          <div className="form-group col-12">
            <label>
              Report Type<span className="text-danger">*</span>
            </label>
            <select
              className="form-control"
              value={reportType}
              onChange={handleReportTypeChange}
              required
            >
              <option value="0" disabled>
                -- Select --
              </option>
              <option value="1">Leave Reports</option>
              <option value="2">Payslip</option>
              <option value="3">P9 Report</option>
            </select>
          </div>
        </div>

        {/* Leave Report Options */}
        {reportType === "1" && (
          <div className="row">
            <div className="form-group col-12">
              <label>
                Document Type<span className="text-danger">*</span>
              </label>
              <select
                className="form-control"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                required
              >
                <option value="0" disabled>
                  -- Select --
                </option>
                <option value="1">Leave Statement Report</option>
                <option value="2">Leave Report</option>
                <option value="3">Leave Summary Report</option>
              </select>
            </div>

            {documentType === "2" && (
              <div className="col-md-12">
                <div className="form-group">
                  <label>
                    Leave Document <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-control"
                    name="documentID"
                    required
                    value={documentID}
                    onChange={(e) => setDocumentID(e.target.value)}
                  >
                    <option value="0" disabled>
                      -- Select --
                    </option>
                    {leaveDocuments.map((leave) => (
                      <option
                        key={leave.Application_No}
                        value={leave.Application_No}
                      >
                        Start Date ({leave.Start_Date}) - Resumption Date (
                        {leave.Resumption_Date})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payslip Year and Month Picker */}
        {reportType === "2" && (
          <div className="row">
            <div className="form-group col-md-6">
              <label>
                Year<span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                required
              >
                {generateYears().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-6">
              <label>
                Month<span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                required
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {new Date(0, month - 1).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* P9 Date Range Picker */}
        {reportType === "3" && (
          <div className="row">
            <div className="form-group col-md-6">
              <label>
                Start Date<span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label>
                End Date<span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
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

      <ReportModal
        pdfData={pdfData}
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default LeaveReportsForm;
