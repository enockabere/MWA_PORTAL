import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "./context/DashboardContext"; // Import context
import mwaLogo from "../../static/img/logo/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFingerprint } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // State for button loading
  const [error, setError] = useState(""); // State for validation error
  const { setLoggedIn } = useDashboard(); // Use setLoggedIn to update login state
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showToast) {
      toast.success("Logged out successfully!");
    }
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if email is entered
    if (!email) {
      setError("Email is required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");

    try {
      const response = await fetch("/selfservice/login_view/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setLoggedIn(true); // Update context login state
        navigate(data.redirect_url, { state: { showWelcomeToast: true } });
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div className="row m-0">
      <div className="col-12 p-0">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="login-card login-dark">
          <div>
            <div>
              <a className="logo" href="#">
                <img
                  className="img-fluid for-light"
                  src={mwaLogo}
                  height="120"
                  width="150"
                  alt="login page"
                />
              </a>
            </div>
            <div className="login-main">
              <form className="theme-form" onSubmit={handleSubmit}>
                <h3>Sign in to account</h3>
                <p>Enter your email &amp; password to login</p>
                <div className="form-group">
                  <label className="col-form-label">Email Address</label>
                  <input
                    className="form-control"
                    type="email"
                    required
                    placeholder="Test@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {error && !email && (
                    <div className="text-danger mt-1">{error}</div>
                  )}
                </div>
                <div className="form-group">
                  <label className="col-form-label">Password</label>
                  <div className="form-input position-relative">
                    <input
                      className="form-control"
                      type="password"
                      required
                      placeholder="*********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="show-hide">
                      <span className="show"></span>
                    </div>
                  </div>
                </div>
                <div className="form-group mb-0">
                  <div className="checkbox p-0">
                    <input id="checkbox1" type="checkbox" />
                    <label className="text-muted" htmlFor="checkbox1">
                      Remember password
                    </label>
                  </div>
                  <a className="link" href="forget-password.html">
                    Forgot password?
                  </a>
                  <div className="text-end mt-3">
                    <button
                      className="btn btn-primary btn-block w-100"
                      type="submit"
                      disabled={isSubmitting} // Disable button while submitting
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          ></span>
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </div>
                </div>
                <h6 className="text-muted mt-4 or">Or Sign in with</h6>
                <div className="social mt-4">
                  <div className="btn-showcase">
                    <a className="btn btn-light" href="#" target="_blank">
                      <FontAwesomeIcon icon={faFingerprint} className="me-2" />{" "}
                      Microsoft 365 Office
                    </a>
                  </div>
                </div>
                {error && (
                  <div className="text-danger text-center mt-3">{error}</div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
