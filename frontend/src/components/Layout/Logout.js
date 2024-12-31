import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDashboard } from "../context/DashboardContext";

const Logout = () => {
  const navigate = useNavigate();
  const { setLoggedIn, setDashboardData } = useDashboard(); // Ensure both are available

  useEffect(() => {
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");

    const handleLogout = async () => {
      try {
        const response = await fetch("/selfservice/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(csrfToken && { "X-CSRFToken": csrfToken }),
          },
          credentials: "include",
        });

        if (response.ok) {
          setLoggedIn(false);
          setDashboardData(null); // Safely set null
          sessionStorage.clear();
          localStorage.clear();
          navigate("/selfservice", { state: { showToast: true } });
        } else {
          toast.error("Failed to log out. Please try again.");
        }
      } catch (error) {
        console.error("Error logging out:", error);
        toast.error("An error occurred. Please try again.");
      }
    };

    handleLogout();
  }, [navigate, setLoggedIn, setDashboardData]);

  return null;
};

export default Logout;
