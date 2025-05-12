import React, { useState, useEffect } from "react";
import Breadcrumb from "../Layout/Breadcrumb";
import { useDashboard } from "../context/DashboardContext";
import Preloader from "../Layout/Preloader";
import DataTable from "react-data-table-component";
import "../planner/table.css";

const DPTBalances = () => {
  const { dashboardData } = useDashboard();
  const [balancesData, setBalanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBalances = async () => {
    try {
      const response = await fetch("/selfservice/LeaveBalances/");
      const data = await response.json();

      const sortedBalances = data
        .sort((a, b) => b.LeaveBalance - a.LeaveBalance)
        .map((item, index) => ({
          id: index + 1,
          Name: `${item.First_Name} ${item.Last_Name}`,
          Job_Position: item.Job_Position,
          LeaveBalance: item.LeaveBalance,
          Status: item.Status,
        }));

      setBalanceData(sortedBalances);
    } catch (error) {
      console.error("Error fetching leave balances:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      width: "60px",
    },
    {
      name: "Name",
      selector: (row) => row.Name,
      sortable: true,
    },
    {
      name: "Job Position",
      selector: (row) => row.Job_Position,
      sortable: true,
    },
    {
      name: "Leave Balance",
      selector: (row) => row.LeaveBalance,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.Status,
      sortable: true,
    },
  ];

  return (
    <div>
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
                    <DataTable
                      columns={columns}
                      data={balancesData}
                      pagination
                      striped
                      highlightOnHover
                      responsive
                      noHeader
                      defaultSortFieldId={4}
                    />
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
