import React, { useState, useEffect, useRef } from 'react'
import {
  AlarmClock,
  Pencil,
  Maximize2,
  Minimize2,
  X,
  Play,
  Pause,
  TimerReset
} from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { DropdownSelect, TimePicker, DatePickerWidget } from '../common'
import { getLocalDateString } from '../../utils'

/**
 * FloatingTimerWidget — Absolute dropdown popover for editing time log entries.
 * Anchored directly below the Header time tracking pill.
 */
export const FloatingTimerWidget: React.FC = () => {
  const {
    showTimerWidget,
    setShowTimerWidget,
    timerSubTab,
    setTimerSubTab,
    timerProject,
    setTimerProject,
    timerDescription,
    setTimerDescription,
    manualProject,
    setManualProject,
    manualDescription,
    setManualDescription,
    manualStartTime,
    setManualStartTime,
    manualEndTime,
    setManualEndTime,
    isTimerRunning,
    setIsTimerRunning,
    secondsTracked,
    setSecondsTracked,
    availableProjects,
    saveManualLog,
    clearManualLog,
    manualLogDate,
    setManualLogDate
  } = useAppContext()

  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Listen for clicks outside of the popover card to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // If target is no longer in the document (detached DOM node), ignore it!
      if (!document.body.contains(target)) return
      
      // If clicking inside the active timer block itself, do not close the widget (let Header.tsx handle toggles)
      if (target.closest('.header-time-tracker')) return

      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowTimerWidget(false)
      }
    }
    if (showTimerWidget) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showTimerWidget, setShowTimerWidget])

  const parseDateStr = (dateStr: string): Date => {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
    }
    return new Date()
  }

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }



  // Returns null when closed
  if (!showTimerWidget) return null

  const projectDropdownOptions = availableProjects.map(p => ({ value: p, label: p }))
  const ticketDropdownOptions = [
    { value: 'ZIG-219', label: 'ZIG-219' },
    { value: 'ZIG-220', label: 'ZIG-220' },
    { value: 'ZIG-221', label: 'ZIG-221' }
  ]

  return (
    <div 
      ref={containerRef}
      className={`absolute right-0 top-full mt-3.5 z-50 bg-white dark:bg-[#242838] border border-slate-200 dark:border-[#3a4060] rounded-[28px] shadow-2xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-visible animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto ${
        isExpanded ? 'w-[90vw] max-w-2xl sm:w-[640px]' : 'w-[90vw] max-w-lg sm:w-[480px]'
      }`}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-[#3a4060] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3.5 text-slate-800 text-xs font-semibold select-none">
          <button
            type="button"
            onClick={() => setTimerSubTab('Timer')}
            className={`flex items-center gap-1.5 transition-all py-1 border-b-2 cursor-pointer ${
              timerSubTab === 'Timer'
                ? 'font-black text-[#1490FE] border-[#1490FE]'
                : 'font-bold text-slate-450 dark:text-[#8892aa] hover:text-slate-700 dark:hover:text-[#e8eaf0] border-transparent'
            }`}
          >
            <AlarmClock className="w-3.5 h-3.5" />
            Timer Log
          </button>
          <span className="text-slate-200 dark:text-[#3a4060] font-normal">|</span>
          <button
            type="button"
            onClick={() => setTimerSubTab('Manual')}
            className={`flex items-center gap-1.5 transition-all py-1 border-b-2 cursor-pointer ${
              timerSubTab === 'Manual'
                ? 'font-black text-[#1490FE] border-[#1490FE]'
                : 'font-bold text-slate-450 dark:text-[#8892aa] hover:text-slate-700 dark:hover:text-[#e8eaf0] border-transparent'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            Manual Log
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 dark:text-[#8892aa] hover:text-slate-650 dark:hover:text-[#e8eaf0] hover:bg-slate-50 dark:hover:bg-[#2e3347] transition-colors hidden sm:inline-block cursor-pointer"
            title={isExpanded ? 'Minimize Widget' : 'Maximize Widget'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowTimerWidget(false)}
            className="p-1.5 rounded-lg text-slate-400 dark:text-[#8892aa] hover:text-slate-650 dark:hover:text-[#e8eaf0] hover:bg-slate-50 dark:hover:bg-[#2e3347] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form Body */}
      <form className="flex-1 overflow-visible p-5 space-y-3.5">
        
        {/* MANUAL LOG CONTROLS */}
        {timerSubTab === 'Manual' && (
          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="block text-[9px] font-display font-extrabold uppercase tracking-widest text-slate-400">
                Date of Log <span className="text-rose-500">*</span>
              </label>
              <DatePickerWidget
                startDate={parseDateStr(manualLogDate)}
                endDate={parseDateStr(manualLogDate)}
                onRangeChange={(start) => {
                  setManualLogDate(getLocalDateString(start))
                }}
                singleDateOnly={true}
                variant="input-field"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="block text-[9px] font-display font-extrabold uppercase tracking-widest text-slate-400">
                  Start Time <span className="text-rose-500">*</span>
                </label>
                <TimePicker
                  value={manualStartTime}
                  onChange={setManualStartTime}
                  variant="input-field"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-display font-extrabold uppercase tracking-widest text-slate-400">
                  End Time <span className="text-rose-500">*</span>
                </label>
                <TimePicker
                  value={manualEndTime}
                  onChange={setManualEndTime}
                  variant="input-field"
                />
              </div>
            </div>
          </div>
        )}

        {/* Metadata Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="sm:col-span-2 space-y-1">
            <label className="block text-[9px] font-display font-extrabold uppercase tracking-widest text-slate-400">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <DropdownSelect
              value={timerSubTab === 'Timer' ? timerProject : manualProject}
              onChange={val => (timerSubTab === 'Timer' ? setTimerProject(val) : setManualProject(val))}
              options={projectDropdownOptions}
              placeholder={timerSubTab === 'Timer' ? 'Learning And Development' : 'Select Project *'}
              variant="input-field"
            />
          </div>

          <div className="sm:col-span-1 space-y-1">
            <label className="block text-[9px] font-display font-extrabold uppercase tracking-widest text-slate-400">
              Ticket ID
            </label>
            <DropdownSelect
              value={""}
              onChange={() => {}}
              options={ticketDropdownOptions}
              placeholder="Select Ticket"
              variant="input-field"
            />
          </div>
        </div>

        {/* Task Description */}
        <div className="space-y-1">
          <label className="block text-[9px] font-display font-extrabold uppercase tracking-widest text-slate-400">
            Task Description
          </label>
          <div className="border border-slate-200 dark:border-[#3a4060] rounded-2xl overflow-hidden shadow-xs focus-within:border-[#1490FE] focus-within:ring-4 focus-within:ring-[#1490FE]/10 transition-all bg-white dark:bg-[#2e3347]">
            <textarea
              rows={isExpanded ? 5 : 3.5}
              value={timerSubTab === 'Timer' ? timerDescription : manualDescription}
              onChange={e => (timerSubTab === 'Timer' ? setTimerDescription(e.target.value) : setManualDescription(e.target.value))}
              placeholder={timerSubTab === 'Timer' ? 'What are you working on?' : 'Describe your task details in max 2000 characters *'}
              className="w-full bg-white dark:bg-[#2e3347] dark:text-[#e8eaf0] dark:placeholder-[#6b7595] px-4 py-3 text-xs text-slate-750 outline-none resize-none font-semibold leading-relaxed placeholder-slate-400"
            />
          </div>
        </div>

      </form>

      {/* Footer Controls */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-[#3a4060] bg-slate-50/30 dark:bg-[#1e2236]/50 flex-shrink-0 flex items-center justify-between">
        {timerSubTab === 'Timer' ? (
          <>
            <div className="flex items-center gap-2.5">
              {/* Task chip — uses theme blue in both modes */}
              <span className="bg-[#1490FE]/10 text-[#1490FE] border border-[#1490FE]/20 text-[8px] font-display font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                Task
              </span>
              
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="w-7 h-7 rounded-full bg-[#1490FE] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title={isTimerRunning ? 'Pause Recording' : 'Start Recording'}
              >
                {isTimerRunning ? (
                  <Pause className="w-3.5 h-3.5 fill-white text-white" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                )}
              </button>

              <span className="font-mono text-xs font-black text-slate-800 dark:text-[#e8eaf0] tracking-wider">
                {formatTime(secondsTracked)}
              </span>
            </div>

            <div className="relative">
              <button 
                type="button"
                onClick={() => setSecondsTracked(0)}
                className="w-7 h-7 rounded-full bg-white dark:bg-[#2e3347] hover:bg-slate-100 dark:hover:bg-[#3a4060] border border-slate-200 dark:border-[#3a4060] flex items-center justify-center text-slate-450 dark:text-[#8892aa] transition-all cursor-pointer shadow-xs"
                title="Reset Timer"
              >
                <TimerReset className="w-4 h-4" />
              </button>
              {secondsTracked > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 text-[8px] font-black text-white flex items-center justify-center shadow-xs">
                  1
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Manual Entry chip — uses theme blue in both modes */}
            <span className="bg-[#1490FE]/10 text-[#1490FE] border border-[#1490FE]/20 text-[8px] font-display font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
              Manual Entry
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveManualLog}
                className="bg-[#1490FE] hover:brightness-105 active:scale-98 text-white text-[11px] font-black px-4 py-2 rounded-xl shadow-[0_3px_8px_rgba(20,144,254,0.2)] transition-all cursor-pointer"
              >
                Save Log
              </button>
              <button
                type="button"
                onClick={clearManualLog}
                className="bg-white dark:bg-[#2e3347] hover:bg-slate-100 dark:hover:bg-[#3a4060] text-slate-500 dark:text-[#a8b0c8] border border-slate-200 dark:border-[#3a4060] text-[11px] font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Clear
              </button>
            </div>
          </>
        )}
      </div>

    </div>
  )
}

export default FloatingTimerWidget
