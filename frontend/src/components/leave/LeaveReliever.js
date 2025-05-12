import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const LeaveReliever = ({ pk, onFetchRelievers }) => {
  const [formData, setFormData] = useState({
    myAction: "insert",
    selectedReliever: "",
  });
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("/selfservice/get_leave_employees/");
        setEmployees((prevData) => [...prevData, ...response.data]);
      } catch (error) {
        console.error("Error fetching leave relievers:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleAddReliever = async (e) => {
    e.preventDefault();

    if (!formData.selectedReliever) {
      await Swal.fire(
        "Missing Selection",
        "Please select a reliever.",
        "warning"
      );
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("reliever", formData.selectedReliever);
      data.append("myAction", formData.myAction);

      await axios.post(`/selfservice/FnLeaveReliever/${pk}/`, data, {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "multipart/form-data",
        },
      });

      await Swal.fire("Success", "Reliever added successfully!", "success");
      setFormData((prevData) => ({ ...prevData, selectedReliever: "" }));

      const relieversResponse = await axios.get(
        `/selfservice/FnLeaveReliever/${pk}/`,
        {
          headers: { "X-CSRFToken": csrfToken },
        }
      );

      if (relieversResponse.status === 200 && onFetchRelievers) {
        onFetchRelievers(relieversResponse.data);
      } else {
        await Swal.fire("Error", "Failed to fetch relievers list.", "error");
      }
    } catch (error) {
      console.error("Error adding reliever:", error);
      await Swal.fire(
        "Error",
        "Error sending data. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddReliever} className="row g-3">
      <input type="hidden" name="myAction" value={formData.myAction} />

      <div className="col-12">
        <label className="form-label" htmlFor="selectedReliever">
          Select Reliever
        </label>
        <select
          id="selectedReliever"
          value={formData.selectedReliever}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Choose a reliever</option>
          {employees.map((employee) => (
            <option key={employee.No_} value={employee.No_}>
              {employee.First_Name} {employee.Last_Name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-12 text-end">
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              style={{ marginRight: "8px" }}
            ></span>
          ) : (
            <>
              Add Reliever{" "}
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default LeaveReliever;
