import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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
    }
  };

  // Determine the button text dynamically based on DocumentType
  const getButtonText = () => {
    switch (DocumentType) {
      case "20":
        return "Cancel Leave Application Approval";
      case "18":
        return "Cancel Leave Adjustmen Approval";
      case "25":
        return "Cancel Leave Recall Approval";
      default:
        return "Cancel Document Approval";
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
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
            // Set custom height in config
            height: "300px", // Increase this value as needed
          }}
          style={{ height: "300px" }} // Optionally add inline style
        />
        {errors.approvalComment && (
          <div className="text-danger">{errors.approvalComment}</div>
        )}
      </div>
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span
              className="spinner-border spinner-border-sm"
              style={{ marginRight: "8px" }}
            ></span>
            Submitting...
          </>
        ) : (
          getButtonText()
        )}
      </button>

      {submitError && (
        <div className="alert alert-danger mt-2" role="alert">
          {submitError}
        </div>
      )}
    </form>
  );
};

export default RejectDocument;
