import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import axios from "axios";
import { toast } from "react-toastify";

const LeaveBalanceChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "pie",
        toolbar: {
          show: false, // Hide chart toolbar
        },
      },
      labels: [
        "Available Max Overdraft",
        "Leave Earned To Date",
        "Balance BF",
        "Days Taken To Date",
        "Recalled Days",
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 150,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      title: {
        align: "center",
        style: {
          fontSize: "18px",
          fontWeight: "bold",
          color: "#2b5f60",
        },
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          customScale: 1.0,
          donut: {
            size: "70%",
            background: "#fff",
          },
        },
      },
      colors: ["#2b5f60", "#1e88e5", "#ff9800", "#8e44ad", "#f44336"], // Custom colors for the slices
      tooltip: {
        y: {
          formatter: (val) => `${val} days`, // Formatting tooltips
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        fontSize: "12px",
        labels: {
          colors: "#6c757d", // Color for legend labels
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          colors: ["#fff"],
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          opacity: 0.6,
        },
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Change to the correct Django endpoint
        const response = await axios.get(
          "/selfservice/FnGetAnnualLeaveDashboard/"
        ); // Update this URL
        const responseData = response.data;

        // Prepare chart data
        const pieData = [
          responseData.availableMaxOverdraft,
          responseData.leaveEarnedToDate,
          responseData.balanceBF,
          responseData.daysTakenToDate,
          responseData.recalledDays,
        ];

        setChartData((prevState) => ({
          ...prevState,
          series: pieData,
        }));
      } catch (error) {
        console.error(error);
        toast.error("Failed to load chart data.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="leave-balance-chart">
      <ApexCharts
        options={chartData.options}
        series={chartData.series}
        type="pie"
        height={250}
      />
    </div>
  );
};

export default LeaveBalanceChart;
