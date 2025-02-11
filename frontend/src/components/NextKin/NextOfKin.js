import React, { useState } from "react";
import { Modal, Table, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faEye,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const NextOfKin = () => {
  const [showViewModal, setShowViewModal] = useState(false); // State for viewing next of kin
  const [showAddEditModal, setShowAddEditModal] = useState(false); // State for adding/editing next of kin
  const [selectedKin, setSelectedKin] = useState(null); // State to store selected next of kin for editing
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
  });

  // Sample data for next of kin
  const [nextOfKinData, setNextOfKinData] = useState([
    {
      id: 1,
      name: "John Doe",
      relationship: "Father",
      phone: "123-456-7890",
      email: "john.doe@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      relationship: "Mother",
      phone: "987-654-3210",
      email: "jane.smith@example.com",
    },
  ]);

  // Open the view modal
  const handleShowViewModal = () => setShowViewModal(true);
  const handleCloseViewModal = () => setShowViewModal(false);

  // Open the add/edit modal
  const handleShowAddEditModal = (kin = null) => {
    setSelectedKin(kin);
    if (kin) {
      // If editing, populate the form with the selected kin's data
      setFormData({
        name: kin.name,
        relationship: kin.relationship,
        phone: kin.phone,
        email: kin.email,
      });
    } else {
      // If adding, reset the form
      setFormData({
        name: "",
        relationship: "",
        phone: "",
        email: "",
      });
    }
    setShowAddEditModal(true);
  };
  const handleCloseAddEditModal = () => setShowAddEditModal(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission (add or edit)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedKin) {
      // Update existing kin
      const updatedData = nextOfKinData.map((kin) =>
        kin.id === selectedKin.id ? { ...kin, ...formData } : kin
      );
      setNextOfKinData(updatedData);
    } else {
      // Add new kin
      const newKin = {
        id: nextOfKinData.length + 1, // Generate a new ID
        ...formData,
      };
      setNextOfKinData([...nextOfKinData, newKin]);
    }
    handleCloseAddEditModal();
  };

  // Handle delete action
  const handleDelete = (id) => {
    const updatedData = nextOfKinData.filter((kin) => kin.id !== id);
    setNextOfKinData(updatedData);
  };

  return (
    <>
      {/* Link to trigger the view modal */}
      <a href="#" onClick={handleShowViewModal}>
        <FontAwesomeIcon icon={faEye} className="text-success" /> View Next of
        Kin
      </a>

      {/* Modal for Viewing Next of Kin */}
      <Modal show={showViewModal} onHide={handleCloseViewModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>Next of Kin Details</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Relationship</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {nextOfKinData.map((kin) => (
                <tr key={kin.id}>
                  <td>{kin.name}</td>
                  <td>{kin.relationship}</td>
                  <td>{kin.phone}</td>
                  <td>{kin.email}</td>
                  <td>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => handleShowAddEditModal(kin)}
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ fontSize: "2px" }}
                      />
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-danger"
                      onClick={() => handleDelete(kin.id)}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ fontSize: "2px" }}
                      />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleShowAddEditModal()}>
            <FontAwesomeIcon icon={faPlus} /> Add New
          </Button>
          <Button variant="secondary" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Adding/Editing Next of Kin */}
      <Modal show={showAddEditModal} onHide={handleCloseAddEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>{selectedKin ? "Edit Next of Kin" : "Add Next of Kin"}</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Relationship</Form.Label>
              <Form.Control
                type="text"
                name="relationship"
                value={formData.relationship}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {selectedKin ? "Save Changes" : "Add Entry"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NextOfKin;
