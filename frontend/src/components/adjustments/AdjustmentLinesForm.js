import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Swal from "sweetalert2";

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
  const modalRef = useRef();

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  useEffect(() => {
    axios
      .get("/selfservice/get-leave-types/")
      .then((res) => setLeaveTypes(res.data))
      .catch((err) => console.error("Error fetching leave types:", err));
  }, []);

  const handleOpen = () => {
    const modalElement = modalRef.current;
    if (modalElement) {
      const bootstrapModal = new window.bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  };

  const fetchLineData = async () => {
    try {
      const { data } = await axios.get(
        `/selfservice/LeaveAdjustmentLine/${pk}/`,
        {
          headers: { "X-CSRFToken": csrfToken },
        }
      );
      console.log("Fetched lines:", data);
      if (onFetchLines) onFetchLines(data?.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      if (onFetchLines) onFetchLines([]);
    }
  };

  const handleAddLines = async (e) => {
    e.preventDefault();
    const { leaveType, transType, entitlementAdj } = formData;
    if (!leaveType || !transType || !entitlementAdj) return;

    try {
      setLoading(true);
      await axios.post(`/selfservice/LeaveAdjustmentLine/${pk}/`, formData, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      });
      await Swal.fire("Success", "Line added successfully", "success");
      setFormData({
        myAction: "insert",
        leaveType: "",
        transType: "",
        entitlementAdj: "",
        lineNo: "0",
      });
      fetchLineData();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not add line", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-end mb-3">
        <button className="btn btn-primary" onClick={handleOpen}>
          <FontAwesomeIcon icon={faPlus} /> Add Leave Adjustment Line
        </button>
      </div>

      <div
        className="modal fade"
        ref={modalRef}
        id="exampleModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content p-3">
            <h5 className="text-danger">
              <FontAwesomeIcon icon={faPlus} /> New Adjustment Line
            </h5>
            <form className="row g-3 mt-3" onSubmit={handleAddLines}>
              <input type="hidden" name="lineNo" value={formData.lineNo} />
              <input type="hidden" name="myAction" value={formData.myAction} />
              <div className="col-12">
                <label>Leave Type *</label>
                <select
                  className="form-select"
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={(e) =>
                    setFormData({ ...formData, leaveType: e.target.value })
                  }
                >
                  <option value="">Choose...</option>
                  {leaveTypes.map((lt) => (
                    <option key={lt.Code} value={lt.Code}>
                      {lt.Description}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <label>Transaction Type *</label>
                <select
                  className="form-select"
                  name="transType"
                  value={formData.transType}
                  onChange={(e) =>
                    setFormData({ ...formData, transType: e.target.value })
                  }
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
              <div className="col-12">
                <label>Entitlement Adjustment *</label>
                <input
                  type="text"
                  className="form-control"
                  name="entitlementAdj"
                  value={formData.entitlementAdj}
                  onChange={(e) =>
                    setFormData({ ...formData, entitlementAdj: e.target.value })
                  }
                />
              </div>
              <div className="col-12 text-end mt-3">
                <button className="btn btn-success" disabled={loading}>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    <>
                      Add{" "}
                      <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentLinesForm;
