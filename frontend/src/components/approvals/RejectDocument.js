import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const RejectDocument = ({
  Id,
  TableID,
  Entry_No_,
  statusApproveRejectDelegate,
  DocumentType,
  onCancelSubmission,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  const [formData, setFormData] = useState({
    TableID,
    Entry_No_,
    statusApproveRejectDelegate,
    approvalComment: "",
  });

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData({
      ...formData,
      approvalComment: data,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (!formData.approvalComment) {
      setErrors({ approvalComment: "Reason for rejection is required." });
      setIsSubmitting(false);
      return;
    }

    const plainText = formData.approvalComment.replace(/<[^>]+>/g, "");

    try {
      if (!csrfToken) {
        await Swal.fire(
          "Error",
          "CSRF token not found. Please refresh the page.",
          "error"
        );
        return;
      }

      const response = await axios.post(
        `/selfservice/FnActionApprovals/${Id}/`,
        { ...formData, approvalComment: plainText },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        }
      );

      if (response.status === 200) {
        await Swal.fire(
          "Success",
          "Document rejected successfully!",
          "success"
        );
        onCancelSubmission(); // Notify parent
        navigate("/selfservice/dashboard");
      } else {
        await Swal.fire(
          "Error",
          "Submission failed. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error details:", error);
      await Swal.fire(
        "Error",
        error.response?.data?.error || "Something went wrong.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
      setShowModal(false);
    }
  };

  const getButtonText = () => {
    switch (DocumentType) {
      case "LeaveApplication":
        return "Cancel Leave Application Approval";
      case "LeaveAdjustment":
        return "Cancel Leave Adjustment Approval";
      case "Leave Recall":
        return "Cancel Leave Recall Approval";
      default:
        return "Cancel Document Approval";
    }
  };

  return (
    <>
      <Button variant="danger" onClick={() => setShowModal(true)}>
        {getButtonText()}{" "}
        <FontAwesomeIcon icon={faTimes} style={{ marginLeft: "8px" }} />
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h6>{getButtonText()}</h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-12">
                <label className="form-label" htmlFor="description">
                  Reason
                </label>
                <CKEditor
                  editor={ClassicEditor}
                  data={formData.approvalComment}
                  onChange={handleEditorChange}
                  config={{
                    placeholder: "Type your details here...",
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "|",
                      "blockQuote",
                      "undo",
                      "redo",
                    ],
                  }}
                />
                {errors.approvalComment && (
                  <div className="text-danger">{errors.approvalComment}</div>
                )}
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12 text-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                  className="me-2"
                >
                  Close
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RejectDocument;
