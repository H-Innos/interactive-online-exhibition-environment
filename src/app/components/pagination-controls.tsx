import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) {
        return null;
    }
  
    const handlePageClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
        onPageChange(page);
        }
    };

    return (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <span
            onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
            className={`px-4 py-2 cursor-pointer text-xl ${
              currentPage === 1 ? 'text-gray-400 cursor-default' : 'text-gray-700 hover:text-black'
            }`}
          >
            ← Previous
          </span>

          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <span
                key={index + 1}
                onClick={() => handlePageClick(index + 1)}
                className={`px-3 py-1 cursor-pointer ${
                  index + 1 === currentPage ? 'bg-black text-white rounded-md' : 'text-gray-700 hover:bg-gray-200 rounded-md'
                }`}
              >
                {index + 1}
              </span>
            ))}
          </div>

          <span
            onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}
            className={`px-4 py-2 cursor-pointer text-xl ${
              currentPage === totalPages ? 'text-gray-400 cursor-default' : 'text-gray-700 hover:text-black'
            }`}
          >
            Next →
          </span>
        </div>
    );
};

export default PaginationControls;