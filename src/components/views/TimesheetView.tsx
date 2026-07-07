import React from 'react'
import {
  ClipboardList,
  Pencil,
  Trash2,
  Check,
  X,
  ChevronDown
} from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import {
  DropdownSelect,
  ExportButton,
  DataCard,
  FilterToolbar,
  EmptyState,
  Badge,
  Button,
  TimePicker
} from '../common'
import { getLocalDateString, calculateTotalDuration } from '../../utils'
import { type TaskTimeEntry } from '../../constants'

// ─── Project options (single source of truth) ─────────────────────────────────
const PROJECT_OPTIONS = [
  { value: 'All', label: 'All Projects' },
  { value: 'Learning and Development', label: 'Learning & Development' },
  { value: 'Tech General', label: 'Tech General' },
  { value: 'ZigTrack Support', label: 'ZigTrack Support' },
  { value: 'ES AI Assessment', label: 'ES AI Assessment' },
  { value: 'Prompts.AI', label: 'Prompts.AI' },
  { value: 'ShallWe Play', label: 'ShallWe Play' },
  { value: 'Freightro', label: 'Freightro' },
]

const PROJECT_EDIT_OPTIONS = PROJECT_OPTIONS.filter(o => o.value !== 'All')

const TYPE_OPTIONS = [
  { value: 'All', label: 'All Types' },
  { value: 'Task', label: 'Task' },
  { value: 'Manual', label: 'Manual' },
]

// ─── Inline edit row ─────────────────────────────────────────────────────────
interface EditRowProps {
  entry: TaskTimeEntry
}

