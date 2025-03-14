import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "./context/DashboardContext";
import mwaLogo from "../../static/img/logo/logo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BentCard from "./BentCard";
import "./BentCard.css"; // Import the CSS file

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { setLoggedIn } = useDashboard();
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
    <div className="container-fluid p-0" style={{ background: "#0c6cb4" }}>
      <div className="row m-0 vh-100">
        {/* Left Column - Login Form */}
        <div
          className="login-card col-md-5 d-flex align-items-center justify-content-center"
          style={{
            backgroundImage:
              "linear-gradient(to right bottom, #0c6cb4, #0C6BAA, #0C8BAA, #0CAAA7, #187094)",
            height: "100vh",
            overflow: "hidden",
            position: "relative",
            borderRadius: "2px",
          }}
        >
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
                      height="200"
                      width="200"
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
          className="col-md-7 p-0 d-flex align-items-center justify-content-center parent-slider-div"
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
              <div className="tile tile-1"></div>
              <div className="tile tile-2"></div>
              <div className="tile tile-3"></div>
              <div className="tile tile-4"></div>
              <div className="tile tile-5"></div>
              <div className="tile tile-6"></div>
              <div className="tile tile-7"></div>
              <div className="tile tile-8"></div>
              <div className="tile tile-9"></div>
              <div className="tile tile-10"></div>
            </div>
            <div className="line line-1"></div>
            <div className="line line-2"></div>
            <div className="line line-3"></div>
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
