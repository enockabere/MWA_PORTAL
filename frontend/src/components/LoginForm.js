import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "./context/DashboardContext";
import mwaLogo from "../../static/img/logo/logo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BentCard from "./BentCard";
import "./BentCard.css"; // Import the CSS file

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { setLoggedIn, setDashboardData } = useDashboard();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showToast) {
      toast.success("Logged out successfully!");
    }
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        fetchDashboardData();
        const data = await response.json();
        setLoggedIn(true);
        toast(data.message);
        navigate(data.redirect_url, { state: { showWelcomeToast: true } });
      } else {
        console.log(response);
        toast.error("Invalid email or password.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const dashboardResponse = await fetch("/selfservice/dashboard_data/");
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        console.log("Dashboard Data:", dashboardData);
        setDashboardData(dashboardData); // Update context with fresh data
      } else {
        console.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "-20px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <ul style={{ margin: "0", padding: "0", color: "white" }}>{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "white",
          margin: "0 5px",
          cursor: "pointer",
        }}
      ></div>
    ),
  };

  return (
    <div className="container-fluid p-0">
      <div className="row login-card">
        {/* Left Column - Login Form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div
            className="login-dark"
            style={{ width: "100%", padding: "20px" }}
          >
            <div>
              <div className="login-main">
                <div style={{ textAlign: "left" }}>
                  <a className="logo" href="#">
                    <img
                      className="img-fluid for-light"
                      src={mwaLogo}
                      height="170"
                      width="170"
                      alt="login page"
                    />
                  </a>
                </div>
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
                    <div className="text-end mt-4">
                      <button
                        className="btn btn-primary btn-block w-100"
                        type="submit"
                        disabled={isSubmitting}
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
                  {error && (
                    <div className="text-danger text-center mt-3">{error}</div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Slider with Hover Effect */}
        <div
          className="col-md-6 p-0 d-flex align-items-center justify-content-center parent-slider-div"
          style={{
            backgroundImage:
              "linear-gradient(to right bottom, #0c6cb4, #0C6BAA, #0C8BAA, #0CAAA7, #187094)",
            height: "100vh",
            overflow: "hidden",
            position: "relative",
            borderRadius: "2px",
          }}
        >
          {/* Add the hover effect structure */}
          <div className="shine"></div>
          <div className="background">
            <div className="tiles">
              {[...Array(25)].map((_, i) => (
                <div key={i} className={`tile tile-${i + 1}`}></div>
              ))}
            </div>
            <div className="lines">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`line line-${i + 1}`}></div>
              ))}
            </div>
          </div>
          {/* Render the BentCard component */}
          <BentCard />
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default LoginForm;
