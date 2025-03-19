import React from "react";

const SalesCard = () => {
  return (
    <div
      className="text-center p-3"
      style={{
        borderRadius: "15px",
        backgroundColor: "#f5f5f5",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div className="card-body">
        <div
          className="mb-3"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            className="bg-success p-2 rounded-circle"
            style={{ width: "24px", height: "24px" }}
          ></div>
          <div className="text-success" style={{ fontSize: "24px" }}>
            &#10022;
          </div>
        </div>
        <h5 className="card-title" style={{ fontWeight: "bold" }}>
          Level up your sales managing to the next level.
        </h5>
        <p className="card-text text-muted" style={{ fontSize: "14px" }}>
          An any way to manage sales with care and precision.
        </p>
        <button
          className="btn btn-success w-100"
          style={{ borderRadius: "25px" }}
        >
          Update to Siohioma+
        </button>
      </div>
    </div>
  );
};

export default SalesCard;
