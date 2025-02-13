import React, { useEffect, useState } from "react";
import axios from "axios";
import PlannerLinesTable from "./PlannerLinesTable";
import Preloader from "../Layout/Preloader";
import AddLineForm from "./AddLineForm";
import SubmitPlanner from "./SubmitPlanner";
import ReOpenPlanner from "./ReOpenPlanner";

const PlanDetailsModal = ({
  selectedPlan,
  onClose,
  onPlanSubmitted,
  onReOpen,
  onShowToast,
}) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDateWithSuffix = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    // Determine ordinal suffix
    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
        ? "rd"
        : "th";

    return `${day}${suffix} ${month}, ${year}`;
  };

  const fetchPlannerLines = () => {
    axios
      .get(`/selfservice/planner-lines/${selectedPlan.No_}/`)
      .then((response) => {
        const formattedData = response.data.map((item) => ({
          Leave_Period: item.LeavePeriod,
          Start_Date: formatDateWithSuffix(item.StartDate),
          End_Date: formatDateWithSuffix(item.EndDate),
          Days_Planned: item.Days,
          LineNo: item.LineNo,
          DocumentNo: item.DocumentNo,
        }));
        setTableData(formattedData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching planner lines:", error);
      });
  };

  useEffect(() => {
    if (selectedPlan) {
      setTableData([]);
      setLoading(true);
      fetchPlannerLines();
    }
  }, [selectedPlan]);

  const onLineAdded = () => {
    fetchPlannerLines(); // Refresh table data after adding a new line
  };

  return (
    <div
      className="modal fade"
      id="bd-example-modal-xl"
      tabIndex={-1}
      role="dialog"
      aria-labelledby="myLargeModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div
          className="modal-content"
          style={{ background: "linear-gradient(to right, #1c2833, #2b5e5e)" }}
        >
          <div className="modal-header border-0">
            <button
              className="btn-close py-0 text-white btn-close-white"
              type="button"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body dark-modal">
            <div className="row">
              <div
                className="row default-according style-1 faq-accordion"
                id="accordionoc"
              >
                <div className="col-xl-12 col-lg-12 col-md-12">
                  <div className="card border border-primary">
                    <div className="card-header bg-primary text-white">
                      <h5 className="mb-0">
                        <button
                          className="btn btn-link ps-0 text-white"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseicon"
                          aria-expanded="true"
                          aria-controls="collapseicon"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-help-circle"
                          >
                            <circle cx={12} cy={12} r={10} />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <line x1={12} y1={17} x2={12} y2={17} />
                          </svg>{" "}
                          Leave Planner Line Details
                        </button>
                      </h5>
                    </div>
                    <div
                      className="collapse show"
                      id="collapseicon"
                      aria-labelledby="collapseicon"
                      data-bs-parent="#accordionoc"
                      style={{}}
                    >
                      <div className="card-body">
                        <div>
                          {selectedPlan?.Submitted === false && (
                            <AddLineForm
                              planId={selectedPlan?.No_}
                              onLineAdded={onLineAdded}
                            />
                          )}
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="card custom-statistics h-100">
                              {loading ? (
                                <Preloader message="Loading page contents, please wait..." />
                              ) : (
                                <PlannerLinesTable
                                  data={tableData}
                                  onFetchSamples={onLineAdded}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">
                        <button
                          className="btn btn-link collapsed ps-0"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseicon4"
                          aria-expanded="false"
                          aria-controls="collapseicon2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-help-circle"
                          >
                            <circle cx={12} cy={12} r={10} />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <line x1={12} y1={17} x2={12} y2={17} />
                          </svg>{" "}
                          Leave Planner Header Details
                        </button>
                      </h5>
                    </div>
                    <div
                      className="collapse"
                      id="collapseicon4"
                      data-bs-parent="#accordionoc"
                    >
                      <div className="card-body">
                        <div className="row">
                          {selectedPlan && (
                            <>
                              <div className="col-md-3">
                                <label htmlFor="employeeName">
                                  Employee Name:
                                </label>
                                <input
                                  type="text"
                                  id="employeeName"
                                  className="form-control"
                                  value={selectedPlan.Employee_Name}
                                  disabled
                                />
                              </div>
                              <div className="col-md-3">
                                <label htmlFor="leavePeriod">
                                  Leave Period:
                                </label>
                                <input
                                  type="text"
                                  id="leavePeriod"
                                  className="form-control"
                                  value={selectedPlan.Leave_Period}
                                  disabled
                                />
                              </div>
                              <div className="col-md-3">
                                <label htmlFor="date">Date:</label>
                                <input
                                  type="text"
                                  id="date"
                                  className="form-control"
                                  value={selectedPlan.Date}
                                  disabled
                                />
                              </div>
                              <div className="col-md-3">
                                <label htmlFor="submitted">Submitted:</label>
                                <input
                                  type="text"
                                  id="submitted"
                                  className="form-control"
                                  value={
                                    selectedPlan?.Submitted !== undefined
                                      ? selectedPlan.Submitted.toString()
                                      : "No data available"
                                  }
                                  disabled
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 box-col-12">
                <div className="file-sidebar">
                  <div className="card">
                    <div className="card-body custom-scrollbar">
                      <ul>
                        {selectedPlan?.Submitted === false && (
                          <li>
                            <SubmitPlanner
                              planId={selectedPlan?.No_}
                              onPlanSubmitted={onPlanSubmitted}
                              onClose={onClose}
                              onShowToast={onShowToast}
                            />
                          </li>
                        )}
                        {selectedPlan?.Submitted === true && (
                          <li>
                            <ReOpenPlanner
                              planId={selectedPlan?.No_}
                              onReOpen={onReOpen}
                              onClose={onClose}
                              onShowToast={onShowToast}
                            />
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetailsModal;
