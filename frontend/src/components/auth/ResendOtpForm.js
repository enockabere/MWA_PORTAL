import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResendOtpForm({ setStep }) {
  const [otp, setOtp] = useState(["", "", ""]);
  const [error, setError] = useState(null);

  // Handle OTP input change
  const handleOtpChange = (index, e) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (e.target.value.length === 2 && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  // Handle submitting OTP to Django view
  const handleSubmitOtp = (e) => {
    e.preventDefault();
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");
    const enteredOtp = otp.join("");

    fetch("/selfservice/verify-otp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({ otp: enteredOtp }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          toast.success("OTP verified successfully!", {
            position: "top-right",
            autoClose: 5000,
          });
          setStep(3);
        } else {
          toast.error(data.message || "OTP verification failed", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      })
      .catch(() => {
        setError("An error occurred. Please try again.");
      });
  };

  // Handle resend OTP action
  const handleResendOtp = (e) => {
    e.preventDefault();
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");

    fetch("/selfservice/resend-otp/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          toast.success("OTP resent successfully!", {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          toast.error(data.message || "Failed to resend OTP", {
            position: "top-right",
            autoClose: 5000,
          });
        }
      })
      .catch(() => {
        setError("An error occurred. Please try again.");
      });
  };

  return (
    <div>
      <ToastContainer />
      <form className="theme-form" onSubmit={handleSubmitOtp}>
        <div className="form-group">
          <label className="col-form-label pt-0">Enter OTP</label>
          <div className="row">
            {otp.map((digit, index) => (
              <div className="col" key={index}>
                <input
                  id={`otp-input-${index}`}
                  className="form-control text-center opt-text"
                  type="text"
                  value={digit}
                  maxLength="2"
                  onChange={(e) => handleOtpChange(index, e)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="form-group mb-0">
          <button className="btn btn-primary btn-block w-100" type="submit">
            Verify OTP
          </button>
        </div>
      </form>
      <div className="mt-4 mb-4">
        <span className="reset-password-link">
          If you didn't receive the OTP?&nbsp;&nbsp;
          <a
            href="#"
            className="btn-link text-danger"
            onClick={handleResendOtp}
          >
            Resend OTP
          </a>
        </span>
      </div>
    </div>
  );
}

export default ResendOtpForm;
