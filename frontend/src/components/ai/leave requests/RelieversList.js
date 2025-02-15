import React from "react";

const RelieversList = ({ data }) => {
  return (
    <div className="relievers-list">
      <h6>Relievers</h6>
      <hr />
      {data.length > 0 ? (
        <ul>
          {data.map((reliever, index) => (
            <li key={index}>
              <strong>Reliever:</strong> {reliever.StaffName}
            </li>
          ))}
        </ul>
      ) : (
        <p>No relievers found.</p>
      )}
    </div>
  );
};

export default RelieversList;
