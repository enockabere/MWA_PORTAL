import React, { useState, useEffect } from "react";
import { Bars } from "react-loader-spinner";
import { useSpring, animated } from "react-spring";
import "./balances.css";

const LeaveBalances = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchLeaveData = async () => {
      if (leaveData.length > 5) {
        setIsRefreshing(true);
      }

      try {
        const response = await fetch("/selfservice/all-leave-balance/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const parsedData = typeof data === "string" ? JSON.parse(data) : data;
        const leaveTypes = Object.keys(parsedData);
        const leaveBalances = Object.values(parsedData);

        const newData = leaveTypes.map((type, index) => ({
          type,
          balance: leaveBalances[index],
          icon: "fa-calendar",
          color: [
            "leave-card-green",
            "leave-card-yellow",
            "leave-card-pink",
            "leave-card-blue",
          ][index % 4],
        }));

        setLeaveData(newData);
      } catch (error) {
        console.error("Failed to fetch leave data:", error);
      }

      setTimeout(() => {
        setLoading(false);
        setIsRefreshing(false);
      }, 1500);
    };

    fetchLeaveData();

    const interval =
      leaveData.length > 5 ? setInterval(fetchLeaveData, 8000) : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [leaveData]);

  const iconAnimation = useSpring({
    transform: isRefreshing ? "scale(1)" : "scale(1.2)",
    opacity: isRefreshing ? 0.5 : 1,
    config: { tension: 200, friction: 15 },
  });

  return (
    <div className="leave-balances">
      {loading && (
        <div className="loader-container card-loading d-flex justify-content-center align-items-center">
          <Bars color="#00BFFF" height={80} width={80} />
        </div>
      )}

      {!loading && (
        <>
          <div className="row gy-2 mb-2 gx-2">
            {leaveData.slice(0, 5).map((leave, index) => (
              <div key={index} className="col-md-4">
                <div
                  className={`card ${leave.color} h-100 order-card leave-card`}
                >
                  <div className="card-block leave-card-block">
                    <h6 className="m-b-20 text-white leave-card-title">
                      {leave.type} Balance
                    </h6>
                    <h2
                      className="text-right leave-card-balance text-white"
                      style={{ fontSize: "1.5rem" }} // Reduced font size
                    >
                      <animated.i
                        className={`fa ${leave.icon} f-left text-white`}
                        style={iconAnimation}
                      />
                      <span className="text-white">{leave.balance}</span>
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {leaveData.length > 5 && isRefreshing && (
            <div className="d-flex justify-content-center align-items-center">
              <Bars color="#00BFFF" height={60} width={60} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeaveBalances;
