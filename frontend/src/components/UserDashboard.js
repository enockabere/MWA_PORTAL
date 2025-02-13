import React, { useEffect } from "react"; // Add useEffect import
import mwaLogo from "../../static/img/logo/logo.png";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Layout/Header";
import Sidebar from "./Layout/Sidebar";
import { Outlet } from "react-router-dom";
import Footer from "./Layout/Footer";
import "./dash.css";

function UserDashboard() {
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
          reject(new Error(`Script load error for ${src}`));
        document.body.appendChild(script);
      });
    };
    const scripts = [
      "../static/assets/js/config.js",
      "../static/assets/js/sidebar-menu.js",
      "../static/assets/js/sidebar-pin.js",
      "../static/assets/js/slick/slick.min.js",
      "../static/assets/js/slick/slick.js",
      "../static/assets/js/header-slick.js",
      "../static/assets/js/chart/morris-chart/raphael.js",
      "../static/assets/js/chart/morris-chart/morris.js",
      "../static/assets/js/chart/morris-chart/prettify.min.js",
      "../static/assets/js/typeahead/handlebars.js",
      "../static/assets/js/typeahead/typeahead.bundle.js",
      "../static/assets/js/typeahead/typeahead.custom.js",
      "../static/assets/js/typeahead-search/handlebars.js",
      "../static/assets/js/typeahead-search/typeahead-custom.js",
      "../static/assets/js/height-equal.js",
      "../static/assets/js/script.js",
    ];
    const loadScriptsSequentially = async () => {
      for (const script of scripts) {
        await loadScript(script);
      }
      if (window.jQuery) {
        $(document).ready(() => {
          // Your jQuery initialization code here
          console.log("jQuery is ready");
        });
      } else {
        console.error("jQuery failed to load");
      }
    };
    loadScriptsSequentially();
    return () => {
      scripts.forEach((script) => {
        const existingScript = document.querySelector(
          `script[src="${script}"]`
        );
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (location.state?.showWelcomeToast) {
      toast.success("Welcome back!");
    }
  }, [location.state]);

  return (
    <div>
      {/* <div className="loader-wrapper">
        <div className="theme-loader">
          <div className="loader-p"></div>
        </div>
      </div> */}
      <div className="tap-top">
        <i data-feather="chevrons-up"></i>
      </div>
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <Header />
        <div className="page-body-wrapper">
          <Sidebar />
          <div className="page-body">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
