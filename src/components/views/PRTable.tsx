import React from 'react'
import { Pencil, Trash2, Send } from 'lucide-react'
import { Button, StatusBadge, EmptyState, Pagination } from '../common'
import type { PRRequest } from '../../constants'

interface PRTableProps {
  filteredPRs: PRRequest[]
  onEdit?: (pr: PRRequest) => void
  onDelete?: (id: number) => void
}

// Column definitions — single source of truth for header + body alignment
const COLUMNS = [
  { label: 'Project',   span: 'col-span-2' },
  { label: 'Date',      span: 'col-span-1' },
  { label: 'Title',     span: 'col-span-3' },
  { label: 'PR Link',   span: 'col-span-2' },
  { label: 'Review By', span: 'col-span-1' },
  { label: 'PR By',     span: 'col-span-1' },
  { label: 'Status',    span: 'col-span-1' },
  { label: 'Action',    span: 'col-span-1 text-center' },
] as const

const PAGE_SIZE = 10

/**
 * PRTable — extracted from ProjectsView to keep file size manageable.
 * Complies with UI_GUIDELINES.md:
 *  - Uses shared Button (iconOnly) for action icons
 *  - Header inside scroll wrapper for correct responsive behaviour
 *  - No hardcoded colors — uses Button variant tokens
 */
export const PRTable: React.FC<PRTableProps> = ({ filteredPRs, onEdit, onDelete }) => {
  const [page, setPage] = React.useState(1)
  const totalPages = Math.max(1, Math.ceil(filteredPRs.length / PAGE_SIZE))
  const paginatedPRs = filteredPRs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  React.useEffect(() => {
    setPage(1)
  }, [filteredPRs.length])

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      {/* Horizontal scroll — header + body together so they stay in sync */}
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          {/* Table header — sticky within the scroll container */}
          <div
            className="grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50/80 border-b border-slate-100 sticky top-0 z-10"
            role="row"
          >
            {COLUMNS.map(({ label, span }) => (
              <div
                key={label}
                className={`${span} text-[9px] font-extrabold text-slate-400 uppercase tracking-widest`}
                role="columnheader"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Table body */}
          {paginatedPRs.length === 0 ? (
            <EmptyState
              title="No PR requests found"
              description="Try adjusting your filters or search term."
            />
          ) : (
            <div role="rowgroup">
              {paginatedPRs.map(pr => (
                <div
                  key={pr.id}
                  role="row"
                  className="grid grid-cols-12 gap-3 px-5 py-3.5 border-b border-slate-50 items-center hover:bg-slate-50/40 transition-colors group"
                >
                  {/* Project */}
                  <div className="col-span-2" role="cell">
                    <span className="text-xs font-bold text-slate-700">{pr.project}</span>
                  </div>

                  {/* Date */}
                  <div className="col-span-1" role="cell">
                    <span className="text-[11px] font-semibold text-slate-500 font-mono">{pr.date}</span>
                  </div>

                  {/* Title */}
                  <div className="col-span-3" role="cell">
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed line-clamp-2">
                      {pr.title}
                    </p>
                  </div>

                  {/* PR Link */}
                  <div className="col-span-2" role="cell">
                    <a
                      href={pr.prLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-[var(--accent)] hover:underline truncate block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)] rounded"
                    >
                      {pr.prLink}
                    </a>
                  </div>

                  {/* Review By */}
                  <div className="col-span-1" role="cell">
                    <span className="text-[11px] font-semibold text-slate-600">{pr.reviewBy}</span>
                  </div>

                  {/* PR By */}
                  <div className="col-span-1" role="cell">
                    <span className="text-[11px] font-semibold text-slate-600">{pr.prGeneratedBy}</span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1" role="cell">
                    <StatusBadge status={pr.status} size="sm" />
                  </div>

                  {/* Actions — shared Button component (iconOnly) */}
                  <div className="col-span-1 flex items-center justify-center gap-1.5" role="cell">
                    <Button
                      onClick={() => onEdit?.(pr)}
                      variant="ghost"
                      size="sm"
                      iconOnly
                      aria-label={`Edit PR: ${pr.title}`}
                      className="hover:bg-[var(--info-bg)] hover:text-[var(--accent)] hover:border-[var(--info-border)]"
                    >
                      <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      onClick={() => onDelete?.(pr.id)}
                      variant="ghost"
                      size="sm"
                      iconOnly
                      aria-label={`Delete PR: ${pr.title}`}
                      className="hover:bg-[var(--error-bg)] hover:text-[var(--error)] hover:border-[var(--error-border)]"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      aria-label={`Send PR: ${pr.title}`}
                      className="hover:bg-[var(--success-bg)] hover:text-[var(--success)] hover:border-[var(--success-border)]"
                    >
                      <Send className="w-3.5 h-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3 border-t border-slate-100">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={filteredPRs.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}

export default PRTable
