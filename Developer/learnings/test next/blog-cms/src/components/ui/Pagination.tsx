"use client";

// components/ui/Pagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  showPrevNext?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  baseUrl?: string;
}

interface PageButtonProps {
  page?: number;
  isActive?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick: () => void;
}

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  showPrevNext = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  baseUrl = "/blog",
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${baseUrl}?${params.toString()}`);
  };

  const getVisiblePages = () => {
    const pages = [];
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);

      if (currentPage <= halfVisible) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + halfVisible >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - halfVisible;
        endPage = currentPage + halfVisible;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const showLeftEllipsis = visiblePages[0] > 1;
  const showRightEllipsis = visiblePages[visiblePages.length - 1] < totalPages;

  const PageButton = ({
    page,
    isActive = false,
    disabled = false,
    children,
    onClick,
  }: PageButtonProps) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
        ${
          isActive
            ? "bg-blue-600 text-white shadow-md"
            : disabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }
        ${!disabled && !isActive ? "border border-gray-300" : ""}
      `}
    >
      {children || page}
    </button>
  );

  return (
    <div className="flex items-center justify-center space-x-1">
      {/* Previous Button */}
      {showPrevNext && (
        <PageButton
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </PageButton>
      )}

      {/* First Page */}
      {showFirstLast && showLeftEllipsis && (
        <>
          <PageButton page={1} onClick={() => handlePageChange(1)} />
          <div className="px-2">
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </div>
        </>
      )}

      {/* Visible Pages */}
      {visiblePages.map((page) => (
        <PageButton
          key={page}
          page={page}
          isActive={page === currentPage}
          onClick={() => handlePageChange(page)}
        />
      ))}

      {/* Last Page */}
      {showFirstLast && showRightEllipsis && (
        <>
          <div className="px-2">
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </div>
          <PageButton
            page={totalPages}
            onClick={() => handlePageChange(totalPages)}
          />
        </>
      )}

      {/* Next Button */}
      {showPrevNext && (
        <PageButton
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </PageButton>
      )}
    </div>
  );
};

export default Pagination;
