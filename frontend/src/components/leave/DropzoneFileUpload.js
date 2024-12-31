import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import "./DropzoneFileUpload.css";

const DropzoneFileUpload = ({ pk, onFetchAttachments }) => {
  const [files, setFiles] = useState([]);

  // Callback function to handle dropped files
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  // Fetch the list of attachments from the backend
  const fetchAttachments = async () => {
    try {
      const response = await fetch(`/selfservice/FileUploadView/${pk}/`);
      if (response.ok) {
        const data = await response.json();
        if (onFetchAttachments) {
          onFetchAttachments(data);
        }
      } else {
        toast.error("Failed to fetch attachments.");
      }
    } catch (error) {
      toast.error("Error fetching attachments. Please try again.");
      console.error("Error:", error);
    }
  };

  // Send files to the backend
  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select a file to upload.");
      return;
    }

    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch(`/selfservice/FileUploadView/${pk}/`, {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRFToken": csrfToken, // Add CSRF token to headers
        },
      });

      if (response.ok) {
        toast.success("File(s) uploaded successfully!");
        setFiles([]); // Clear files after successful upload
        // Fetch attachments after successful file upload
        fetchAttachments();
      } else {
        toast.error("Failed to upload files.");
      }
    } catch (error) {
      toast.error("Error uploading files. Please try again.");
      console.error("Error:", error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div className="dropzone-container">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "dropzone-active" : ""}`}
      >
        <input {...getInputProps()} />
        <p>Drag and drop files here, or click to select files</p>
      </div>

      {files.length > 0 && (
        <div className="file-preview">
          <h4>Files to upload:</h4>
          <ul>
            {files.map((file) => (
              <li key={file.path}>{file.path}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleUpload} className="btn btn-primary mt-2 w-100">
        Upload Files
      </button>
    </div>
  );
};

export default DropzoneFileUpload;
