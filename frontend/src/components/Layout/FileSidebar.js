import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import "./file.css";

// Utility function to format the date
const formatDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const ordinalSuffix = (n) => {
    if (n > 3 && n < 21) return "th"; // 11th, 12th, 13th
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${ordinalSuffix(day)}, ${month}, ${year}`;
};

const FileSidebar = () => {
  const [loading, setLoading] = useState(false);
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const today = formatDate(new Date()); // Format today's date

  const handleDownload = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "/selfservice/DashboardReports/",
        {},
        {
          headers: {
            "X-CSRFToken": csrfToken, // Include CSRF token for Django
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Decode the base64 PDF data
        const pdfData = atob(response.data.pdf_data);
        const byteArray = new Uint8Array(
          pdfData.split("").map((char) => char.charCodeAt(0))
        );

        // Create a Blob and initiate download
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = response.data.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("Report downloaded successfully!");
      } else {
        throw new Error(response.data.error || "Download failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to download the report. Please try again.");
    } finally {
      setLoading(false); // Ensure loading state is cleared
    }
  };

  return (
    <div className="file-sidebar">
      <div className="d-flex justify-content-center align-items-center">
        <div className="p-4 custom-scrollbar">
          <ul>
            <li>
              <div className="pricing-plan border-2">
                {/* Loader */}
                {loading && (
                  <div className="d-flex justify-content-center my-3">
                    <Bars color="#00BFFF" height={30} width={30} />
                  </div>
                )}
                <h6 className="text-center">
                  Download your Leave Statement Report
                </h6>
                <p className="small text-center">as on {today}</p>
                <form
                  onSubmit={handleDownload}
                  className="d-flex justify-content-center"
                >
                  <button
                    type="submit"
                    className="btn btn-primary download-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        style={{ marginRight: "8px" }}
                      ></span>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faDownload}
                          style={{ marginRight: "5px" }}
                        />
                        Download
                      </>
                    )}
                  </button>
                </form>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileSidebar;
