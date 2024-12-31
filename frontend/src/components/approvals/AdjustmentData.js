// LeaveData.js
import React from "react";

const AdjustmentData = ({ data }) => {
  return (
    <form className="row">
      <div className="col-md-12 my-2">
        <label className="form-label">Adjusment Description</label>
        <input
          type="text"
          className="form-control"
          value={data.Description || ""}
          readOnly
        />
      </div>
    </form>
  );
};

export default AdjustmentData;
