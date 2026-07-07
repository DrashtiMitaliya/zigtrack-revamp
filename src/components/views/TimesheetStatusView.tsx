import React, { useState } from 'react'
import { Eye, Calendar, Clock, AlertCircle, X } from 'lucide-react'
import {
  DropdownSelect,
  FilterToolbar,
  Button,
  StatusBadge,
  EmptyState,
  Pagination
} from '../common'

interface StatusEntry {
  id: number
  weekRange: string
  duration: string
  status: 'Pending' | 'Submitted'
  reason: string
  projectBreakdown: { name: string; hours: string; color: string }[]
}

const MOCK_STATUS_DATA: StatusEntry[] = [
  {
    id: 1,
    weekRange: 'Mon, Jun 29, 2026 - Sun, Jul 5, 2026',
    duration: '43:29',
    status: 'Pending',
    reason: '',
    projectBreakdown: [
      { name: 'Tech General', hours: '22:15', color: '#1490FE' },
      { name: 'Learning and Development', hours: '12:44', color: '#a855f7' },
      { name: 'ZigTrack Support', hours: '8:30', color: '#10B981' }
    ]
  },
  {
    id: 2,
    weekRange: 'Mon, Jun 22, 2026 - Sun, Jun 28, 2026',
    duration: '45:03',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'ES AI Assessment', hours: '30:00', color: '#1490FE' },
      { name: 'Prompts.AI', hours: '10:00', color: '#a855f7' },
      { name: 'Tech General', hours: '5:03', color: '#6366f1' }
    ]
  },
  {
    id: 3,
    weekRange: 'Mon, Jun 15, 2026 - Sun, Jun 21, 2026',
    duration: '41:24',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'ShallWe Play', hours: '25:00', color: '#FF6347' },
      { name: 'Freightro', hours: '12:00', color: '#F59E0B' },
      { name: 'Tech General', hours: '4:24', color: '#1490FE' }
    ]
  },
  {
    id: 4,
    weekRange: 'Mon, Jun 8, 2026 - Sun, Jun 14, 2026',
    duration: '41:40',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'ES AI Assessment', hours: '20:40', color: '#1490FE' },
      { name: 'Prompts.AI', hours: '15:00', color: '#a855f7' },
      { name: 'Learning and Development', hours: '6:00', color: '#6366f1' }
    ]
  },
  {
    id: 5,
    weekRange: 'Mon, Jun 1, 2026 - Sun, Jun 7, 2026',
    duration: '41:01',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'ShallWe Play', hours: '32:01', color: '#FF6347' },
      { name: 'Tech General', hours: '9:00', color: '#1490FE' }
    ]
  },
  {
    id: 6,
    weekRange: 'Mon, May 25, 2026 - Sun, May 31, 2026',
    duration: '43:21',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'Freightro', hours: '28:15', color: '#F59E0B' },
      { name: 'Learning and Development', hours: '15:06', color: '#a855f7' }
    ]
  },
  {
    id: 7,
    weekRange: 'Mon, May 18, 2026 - Sun, May 24, 2026',
    duration: '54:39',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'ZigTrack Support', hours: '40:00', color: '#10B981' },
      { name: 'Tech General', hours: '14:39', color: '#1490FE' }
    ]
  },
  {
    id: 8,
    weekRange: 'Mon, May 11, 2026 - Sun, May 17, 2026',
    duration: '36:39',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'ES AI Assessment', hours: '25:00', color: '#1490FE' },
      { name: 'Prompts.AI', hours: '11:39', color: '#a855f7' }
    ]
  },
  {
    id: 9,
    weekRange: 'Mon, May 4, 2026 - Sun, May 10, 2026',
    duration: '39:58',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'ShallWe Play', hours: '30:00', color: '#FF6347' },
      { name: 'Tech General', hours: '9:58', color: '#1490FE' }
    ]
  },
  {
    id: 10,
    weekRange: 'Mon, Apr 27, 2026 - Sun, May 3, 2026',
    duration: '41:25',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'Freightro', hours: '35:25', color: '#F59E0B' },
      { name: 'Learning and Development', hours: '6:00', color: '#a855f7' }
    ]
  },
  {
    id: 11,
    weekRange: 'Mon, Apr 20, 2026 - Sun, Apr 26, 2026',
    duration: '40:55',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'ZigTrack Support', hours: '25:00', color: '#10B981' },
      { name: 'Tech General', hours: '15:55', color: '#1490FE' }
    ]
  },
  {
    id: 12,
    weekRange: 'Mon, Apr 13, 2026 - Sun, Apr 19, 2026',
    duration: '40:53',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'Prompts.AI', hours: '30:00', color: '#a855f7' },
      { name: 'Tech General', hours: '10:53', color: '#1490FE' }
    ]
  },
  {
    id: 13,
    weekRange: 'Mon, Apr 6, 2026 - Sun, Apr 12, 2026',
    duration: '41:06',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'ES AI Assessment', hours: '35:00', color: '#1490FE' },
      { name: 'Learning and Development', hours: '6:06', color: '#a855f7' }
    ]
  },
  {
    id: 14,
    weekRange: 'Mon, Mar 30, 2026 - Sun, Apr 5, 2026',
    duration: '32:46',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'ShallWe Play', hours: '22:00', color: '#FF6347' },
      { name: 'Tech General', hours: '10:46', color: '#1490FE' }
    ]
  },
  {
    id: 15,
    weekRange: 'Mon, Mar 23, 2026 - Sun, Mar 29, 2026',
    duration: '43:15',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'Freightro', hours: '38:15', color: '#F59E0B' },
      { name: 'ZigTrack Support', hours: '5:00', color: '#10B981' }
    ]
  },
  {
    id: 16,
    weekRange: 'Mon, Mar 16, 2026 - Sun, Mar 22, 2026',
    duration: '40:20',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'Tech General', hours: '30:20', color: '#1490FE' },
      { name: 'Learning and Development', hours: '10:00', color: '#a855f7' }
    ]
  },
  {
    id: 17,
    weekRange: 'Mon, Mar 9, 2026 - Sun, Mar 15, 2026',
    duration: '33:09',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'ES AI Assessment', hours: '25:00', color: '#1490FE' },
      { name: 'Tech General', hours: '8:09', color: '#6366f1' }
    ]
  },
  {
    id: 18,
    weekRange: 'Mon, Mar 2, 2026 - Sun, Mar 8, 2026',
    duration: '33:14',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'Prompts.AI', hours: '20:14', color: '#a855f7' },
      { name: 'Learning and Development', hours: '13:00', color: '#6366f1' }
    ]
  },
  {
    id: 19,
    weekRange: 'Mon, Feb 23, 2026 - Sun, Mar 1, 2026',
    duration: '36:41',
    status: 'Submitted',
    reason: '',
    projectBreakdown: [
      { name: 'ShallWe Play', hours: '30:00', color: '#FF6347' },
      { name: 'Tech General', hours: '6:41', color: '#1490FE' }
    ]
  }
]

