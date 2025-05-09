import React, { useState, useEffect } from "react";
import axios from "axios";
import premium from "../../../static/img/bg/premium.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Bars } from "react-loader-spinner";
import Swal from "sweetalert2";

const CreateLeavePlanForm = ({ onCodeRetrieved, retrievedCode, myAction }) => {
  const [formData, setFormData] = useState({
    myAction: myAction || "insert",
    plannerNo: retrievedCode || "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      myAction: myAction || "insert",
      plannerNo: retrievedCode || "",
    });
  }, [retrievedCode, myAction]);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("plannerNo", formData.plannerNo);
      data.append("myAction", formData.myAction);

      const response = await axios.post("/selfservice/LeavePlanner/", data, {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 && response.data.code) {
        await Swal.fire({
          icon: "success",
          title: "Plan Created",
          text: "Your leave planner has been initialized successfully.",
        });
        setFormData({ myAction: "insert", plannerNo: "" });
        onCodeRetrieved(response.data.code);
      } else {
        await Swal.fire({
          icon: "error",
          title: "Code Retrieval Failed",
          text: "Failed to retrieve a planner code. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while creating the planner.",
      });
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
        style={{ visibility: "visible", animationName: "bounceInLeft" }}
      >
        <div className="premium-img">
          <img className="img-fluid" src={premium} alt="premium" />
        </div>
      </div>

      <div
        className="col-md-6 wow bounceInRight mt-0"
        style={{ visibility: "visible", animationName: "bounceInRight" }}
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

      <div className="col-xl-12 text-end">
        {loading && (
          <div className="loader-container card-loading d-flex justify-content-center align-items-center">
            <Bars color="#00BFFF" height={30} width={30} />
          </div>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <span className="spinner-border spinner-border-sm me-2" />
          ) : (
            <>
              Start Your Leave Planner
              <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateLeavePlanForm;
