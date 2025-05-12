import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const LeaveApprovers = ({ approvers, pk }) => {
  const navigate = useNavigate();
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  const cancelSubmit = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this approval request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, cancel it",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(`/selfservice/LeaveCancel/${pk}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        await Swal.fire(
          "Canceled!",
          "Your approval request has been canceled.",
          "success"
        );
        navigate("/selfservice/dashboard");
      } else {
        console.error("Cancel request failed.");
        await Swal.fire(
          "Error",
          "Cancel request failed. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Cancel request failed:", error);
      await Swal.fire(
        "Error",
        "Cancel request failed. Please try again.",
        "error"
      );
    }
  };

  return (
    <div className="card card-mb-faq">
      <div className="card-body faq-body">
        <div className="navigation-option">
          <ul>
            {approvers.map((approver) => (
              <li key={approver.id}>
                <div>
                  <FontAwesomeIcon icon={faUserCircle} className="me-1" />
                  {approver.Name}{" "}
                  <span className="badge bg-primary">
                    {approver.Approval_sequence}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <hr />
          <button
            type="button"
            className="btn btn-danger"
            onClick={cancelSubmit}
          >
            Cancel Approval Request <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveApprovers;
