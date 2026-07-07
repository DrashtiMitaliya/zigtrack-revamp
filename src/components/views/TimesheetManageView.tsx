import React from 'react'
import { ClipboardList } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import {
  DropdownSelect,
  Button,
  ExportButton,
  FilterToolbar,
  EmptyState
} from '../common'
import { getLocalDateString } from '../../utils'

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

const TYPE_OPTIONS = [
  { value: 'All', label: 'All Types' },
  { value: 'Task', label: 'Task' },
  { value: 'Manual', label: 'Manual' },
]

export const TimesheetManageView: React.FC = () => {
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
    clockSessions,
    secondsTracked
  } = useAppContext()

  const clearFilters = () => {
    setTimelogSearchQuery('')
    setTimelogProjectFilter('All')
    setTimelogTypeFilter('All')
  }

  // Filter entries
  const filteredEntries = taskEntries.filter(e => {
    const matchSearch = !timelogSearchQuery || e.description.toLowerCase().includes(timelogSearchQuery.toLowerCase())
    const matchProject = timelogProjectFilter === 'All' || e.project === timelogProjectFilter
    const matchType = timelogTypeFilter === 'All' || e.entryType === timelogTypeFilter
    return matchSearch && matchProject && matchType
  })

  // Date list helper (max 7 days)
  const getDatesInRange = (start: Date, end: Date) => {
    const dates: Date[] = []
    let curr = new Date(start.getFullYear(), start.getMonth(), start.getDate())
    const toDate = new Date(end.getFullYear(), end.getMonth(), end.getDate())
    let count = 0
    while (curr <= toDate && count < 7) {
      dates.push(new Date(curr))
      curr.setDate(curr.getDate() + 1)
      count++
    }
    return dates
  }

  const weekDates = getDatesInRange(startDate, endDate)

  // Determine projects to render
  const weekStartStr = getLocalDateString(startDate)
  const weekEndStr = getLocalDateString(endDate)
  const activeProjects = Array.from(new Set(
    filteredEntries
      .filter(e => e.date >= weekStartStr && e.date <= weekEndStr)
      .map(e => e.project)
  ))

  const projectsToRender = activeProjects.length > 0
    ? activeProjects
    : ['Learning and Development', 'Tech General', 'DevOps/SysAdmin General']

  const getProjectColor = (project: string) => {
    const entry = taskEntries.find(e => e.project === project)
    return entry?.projectColor || '#1490FE'
  }

  const getInitials = (name: string) => {
    const words = name.split(' ')
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const getProjectWorkType = (project: string) => {
    const nonProjectList = ['Tech General', 'DevOps/SysAdmin General', 'Learning and Development', 'BA/PM General', 'HR/Admin', 'UX General']
    return nonProjectList.includes(project) ? 'Non Project Work' : 'Project Work'
  }

  const formatMins = (totalMin: number): string => {
    if (totalMin <= 0) return '-'
    const hrs = Math.floor(totalMin / 60)
    const mins = totalMin % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
  }

  const getProjectMinutesForDate = (project: string, dateStr: string) => {
    let total = 0
    filteredEntries
      .filter(e => e.project === project && e.date === dateStr)
      .forEach(e => {
        const parts = e.duration.split(':')
        if (parts.length === 2) {
          total += parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
        }
      })
    return total
  }

  const getProjectTotalMinutes = (project: string) => {
    let total = 0
    weekDates.forEach(date => {
      total += getProjectMinutesForDate(project, getLocalDateString(date))
    })
    return total
  }

  const getAllProjectsMinutesForDate = (dateStr: string) => {
    let total = 0
    filteredEntries
      .filter(e => e.date === dateStr)
      .forEach(e => {
        const parts = e.duration.split(':')
        if (parts.length === 2) {
          total += parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
        }
      })
    return total
  }

  const getAllProjectsGrandTotalMinutes = () => {
    let total = 0
    weekDates.forEach(date => {
      total += getAllProjectsMinutesForDate(getLocalDateString(date))
    })
    return total
  }

  const getClockInOutMinutesForDate = (dateStr: string) => {
    const todayStr = '2026-07-06'
    if (dateStr === todayStr) {
      let total = 0
      clockSessions.forEach(s => {
        if (s.isActive) {
          total += Math.floor(secondsTracked / 60) || 113
        } else {
          const parts = s.duration.split(':')
          if (parts.length === 2) {
            total += parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
          }
        }
      })
      return total
    }

    const taskMin = getAllProjectsMinutesForDate(dateStr)
    if (taskMin === 0) return 0
    return taskMin + 45
  }

  const getClockInOutGrandTotalMinutes = () => {
    let total = 0
    weekDates.forEach(date => {
      total += getClockInOutMinutesForDate(getLocalDateString(date))
    })
    return total
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Filter Toolbar */}
      <FilterToolbar
        leftSlot={
          <>
            <DropdownSelect
              value={timelogProjectFilter}
              onChange={setTimelogProjectFilter}
              className="w-40 sm:w-48"
              options={PROJECT_OPTIONS}
              id="weekly-project-filter"
            />
            <DropdownSelect
              value={timelogTypeFilter}
              onChange={setTimelogTypeFilter}
              className="w-28 sm:w-32"
              options={TYPE_OPTIONS}
              id="weekly-type-filter"
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
              >
                {formatMins(getAllProjectsGrandTotalMinutes())}
              </span>
            </div>
            <ExportButton onClick={() => { }} label="Export" />
          </>
        }
      />

      {/* Grid container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6 bg-slate-50/50">
        {weekDates.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No time entries found"
            description="Select a week in the date picker to display grid."
            actionLabel="Clear Filters"
            onAction={clearFilters}
          />
        ) : (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#242838] rounded-3xl border border-slate-200/80 dark:border-[#3a4060] shadow-md overflow-hidden">
              <div className="overflow-x-auto w-full scrollbar-none animate-fade-in">
                <table className="w-full text-left text-xs border-collapse min-w-[840px]">
                  <thead>
                    <tr className="bg-slate-50/75 dark:bg-[#2e3347] border-b border-slate-200 dark:border-[#3a4060] text-slate-500 dark:text-[#8892aa] font-display font-bold uppercase select-none">
                      <th className="py-4 px-6 text-[10px] tracking-wider text-slate-600 dark:text-[#8892aa] font-black w-[28%]">
                        WEEKLY TIMESHEET
                      </th>
                      {weekDates.map((date, idx) => (
                        <th key={idx} className="py-3 px-3 text-center border-l border-slate-200/60 dark:border-[#3a4060] w-[9%]">
                          <div className="flex items-center gap-2 justify-center py-0.5">
                            <span className="text-xl font-black text-slate-800 dark:text-[#e8eaf0] font-display leading-none">
                              {String(date.getDate()).padStart(2, '0')}
                            </span>
                            <div className="flex flex-col text-left">
                              <span className="text-[9px] font-black text-slate-650 dark:text-[#a8b0c8] uppercase tracking-wider leading-none">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                              </span>
                              <span className="text-[8px] font-bold text-slate-400 dark:text-[#6b7595] uppercase tracking-widest leading-none mt-0.5">
                                {date.toLocaleDateString('en-US', { month: 'short' })}
                              </span>
                            </div>
                          </div>
                        </th>
                      ))}
                      <th className="py-4 px-4 text-center border-l border-slate-200 dark:border-[#3a4060] text-[10px] tracking-wider text-slate-600 dark:text-[#8892aa] font-black w-[9%] bg-slate-50 dark:bg-[#1e2236]">
                        TOTAL
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#2e3347] text-slate-700 dark:text-[#c4cade] font-medium font-display">
                    {projectsToRender.map(project => {
                      const color = getProjectColor(project)
                      const initials = getInitials(project)
                      const workType = getProjectWorkType(project)
                      const isProjectWork = workType === 'Project Work'

                      return (
                        <tr key={project} className="hover:bg-slate-50/50 dark:hover:bg-[#2e3347] transition-colors">
                          <td className="py-4 px-6 flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-xs"
                              style={{ backgroundColor: color }}
                            >
                              {initials}
                            </div>
                            <div className="truncate">
                              <span className="block font-bold text-slate-800 dark:text-[#e8eaf0] text-xs truncate">
                                {project}
                              </span>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                                isProjectWork
                                  ? 'bg-emerald-50/60 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20'
                                  : 'bg-amber-50/60 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20'
                              }`}>
                                {workType}
                              </span>
                            </div>
                          </td>

                          {weekDates.map((date, idx) => {
                            const dateStr = getLocalDateString(date)
                            const mins = getProjectMinutesForDate(project, dateStr)
                            const val = formatMins(mins)
                            return (
                              <td key={idx} className={`py-4 px-3 text-center border-l border-slate-100/80 dark:border-[#2e3347] font-mono text-[12px] ${
                                val === '-' ? 'text-slate-300 dark:text-[#3a4060] font-medium' : 'text-slate-800 dark:text-[#e8eaf0] font-bold'
                              }`}>
                                {val === '-' ? '—' : val}
                              </td>
                            )
                          })}

                          <td className="py-4 px-4 text-center border-l border-slate-200/80 dark:border-[#3a4060] font-mono font-black text-slate-800 dark:text-[#e8eaf0] text-[12px] bg-slate-50/40 dark:bg-[#1e2236]/60">
                            {formatMins(getProjectTotalMinutes(project))}
                          </td>
                        </tr>
                      )
                    })}

                    {/* All Projects Summary Row */}
                    <tr className="bg-slate-50/30 dark:bg-[#1e2236]/40 font-bold border-t border-slate-200 dark:border-[#3a4060]">
                      <td className="py-4 px-6 text-slate-850 dark:text-[#e8eaf0] text-xs font-black">
                        All projects
                      </td>
                      {weekDates.map((date, idx) => {
                        const dateStr = getLocalDateString(date)
                        const mins = getAllProjectsMinutesForDate(dateStr)
                        const val = formatMins(mins)
                        return (
                          <td key={idx} className={`py-4 px-3 text-center border-l border-slate-100/80 dark:border-[#2e3347] font-mono text-[12px] ${
                            val === '-' ? 'text-slate-300 dark:text-[#3a4060] font-medium' : 'text-slate-800 dark:text-[#e8eaf0] font-black'
                          }`}>
                            {val === '-' ? '—' : val}
                          </td>
                        )
                      })}
                      <td className="py-4 px-4 text-center border-l border-slate-200 dark:border-[#3a4060] font-mono font-black text-[#1490FE] text-[12px] bg-blue-50/20 dark:bg-[#1490FE]/10">
                        {formatMins(getAllProjectsGrandTotalMinutes())}
                      </td>
                    </tr>

                    {/* Clock In/Out Summary Row */}
                    <tr className="bg-slate-50/50 dark:bg-[#1e2236]/20 font-bold">
                      <td className="py-4 px-6 text-slate-850 dark:text-[#e8eaf0] text-xs font-black">
                        Clock In/Out
                      </td>
                      {weekDates.map((date, idx) => {
                        const dateStr = getLocalDateString(date)
                        const mins = getClockInOutMinutesForDate(dateStr)
                        const val = formatMins(mins)
                        return (
                          <td key={idx} className={`py-4 px-3 text-center border-l border-slate-100/80 dark:border-[#2e3347] font-mono text-[12px] ${
                            val === '-' ? 'text-slate-350 dark:text-[#3a4060] font-medium' : 'text-slate-800 dark:text-[#e8eaf0] font-black'
                          }`}>
                            {val === '-' ? '—' : val}
                          </td>
                        )
                      })}
                      <td className="py-4 px-4 text-center border-l border-slate-200 dark:border-[#3a4060] font-mono font-black text-[#1490FE] text-[12px] bg-blue-50/30 dark:bg-[#1490FE]/10">
                        {formatMins(getClockInOutGrandTotalMinutes())}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => alert('Weekly Timesheet submitted successfully!')}
                className="bg-[#1490FE] hover:bg-[#0070DF] text-white text-xs font-extrabold px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-98"
              >
                Submit Timesheet
              </button>
            </div>
          </div>
        )}
        <div className="h-24" />
      </div>
    </div>
  )
}
