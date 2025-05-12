import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import axios from "axios";
import { useDashboard } from "../context/DashboardContext";

const RelieverList = ({ relievers, onDeleteReliever, pk }) => {
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  const { profileImage } = useDashboard();

  const imageSrc =
    profileImage &&
    `data:image/${profileImage.image_format};base64,${profileImage.encoded_string}`;

  const handleDelete = async (staffNo) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this reliever?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

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
        await Swal.fire(
          "Deleted!",
          "Reliever deleted successfully!",
          "success"
        );
        onDeleteReliever(pk);
      } else {
        await Swal.fire("Error", "Failed to delete reliever.", "error");
      }
    } catch (error) {
      console.error("Error deleting reliever:", error);
      await Swal.fire(
        "Error",
        "Error deleting reliever. Please try again.",
        "error"
      );
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
            <img className="list-img" src={imageSrc} alt="profile" />
            <div className="list-content ms-3">
              <h5>{reliever.StaffName}</h5>
              <p>{reliever.ShortcutDimension2Code}</p>
            </div>
          </div>
          <FontAwesomeIcon
            icon={faTrash}
            className="text-danger ms-3"
            onClick={() => handleDelete(reliever.StaffNo)}
            style={{ cursor: "pointer" }}
            title="Delete"
          />
        </div>
      ))}
    </div>
  );
};

export default RelieverList;
