import React from "react";
import Avatar from "../../../static/img/logo/pp.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const AttachmentList = ({ attachments }) => {
  // Function to handle file deletion
  const handleDelete = (id) => {
    // Perform delete operation here (e.g., send a DELETE request)
    toast.success(`Attachment with ID ${id} deleted.`);
  };

  return (
    <div>
      {attachments && attachments.length > 0 ? (
        attachments.map((attachment) => (
          <div
            className="d-flex align-items-center files-list my-3" // Added margin-bottom for spacing
            key={attachment.ID}
          >
            <div className="flex-shrink-0 file-left">
              <i className="f-22 fa fa-folder font-info"></i>
            </div>
            <div className="flex-grow-1 ms-3">
              <h6>
                {attachment.FileName}.{attachment.FileExtension}
              </h6>
              <p>
                {new Date(attachment.AttachedDate).toLocaleString()},{" "}
                {(2 / 1024).toFixed(2)} KB
              </p>
            </div>
            <div className="flex-shrink-0 ms-2">
              {" "}
              <FontAwesomeIcon
                icon={faTrash}
                className="text-danger f-15" // Added text-danger for red color and f-22 for size
                onClick={() => handleDelete(attachment.ID)}
                style={{ cursor: "pointer" }} // Optional: To show pointer on hover
              />
            </div>
          </div>
        ))
      ) : (
        <p>No attachments found.</p>
      )}
    </div>
  );
};

export default AttachmentList;
