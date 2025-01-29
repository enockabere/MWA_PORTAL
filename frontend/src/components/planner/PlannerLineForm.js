import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import "./button.css";

const PlannerLineForm = ({ pk, onFetchSamples }) => {
  const [formData, setFormData] = useState({
    startDate: new Date(),
    endDate: null,
    lineNo: 0, // Default lineNo to 0
    MyAction: "insert",
  });
  const [loading, setLoading] = useState(false);
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  const modalRef = useRef();

  const handleOpen = () => {
    const modalElement = modalRef.current;
    if (modalElement) {
      const bootstrapModal = new window.bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  };

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1500); // End animation after 1.5 seconds
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  const handleStartDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      startDate: date,
      endDate: date > formData.endDate ? null : formData.endDate,
    }));
  };

  const handleEndDateChange = (date) => {
    setFormData((prevData) => ({ ...prevData, endDate: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { startDate, endDate, lineNo, MyAction } = formData;

    if (startDate && endDate) {
      setLoading(true);
      try {
        if (!pk) {
          toast.error("Plan code is missing.");
          return;
        }

        await axios.post(
          `/selfservice/FnLeavePlannerLine/${pk}/`,
          {
            startDate,
            endDate,
            lineNo: lineNo || 0,
            MyAction,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
          }
        );
        toast.success("Plan added successfully!");
        // Reset form data after success
        setFormData({
          startDate: new Date(),
          endDate: null,
          lineNo: 0,
          MyAction: "insert",
        });

        // Call the parent fetch function to update the list of plans
        onFetchSamples(pk); // This will trigger the parent's function to fetch and update the plans
      } catch (error) {
        if (error.response && error.response.data.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Error sending data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <button
        className={`floating-button btn btn-primary btn-air ${
          animate ? "shake-animation" : ""
        }`}
        data-bs-toggle="tooltip"
        data-bs-placement="left"
        title="Click to add a new planner line"
        type="button"
        onClick={handleOpen}
      >
        <FontAwesomeIcon icon={faPlus} className="text-white" />
      </button>

      <div
        className="modal fade"
        ref={modalRef}
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModal"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h4>
                New Leave <strong className="text-danger">Planner</strong> Line
              </h4>
              <button
                className="btn-close py-0"
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="modal-toggle-wrapper">
                <p>
                  Enter your expected leave start and end dates to begin
                  scheduling your leave plan. This will help you organize and
                  manage your upcoming time off effectively.
                </p>
                {loading && (
                  <div className="d-flex justify-content-center mt-5">
                    <Bars color="#00BFFF" height={30} width={30} />
                  </div>
                )}
                <form
                  className="row g-3 mt-4 needs-validation"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <input type="hidden" name="lineNo" value="0" />
                  <input type="hidden" name="MyAction" value="insert" />
                  <div className="col-md-6">
                    <label className="form-label">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <DatePicker
                      selected={formData.startDate}
                      onChange={handleStartDateChange}
                      minDate={new Date()}
                      className="form-control"
                      dateFormat="yyyy/MM/dd"
                      placeholderText="Select start date"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      End Date <span className="text-danger">*</span>
                    </label>
                    <DatePicker
                      selected={formData.endDate}
                      onChange={handleEndDateChange}
                      minDate={formData.startDate || new Date()}
                      className="form-control"
                      dateFormat="yyyy/MM/dd"
                      placeholderText="Select end date"
                    />
                  </div>
                  <button
                    className="btn bg-primary d-flex align-items-center w-50 gap-2 text-light ms-auto"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      <>
                        {" "}
                        Add Planner Line
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          style={{ marginLeft: "8px" }}
                        />
                      </>
                    )}
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerLineForm;
