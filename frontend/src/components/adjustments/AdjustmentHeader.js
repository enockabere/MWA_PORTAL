import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";

const AdjustmentHeader = ({ onApplicationNoRetrieved }) => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

  const [formData, setFormData] = useState({
    richText: "",
    myAction: "insert",
    AdjustmentNo: "",
  });

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData({
      ...formData,
      richText: data,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors = {};
    if (!formData.richText) {
      newErrors.richText = "Leave Adjustment Description is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
    const plainText = formData.richText.replace(/<[^>]+>/g, "");
    try {
      const response = await axios.post(
        "/selfservice/LeaveAdjustments/",
        { ...formData, richText: plainText },
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.applicationNo) {
        toast.success("Application submitted successfully!");
        if (onApplicationNoRetrieved) {
          onApplicationNoRetrieved(response.data.applicationNo);
        }
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (error) {
      toast.error("Error submitting application.");
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adjustment-header">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="hidden" name="myAction" value={formData.myAction} />
          <input
            type="hidden"
            name="AdjustmentNo"
            value={formData.AdjustmentNo}
          />
          <label className="form-label" htmlFor="description">
            Leave Adjustment Description
          </label>
          <CKEditor
            editor={ClassicEditor}
            data={formData.richText}
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
          {errors.richText && (
            <div className="text-danger">{errors.richText}</div>
          )}
        </div>

        <div className="col-xl-12 text-end mt-4">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                style={{ marginRight: "8px" }}
              ></span>
            ) : (
              <>
                Start Your Leave Adjustment
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ marginRight: "5px" }}
                />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdjustmentHeader;
