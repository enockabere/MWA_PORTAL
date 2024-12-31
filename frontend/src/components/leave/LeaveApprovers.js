import React from "react";
import Avatar from "../../../static/img/logo/pp.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LeaveApprovers = ({ approvers, pk }) => {
  const navigate = useNavigate();
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  const cancelSubmit = async () => {
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
        toast.success("Cancel request submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/selfservice/dashboard");
      } else {
        console.error("Cancel request failed.");
        toast.error("Cancel request failed. Please try again.");
      }
    } catch (error) {
      console.error("Cancel request failed:", error);
      toast.error("Cancel request failed. Please try again.");
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
