import React, { useCallback, useState } from "react";
import { useDashboard } from "./context/DashboardContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useDropzone } from "react-dropzone";
import { Modal, Button } from "react-bootstrap";
import "./leave/DropzoneFileUpload.css";
import PasswordChange from "./PasswordChange";
import { useNavigate } from "react-router-dom";

const AvatarDetails = ({ onShowToast }) => {
  // Destructure onShowToast from props
  const { dashboardData, profileImage, setLoggedIn } = useDashboard();
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [files, setFiles] = useState([]); // State to store uploaded files
  const [uploading, setUploading] = useState(false); // State to handle upload progress
  const navigate = useNavigate();

  const imageSrc =
    profileImage &&
    `data:image/${profileImage.image_format};base64,${profileImage.encoded_string}`;

  console.log(imageSrc);

  // Handle modal open/close
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Filter out invalid files (e.g., non-image files)
      const validFiles = acceptedFiles.filter((file) =>
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type
        )
      );

      if (validFiles.length === 0) {
        onShowToast(
          "Only JPEG, PNG, GIF, and WebP files are allowed.",
          "error"
        );
        return;
      }

      setFiles(validFiles);
    },
    [onShowToast] // Add onShowToast to the dependency array
  );

  // Handle file upload to Django backend
  const handleUpload = async () => {
    if (files.length === 0) {
      onShowToast("Please select a file to upload.", "error");
      return;
    }

    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      .getAttribute("content");

    const formData = new FormData();
    formData.append("profile_picture", files[0]); // Use "profile_picture" as the key

    setUploading(true);

    try {
      const response = await fetch("/selfservice/profile_picture/", {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRFToken": csrfToken, // Add CSRF token to headers
        },
      });

      if (response.ok) {
        onShowToast("Profile picture uploaded successfully!", "success");
        setFiles([]); // Clear files after successful upload
        handleCloseModal(); // Close modal after upload
        sessionStorage.clear();
        localStorage.clear();
        navigate("/selfservice", { state: { showToast: true } });
      } else {
        onShowToast("Failed to upload profile picture.", "error");
      }
    } catch (error) {
      onShowToast(
        "Error uploading profile picture. Please try again.",
        "error"
      );
      console.error("Error:", error);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false, // Allow only one file
  });

  return (
    <div>
      <div className="card h-100">
        <div className="card-header pb-0">
          <h4 className="card-title mb-0">My Profile</h4>
        </div>
        <div className="card-body">
          <div className="row mb-2">
            <div className="profile-title">
              <div className="d-flex">
                {/* Avatar with Camera Icon */}
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <img
                    className="img-70 rounded-circle"
                    alt=""
                    src={imageSrc}
                  />
                  {/* Camera Icon */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      borderRadius: "50%",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "24px",
                      height: "24px",
                      cursor: "pointer", // Add pointer cursor
                    }}
                    onClick={handleShowModal} // Open modal on click
                  >
                    <FontAwesomeIcon
                      icon={faCamera}
                      style={{ color: "white", fontSize: "12px" }}
                    />
                  </div>
                </div>
                <div className="flex-grow-2" style={{ marginLeft: "1rem" }}>
                  <h3 className="mb-1 f-w-600">{`${dashboardData.user_data.full_name}`}</h3>
                  <p
                    className="text-success"
                    style={{ fontSize: "10px" }}
                  >{`${dashboardData.user_data.E_Mail}`}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Pass onShowToast to PasswordChange */}
          <PasswordChange onShowToast={onShowToast} />
        </div>
      </div>

      {/* React-Bootstrap Modal for Image Upload */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>Upload Profile Picture</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "dropzone-active" : ""}`}
          >
            <input {...getInputProps()} />
            <p>Drag and drop an image here, or click to select an image</p>
          </div>

          {files.length > 0 && (
            <div className="file-preview">
              <h4>File to upload:</h4>
              <ul>
                {files.map((file) => (
                  <li key={file.path}>{file.path}</li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AvatarDetails;
