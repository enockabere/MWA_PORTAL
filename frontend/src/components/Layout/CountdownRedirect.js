import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CountdownRedirect = ({ countdownTime, redirectPath }) => {
  const [countdown, setCountdown] = useState(countdownTime);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      sessionStorage.clear();
      localStorage.clear();
      navigate("/selfservice/dashboard"); // Navigate to the redirect path
    }
  }, [countdown, navigate, redirectPath]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <p>
        Redirecting to the dashboard in{" "}
        <span className="text-danger">{countdown}</span> seconds...
      </p>
    </div>
  );
};

export default CountdownRedirect;
