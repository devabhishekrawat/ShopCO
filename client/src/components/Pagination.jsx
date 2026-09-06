import React from "react";

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <img
          src="/assets/icons/left-icon.svg"
          alt="prev"
          width="14"
          height="14"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <span>Previous</span>
      </button>

      <div className="pagination__pages">
        {pages.map((p, index) =>
          p === "..." ? (
            <span key={`dots-${index}`} className="pagination__page pagination__page--dots">
              ...
            </span>
          ) : (
            <button
              key={p}
              className={`pagination__page ${
                p === currentPage ? "pagination__page--active" : ""
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        className="pagination__btn"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span>Next</span>
        <img
          src="/assets/icons/right-icon.svg"
          alt="next"
          width="14"
          height="14"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </button>
    </div>
  );
};

export default Pagination;
