// ModalComponents.js
import React from "react";
import moment from "moment";
import { Modal, Button, Form, Alert } from "react-bootstrap";

export const AddEntryModal = ({
  show,
  onHide,
  popupDate,
  hoursWorked,
  handleHoursWorkedChange,
  region,
  selectedProject,
  handleProjectChange,
  projects,
  error,
  loadingAddEntry,
  handleSubmit,
  getMaxHoursForDay,
}) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>
        Enter Hours Worked for {popupDate.format("MMMM Do, YYYY")}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>
            Hours Worked (Max: {getMaxHoursForDay(popupDate.toDate())} hours)
          </Form.Label>
          <Form.Control
            type="number"
            value={hoursWorked}
            onChange={handleHoursWorkedChange}
            placeholder="Enter hours worked"
            required
          />
        </Form.Group>
        {region === "USA" && (
          <Form.Group className="mb-3">
            <Form.Label>Project</Form.Label>
            <Form.Select
              value={selectedProject}
              onChange={handleProjectChange}
              required
            >
              <option value="">Select a project</option>
              {projects.map((project, index) => (
                <option key={index} value={project.ProjectTask}>
                  {project.ProjectTask}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        <Button type="submit" variant="primary" disabled={loadingAddEntry}>
          {loadingAddEntry ? "Submitting..." : "Submit"}
        </Button>
        <Button variant="secondary" onClick={onHide} className="ms-2">
          Cancel
        </Button>
      </Form>
    </Modal.Body>
  </Modal>
);

export const EditEntryModal = ({
  show,
  onHide,
  editingProject,
  hoursWorked,
  handleHoursWorkedChange,
  region,
  selectedProject,
  handleProjectChange,
  projects,
  error,
  loadingEditEntry,
  handleEditSubmit,
  getMaxHoursForDay,
}) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>
        Edit Hours Worked for{" "}
        {editingProject &&
          moment(editingProject.Timesheet_Entry_Date).format("MMMM Do, YYYY")}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={handleEditSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>
            Hours Worked (Max:{" "}
            {editingProject &&
              getMaxHoursForDay(
                new Date(editingProject.Timesheet_Entry_Date)
              )}{" "}
            hours)
          </Form.Label>
          <Form.Control
            type="number"
            value={hoursWorked}
            onChange={handleHoursWorkedChange}
            required
          />
        </Form.Group>
        {region === "USA" && (
          <Form.Group className="mb-3">
            <Form.Label>Project</Form.Label>
            <Form.Select
              value={selectedProject}
              onChange={handleProjectChange}
              required
            >
              <option value="">Select a project</option>
              {projects.map((project, index) => (
                <option key={index} value={project.ProjectTask}>
                  {project.ProjectTask}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        )}
        {error && <Alert variant="danger">{error}</Alert>}
        <Button type="submit" variant="primary" disabled={loadingEditEntry}>
          {loadingEditEntry ? "Updating..." : "Update"}
        </Button>
        <Button variant="secondary" onClick={onHide} className="ms-2">
          Cancel
        </Button>
      </Form>
    </Modal.Body>
  </Modal>
);

export const DeleteEntryModal = ({
  show,
  onHide,
  deletingProject,
  error,
  loadingDeleteEntry,
  handleDeleteSubmit,
  region,
}) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Confirm Deletion</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {error && <Alert variant="danger">{error}</Alert>}
      <p>
        Are you sure you want to delete the entry for {deletingProject?.Project}
        ?
      </p>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleDeleteSubmit();
        }}
      >
        <input
          type="hidden"
          name="DocumentNo"
          value={deletingProject?.Document_No || ""}
        />
        <input
          type="hidden"
          name="EntryNo"
          value={deletingProject?.Document_Entry_No || ""}
        />
        <input
          type="hidden"
          name="Date"
          value={deletingProject?.Timesheet_Entry_Date || ""}
        />
        <input
          type="hidden"
          name="HoursWorked"
          value={deletingProject?.Hours_Worked || ""}
        />
        <input
          type="hidden"
          name="Project"
          value={deletingProject?.Project || ""}
        />
        <input type="hidden" name="Region" value={region} />
        <input
          type="hidden"
          name="LineNo"
          value={deletingProject?.Entry_No || ""}
        />
        <input type="hidden" name="myAction" value="delete" />

        <div className="d-flex justify-content-end">
          <Button
            variant="danger"
            onClick={handleDeleteSubmit}
            disabled={loadingDeleteEntry}
            className="me-2"
          >
            {loadingDeleteEntry ? "Deleting..." : "Delete"}
          </Button>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
        </div>
      </Form>
    </Modal.Body>
  </Modal>
);
