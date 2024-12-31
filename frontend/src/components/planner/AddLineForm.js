import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const AddLineForm = ({ planId, onLineAdded }) => {
  // Get today's date in "YYYY-MM-DD" format
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    startDate: today, // Default to today's date
    endDate: today, // Default to today's date
    lineNo: 0, // Default line number
    MyAction: "insert",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      // Ensure endDate cannot be earlier than startDate
      if (name === "startDate") {
        return {
          ...prevData,
          startDate: value,
          endDate: value > prevData.endDate ? value : prevData.endDate,
        };
      }

      return { ...prevData, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    axios
      .post(`/selfservice/FnAddLeavePlannerLine/${planId}/`, formData, {
        headers: {
          "X-CSRFToken": csrfToken,
        },
      })
      .then(() => {
        setIsSubmitting(false);
        toast.success("Planner line added successfully!");
        onLineAdded(); // Trigger table refresh in parent
        setFormData({
          startDate: today,
          endDate: today,
          lineNo: 0,
          MyAction: "insert",
        });
      })
      .catch((error) => {
        setIsSubmitting(false);
        toast.error("Error sending data. Please try again.");
        console.error("Error details:", error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="row">
        <div className="col-md-4">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="form-control"
            min={today} // Prevent dates earlier than today
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="form-control"
            min={formData.startDate} // Prevent dates earlier than startDate
            required
          />
        </div>
        <div className="col-md-4">
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <>
                Add Planner Line
                <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddLineForm;
