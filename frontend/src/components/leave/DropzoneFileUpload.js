import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";
import "./DropzoneFileUpload.css";

const DropzoneFileUpload = ({ pk, onFetchAttachments }) => {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const fetchAttachments = async () => {
    try {
      const response = await fetch(`/selfservice/FileUploadView/${pk}/`);
      if (response.ok) {
        const data = await response.json();
        if (onFetchAttachments) {
          onFetchAttachments(data);
        }
      } else {
        Swal.fire("Error", "Failed to fetch attachments.", "error");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        "Error fetching attachments. Please try again.",
        "error"
      );
      console.error("Error:", error);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      Swal.fire(
        "No File Selected",
        "Please select a file to upload.",
        "warning"
      );
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
          "X-CSRFToken": csrfToken,
        },
      });

      if (response.ok) {
        Swal.fire("Success", "File(s) uploaded successfully!", "success");
        setFiles([]);
        fetchAttachments();
      } else {
        Swal.fire("Upload Failed", "Failed to upload files.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error uploading files. Please try again.", "error");
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
