import React, { useState } from "react";

function SendOtpForm({ setStep }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  // Define the handleEmailChange function
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleSubmitEmail = async (event) => {
    event.preventDefault();
    console.log("Submitting email:", email);
  
    try {
      // Include the email as a query parameter in the URL
      const response = await fetch(
        `/selfservice/send-otps/?email=${encodeURIComponent(email)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Raw response:", response);
  
      if (!response.ok) {
        console.error("HTTP error:", response.status);
        return;
      }
  
      // Parse the JSON response directly
      const data = await response.json();
      console.log("Parsed response:", data);
  
      // Navigate after successful response
      setStep(2);
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };
  return (
    <form className="theme-form" onSubmit={handleSubmitEmail}>
      <h4>Reset Your Password</h4>
      <div className="form-group">
        <label className="col-form-label">Enter Your Email</label>
        <div className="row">
          <div className="col-12">
            <input
              className="form-control mb-1"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="example@example.com"
              required
            />
          </div>
          <div className="col-12">
            <div className="text-end">
              <button
                className="btn btn-primary btn-block m-t-10"
                type="submit"
              >
                Send OTP
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="text-danger mt-2">{error}</div>}
    </form>
  );
}

export default SendOtpForm;