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

  const renderPageNumbers = () => {
    const pages = [];
    pages.push(
      <Link
        key={1}
        href={`?page=1`}
        className={`cursor-pointer px-2 py-1 text-sm sm:px-3 sm:py-1 sm:text-base ${
          currentPage === 1
            ? "rounded-md bg-black text-white"
            : "rounded-md text-gray-700 hover:bg-gray-200"
        }`}
      >
        1
      </Link>,
    );

    if (currentPage > 3) {
      pages.push(
        <span
          key="start-ellipsis"
          className="px-2 py-1 text-sm text-gray-700 sm:px-3 sm:py-1 sm:text-base"
        >
          ...
        </span>,
      );
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(
        <Link
          key={i}
          href={`?page=${i}`}
          className={`cursor-pointer px-2 py-1 text-sm sm:px-3 sm:py-1 sm:text-base ${
            i === currentPage
              ? "rounded-md bg-black text-white"
              : "rounded-md text-gray-700 hover:bg-gray-200"
          }`}
        >
          {i}
        </Link>,
      );
    }

    if (currentPage < totalPages - 2) {
      pages.push(
        <span
          key="end-ellipsis"
          className="px-2 py-1 text-sm text-gray-700 sm:px-3 sm:py-1 sm:text-base"
        >
          ...
        </span>,
      );
    }

    if (totalPages > 1) {
      pages.push(
        <Link
          key={totalPages}
          href={`?page=${totalPages}`}
          className={`cursor-pointer px-2 py-1 text-sm sm:px-3 sm:py-1 sm:text-base ${
            currentPage === totalPages
              ? "rounded-md bg-black text-white"
              : "rounded-md text-gray-700 hover:bg-gray-200"
          }`}
        >
          {totalPages}
        </Link>,
      );
    }

    return pages;
  };

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center space-x-2 sm:space-x-4">
      {currentPage > 1 ? (
        <Link
          href={`?page=${currentPage - 1}`}
          className="flex cursor-pointer items-center rounded-md px-3 py-2 text-lg text-gray-700 hover:bg-gray-200 hover:text-black sm:px-4 sm:py-2 sm:text-xl"
        >
          <ChevronLeft className="mr-1 h-5 w-5 sm:mr-2 sm:h-7 sm:w-7" />
          {t("pagination.previous")}
        </Link>
      ) : (
        <span className="flex cursor-pointer items-center rounded-md px-3 py-2 text-lg text-gray-700 hover:bg-gray-200 hover:text-black sm:px-4 sm:py-2 sm:text-xl">
          <ChevronLeft className="mr-1 h-5 w-5 w-7 sm:mr-2 sm:h-7" />
          {t("pagination.previous")}
        </span>
      )}

      <div className="flex flex-wrap justify-center space-x-1 sm:space-x-2">
        {renderPageNumbers()}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={`?page=${currentPage + 1}`}
          className="flex cursor-pointer items-center rounded-md px-3 py-2 text-lg text-gray-700 hover:bg-gray-200 hover:text-black sm:px-4 sm:py-2 sm:text-xl"
        >
          {t("pagination.next")}
          <ChevronRight className="ml-1 h-5 w-5 sm:ml-2 sm:h-7 sm:w-7" />
        </Link>
      ) : (
        <span className="flex cursor-pointer items-center rounded-md px-3 py-2 text-lg text-gray-700 hover:bg-gray-200 hover:text-black sm:px-4 sm:py-2 sm:text-xl">
          {t("pagination.next")}
          <ChevronRight className="ml-1 h-5 w-5 sm:ml-2 sm:h-7 sm:w-7" />
        </span>
      )}
    </div>
  );
};

export default PaginationControls;
