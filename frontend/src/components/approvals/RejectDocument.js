import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
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

    const newErrors = {};
    if (!formData.approvalComment) {
      newErrors.approvalComment = "Reason for rejection is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    const plainText = formData.approvalComment.replace(/<[^>]+>/g, "");

    try {
      if (!csrfToken) {
        toast.error("CSRF token not found. Please refresh the page.");
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
        toast.success("Approved successfully!");
        onCancelSubmission(); // Notify parent of success
        navigate("/selfservice/dashboard");
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Error submitting the document."
      );
      console.error("Error details:", error);
    } finally {
      setIsSubmitting(false);
      setShowModal(false); // Close modal on submission
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
      {/* Button to trigger modal */}
      <Button variant="danger" onClick={() => setShowModal(true)}>
        {getButtonText()}{" "}
        <FontAwesomeIcon icon={faTimes} style={{ marginLeft: "8px" }} />
      </Button>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{getButtonText()}</Modal.Title>
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