const STATUS_FILTER_OPTIONS = [
  { value: 'All', label: 'All Status' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Submitted', label: 'Submitted' }
]

const PER_PAGE_OPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
  { value: '100', label: '100' }
]

export const TimesheetStatusView: React.FC = () => {
  // Filters
  const [statusFilter, setStatusFilter] = useState('All')
  const [perPage, setPerPage] = useState('100')
  const [appliedStatusFilter, setAppliedStatusFilter] = useState('All')
  const [appliedPerPage, setAppliedPerPage] = useState('100')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

  // Selected item for details modal
  const [selectedEntry, setSelectedEntry] = useState<StatusEntry | null>(null)

  const handleApplyFilter = () => {
    setAppliedStatusFilter(statusFilter)
    setAppliedPerPage(perPage)
    setCurrentPage(1)
  }

  const handleClearFilter = () => {
    setStatusFilter('All')
    setPerPage('100')
    setAppliedStatusFilter('All')
    setAppliedPerPage('100')
    setCurrentPage(1)
  }

  // Filter logic
  const filteredData = MOCK_STATUS_DATA.filter(entry => {
    if (appliedStatusFilter !== 'All' && entry.status !== appliedStatusFilter) {
      return false
    }
    return true
  })

  // Pagination logic
  const itemsPerPage = parseInt(appliedPerPage, 10)
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage))
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="flex-1 overflow-hidden flex flex-col relative">
      {/* ── Toolbar Filters ──────────────────────── */}
      <FilterToolbar
        leftSlot={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 min-w-[130px]">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Status:</span>
              <DropdownSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={STATUS_FILTER_OPTIONS}
                id="status-filter-select"
                variant="light"
              />
            </div>
            <div className="flex items-center gap-1.5 min-w-[100px]">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Per Page:</span>
              <DropdownSelect
                value={perPage}
                onChange={setPerPage}
                options={PER_PAGE_OPTIONS}
                id="per-page-select"
                variant="light"
              />
            </div>
          </div>
        }
        rightSlot={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleApplyFilter}
            >
              Apply Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilter}
            >
              Clear
            </Button>
          </div>
        }
      />

      {/* ── Table / Grid Layout ─────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 bg-slate-50/50 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/75 shadow-xs overflow-hidden">
            <div className="overflow-x-auto w-full scrollbar-none">
              <div className="min-w-[840px]">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-500/80">
                  <div className="col-span-4 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    WEEK
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    DURATION
                  </div>
                  <div className="col-span-2">STATUS</div>
                  <div className="col-span-3 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                    REASON
                  </div>
                  <div className="col-span-1 text-center">ACTION</div>
                </div>

                {/* Rows */}
                {paginatedData.length === 0 ? (
                  <EmptyState
                    title="No Timesheet Records Found"
                    description="Adjust status filters to view records."
                    actionLabel="Clear Filters"
                    onAction={handleClearFilter}
                  />
                ) : (
                  <div className="divide-y divide-slate-100 font-display">
                    {paginatedData.map(entry => (
                      <div
                        key={entry.id}
                        className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/30 transition-colors group"
                      >
                        <div className="col-span-4 font-semibold text-slate-700 text-xs">
                          {entry.weekRange}
                        </div>
                        <div className="col-span-2 font-mono font-bold text-slate-600 text-xs">
                          {entry.duration}
                        </div>
                        <div className="col-span-2">
                          <StatusBadge status={entry.status} size="sm" />
                        </div>
                        <div className="col-span-3 text-slate-400 text-xs italic font-medium">
                          {entry.reason || '—'}
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <Button
                            type="button"
                            onClick={() => setSelectedEntry(entry)}
                            variant="ghost"
                            size="sm"
                            iconOnly
                            className="bg-slate-50 border border-slate-200 text-slate-400 hover:text-[#FF6347] hover:border-[#FF6347]/30 hover:bg-[#FF6347]/5 cursor-pointer active:scale-95"
                            aria-label={`View breakdown for week: ${entry.weekRange}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination controls */}
        {filteredData.length > 0 && (
          <div className="mt-5 bg-white border border-slate-200/60 p-4 rounded-2xl shadow-xs">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredData.length}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* ── Breakdown Modal Overlay ────────────── */}
      {selectedEntry && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 id="modal-title" className="font-display font-black text-slate-800 text-sm">
                  Week Breakdown
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5">
                  {selectedEntry.weekRange}
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setSelectedEntry(null)}
                variant="ghost"
                size="sm"
                iconOnly
                className="hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between bg-[#D9E8F5]/30 border border-[#1490FE]/10 px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-[#1490FE]" />
                  <span className="text-xs font-bold font-display">Total Hours Logged</span>
                </div>
                <span className="text-sm font-black font-mono text-[#1490FE]">
                  {selectedEntry.duration}
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-1">
                  PROJECT BREAKDOWN
                </h4>

                <div className="space-y-2">
                  {selectedEntry.projectBreakdown.map((proj, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: proj.color }}
                        />
                        <span className="text-xs font-bold text-slate-700 truncate">
                          {proj.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold font-mono text-slate-650 bg-slate-100/50 px-2 py-0.5 rounded-md border border-slate-200/10">
                        {proj.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedEntry(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimesheetStatusView
