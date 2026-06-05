import React, { useContext, type ChangeEvent } from "react";

//Icons
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

//Context
import { CommonContext } from "src/context/commonContext";

//Utils
import { cn } from "src/utils/utils";

type PaginationProps = {
  currentPage: number;
  pageSize: number;
  pageRangeDisplayed?: number | string;
  totalItemCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number, page: number) => void;
};

type CommonContextValue = {
  languageData?: Record<string, string>;
  connection?: unknown;
};

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25, 50];

export default function Pagination({
  currentPage,
  pageSize,
  pageRangeDisplayed = 3,
  totalItemCount,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const context = useContext(CommonContext) as CommonContextValue;
  const languageData = context?.languageData ?? {};

  const parsedRange = Number(pageRangeDisplayed);
  const visibleRange = Number.isNaN(parsedRange) ? 3 : Math.max(1, parsedRange);

  const totalPages = Math.ceil(totalItemCount / pageSize);
  if (totalItemCount <= 0 || totalPages <= 1) return null;

  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startPage = Math.max(
    1,
    Math.min(safeCurrentPage, totalPages - visibleRange + 1),
  );
  const endPage = Math.min(totalPages, startPage + visibleRange - 1);

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  const from = safeCurrentPage > 1 ? (safeCurrentPage - 1) * pageSize + 1 : 1;
  const to = Math.min(safeCurrentPage * pageSize, totalItemCount);

  const gotoPage = (page: number) => {
    const next = Math.max(1, Math.min(page, totalPages));
    if (next !== safeCurrentPage) onPageChange(next);
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextPageSize = Number(e.target.value);
    if (!Number.isNaN(nextPageSize) && onPageSizeChange) {
      onPageSizeChange(nextPageSize, 1);
    }
  };

  const btnBase =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50";
  const btnNormal =
    "border-slate-300 bg-white text-slate-700 hover:bg-slate-50";
  const btnActive = "border-blue-600 bg-blue-600 text-white";

  return (
    <div className="w-full">
      <nav aria-label="Pagination">
        <ul className="flex flex-wrap items-center gap-2">
          <li>
            <button
              type="button"
              onClick={() => gotoPage(1)}
              disabled={safeCurrentPage === 1}
              className={cn(btnBase, btnNormal)}
              aria-label="First page">
              <ChevronsLeft size={16} />
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={() => gotoPage(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className={cn(btnBase, btnNormal)}
              aria-label="Previous page">
              <ChevronLeft size={16} />
            </button>
          </li>

          {startPage > 1 && (
            <li>
              <button
                type="button"
                onClick={() => gotoPage(startPage - visibleRange)}
                className={cn(btnBase, btnNormal)}
                aria-label="Previous page range">
                <MoreHorizontal size={16} />
              </button>
            </li>
          )}

          {pages.map((page) => (
            <li key={page}>
              <button
                type="button"
                onClick={() => gotoPage(page)}
                className={cn(
                  btnBase,
                  page === safeCurrentPage ? btnActive : btnNormal,
                )}
                aria-current={page === safeCurrentPage ? "page" : undefined}>
                {page}
              </button>
            </li>
          ))}

          {endPage < totalPages && (
            <li>
              <button
                type="button"
                onClick={() => gotoPage(endPage + 1)}
                className={cn(btnBase, btnNormal)}
                aria-label="Next page range">
                <MoreHorizontal size={16} />
              </button>
            </li>
          )}

          <li>
            <button
              type="button"
              onClick={() => gotoPage(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className={cn(btnBase, btnNormal)}
              aria-label="Next page">
              <ChevronRight size={16} />
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={() => gotoPage(totalPages)}
              disabled={safeCurrentPage === totalPages}
              className={cn(btnBase, btnNormal)}
              aria-label="Last page">
              <ChevronsRight size={16} />
            </button>
          </li>
        </ul>
      </nav>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <span>
          {(languageData.page ?? "Page") + " "}
          {from} - {to} {languageData.of ?? "of"} {totalItemCount}
        </span>

        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="h-9 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-700 outline-none ring-blue-500 focus:ring-2"
            aria-label="Items per page">
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
