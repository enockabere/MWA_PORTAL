import React from "react";

const ProjectSummary = ({ projects }) => {
  return (
    <div>
      <h5>Project Summary</h5>
      <div className="table-responsive">
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
            {projects && projects.length > 0 ? (
              projects.map((project, index) => (
                <tr key={index}>
                  <td>{project.ProjectTask}</td>
                  <td>{project.ProjectStartDate}</td>
                  <td>{project.ProjectEndDate}</td>
                  <td>{project.Allocation}%</td>
                  <td>{project.SupervisorName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No projects assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectSummary;
