// LeaveAdjustmentLines.js
import React from "react";

const LeaveAdjustmentLines = ({ AdjustmentLinesData }) => {
  return (
    <div className="row my-3">
      <div className="col-xl-12">
        <div className="card bg-primary">
          <div className="card-body">
            <div className="d-flex faq-widgets">
              <div className="flex-grow-1">
                <h4>Leave Adjustment Lines</h4>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Leave Code</th>
                      <th>Entry Type</th>
                      <th>New Entitlement</th>
                      <th>Transaction Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AdjustmentLinesData.map((line, index) => (
                      <tr key={index}>
                        <td>{line.EmployeeName}</td>
                        <td>{line.LeaveCode}</td>
                        <td>{line.LeaveAdjEntryType}</td>
                        <td>{line.NewEntitlement}</td>
                        <td>{line.TransactionType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveAdjustmentLines;
