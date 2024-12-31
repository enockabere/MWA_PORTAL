import React, { useState, useEffect } from "react";
import axios from "axios";
import premium from "../../../static/img/bg/premium.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";

const CreateLeavePlanForm = ({ onCodeRetrieved, retrievedCode, myAction }) => {
  const [formData, setFormData] = useState({
    myAction: myAction || "insert",
    plannerNo: retrievedCode || "",
  });
  const [loading, setLoading] = useState(false);

  // Update formData when props change
  useEffect(() => {
    setFormData({
      myAction: myAction || "insert",
      plannerNo: retrievedCode || "",
    });
  }, [retrievedCode, myAction]);

  // Log data whenever formData or its related props change
  useEffect(() => {}, [formData, retrievedCode, myAction]);

  // CSRF token from the meta tag
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("plannerNo", formData.plannerNo);
      data.append("myAction", formData.myAction);

      // POST request to add the reliever
      const response = await axios.post("/selfservice/LeavePlanner/", data, {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 && response.data.code) {
        toast.success("Plan added successfully!");
        setFormData({ myAction: "insert", plannerNo: "" }); // Clear form after successful submission
        onCodeRetrieved(response.data.code); // Pass the retrieved code to parent component
      } else {
        toast.error("Failed to retrieve code. Please try again.");
      }
    } catch (error) {
      toast.error("Error retrieving code.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="row g-3 needs-validation"
      onSubmit={handleSubmit}
      noValidate
    >
      <input type="hidden" name="myAction" value={formData.myAction} />
      <input type="hidden" name="plannerNo" value={formData.plannerNo} />
      <div
        className="col-md-6 wow bounceInLeft mt-0"
        style={{
          visibility: "visible",
          animationName: "bounceInLeft",
        }}
      >
        <div className="premium-img">
          <img className="img-fluid" src={premium} alt="premium" />
        </div>
      </div>

      <div
        className="col-md-6 wow bounceInRight mt-0"
        style={{
          visibility: "visible",
          animationName: "bounceInRight",
        }}
      >
        <div className="premium-wrapper mt-5">
          <h2>Plan Your Leave with Ease</h2>
          <span>
            Start managing your leave effortlessly with our comprehensive leave
            planner. Our support team is here to help you maximize productivity
            and manage time off efficiently.
          </span>
        </div>
      </div>
      <div className="col-xl-12 text-end mt-4">
        {loading && (
          <div className="loader-container card-loading d-flex justify-content-center align-items-center">
            <Bars color="#00BFFF" height={30} width={30} />
          </div>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span
              className="spinner-border spinner-border-sm me-2" // me-2 adds margin-end (right) to the spinner
            ></span>
          ) : (
            <>
              Start Your Leave Planner
              <FontAwesomeIcon
                icon={faArrowRight}
                className="ms-2" // ms-2 adds margin-start (left) to the icon
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateLeavePlanForm;
