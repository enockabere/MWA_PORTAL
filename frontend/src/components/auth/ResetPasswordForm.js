import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");

    // Make an API call to reset password
    fetch("/selfservice/reset-password/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({ password: newPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          toast.success("Password reset successfully!", {
            position: "top-right",
            autoClose: 5000,
          });
          navigate("/selfservice");
          // Optionally, redirect or perform further actions
        } else {
          toast.error(data.message || "Failed to reset password", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      })
      .catch(() => {
        toast.error("An error occurred. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  };

  return (
    <div>
      <ToastContainer />
      <form className="theme-form" onSubmit={handlePasswordChange}>
        <h6 className="mt-4">Create Your Password</h6>
        <div className="form-group">
          <label className="col-form-label">New Password</label>
          <div className="form-input position-relative">
            <input
              className="form-control"
              type="password"
              required
              placeholder="*********"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="col-form-label">Retype Password</label>
          <input
            className="form-control"
            type="password"
            required
            placeholder="*********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="form-group mb-0">
          <button className="btn btn-primary btn-block w-100" type="submit">
            Done
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPasswordForm;
