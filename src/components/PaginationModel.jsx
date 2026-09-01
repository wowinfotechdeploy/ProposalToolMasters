import React from "react";
import "./PaginationCss.css";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

function PaginationComponent({ totalPages, currentPage, onPageChange }) {
  const getDisplayedPageNumbers = () => {
    const maxPagesToShow = 3;
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfPagesToShow);

    let endPage = Math.min(totalPages, currentPage + halfPagesToShow);

    if (endPage - startPage + 1 < maxPagesToShow) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
    }

    const displayedPageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      displayedPageNumbers.push(i);
    }

    return displayedPageNumbers;
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber !== currentPage) {
      onPageChange(pageNumber);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const goToFirstPage = () => {
    if (currentPage !== 1) {
      onPageChange(1);
    }
  };

  const goToLastPage = () => {
    if (currentPage !== totalPages) {
      onPageChange(totalPages);
    }
  };

  const displayedPageNumbers = getDisplayedPageNumbers();

  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <div className="figma-pagination">
      {/* LEFT */}
      <div className="figma-pagination__left">
        {totalPages > 3 && (
          <button
            type="button"
            className="figma-pagination__nav figma-pagination__first"
            disabled={currentPage === 1}
            onClick={goToFirstPage}
            aria-label="First page"
          >
            <ChevronsLeft size={15} />
          </button>
        )}

        <button
          type="button"
          className="figma-pagination__nav"
          disabled={currentPage === 1}
          onClick={previousPage}
        >
          <ChevronLeft size={15} />
          <span>Previous</span>
        </button>
      </div>

      {/* CENTER */}
      <div className="figma-pagination__pages">
        {displayedPageNumbers.map((pageNumber) => (
          <button
            type="button"
            key={pageNumber}
            className={`figma-pagination__page ${
              currentPage === pageNumber ? "is-active" : ""
            }`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {/* RIGHT */}
      <div className="figma-pagination__right">
        <button
          type="button"
          className="figma-pagination__nav"
          disabled={currentPage === totalPages}
          onClick={nextPage}
        >
          <span>Next</span>
          <ChevronRight size={15} />
        </button>

        {totalPages > 3 && (
          <button
            type="button"
            className="figma-pagination__nav figma-pagination__last"
            disabled={currentPage === totalPages}
            onClick={goToLastPage}
            aria-label="Last page"
          >
            <ChevronsRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

export default PaginationComponent;
