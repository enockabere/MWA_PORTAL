import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "./context/DashboardContext"; // Import context
import mwaLogo from "../../static/img/logo/logo.png";
import slider1 from "../../static/img/slider/1.png";
import slider2 from "../../static/img/slider/2.png";
import slider3 from "../../static/img/slider/3.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        toast(data.message);
        navigate(data.redirect_url, { state: { showWelcomeToast: true } });
      } else {
        console.log(response);
        toast.error("Invalid email or password.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Remove slider arrows
  };

  return (
    <div className="container-fluid p-0">
      <div className="row m-0 vh-100">
        {/* Left Column - Login Form */}
        <div className="login-card col-md-6 d-flex align-items-center justify-content-center">
          <div className="login-dark">
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
                  {error && (
                    <div className="text-danger text-center mt-3">{error}</div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Slider */}
        <div
          className="col-md-6 p-0 d-flex align-items-center justify-content-center"
          style={{
            backgroundImage:
              "linear-gradient(to right bottom, #1e7e34, #1e7e34, #1e7e34, #01709d, #187094)", // Gradient background
            height: "100vh", // Ensure the slider takes full height
            overflow: "hidden", // Prevent overflow
          }}
        >
          <div style={{ maxWidth: "80%", textAlign: "center" }}>
            <Slider {...sliderSettings}>
              <div>
                <img
                  src={slider1}
                  alt="Slide 1"
                  style={{ width: "60%", margin: "0 auto 20px" }} // Smaller image with margin below
                />
                <div
                  className="slider-caption"
                  style={{ color: "white", marginTop: "20px" }} // White text and space above
                >
                  <h3 className="text-white">
                    Welcome to The Employee Self-Service Portal
                  </h3>
                  <p>
                    Access leave management, timesheets, HR reports, approvals,
                    and more—all in one place.
                  </p>
                </div>
              </div>
              <div>
                <img
                  src={slider2}
                  alt="Slide 2"
                  style={{ width: "60%", margin: "0 auto 20px" }} // Smaller image with margin below
                />
                <div
                  className="slider-caption"
                  style={{ color: "white", marginTop: "20px" }} // White text and space above
                >
                  <h3 className="text-white">Easy to Use</h3>
                  <p>
                    Our portal is designed to be user-friendly and intuitive.
                  </p>
                </div>
              </div>
              <div>
                <img
                  src={slider3}
                  alt="Slide 3"
                  style={{ width: "60%", margin: "0 auto 20px" }} // Smaller image with margin below
                />
                <div
                  className="slider-caption"
                  style={{ color: "white", marginTop: "20px" }} // White text and space above
                >
                  <h3 className="text-white">Secure and Reliable</h3>
                  <p>Your data is safe with us. We prioritize security.</p>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default LoginForm;
