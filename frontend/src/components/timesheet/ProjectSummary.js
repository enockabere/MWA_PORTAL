import React from "react";

// Dummy project data
const projectData = [
  { project: "Project Alpha", percentage: 40, hoursWorked: 32 },
  { project: "Project Beta", percentage: 30, hoursWorked: 24 },
  { project: "Project Gamma", percentage: 20, hoursWorked: 16 },
  { project: "Project Delta", percentage: 10, hoursWorked: 8 },
];

const ProjectSummary = () => {
  // Calculate total hours worked
  const totalHoursWorked = projectData.reduce(
    (acc, project) => acc + project.hoursWorked,
    0
  );

  // Ensure the total percentage is always 100
  const totalPercentage = projectData.reduce(
    (acc, project) => acc + project.percentage,
    0
  );

  return (
    <div>
      <h5>Project Summary</h5>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Project</th>
              <th>Percentage Assigned</th>
              <th>Hours Worked</th>
            </tr>
          </thead>
          <tbody>
            {projectData.map((project, index) => (
              <tr key={index}>
                <td>{project.project}</td>
                <td>{project.percentage}%</td>
                <td>{project.hoursWorked} hrs</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="my-4">
        <p>
          <strong>Total Hours Worked:</strong> {totalHoursWorked} hrs
        </p>
        <p>
          <strong>Total Percentage Assigned:</strong> {totalPercentage}%
        </p>
      </div>
    </div>
  );
};

export default ProjectSummary;
