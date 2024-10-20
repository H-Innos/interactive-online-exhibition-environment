import Link from 'next/link';
import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages }) => {
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <div className="flex justify-center items-center mt-8 space-x-4">
      {currentPage > 1 ? (
        <Link
          href={`?page=${currentPage - 1}`}
          className="px-4 py-2 cursor-pointer text-xl text-gray-700 hover:text-black  hover:bg-gray-200 rounded-md"
        >
          ← Previous
        </Link>
      ) : (
        <span className="px-4 py-2 text-xl text-gray-400 cursor-default">
          ← Previous
        </span>
      )}

      <div className="flex space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <Link
            key={index + 1}
            //onClick={() => handlePageClick(index + 1)}
            href={`?page=${index + 1}`}
            className={`px-3 py-1 cursor-pointer ${
              index + 1 === currentPage ? 'bg-black text-white rounded-md' : 'text-gray-700 hover:bg-gray-200 rounded-md'
            }`}
          >
            {index + 1}
          </Link>
        ))}
      </div>

    {currentPage < totalPages ? (
      <Link
      href={`?page=${currentPage + 1}`}
      className="px-4 py-2 cursor-pointer text-xl text-gray-700 hover:text-black  hover:bg-gray-200 rounded-md"
      >
        Next →
      </Link>
    ) : (
      <span className="px-4 py-2 text-xl text-gray-400 cursor-default">
      Next →
      </span>
    )}
    </div>
  );
};

export default PaginationControls;