import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <nav aria-label="Page navigation">
      <ul className="pagination pagination-success pagin-border-success">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <a
            className="page-link" style={{ cursor: "pointer" }}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </a>
        </li>
        {[...Array(totalPages)].map((_, index) => (
          <li
            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
            key={index}
          >
            <a className="page-link" onClick={() => onPageChange(index + 1)}>
              {index + 1}
            </a>
          </li>
        ))}
        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <a
            className="page-link" style={{ cursor: "pointer" }}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
