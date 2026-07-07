import React, { useState } from 'react'
import { X, Clock, TrendingUp, AlertTriangle } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { convertTo24Hour } from '../../utils'

export const DayOutModal: React.FC = () => {
  const {
    showDayOutModal,
    setShowDayOutModal,
    clockSessions,
    secondsTracked,
    taskEntries,
    sendDailyReportEmail,
    setSendDailyReportEmail,
    handleConfirmClockOut
  } = useAppContext()

  const [seeMoreId, setSeeMoreId] = useState<number | null>(null)

  if (!showDayOutModal) return null

  // Date of today
  const todayStr = '2026-07-06' // Hardcoded today's log date from mock data

  // Earliest clock in time
  const dayInTime = clockSessions.length > 0 ? clockSessions[clockSessions.length - 1].inTime : '10:17 AM'

  // Helper to format minutes to HH:MM
  const formatMinutes = (totalMin: number): string => {
    const hrs = Math.floor(totalMin / 60)
    const mins = totalMin % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
  }

  // Get total clock-in minutes today
  const getTotalClockMinutes = () => {
    let total = 0
    clockSessions.forEach(s => {
      if (s.isActive) {
        total += Math.floor(secondsTracked / 60) || 113 // Mock active duration if 0
      } else {
        const parts = s.duration.split(':')
        if (parts.length === 2) {
          total += parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
        }
      }
    })
    return total
  }

  // Get total task minutes today
  const getTotalTaskMinutes = () => {
    let total = 0
    taskEntries.filter(e => e.date === todayStr).forEach(e => {
      const parts = e.duration.split(':')
      if (parts.length === 2) {
        total += parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
      }
    })
    return total
  }

  const clockMinutes = getTotalClockMinutes()
  const taskMinutes = getTotalTaskMinutes()

  // Productivity % = (Task Minutes / Clock Minutes) * 100
  const productivityPercent = clockMinutes > 0 
    ? ((taskMinutes / clockMinutes) * 100).toFixed(2) 
    : '0.00'

  // Today's entries
  const todayEntries = taskEntries.filter(e => e.date === todayStr)

  // Parse start/end times from range string e.g. "05:47 PM – 06:36 PM"
  const parseTimeRange = (range: string) => {
    const parts = range.split(/[–-]/).map(p => p.trim())
    if (parts.length === 2) {
      return {
        start: convertTo24Hour(parts[0]),
        end: convertTo24Hour(parts[1])
      }
    }
    return { start: '--:--', end: '--:--' }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl border border-slate-100 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-rose-50 flex justify-between items-start bg-rose-50/20">
          <div>
            <h2 className="text-lg font-display font-extrabold text-slate-800 tracking-tight">
              Today's Summary
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Day in at <span className="text-slate-650 font-bold">{dayInTime}</span>
            </p>
          </div>
          <button 
            onClick={() => setShowDayOutModal(false)} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-xl transition-all"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: Productive Hours */}
            <div className="flex items-center gap-4 bg-rose-50/30 border border-rose-100/50 rounded-2xl p-4.5 transition-all hover:shadow-xs">
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-zg-coral flex-shrink-0">
                <div className="relative">
                  <Clock className="w-6 h-6 stroke-[2.5]" />
                  <span className="absolute -bottom-1 -right-1 bg-zg-coral text-[9px] font-black text-white w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                    ⚙️
                  </span>
                </div>
              </div>
              <div>
                <span className="block text-xl font-mono font-black text-[#FF6347] leading-none">
                  {formatMinutes(taskMinutes)}
                </span>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                  Productive Hours
                </span>
              </div>
            </div>

            {/* Card 2: Productivity Percentage */}
            <div className="flex items-center gap-4 bg-rose-50/30 border border-rose-100/50 rounded-2xl p-4.5 transition-all hover:shadow-xs">
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-zg-coral flex-shrink-0">
                <div className="relative">
                  <TrendingUp className="w-6 h-6 stroke-[2.5]" />
                  <span className="absolute -bottom-1 -right-1 bg-zg-coral text-[9px] font-black text-white w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                    📊
                  </span>
                </div>
              </div>
              <div>
                <span className="block text-xl font-mono font-black text-[#FF6347] leading-none">
                  {productivityPercent}%
                </span>
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">
                  Productivity
                </span>
              </div>
            </div>

          </div>

          {/* Task Summary Section */}
          <div className="rounded-2xl border border-rose-100 overflow-hidden shadow-xs">
            {/* Red Table Header Banner */}
            <div className="bg-gradient-to-r from-zg-coral to-rose-500 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-white">
              <span className="text-xs font-display font-extrabold tracking-widest uppercase">
                Task Summary
              </span>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold text-white/90">
                <span>Total Clock In Time: {formatMinutes(clockMinutes)}</span>
                <span className="text-white/40">|</span>
                <span>Total Task Hours: {formatMinutes(taskMinutes)}</span>
              </div>
            </div>

            {/* Entries Body */}
            {todayEntries.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                No tasks logged today.
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Desktop View */}
                <table className="hidden sm:table w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-rose-50 text-[10px] font-display font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-4 w-[25%]">Project</th>
                      <th className="py-2.5 px-4 w-[45%]">Task</th>
                      <th className="py-2.5 px-4 w-[10%] text-center">Start Time</th>
                      <th className="py-2.5 px-4 w-[10%] text-center">End Time</th>
                      <th className="py-2.5 px-4 w-[10%] text-center">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-50/40 text-slate-700 font-medium">
                    {todayEntries.map(e => {
                      const times = parseTimeRange(e.timeRange)
                      const isLongText = e.description.length > 60
                      const showFullText = seeMoreId === e.id

                      return (
                        <tr key={e.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-800 align-top">
                            {e.project}
                          </td>
                          <td className="py-3 px-4 text-slate-650 leading-relaxed align-top break-words">
                            {showFullText ? e.description : `${e.description.slice(0, 60)}${isLongText ? '...' : ''}`}
                            {isLongText && (
                              <button 
                                onClick={() => setSeeMoreId(showFullText ? null : e.id)}
                                className="text-zg-vivid-blue hover:underline ml-1 font-bold text-[10px]"
                              >
                                {showFullText ? 'see less' : 'see more'}
                              </button>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-mono align-top text-slate-500 font-bold">
                            {times.start}
                          </td>
                          <td className="py-3 px-4 text-center font-mono align-top text-slate-500 font-bold">
                            {times.end}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-black text-slate-800 align-top">
                            {e.duration}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                {/* Mobile View (Card List) */}
                <div className="sm:hidden divide-y divide-rose-50/50 p-1">
                  {todayEntries.map(e => {
                    const times = parseTimeRange(e.timeRange)
                    const isLongText = e.description.length > 80
                    const showFullText = seeMoreId === e.id

                    return (
                      <div key={e.id} className="p-3.5 space-y-2 text-xs">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-slate-800">{e.project}</span>
                          <span className="font-mono font-black text-slate-700 bg-rose-50/50 px-2 py-0.5 rounded-md">{e.duration}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed font-semibold">
                          {showFullText ? e.description : `${e.description.slice(0, 80)}${isLongText ? '...' : ''}`}
                          {isLongText && (
                            <button 
                              onClick={() => setSeeMoreId(showFullText ? null : e.id)}
                              className="text-zg-vivid-blue hover:underline ml-1 font-bold text-[10px]"
                            >
                              {showFullText ? 'see less' : 'see more'}
                            </button>
                          )}
                        </p>
                        <div className="flex gap-4 pt-1 font-mono text-[10px] font-bold text-slate-400">
                          <span>Start: <span className="text-slate-500">{times.start}</span></span>
                          <span>End: <span className="text-slate-500">{times.end}</span></span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Email Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer group p-1 select-none">
            <div className="relative">
              <input 
                type="checkbox"
                checked={sendDailyReportEmail}
                onChange={e => setSendDailyReportEmail(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 rounded-lg border-2 border-slate-300 peer-checked:border-zg-coral peer-checked:bg-zg-coral flex items-center justify-center transition-all group-hover:border-zg-coral/60 peer-focus-visible:ring-2 peer-focus-visible:ring-zg-coral/25">
                <svg className="w-3.5 h-3.5 text-white fill-current opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 20 20">
                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                </svg>
              </div>
            </div>
            <span className="text-xs text-slate-650 font-bold group-hover:text-slate-800 transition-colors">
              Do you want to send daily report email?
            </span>
          </label>

          {/* Warning notice */}
          <div className="flex items-start gap-2 bg-amber-50/40 border border-amber-100 rounded-xl p-3 text-[11px] text-amber-750 font-medium leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>Clocking out will finalize your active session. You can review and edit your logged details in the Timesheet module if needed.</span>
          </div>

          {/* Confirmation Prompt & Buttons */}
          <div className="space-y-4 pt-2 border-t border-rose-50 text-center">
            <h3 className="text-base font-display font-extrabold text-slate-800">
              Are you sure you want to day out?
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleConfirmClockOut}
                className="w-full sm:w-36 bg-[#FF6347] hover:bg-[#e05439] active:scale-98 text-white text-sm font-bold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setShowDayOutModal(false)}
                className="w-full sm:w-36 border-2 border-[#FF6347]/30 hover:border-[#FF6347] hover:bg-rose-50/25 active:scale-98 text-[#FF6347] text-sm font-bold py-2.5 px-6 rounded-xl transition-all"
              >
                No
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
export default DayOutModal
