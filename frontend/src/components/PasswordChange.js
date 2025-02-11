import React, { useState } from "react";
import { Collapse } from "react-bootstrap"; // Import Collapse here
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCog,
  faInfoCircle,
  faChevronRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useDashboard } from "./context/DashboardContext";
import { useNavigate } from "react-router-dom";

const PasswordChange = ({ onShowToast }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRequirements, setShowRequirements] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loader state
  const { setLoggedIn, setDashboardData } = useDashboard();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrors({});
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setErrors({});
  };

  const validatePassword = () => {
    const newErrors = {};

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least 1 uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least 1 lowercase letter.";
    }

    if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least 1 number.";
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      newErrors.password =
        "Password must contain at least 1 special character.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      onShowToast("Please fix the errors before submitting.", "error");
      return;
    }

    setLoading(true); // Start loading

    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");

    try {
      const response = await fetch("/selfservice/change-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        onShowToast(
          "Password changed successfully, login to continue!!",
          "success"
        );
        setPassword("");
        setConfirmPassword("");
        setLoggedIn(false);
        setDashboardData(null);
        sessionStorage.clear();
        localStorage.clear();
        navigate("/selfservice", { state: { showToast: true } });
      } else {
        onShowToast("Failed to change password. Please try again.", "error");
      }
    } catch (error) {
      onShowToast("An error occurred. Please try again.", "error");
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            New Password <span className="text-danger">*</span>
          </label>
          <input
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter new password"
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">
            Confirm Password <span className="text-danger">*</span>
          </label>
          <input
            className={`form-control ${
              errors.confirmPassword ? "is-invalid" : ""
            }`}
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm new password"
          />
          {errors.confirmPassword && (
            <div className="invalid-feedback">{errors.confirmPassword}</div>
          )}
        </div>
        <div className="mb-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowRequirements(!showRequirements);
            }}
          >
            <FontAwesomeIcon
              icon={faInfoCircle}
              style={{ marginRight: "5px" }}
            />
            Password Requirements
          </a>
          <Collapse in={showRequirements}>
            <div className="mt-2">
              <ul>
                <li>
                  <FontAwesomeIcon icon={faChevronRight} className="me-2" /> At
                  least 6 characters long.
                </li>
                <li>
                  <FontAwesomeIcon icon={faChevronRight} className="me-2" />{" "}
                  Contains at least 1 uppercase letter.
                </li>
                <li>
                  <FontAwesomeIcon icon={faChevronRight} className="me-2" />{" "}
                  Contains at least 1 lowercase letter.
                </li>
                <li>
                  <FontAwesomeIcon icon={faChevronRight} className="me-2" />{" "}
                  Contains at least 1 number.
                </li>
                <li>
                  <FontAwesomeIcon icon={faChevronRight} className="me-2" />{" "}
                  Contains at least 1 special character.
                </li>
              </ul>
            </div>
          </Collapse>
        </div>
        <div className="form-footer">
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? (
              <>
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  style={{ marginRight: "8px" }}
                />
                Changing...
              </>
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faUserCog}
                  style={{ marginRight: "8px" }}
                />
                Change Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChange;
