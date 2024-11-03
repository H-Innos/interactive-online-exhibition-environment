import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="flex justify-center items-center mt-8 space-x-4">
      {currentPage > 1 ? (
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          className="px-4 py-2 cursor-pointer text-xl text-gray-700 hover:text-black hover:bg-gray-200 rounded-md"
        >
          ← Previous
        </button>
      ) : (
        <span className="px-4 py-2 text-xl text-gray-400 cursor-default">
          ← Previous
        </span>
      )}

      <div className="flex space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageClick(index + 1)}
            className={`px-3 py-1 cursor-pointer ${
              index + 1 === currentPage ? 'bg-black text-white rounded-md' : 'text-gray-700 hover:bg-gray-200 rounded-md'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {currentPage < totalPages ? (
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          className="px-4 py-2 cursor-pointer text-xl text-gray-700 hover:text-black hover:bg-gray-200 rounded-md"
        >
          Next →
        </button>
      ) : (
        <span className="px-4 py-2 text-xl text-gray-400 cursor-default">
          Next →
        </span>
      )}
    </div>
  );
};

export default PaginationControls;


