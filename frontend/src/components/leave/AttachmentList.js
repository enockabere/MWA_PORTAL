import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const AttachmentList = ({ attachments }) => {
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete attachment with ID ${id}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform delete operation here
        Swal.fire("Deleted!", "Attachment has been deleted.", "success");
      }
    });
  };

  return (
    <div>
      {attachments && attachments.length > 0 ? (
        attachments.map((attachment) => (
          <div
            className="d-flex align-items-center files-list my-3"
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
              <FontAwesomeIcon
                icon={faTrash}
                className="text-danger f-15"
                onClick={() => handleDelete(attachment.ID)}
                style={{ cursor: "pointer" }}
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
