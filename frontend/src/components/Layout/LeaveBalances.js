import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import { useSpring, animated } from "react-spring";
import "./balances.css";

const LeaveBalances = () => {
  const [leaveData, setLeaveData] = useState([]); // Leave data state
  const [loading, setLoading] = useState(true); // Loading spinner state
  const [isRefreshing, setIsRefreshing] = useState(false); // For data refresh indicator

  useEffect(() => {
    const fetchLeaveData = () => {
      setIsRefreshing(true);

      // Simulate fetching data (replace with your actual API call)
      const leaveTypes = [
        "Annual Leave",
        "Sick Leave",
        "Maternity Leave",
        "Paternity Leave",
      ];
      const newData = Array.from({ length: 4 }, (_, index) => ({
        type: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
        balance: Math.floor(Math.random() * 10) + 1,
        totalTaken: Math.floor(Math.random() * 20),
        icon: "fa-calendar", // Use calendar icon for all
        color: [
          "leave-card-green",
          "leave-card-yellow",
          "leave-card-pink",
          "leave-card-blue",
        ][index],
      }));

      // Add the black card data to the array (same as other leave types)
      newData.push({
        type: leaveTypes[Math.floor(Math.random() * leaveTypes.length)], // Dynamic leave type
        balance: Math.floor(Math.random() * 10) + 1,
        totalTaken: Math.floor(Math.random() * 20),
        icon: "fa-calendar", // Calendar icon for consistency
        color: "bg-dark text-white", // Style for the black card
      });

      setTimeout(() => {
        setLeaveData(newData); // Update leave data
        setLoading(false); // Stop initial loading spinner
        setIsRefreshing(false); // Stop refreshing indicator
      }, 1500); // Simulate delay for data fetching
    };

    fetchLeaveData();

    // Periodically refresh data
    const interval = setInterval(fetchLeaveData, 8000);

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  const iconAnimation = useSpring({
    transform: isRefreshing ? "scale(1)" : "scale(1.2)",
    opacity: isRefreshing ? 0.5 : 1,
    config: { tension: 200, friction: 15 },
  });

  return (
    <div className="leave-balances">
      {/* Loader */}
      {loading && (
        <div className="loader-container card-loading d-flex justify-content-center align-items-center">
          <Bars color="#00BFFF" height={80} width={80} />
        </div>
      )}

      {!loading && (
        <>
          {/* First row: 3 cards */}
          <div className="row gy-2 mb-2 gx-2">
            {leaveData.slice(0, 3).map((leave, index) => (
              <div key={index} className="col-md-4">
                <div
                  className={`card ${leave.color} h-100 order-card leave-card`}
                >
                  <div className="card-block leave-card-block">
                    <h6 className="m-b-20 text-white leave-card-title">
                      {leave.type} Balance
                    </h6>
                    <h2 className="text-right leave-card-balance text-white">
                      <animated.i
                        className={`fa ${leave.icon} f-left text-white`}
                        style={iconAnimation}
                      />
                      <span className="text-white">{leave.balance}</span>
                    </h2>
                    <p className="m-b-0 text-white leave-card-info">
                      Total Taken
                      <span className="f-right text-white">{`${leave.totalTaken} days`}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second row: 1 card + 1 black card + loader */}
          <div className="row gy-2 mb-2 gx-2">
            {leaveData.slice(3, 4).map((leave, index) => (
              <div key={index} className="col-md-4">
                <div
                  className={`card ${leave.color} h-100 order-card leave-card`}
                >
                  <div className="card-block leave-card-block">
                    <h6 className="m-b-20 text-white leave-card-title">
                      {leave.type} Balance
                    </h6>
                    <h2 className="text-right leave-card-balance text-white">
                      <animated.i
                        className={`fa ${leave.icon} f-left text-white`}
                        style={iconAnimation}
                      />
                      <span className="text-white">{leave.balance}</span>
                    </h2>
                    <p className="m-b-0 text-white leave-card-info">
                      Total Taken
                      <span className="f-right text-white">{`${leave.totalTaken} days`}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Black card */}
            <div className="col-md-4">
              <div className="card bg-dark text-white h-100 order-card leave-card">
                <div className="card-block leave-card-block">
                  <h6 className="m-b-20 leave-card-title text-white">
                    {leaveData[4]?.type || "Loading..."}{" "}
                    {/* Dynamic leave type */}
                  </h6>
                  <h2 className="text-right leave-card-balance text-white">
                    <animated.i
                      className="fa fa-calendar f-left text-white"
                      style={iconAnimation}
                    />
                    <span>{leaveData[4]?.balance || "Loading..."}</span>{" "}
                    {/* Show the balance */}
                  </h2>
                  <p className="m-b-0 leave-card-info text-white">
                    Total Taken
                    <span className="f-right text-white">
                      {`${leaveData[4]?.totalTaken || "Loading..."} days`}{" "}
                      {/* Show Total Taken */}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Loader */}
            {isRefreshing && (
              <div className="col-md-4 d-flex justify-content-center align-items-center">
                <Bars color="#00BFFF" height={60} width={60} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LeaveBalances;
