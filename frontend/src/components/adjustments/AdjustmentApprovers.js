import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdjustmentApprovers = ({ approvers, pk }) => {
  const navigate = useNavigate();
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const cancelSubmit = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will cancel the approval request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(
        `/selfservice/FnCancelLeaveAdjustmentApproval/${pk}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify({}),
        }
      );

      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "Request Cancelled",
          text: "Your approval request has been cancelled successfully.",
        });
        navigate("/selfservice/dashboard");
      } else {
        console.error("Cancel request failed.");
        await Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Cancel request failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Cancel request failed:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Cancel request failed. Please try again.",
      });
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

export default AdjustmentApprovers;
