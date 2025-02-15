import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const AttachmentsList = ({ data }) => {
  return (
    <div className="attachments-list">
      <h6>Attachments</h6>
      <hr />
      {data.length > 0 ? (
        <ul>
          {data.map((attachment, index) => (
            <li key={index}>
              <a
                href={`/selfservice/FileUploadView/${attachment.No}/download`}
                download
              >
                <FontAwesomeIcon icon={faDownload} /> {attachment.FileName}.
                {attachment.FileExtension}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No attachments found.</p>
      )}
    </div>
  );
};

export default AttachmentsList;
