import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const AddLineForm = ({ planId, onLineAdded }) => {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    startDate: today,
    endDate: today,
    lineNo: 0,
    MyAction: "insert",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let updated = { ...prev, [name]: value };
      if (name === "startDate" && value > prev.endDate) {
        updated.endDate = value;
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `/selfservice/FnAddLeavePlannerLine/${planId}/`,
        formData,
        {
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      // Check if server returned an error despite 200 status
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      console.log("Server Response:", response.data);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Plan added successfully",
      });

      onLineAdded();
      setFormData({
        startDate: today,
        endDate: today,
        lineNo: 0,
        MyAction: "insert",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="row g-2">
        <div className="col-md-4">
          <label htmlFor="startDate" className="form-label">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="form-control"
            min={today}
            required
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="endDate" className="form-label">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="form-control"
            min={formData.startDate}
            required
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isSubmitting}
            style={{ marginBottom: "13px" }}
          >
            {isSubmitting ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <>
                Add Planner Line{" "}
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
