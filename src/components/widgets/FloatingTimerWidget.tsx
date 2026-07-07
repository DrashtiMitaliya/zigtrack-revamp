import React, { useState } from 'react'
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
    isClockedIn,
    secondsTracked,
    setSecondsTracked,
    bottomSeconds,
    availableProjects,
    saveManualLog,
    clearManualLog,
    setActiveTab,
    setShowDayOutModal,
    handleClockIn,
    manualLogDate,
    setManualLogDate
  } = useAppContext()

  // Local interactive layout states
  const [isExpanded, setIsExpanded] = useState(false)


  const parseDateStr = (dateStr: string): Date => {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
    }
    return new Date(2026, 6, 6)
  }

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const handleClockToggle = () => {
    if (isClockedIn) {
      setShowDayOutModal(true)
    } else {
      handleClockIn()
    }
  }

  if (!showTimerWidget) {
    // Collapsed state floating pills
    return (
      <div className="fixed bottom-5 right-5 flex flex-wrap items-center justify-end gap-2 z-35">
        <button
          onClick={() => {
            setShowTimerWidget(true)
            setActiveTab('Timesheet')
          }}
          className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2.5 rounded-full shadow-lg text-xs font-bold transition-all hover:scale-103 active:scale-97"
        >
          <AlarmClock className="w-4 h-4" />
          Time Log
        </button>
        <button
          onClick={handleClockToggle}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-xs font-bold transition-all hover:scale-103 active:scale-97 ${
            isClockedIn 
              ? 'bg-gradient-to-r from-zg-coral to-rose-500 hover:brightness-105 text-white' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isClockedIn ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isClockedIn ? `Clock Out  ${formatTime(bottomSeconds)}` : 'Clock In'}
        </button>
      </div>
    )
  }

  // Dynamic layout styling: Solid green background to match Screenshot 3
  const containerClass = 'bg-[#10B981] border border-[#0d9488]/30 shadow-[0_25px_60px_rgba(0,0,0,0.3)] text-white'

  const headerIconColor = 'text-white/70 hover:text-white'
  const dividerClass = 'bg-white/25'
  const labelClass = 'text-white/80'

  const textareaClass = 'w-full bg-white/10 border border-white/20 rounded-2xl p-3.5 text-xs text-white leading-relaxed outline-none resize-none placeholder-white/40 focus:bg-white/15 focus:border-white/30 transition-all font-medium'


  // Dropdown list mappings
  const projectDropdownOptions = availableProjects.map(p => ({ value: p, label: p }))
  const ticketDropdownOptions = [
    { value: 'ZIG-219', label: 'ZIG-219' },
    { value: 'ZIG-220', label: 'ZIG-220' },
    { value: 'ZIG-221', label: 'ZIG-221' }
  ]

  return (
    <>
      <div className="fixed inset-0 z-30 pointer-events-none" />
      <div
        className={`fixed bottom-[76px] right-4 left-4 sm:left-auto z-40 transition-all duration-300 ${
          isExpanded ? 'sm:w-[720px]' : 'sm:w-[540px]'
        }`}
      >
        <div className={`rounded-3xl overflow-hidden ${containerClass}`}>
          {/* Header tabs bar */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-3.5 text-white text-sm font-semibold select-none">
              <button
                type="button"
                onClick={() => setTimerSubTab('Timer')}
                className={`flex items-center gap-1.5 transition-all py-1 border-b-2 ${
                  timerSubTab === 'Timer' ? 'font-black opacity-100 border-white' : 'font-bold opacity-75 hover:opacity-100 border-transparent'
                }`}
              >
                <AlarmClock className="w-3.5 h-3.5" />
                Timer
              </button>
              <span className="text-white/30 font-normal">|</span>
              <button
                type="button"
                onClick={() => setTimerSubTab('Manual')}
                className={`flex items-center gap-1.5 transition-all py-1 border-b-2 ${
                  timerSubTab === 'Manual' ? 'font-black opacity-100 border-white' : 'font-bold opacity-75 hover:opacity-100 border-transparent'
                }`}
              >
                <Pencil className="w-3.5 h-3.5" />
                Manual
              </button>
            </div>

            <div className="flex items-center gap-1">
              {/* Maximize/Minimize Layout Button */}
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className={`p-1.5 rounded-xl transition-colors ${headerIconColor} hidden sm:inline-block`}
                title={isExpanded ? 'Minimize Widget' : 'Maximize Widget'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowTimerWidget(false)}
                className={`p-1.5 rounded-xl transition-colors ${headerIconColor}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className={`h-px mx-5 ${dividerClass}`} />

          {/* Body Content */}
          <div className="p-5 space-y-4">
            
            {/* MANUAL INPUT CONTROLS */}
            {timerSubTab === 'Manual' && (
              <div className="space-y-3">
                {/* Date Display (Using DatePickerWidget) */}
                <div className="space-y-1.5">
                  <label className={`block text-[9px] font-display font-extrabold uppercase tracking-wider ${labelClass}`}>
                    Date of Log
                  </label>
                  <DatePickerWidget
                    startDate={parseDateStr(manualLogDate)}
                    endDate={parseDateStr(manualLogDate)}
                    onRangeChange={(start) => {
                      setManualLogDate(getLocalDateString(start))
                    }}
                    singleDateOnly={true}
                    variant="green-glass"
                  />
                </div>

                {/* Time range inputs side-by-side using the custom TimePicker */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className={`block text-[9px] font-display font-extrabold uppercase tracking-wider ${labelClass}`}>
                      Start Time
                    </label>
                    <TimePicker
                      value={manualStartTime}
                      onChange={setManualStartTime}
                      variant="dark-glass"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`block text-[9px] font-display font-extrabold uppercase tracking-wider ${labelClass}`}>
                      End Time
                    </label>
                    <TimePicker
                      value={manualEndTime}
                      onChange={setManualEndTime}
                      variant="dark-glass"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Metadata Selection fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1.5">
                <label className={`block text-[9px] font-display font-extrabold uppercase tracking-wider ${labelClass}`}>
                  Project Name
                </label>
                <DropdownSelect
                  value={timerSubTab === 'Timer' ? timerProject : manualProject}
                  onChange={val => (timerSubTab === 'Timer' ? setTimerProject(val) : setManualProject(val))}
                  options={projectDropdownOptions}
                  placeholder={timerSubTab === 'Timer' ? 'Learning And Development' : 'Select Project *'}
                  variant="dark-glass"
                />
              </div>

              <div className="sm:col-span-1 space-y-1.5">
                <label className={`block text-[9px] font-display font-extrabold uppercase tracking-wider ${labelClass}`}>
                  Ticket ID
                </label>
                <DropdownSelect
                  value={""}
                  onChange={() => {}}
                  options={ticketDropdownOptions}
                  placeholder="Select Ticket"
                  variant="dark-glass"
                />
              </div>
            </div>

            {/* Task Description */}
            <div className="space-y-1.5">
              <label className={`block text-[9px] font-display font-extrabold uppercase tracking-wider ${labelClass}`}>
                Task Description
              </label>
              <textarea
                rows={isExpanded ? 6 : 4}
                value={timerSubTab === 'Timer' ? timerDescription : manualDescription}
                onChange={e => (timerSubTab === 'Timer' ? setTimerDescription(e.target.value) : setManualDescription(e.target.value))}
                placeholder={timerSubTab === 'Timer' ? 'What are you working on?' : 'Describe your task details in max 2000 characters *'}
                className={textareaClass}
              />
            </div>

            {/* Action Bottom Footer bar */}
            <div className="flex items-center justify-between pt-1">
              {timerSubTab === 'Timer' ? (
                <>
                  {/* Left: Task Badge, Play button, and digits */}
                  <div className="flex items-center gap-3">
                    <span className="bg-white text-zg-coral text-[9px] font-display font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                      Task
                    </span>
                    
                    <button
                      type="button"
                      onClick={handleClockToggle}
                      className="w-9 h-9 rounded-full bg-white text-[#10B981] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
                      title={isClockedIn ? 'Pause Recording' : 'Start Recording'}
                    >
                      {isClockedIn ? (
                        <Pause className="w-4 h-4 fill-[#10B981] text-[#10B981]" />
                      ) : (
                        <Play className="w-4 h-4 fill-[#10B981] text-[#10B981] ml-0.5" />
                      )}
                    </button>

                    <span className="font-mono text-base font-black text-white tracking-wider">
                      {formatTime(secondsTracked)}
                    </span>
                  </div>

                  {/* Right: Reset/Undo Timer */}
                  <div className="relative">
                    <button 
                      type="button"
                      onClick={() => setSecondsTracked(0)}
                      className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all"
                      title="Reset Timer"
                    >
                      <TimerReset className="w-4.5 h-4.5" />
                    </button>
                    {secondsTracked > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-amber-400 text-[9px] font-black text-white flex items-center justify-center shadow-sm">
                        1
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Left: Manual Badge */}
                  <span className="bg-white/15 border border-white/10 text-white text-[9px] font-display font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-lg">
                    Manual Entry
                  </span>

                  {/* Right: Save & Clear buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={saveManualLog}
                      className="bg-white hover:bg-slate-50 text-[#10B981] text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-colors active:scale-97"
                    >
                      Save Log
                    </button>
                    <button
                      type="button"
                      onClick={clearManualLog}
                      className="bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors active:scale-97"
                    >
                      Clear
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
export default FloatingTimerWidget
