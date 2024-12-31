import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ReportModal = ({ pdfData, isModalOpen, closeModal, downloadPdf }) => {
  return (
    <Modal
      show={isModalOpen}
      onHide={closeModal}
      size="lg"
      aria-labelledby="myExtraLargeModal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="myExtraLargeModal">Preview Report</Modal.Title>
      </Modal.Header>
      <Modal.Body className="dark-modal">
        <div className="large-modal-header">
          <i data-feather="chevrons-right"></i>
          <h6>Preview your leave report</h6>
        </div>
        <iframe
          src={`data:application/pdf;base64,${pdfData}`}
          title="PDF Preview"
          width="100%"
          height="500px"
        ></iframe>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button variant="success" onClick={downloadPdf}>
          Download
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportModal;
