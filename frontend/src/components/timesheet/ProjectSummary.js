import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const ProjectSummary = ({ projects }) => {
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "-";
    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const dayOfMonth = date.getDate();
    const suffix = getDaySuffix(dayOfMonth);
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const weekday = date.toLocaleString("default", { weekday: "short" });

    return `${weekday}, ${dayOfMonth}${suffix} ${month}, ${year}`;
  };

  useEffect(() => {
    setLoading(false);
  }, [projects]);

  if (loading) {
    return (
      <div className="text-center">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" />
        <p>Loading projects...</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center mt-3">
        <p>No projects assigned.</p>
      </div>
    );
  }

  return (
    <div>
      <h5>Project Summary</h5>
      <div className="table-responsive mt-3">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Project</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>% Allocation</th>
              <th>Supervisor</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index}>
                <td>{project.ProjectTask}</td>
                <td>{formatDate(project.ProjectStartDate)}</td>
                <td>{formatDate(project.ProjectEndDate)}</td>
                <td>{project.Allocation}%</td>
                <td>{project.SupervisorName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectSummary;
