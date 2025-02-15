import React from "react";

const AdjustmentLines = ({ data }) => {
  return (
    <div className="adjustment-lines">
      <h6>Adjustment Lines</h6>
      <hr />
      {data.length > 0 ? (
        <table>
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
            {data.map((line, index) => (
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
      ) : (
        <p>No adjustment lines found.</p>
      )}
    </div>
  );
};

export default AdjustmentLines;
