import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";

const AdjustmentLinesForm = ({ pk, onFetchLines }) => {
  const [formData, setFormData] = useState({
    myAction: "insert",
    leaveType: "",
    transType: "",
    entitlementAdj: "",
    lineNo: "0",
  });
  const [loading, setLoading] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await axios.get("/selfservice/get-leave-types/");
        setLeaveTypes(response.data);
      } catch (error) {
        console.error("Error fetching leave types:", error);
      }
    };

    fetchLeaveTypes();
  }, []);

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

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("AdjustmentLineData"));
    if (savedData && pk) {
      onFetchLines(savedData);
    } else {
      fetchLineData();
    }
  }, [pk]);

  const fetchLineData = async () => {
    try {
      const { data: sampleData } = await axios.get(
        `/selfservice/LeaveAdjustmentLine/${pk}/`,
        {
          headers: { "X-CSRFToken": csrfToken },
        }
      );

      // Ensure sampleData and sampleData.data exist and have length > 0
      if (sampleData && sampleData.data && sampleData.data.length > 0) {
        localStorage.setItem("AdjustmentLineData", JSON.stringify(sampleData));
        onFetchLines(sampleData);
      } else {
        localStorage.removeItem("AdjustmentLineData");
        onFetchLines([]); // Return an empty array if there's no data
      }
    } catch (error) {
      console.error("Error fetching sample data:", error);
      if (error.response && error.response.status !== 404) {
        toast.error("Failed to fetch sample data.");
      }
      onFetchLines([]); // Return an empty array if there's an error
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddLines = async (e) => {
    e.preventDefault();

    const { myAction, leaveType, transType, entitlementAdj, lineNo } = formData;

    if (leaveType && transType && entitlementAdj) {
      setLoading(true);
      try {
        if (!pk) {
          toast.error("Adjustment code is missing.");
          return;
        }
        await axios.post(
          `/selfservice/LeaveAdjustmentLine/${pk}/`,
          {
            leaveType,
            transType,
            entitlementAdj,
            lineNo,
            myAction,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            },
          }
        );
        toast.success("Plan added successfully!");
        setFormData({
          leaveType: "",
          transType: "",
          entitlementAdj: "",
          lineNo: "0",
          myAction: "insert",
        });
        fetchLineData();
      } catch (error) {
        toast.error("Error sending data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="text-end">
        <button className="btn btn-primary" type="button" onClick={handleOpen}>
          <FontAwesomeIcon icon={faPlus} /> Add Leave Adjustment Line
        </button>
      </div>

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
            <div className="modal-body">
              <div className="modal-toggle-wrapper">
                <h4>
                  <FontAwesomeIcon icon={faPlus} className="text-danger" /> New
                  Leave <strong className="text-danger">Adjustment</strong> Line
                </h4>

                <form onSubmit={handleAddLines} className="row g-3 mb-4">
                  <input type="hidden" name="lineNo" value={formData.lineNo} />
                  <input
                    type="hidden"
                    name="myAction"
                    value={formData.myAction}
                  />

                  <div className="row mt-3">
                    <div className="col-12 mt-3">
                      <label className="form-label">
                        Select Leave Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="leaveType"
                        value={formData.leaveType}
                        onChange={handleChange}
                      >
                        <option value="">Choose...</option>
                        {leaveTypes.map((leave) => (
                          <option key={leave.Code} value={leave.Code}>
                            {leave.Description}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 mt-3">
                      <label className="form-label">
                        Transaction Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="transType"
                        value={formData.transType}
                        onChange={handleChange}
                      >
                        <option value="">Choose...</option>
                        <option value="1">Leave Allocation</option>
                        <option value="2">Leave Recall</option>
                        <option value="3">Overtime</option>
                        <option value="4">Leave Application</option>
                        <option value="5">Leave Adjustment</option>
                        <option value="6">Leave B/F</option>
                        <option value="7">Absent</option>
                      </select>
                    </div>

                    <div className="col-12 mt-3">
                      <label className="form-label">
                        Entitlement Adjustment{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="entitlementAdj"
                        value={formData.entitlementAdj}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12 mt-3 text-end">
                      <button
                        className="btn bg-primary"
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
                            <FontAwesomeIcon
                              icon={faArrowRight}
                              style={{ marginLeft: "8px" }}
                            />{" "}
                            Add Adjustment Line
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentLinesForm;
