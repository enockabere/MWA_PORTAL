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

  const today = formatDate(new Date());

  const handleDownload = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "/selfservice/DashboardReports/",
        {},
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const pdfData = atob(response.data.pdf_data);
        const byteArray = new Uint8Array(
          pdfData.split("").map((char) => char.charCodeAt(0))
        );

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
      setLoading(false);
    }
  };

  return (
    <div className="folder-card card">
      <h5 className="folder-title header-top text-white">
        Reports as at {today}
      </h5>
      <div className="task">
        <input type="checkbox" />
        <span>Leave Summary</span>
      </div>
      <div className="task">
        <input type="checkbox" />
        <span>Payslip</span>
      </div>
      <form onSubmit={handleDownload}>
        <button type="submit" className="download-btn" disabled={loading}>
          {loading ? (
            <Bars color="#fff" height={20} width={20} />
          ) : (
            <>
              <FontAwesomeIcon icon={faDownload} /> Download Report
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default FileSidebar;
