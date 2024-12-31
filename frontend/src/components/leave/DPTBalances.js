import React, { useState, useEffect } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import { useDashboard } from "../context/DashboardContext";
import Preloader from "../Layout/Preloader";
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "../planner/table.css";

const DPTBalances = () => {
  const { dashboardData, setLoggedIn } = useDashboard();
  const [balancesData, setBalanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBalances = async () => {
    try {
      const response = await fetch("/selfservice/LeaveBalances/");
      const data = await response.json();

      // Sort by LeaveBalance in descending order
      const sortedBalances = data.sort(
        (a, b) => b.LeaveBalance - a.LeaveBalance
      );

      // Map required fields
      const balances = sortedBalances.map((item) => ({
        No: item.No_,
        Name: `${item.First_Name} ${item.Last_Name}`,
        Job_Position: item.Job_Position,
        LeaveBalance: item.LeaveBalance,
        Status: item.Status,
      }));

      setBalanceData(balances);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize DataTable once the table data is loaded
  useEffect(() => {
    if (!loading) {
      // Initialize DataTables
      $("#balancesTable").DataTable({
        paging: true,
        searching: true,
        ordering: true,
        info: true,
        responsive: true,
      });
    }
  }, [loading, balancesData]);

  useEffect(() => {
    fetchBalances();
  }, []);

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
        pageTitle={`${dashboardData.user_data.Department} Leave Balances`}
        breadcrumb="Leave Balances"
      />

      <div className="container-fluid">
        <div className="row project-cards">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                {loading ? (
                  <Preloader message="Loading page contents, please wait..." />
                ) : (
                  <div>
                    <h4>Leave Balances</h4>

                    <table
                      id="balancesTable" // Assign an ID to the table for DataTables to target
                      className="table table-bordered"
                    >
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Job Position</th>
                          <th>Leave Balance</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {balancesData.length > 0 ? (
                          balancesData.map((balance, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{balance.Name}</td>
                              <td>{balance.Job_Position}</td>
                              <td>{balance.LeaveBalance}</td>
                              <td>{balance.Status}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DPTBalances;
