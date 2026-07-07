import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems?: number
  pageSize?: number
  onPageChange: (page: number) => void
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className = '',
}) => {
  const startItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : undefined
  const endItem = totalItems && pageSize
    ? Math.min(currentPage * pageSize, totalItems)
    : undefined

  /** Build a page number array with ellipsis */
  const buildPages = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '...')[] = [1]
    if (currentPage > 3) pages.push('...')
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <div
      className={`flex items-center justify-between pt-2 ${className}`}
      role="navigation"
      aria-label="Pagination"
    >
      {/* Entry count */}
      <span className="text-xs text-slate-400 font-semibold">
        {startItem !== undefined && endItem !== undefined && totalItems !== undefined
          ? `Showing ${startItem}–${endItem} of ${totalItems} entries`
          : '\u00A0'}
      </span>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {buildPages().map((page, i) =>
          page === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="w-7 h-7 flex items-center justify-center text-xs text-slate-400"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                page === currentPage
                  ? 'bg-[#1490FE] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export default Pagination
