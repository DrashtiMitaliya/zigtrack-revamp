import React from 'react'
import { Pencil, Trash2, Send, Calendar } from 'lucide-react'
import { Button, StatusBadge, EmptyState, Pagination } from '../common'
import type { PRRequest } from '../../constants'

interface PRTableProps {
  filteredPRs: PRRequest[]
  onEdit?: (pr: PRRequest) => void
  onDelete?: (id: number) => void
}

const PAGE_SIZE = 10

/**
 * PRTable — redesigned table of Pull Requests.
 * Conforms to premium guidelines with rounded cards, custom reviewer badges, and micro-animations.
 */
export const PRTable: React.FC<PRTableProps> = ({ filteredPRs, onEdit, onDelete }) => {
  const [page, setPage] = React.useState(1)
  const totalPages = Math.max(1, Math.ceil(filteredPRs.length / PAGE_SIZE))
  const paginatedPRs = filteredPRs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  React.useEffect(() => {
    setPage(1)
  }, [filteredPRs.length])

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      {/* Horizontal scroll layout */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px] p-2">
          
          {/* Table Header */}
          <div
            className="grid grid-cols-12 gap-4 px-5 py-3.5 bg-slate-50/50 rounded-2xl border border-slate-100 mb-2"
            role="row"
          >
            <div className="col-span-2 text-[9px] font-display font-black text-slate-400 uppercase tracking-widest" role="columnheader">Project</div>
            <div className="col-span-2 text-[9px] font-display font-black text-slate-400 uppercase tracking-widest" role="columnheader">Date</div>
            <div className="col-span-3 text-[9px] font-display font-black text-slate-400 uppercase tracking-widest" role="columnheader">Title</div>
            <div className="col-span-2 text-[9px] font-display font-black text-slate-400 uppercase tracking-widest" role="columnheader">PR Link</div>
            <div className="col-span-1 text-[9px] font-display font-black text-slate-400 uppercase tracking-widest" role="columnheader">Reviewer</div>
            <div className="col-span-1 text-[9px] font-display font-black text-slate-400 uppercase tracking-widest text-center" role="columnheader">Status</div>
            <div className="col-span-1 text-[9px] font-display font-black text-slate-400 uppercase tracking-widest text-center" role="columnheader">Actions</div>
          </div>

          {/* Table Body */}
          {paginatedPRs.length === 0 ? (
            <div className="py-12">
              <EmptyState
                title="No PR requests found"
                description="Try adjusting your filters or search term."
              />
            </div>
          ) : (
            <div className="space-y-1.5" role="rowgroup">
              {paginatedPRs.map(pr => (
                <div
                  key={pr.id}
                  role="row"
                  className="grid grid-cols-12 gap-4 px-5 py-4 bg-white hover:bg-slate-50/30 border border-slate-100 rounded-2xl items-center hover:border-slate-200 hover:shadow-xs transition-all group duration-200"
                >
                  {/* Project */}
                  <div className="col-span-2 flex items-center gap-2" role="cell">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1490FE]" />
                    <span className="text-xs font-black text-slate-700 truncate">{pr.project}</span>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 flex items-center gap-1.5 text-slate-500 font-semibold" role="cell">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[11px] font-mono font-bold">{pr.date}</span>
                  </div>

                  {/* Title */}
                  <div className="col-span-3" role="cell">
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed truncate group-hover:text-[#1490FE] transition-colors" title={pr.title}>
                      {pr.title}
                    </p>
                  </div>

                  {/* PR Link */}
                  <div className="col-span-2" role="cell">
                    <a
                      href={pr.prLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-[var(--accent)] hover:underline truncate block max-w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)] rounded font-mono"
                    >
                      {pr.prLink}
                    </a>
                  </div>

                  {/* Reviewer */}
                  <div className="col-span-1" role="cell">
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md truncate block max-w-max">
                      {pr.reviewBy.split(' ')[0]}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 flex justify-center" role="cell">
                    <StatusBadge status={pr.status} size="sm" />
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-center gap-1.5" role="cell">
                    <Button
                      onClick={() => onEdit?.(pr)}
                      variant="ghost"
                      size="sm"
                      iconOnly
                      aria-label={`Edit PR: ${pr.title}`}
                      className="hover:bg-[#1490FE]/10 hover:text-[#1490FE] hover:border-[#1490FE]/20 transition-all hover:scale-105"
                    >
                      <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      onClick={() => onDelete?.(pr.id)}
                      variant="ghost"
                      size="sm"
                      iconOnly
                      aria-label={`Delete PR: ${pr.title}`}
                      className="hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all hover:scale-105"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconOnly
                      aria-label={`Send PR: ${pr.title}`}
                      className="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all hover:scale-105"
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
      <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/10">
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