const EditRow: React.FC<EditRowProps> = ({ entry }) => {
  const {
    editDescription, setEditDescription,
    editProject, setEditProject,
    editStartTime, setEditStartTime,
    editEndTime, setEditEndTime,
    editDuration,
    editTicket, setEditTicket,
    editType, setEditType,
    saveEditing, setEditingId,
  } = useAppContext()

  return (
    <div className="bg-white rounded-2xl border border-[#1490FE]/40 p-4 sm:p-5 shadow-md space-y-4 transition-all">
      <div className="grid grid-cols-12 gap-3 sm:gap-4 items-start">
        {/* Description */}
        <div className="col-span-12 sm:col-span-6 space-y-1">
          <textarea
            id={`edit-desc-${entry.id}`}
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
            className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#1490FE]/40 focus:bg-white transition-all resize-none font-medium leading-relaxed"
            rows={3}
            maxLength={2000}
            placeholder="Describe your task details (max 2000 chars) *"
            aria-label="Task description"
          />
        </div>

        {/* Project */}
        <div className="col-span-6 sm:col-span-2">
          <DropdownSelect
            value={editProject}
            onChange={setEditProject}
            options={PROJECT_EDIT_OPTIONS}
            id={`edit-project-${entry.id}`}
          />
        </div>

        {/* Time range using custom TimePicker */}
        <div className="col-span-6 sm:col-span-2">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1.5 rounded-xl">
            <TimePicker
              value={editStartTime}
              onChange={setEditStartTime}
              variant="small"
              className="w-full text-center"
            />
            <span className="text-slate-400 font-bold text-xs" aria-hidden="true">-</span>
            <TimePicker
              value={editEndTime}
              onChange={setEditEndTime}
              variant="small"
              className="w-full text-center"
            />
          </div>
          <p className="text-[9px] text-slate-400 font-semibold text-center mt-1">Start & End</p>
        </div>

        {/* Duration */}
        <div className="col-span-6 sm:col-span-1 text-center pt-2">
          <span className="text-sm font-black text-slate-800 font-mono bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
            {editDuration}
          </span>
          <p className="text-[9px] text-slate-400 font-semibold mt-1">Duration</p>
        </div>

        {/* Actions */}
        <div className="col-span-6 sm:col-span-1 flex items-center justify-center gap-1.5 pt-1.5">
          <Button
            variant="success"
            size="sm"
            iconOnly
            onClick={() => saveEditing(entry.id)}
            aria-label="Save changes"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            iconOnly
            onClick={() => setEditingId(null)}
            aria-label="Cancel editing"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Footer: ticket + type */}
      <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Ticket select */}
          <div className="relative w-36">
            <select
              id={`edit-ticket-${entry.id}`}
              value={editTicket}
              onChange={e => setEditTicket(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-2 pl-2.5 pr-8 rounded-xl outline-none cursor-pointer focus:border-[#1490FE]/40"
              aria-label="Ticket"
            >
              <option value="">Select Ticket</option>
              <option value="ZIG-219">ZIG-219</option>
              <option value="ZIG-220">ZIG-220</option>
              <option value="ZIG-221">ZIG-221</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {editTicket && (
            <Badge variant="blue" size="md">
              {editTicket}
              <button
                type="button"
                onClick={() => setEditTicket('')}
                className="hover:text-red-300 ml-1"
                aria-label={`Remove ticket ${editTicket}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {/* Entry type toggle */}
          <div className="flex bg-slate-100 rounded-xl p-0.5" role="radiogroup" aria-label="Entry type">
            {(['Task', 'Manual'] as const).map(t => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={editType === t}
                onClick={() => setEditType(t)}
                className={`text-[10px] font-bold px-3 py-1 rounded-lg transition-all ${editType === t
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Display row ──────────────────────────────────────────────────────────────
interface DisplayRowProps {
  entry: TaskTimeEntry
}

const DisplayRow: React.FC<DisplayRowProps> = ({ entry }) => {
  const { startEditing, deleteEntry } = useAppContext()
  return (
    <DataCard display="grid" className="group grid-cols-12 gap-2 sm:gap-3 px-4 sm:px-5 py-4 items-center">
      {/* Description */}
      <div className="col-span-12 sm:col-span-6 flex items-start gap-3">
        <div className="space-y-2 min-w-0">
          <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
            {entry.description}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="default" dot dotColor={entry.projectColor}>
              {entry.project}
            </Badge>
            {entry.ticket && <Badge variant="blue">{entry.ticket}</Badge>}
            <Badge variant={entry.entryType === 'Task' ? 'blue' : 'muted'}>
              {entry.entryType}
            </Badge>
          </div>
        </div>
      </div>

      {/* Project */}
      <div className="hidden sm:block col-span-2 pt-0.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: entry.projectColor }}>
          {entry.project}
        </span>
      </div>

      {/* Time range */}
      <div className="hidden sm:block col-span-2 text-center">
        <span className="text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl inline-block shadow-sm font-semibold">
          {entry.timeRange}
        </span>
      </div>

      {/* Duration */}
      <div className="col-span-6 sm:col-span-1 text-center">
        <span className="text-sm font-black text-slate-800 font-mono">{entry.duration}</span>
      </div>

      {/* Actions */}
      <div className="col-span-6 sm:col-span-1 flex items-center justify-end sm:justify-center gap-1.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {entry.canEdit && (
          <button
            onClick={() => startEditing(entry)}
            className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-[#EFF6FF] text-slate-400 hover:text-[#1490FE] flex items-center justify-center border border-slate-200 hover:border-[#BFDBFE] transition-all"
            aria-label="Edit log"
          >
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
        <button
          onClick={() => deleteEntry(entry.id)}
          className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-[#FEF2F2] text-slate-400 hover:text-[#DC2626] flex items-center justify-center border border-slate-200 hover:border-[#FECACA] transition-all"
          aria-label="Delete log"
        >
          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    </DataCard>
  )
}

// ─── Timesheet view ──────────────────────────────────────────────────────────
export const TimesheetView: React.FC = () => {
  const {
    taskEntries,
    timelogSearchQuery, setTimelogSearchQuery,
    timelogProjectFilter, setTimelogProjectFilter,
    timelogTypeFilter, setTimelogTypeFilter,
    startDate, endDate,
    setStartDate, setEndDate,
    editingId,
  } = useAppContext()

  // Filter
  const filteredEntries = taskEntries.filter(e => {
    const matchSearch = !timelogSearchQuery || e.description.toLowerCase().includes(timelogSearchQuery.toLowerCase())
    const matchProject = timelogProjectFilter === 'All' || e.project === timelogProjectFilter
    const matchType = timelogTypeFilter === 'All' || e.entryType === timelogTypeFilter
    const startStr = getLocalDateString(startDate)
    const endStr = getLocalDateString(endDate)
    const matchDate = e.date >= startStr && e.date <= endStr
    return matchSearch && matchProject && matchType && matchDate
  })

  // Group by date
  const groupedEntries: Record<string, TaskTimeEntry[]> = {}
  filteredEntries.forEach(entry => {
    if (!groupedEntries[entry.date]) groupedEntries[entry.date] = []
    groupedEntries[entry.date].push(entry)
  })
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a))

  const clearFilters = () => {
    setTimelogSearchQuery('')
    setTimelogProjectFilter('All')
    setTimelogTypeFilter('All')
    const today = new Date(2026, 6, 6)
    setStartDate(today)
    setEndDate(today)
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* ── Toolbar ──────────────────────────────── */}
      <FilterToolbar
        leftSlot={
          <>
            <DropdownSelect
              value={timelogProjectFilter}
              onChange={setTimelogProjectFilter}
              className="w-40 sm:w-48"
              options={PROJECT_OPTIONS}
              id="timesheet-project-filter"
            />
            <DropdownSelect
              value={timelogTypeFilter}
              onChange={setTimelogTypeFilter}
              className="w-28 sm:w-32"
              options={TYPE_OPTIONS}
              id="timesheet-type-filter"
            />
          </>
        }
        rightSlot={
          <>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {}}
            >
              Apply Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
            >
              Clear
            </Button>
            <div className="flex items-center gap-1.5 text-[10px] font-display font-extrabold text-slate-400 tracking-wider uppercase whitespace-nowrap">
              <span>Total:</span>
              <span
                className="text-[13px] font-black text-[#FF6347] font-mono bg-[#FEF2F2] border border-[#FECACA] px-3 py-1 rounded-xl shadow-sm"
                aria-label={`Total hours: ${calculateTotalDuration(filteredEntries)}`}
              >
                {calculateTotalDuration(filteredEntries)}
              </span>
            </div>
            <ExportButton onClick={() => { }} label="Export" />
          </>
        }
      />

      {/* ── Scrollable log list ───────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6 bg-slate-50/50">
        {sortedDates.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No time entries found"
            description="No logs match your current filters or date range."
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        ) : (
          sortedDates.map(dateGroup => {
            const parts = dateGroup.split('-')
            const groupDate = new Date(
              parseInt(parts[0], 10),
              parseInt(parts[1], 10) - 1,
              parseInt(parts[2], 10)
            )
            const groupTotal = calculateTotalDuration(groupedEntries[dateGroup])
            const entriesInGroup = groupedEntries[dateGroup]

            return (
              <div key={dateGroup} className="space-y-3">
                {/* Date group header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-[#D9E8F5] text-[#1490FE] flex items-center justify-center text-xs font-bold border border-[#1490FE]/10">
                      {groupDate.getDate()}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-[14px] text-slate-800 leading-tight">
                        {groupDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: '2-digit',
                          year: 'numeric',
                        })}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {entriesInGroup.length} logs
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-xl font-mono">
                      <span className="text-slate-400 font-sans mr-1 text-[10px]">TOTAL:</span>
                      {groupTotal}
                    </span>
                    <ExportButton onClick={() => { }} variant="group" />
                  </div>
                </div>

                {/* Column headers — hidden on mobile */}
                <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-2 text-[9px] font-display font-bold uppercase tracking-widest text-slate-400/80">
                  <div className="col-span-6">TASK DESCRIPTION</div>
                  <div className="col-span-2">PROJECT</div>
                  <div className="col-span-2 text-center">TIME RANGE</div>
                  <div className="col-span-1 text-center">DURATION</div>
                  <div className="col-span-1 text-center">ACTION</div>
                </div>

                {/* Entry rows */}
                <div className="space-y-2">
                  {entriesInGroup.map(entry =>
                    editingId === entry.id ? (
                      <EditRow key={entry.id} entry={entry} />
                    ) : (
                      <DisplayRow key={entry.id} entry={entry} />
                    )
                  )}
                </div>
              </div>
            )
          })
        )}
        <div className="h-24" />
      </div>
    </div>
  )
}

export default TimesheetView
