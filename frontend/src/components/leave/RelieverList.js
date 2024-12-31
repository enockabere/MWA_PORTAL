import React from "react";
import Avatar from "../../../static/img/logo/pp.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";

const RelieverList = ({ relievers, onDeleteReliever, pk }) => {
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  // Function to handle deletion
  const handleDelete = async (staffNo) => {
    try {
      const response = await axios.post(
        `/selfservice/FnLeaveReliever/${pk}/`,
        {
          reliever: staffNo,
          myAction: "delete",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Reliever deleted successfully!");
        // Call parent handler to refresh the list
        onDeleteReliever(pk);
      } else {
        toast.error("Failed to delete reliever.");
      }
    } catch (error) {
      toast.error("Error deleting reliever. Please try again.");
      console.error("Error deleting reliever:", error);
    }
  };

  return (
    <div className="list-group main-lists-content scrollbar-wrapper custom-scrollbar">
      {relievers.map((reliever) => (
        <div
          key={reliever.StaffNo}
          className="list-group-item list-group-item-action bg-light-hover-primary d-flex align-items-center justify-content-between"
        >
          <div className="list-wrapper gap-0 d-flex align-items-center">
            <img className="list-img" src={Avatar} alt="profile" />
            <div className="list-content ms-3">
              <h5>{reliever.StaffName}</h5>
              <p>{reliever.ShortcutDimension2Code}</p>
            </div>
          </div>
          <FontAwesomeIcon
            icon={faTrash}
            className="text-danger ms-3" // Add spacing and color
            onClick={() => handleDelete(reliever.StaffNo)}
            style={{ cursor: "pointer" }} // Show pointer cursor on hover
            title="Delete" // Tooltip for accessibility
          />
        </div>
      ))}
    </div>
  );
};

export default RelieverList;
