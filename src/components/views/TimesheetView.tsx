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
import { DropdownSelect, SearchBar, ExportButton, DataCard } from '../common'
import { getLocalDateString, calculateTotalDuration } from '../../utils'
import { type TaskTimeEntry } from '../../constants'

export const TimesheetView: React.FC = () => {
  const {
    taskEntries,
    timelogSearchQuery,
    setTimelogSearchQuery,
    timelogProjectFilter,
    setTimelogProjectFilter,
    timelogTypeFilter,
    setTimelogTypeFilter,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    editingId,
    setEditingId,
    editDescription,
    setEditDescription,
    editProject,
    setEditProject,
    editStartTime,
    setEditStartTime,
    editEndTime,
    setEditEndTime,
    editDuration,
    editTicket,
    setEditTicket,
    editType,
    setEditType,
    startEditing,
    saveEditing,
    deleteEntry
  } = useAppContext()

  // Filtered task entries based on Search, Project Filter, and selected Date Range
  const filteredEntries = taskEntries.filter(e => {
    const matchSearch = !timelogSearchQuery || e.description.toLowerCase().includes(timelogSearchQuery.toLowerCase())
    const matchProject = timelogProjectFilter === 'All' || e.project === timelogProjectFilter
    const matchType = timelogTypeFilter === 'All' || e.entryType === timelogTypeFilter
    
    const startStr = getLocalDateString(startDate)
    const endStr = getLocalDateString(endDate)
    const matchDate = e.date >= startStr && e.date <= endStr
    
    return matchSearch && matchProject && matchType && matchDate
  })

  // Group entries by date
  const groupedEntries: Record<string, TaskTimeEntry[]> = {}
  filteredEntries.forEach(entry => {
    if (!groupedEntries[entry.date]) {
      groupedEntries[entry.date] = []
    }
    groupedEntries[entry.date].push(entry)
  })

  // Sort dates descending
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a))

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Sub-header toolbar */}
      <div className="bg-white border-b border-slate-100 px-6 py-3.5 flex items-center justify-between gap-4 flex-shrink-0">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-display font-extrabold tracking-widest text-slate-400 uppercase">Filters:</span>
          
          {/* Project selector */}
          <DropdownSelect
            value={timelogProjectFilter}
            onChange={setTimelogProjectFilter}
            className="w-48"
            options={[
              { value: 'All', label: 'All Projects' },
              { value: 'Learning and Development', label: 'Learning & Development' },
              { value: 'Tech General', label: 'Tech General' },
              { value: 'ZigTrack Support', label: 'ZigTrack Support' },
              { value: 'ES AI Assessment', label: 'ES AI Assessment' },
              { value: 'Prompts.AI', label: 'Prompts.AI' },
              { value: 'ShallWe Play', label: 'ShallWe Play' },
              { value: 'Freightro', label: 'Freightro' }
            ]}
          />

          {/* Tag/Type selector */}
          <DropdownSelect
            value={timelogTypeFilter}
            onChange={setTimelogTypeFilter}
            className="w-32"
            options={[
              { value: 'All', label: 'All Types' },
              { value: 'Task', label: 'Task' },
              { value: 'Manual', label: 'Manual' }
            ]}
          />
        </div>

        {/* Center/Right stats & search */}
        <div className="flex items-center gap-4">
          {/* Search box */}
          <SearchBar
            value={timelogSearchQuery}
            onChange={setTimelogSearchQuery}
            placeholder="Search logs..."
            className="w-56"
          />

          {/* Total hours indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-display font-extrabold text-slate-400 tracking-wider uppercase whitespace-nowrap">Total Hours Spent :</span>
            <span className="text-[13px] font-black text-[#FF6347] font-mono bg-rose-50 border border-rose-100/50 px-3 py-1 rounded-xl shadow-xs">
              {calculateTotalDuration(filteredEntries)}
            </span>
          </div>

          {/* Export button */}
          <ExportButton onClick={() => {}} label="Export" />
        </div>
      </div>

      {/* Scrollable logs layout */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 bg-slate-50/50">
        {sortedDates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <ClipboardList className="w-12 h-12 mb-3.5 opacity-30 text-[#1490FE]" />
            <p className="text-sm font-semibold text-slate-500">No time entries found for this range</p>
            <button onClick={() => {
              setTimelogSearchQuery('')
              setTimelogProjectFilter('All')
              setTimelogTypeFilter('All')
              const today = new Date(2026, 6, 6)
              setStartDate(today)
              setEndDate(today)
            }} className="mt-2 text-xs text-[#1490FE] font-bold hover:underline">Clear filters</button>
          </div>
        ) : (
          sortedDates.map(dateGroup => {
            const parts = dateGroup.split('-')
            const groupDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
            const groupTotal = calculateTotalDuration(groupedEntries[dateGroup])
            const entriesInGroup = groupedEntries[dateGroup]

            return (
              <div key={dateGroup} className="space-y-3">
                {/* Date Group Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#1490FE] flex items-center justify-center text-xs font-bold border border-[#1490FE]/10">
                      {groupDate.getDate()}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-[14px] text-slate-800 leading-tight">
                        {groupDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' })}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold">{entriesInGroup.length} logs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-2xs font-mono">
                      <span className="text-slate-400 font-sans mr-1 text-[10px]">TOTAL:</span>{groupTotal}
                    </span>
                    <ExportButton onClick={() => {}} variant="group" />
                  </div>
                </div>

                {/* Columns headers */}
                <div className="grid grid-cols-12 gap-3 px-5 py-2 text-[9px] font-display font-bold uppercase tracking-widest text-slate-400/80">
                  <div className="col-span-6">TASK DESCRIPTION</div>
                  <div className="col-span-2">PROJECT</div>
                  <div className="col-span-2 text-center">TIME RANGE</div>
                  <div className="col-span-1 text-center">DURATION</div>
                  <div className="col-span-1 text-center">ACTION</div>
                </div>

                {/* Group entries cards */}
                <div className="space-y-2">
                  {entriesInGroup.map(entry => {
                    const isEditing = editingId === entry.id

                    if (isEditing) {
                      // Render Inline Edit Row
                      return (
                        <div key={entry.id} className="bg-white rounded-2xl border border-[#1490FE]/40 p-5 shadow-md space-y-4 transition-all animate-none">
                          <div className="grid grid-cols-12 gap-4 items-start">
                            
                            {/* Description text area */}
                            <div className="col-span-6 space-y-2">
                              <textarea
                                value={editDescription}
                                onChange={e => setEditDescription(e.target.value)}
                                className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-[#1490FE]/40 focus:bg-white transition-all resize-none font-medium leading-relaxed"
                                rows={3}
                                maxLength={2000}
                                placeholder="Describe your task details in max 2000 characters *"
                              />
                            </div>

                            {/* Project dropdown select */}
                            <div className="col-span-2">
                              <DropdownSelect
                                value={editProject}
                                onChange={setEditProject}
                                options={[
                                  { value: 'Learning and Development', label: 'Learning & Development' },
                                  { value: 'Tech General', label: 'Tech General' },
                                  { value: 'ZigTrack Support', label: 'ZigTrack Support' },
                                  { value: 'ES AI Assessment', label: 'ES AI Assessment' },
                                  { value: 'Prompts.AI', label: 'Prompts.AI' },
                                  { value: 'ShallWe Play', label: 'ShallWe Play' },
                                  { value: 'Freightro', label: 'Freightro' }
                                ]}
                              />
                            </div>

                            {/* Time range inputs */}
                            <div className="col-span-2">
                              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1.5 rounded-xl">
                                <input
                                  type="time"
                                  value={editStartTime}
                                  onChange={e => setEditStartTime(e.target.value)}
                                  className="w-full bg-transparent border-none text-[#141414] text-[11px] font-semibold font-mono outline-none text-center"
                                />
                                <span className="text-slate-400 font-bold text-xs">-</span>
                                <input
                                  type="time"
                                  value={editEndTime}
                                  onChange={e => setEditEndTime(e.target.value)}
                                  className="w-full bg-transparent border-none text-[#141414] text-[11px] font-semibold font-mono outline-none text-center"
                                />
                              </div>
                              <p className="text-[9px] text-slate-400 font-semibold text-center mt-1">Start & End time</p>
                            </div>

                            {/* Live Duration */}
                            <div className="col-span-1 text-center pt-2">
                              <span className="text-sm font-black text-slate-800 font-mono bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                                {editDuration}
                              </span>
                              <p className="text-[9px] text-slate-400 font-semibold mt-1">Duration</p>
                            </div>

                            {/* Form Actions */}
                            <div className="col-span-1 flex items-center justify-center gap-1.5 pt-1.5">
                              <button
                                type="button"
                                onClick={() => saveEditing(entry.id)}
                                className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-200/60 flex items-center justify-center transition-all shadow-xs"
                                title="Save changes"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-200/60 flex items-center justify-center transition-all shadow-xs"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Form Footer: Ticket tag, selection, type selection */}
                          <div className="flex items-center justify-between border-t border-slate-100 pt-3 flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                              {/* Ticket select */}
                              <div className="relative w-36">
                                <select
                                  value={editTicket}
                                  onChange={e => setEditTicket(e.target.value)}
                                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-2 pl-2.5 pr-8 rounded-xl outline-none cursor-pointer focus:border-[#1490FE]/40"
                                >
                                  <option value="">Select Ticket</option>
                                  <option value="ZIG-219">ZIG-219</option>
                                  <option value="ZIG-220">ZIG-220</option>
                                  <option value="ZIG-221">ZIG-221</option>
                                </select>
                                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>

                              {/* Ticket tag */}
                              {editTicket && (
                                <span className="inline-flex items-center gap-1.5 bg-[#1490FE] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-2xs">
                                  {editTicket}
                                  <button type="button" onClick={() => setEditTicket('')} className="hover:text-red-100 text-xs"><X className="w-3 h-3" /></button>
                                </span>
                              )}

                              {/* Type selectors */}
                              <div className="flex bg-slate-100 rounded-xl p-0.5 ml-1">
                                {(['Task', 'Manual'] as const).map(t => {
                                  const isSelected = editType === t
                                  return (
                                    <button
                                      key={t}
                                      type="button"
                                      onClick={() => setEditType(t)}
                                      className={`text-[10px] font-bold px-3 py-1 rounded-lg transition-all ${
                                        isSelected 
                                          ? 'bg-white text-slate-800 shadow-xs' 
                                          : 'text-slate-500 hover:text-slate-800'
                                      }`}
                                    >
                                      {t}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    // Render standard Row Card using the unified DataCard component
                    return (
                      <DataCard key={entry.id} display="grid" className="group grid-cols-12 gap-3 px-5 py-4 items-center">
                        {/* Description content */}
                        <div className="col-span-6 flex items-start gap-3">
                          <div className="space-y-2">
                            <p className="text-[13px] text-slate-700 leading-relaxed font-medium">
                              {entry.description}
                            </p>
                            {/* Dynamic badges below description */}
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Project tag */}
                              <span className="inline-flex items-center gap-1 text-[10px] font-display font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-lg border bg-[#D9E8F5] text-[#141414] border-[#1490FE]/10">
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.projectColor }} />
                                {entry.project}
                              </span>
                              
                              {/* Ticket tag */}
                              {entry.ticket && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-display font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-lg bg-blue-50 text-[#1490FE] border border-[#1490FE]/10">
                                  {entry.ticket}
                                </span>
                              )}

                              {/* Type tag */}
                              <span className={`text-[10px] font-display font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-lg border ${
                                entry.entryType === 'Task' 
                                  ? 'bg-[#1490FE]/10 text-[#1490FE] border-[#1490FE]/15' 
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}>
                                {entry.entryType}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Project display block */}
                        <div className="col-span-2 pt-0.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: entry.projectColor }}>
                            <span className="leading-tight">{entry.project}</span>
                          </span>
                        </div>

                        {/* Time Range */}
                        <div className="col-span-2 text-center">
                          <span className="text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl inline-block shadow-2xs font-semibold">
                            {entry.timeRange}
                          </span>
                        </div>

                        {/* Duration */}
                        <div className="col-span-1 text-center">
                          <span className="text-sm font-black text-slate-800 font-mono">{entry.duration}</span>
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {entry.canEdit && (
                            <button
                              onClick={() => startEditing(entry)}
                              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-[#1490FE] flex items-center justify-center border border-slate-200 hover:border-blue-200 shadow-2xs transition-all"
                              title="Edit log"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center border border-slate-200 hover:border-rose-200 shadow-2xs transition-all"
                            title="Delete log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </DataCard>
                    )
                  })}
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
