import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import Swal from "sweetalert2";
import "./button.css";

const PlannerLineForm = ({ pk, onFetchSamples }) => {
  const [formData, setFormData] = useState({
    startDate: new Date(),
    endDate: null,
    lineNo: 0,
    MyAction: "insert",
  });
  const [loading, setLoading] = useState(false);
  const modalRef = useRef();
  const [animate, setAnimate] = useState(false);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const handleOpen = () => {
    const modalElement = modalRef.current;
    if (modalElement) {
      const bootstrapModal = new window.bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  };

  const handleClose = () => {
    const modalElement = modalRef.current;
    if (modalElement) {
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  };

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 1500);
    return () => clearTimeout(timer);
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
          await Swal.fire({
            icon: "error",
            title: "Missing Plan ID",
            text: "Plan code is missing.",
          });
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

        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Planner line added successfully.",
        });

        setFormData({
          startDate: new Date(),
          endDate: null,
          lineNo: 0,
          MyAction: "insert",
        });

        onFetchSamples(pk);
        handleClose();
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response?.data?.error ||
            "Error sending data. Please try again.",
        });
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
              <p>
                Enter your expected leave start and end dates to begin planning
                your time off.
              </p>

              {loading && (
                <div className="d-flex justify-content-center mt-4">
                  <Bars color="#00BFFF" height={30} width={30} />
                </div>
              )}

              <form
                className="row g-3 mt-3 needs-validation"
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
                      Add Planner Line
                      <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerLineForm;
