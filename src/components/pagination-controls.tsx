import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
}) => {
  const { t } = useTranslation();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-center space-x-4">
      {currentPage > 1 ? (
        <Link
          href={`?page=${currentPage - 1}`}
          className="flex cursor-pointer rounded-md px-4 py-2 text-xl text-gray-700 hover:bg-gray-200 hover:text-black"
        >
          {" "}
          <>
            <ChevronLeft className="mr-2 h-7 w-7" />
            {t("pagination.previous")}
          </>
        </Link>
      ) : (
        <span className="flex cursor-pointer rounded-md px-4 py-2 text-xl text-gray-700 hover:bg-gray-200 hover:text-black">
          <ChevronLeft className="mr-2 h-11 w-11" />
          {t("pagination.previous")}
        </span>
      )}

      <div className="flex space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <Link
            key={index + 1}
            href={`?page=${index + 1}`}
            className={`cursor-pointer px-3 py-1 ${
              index + 1 === currentPage
                ? "rounded-md bg-black text-white"
                : "rounded-md text-gray-700 hover:bg-gray-200"
            }`}
          >
            {index + 1}
          </Link>
        ))}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={`?page=${currentPage + 1}`}
          className="flex cursor-pointer rounded-md px-4 py-2 text-xl text-gray-700 hover:bg-gray-200 hover:text-black"
        >
          {t("pagination.next")}
          <ChevronRight className="ml-2 h-7 w-7" />
        </Link>
      ) : (
        <span className="flex cursor-pointer rounded-md px-4 py-2 text-xl text-gray-700 hover:bg-gray-200 hover:text-black">
          {t("pagination.next")}
          <ChevronRight className="ml-2 h-7 w-7" />
        </span>
      )}
    </div>
  );
};

export default PaginationControls;
