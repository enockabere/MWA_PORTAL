import React from "react";

const AdjustmentDetails = ({ data }) => {
  return (
    <div className="adjustment-details">
      <h6>Adjustment Details</h6>
      <hr />
      <p>
        <strong>Code:</strong> {data.Code}
      </p>
      <p>
        <strong>Description:</strong> {data.Description}
      </p>
      <p>
        <strong>Maturity Date:</strong> {data.MaturityDate}
      </p>
      <p>
        <strong>Status:</strong> {data.Status}
      </p>
      <p>
        <strong>Transaction Type:</strong> {data.TransactionType}
      </p>
    </div>
  );
};

export default AdjustmentDetails;
