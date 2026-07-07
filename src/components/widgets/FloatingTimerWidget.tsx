import React, { useState } from 'react'
import {
  AlarmClock,
  Pencil,
  Maximize2,
  Minimize2,
  X,
  Play,
  Pause,
  TimerReset,
  Clock,
  ChevronDown,
  Calendar,
  Palette
} from 'lucide-react'
import { useAppContext } from '../../context/AppContext'

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
    setIsClockedIn,
    secondsTracked,
    bottomSeconds,
    availableProjects,
    saveManualLog,
    clearManualLog,
    setActiveTab
  } = useAppContext()

  // Local interactive layout states
  const [isExpanded, setIsExpanded] = useState(false)
  const [isThemeBg, setIsThemeBg] = useState(true) // Defaults to deep dark theme

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  if (!showTimerWidget) {
    // Collapsed state
    return (
      <div className="fixed bottom-5 right-5 flex items-center gap-2 z-30">
        <button
          onClick={() => {
            setShowTimerWidget(true)
            setActiveTab('Timesheet')
          }}
          className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2.5 rounded-full shadow-lg text-xs font-bold transition-all hover:shadow-xl"
        >
          <AlarmClock className="w-4 h-4" />
          Time Log
        </button>
        <button
          onClick={() => setIsClockedIn(!isClockedIn)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-xs font-bold transition-all hover:shadow-xl ${
            isClockedIn ? 'bg-[#FF6347] hover:bg-[#e05439] text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isClockedIn ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isClockedIn ? `Clock Out  ${formatTime(bottomSeconds)}` : 'Clock In'}
        </button>
      </div>
    )
  }

  // Dynamic layout styling based on theme:
  // True = Premium Zignuts Midnight Dark (#061D42 to Chinese Black #141414)
  // False = Premium Clean Light Card
  const containerClass = isThemeBg
    ? 'bg-gradient-to-br from-[#061D42] via-[#0b1625] to-[#141414] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.55)] text-white'
    : 'bg-white border border-slate-200/80 shadow-[0_15px_50px_rgba(0,0,0,0.08)] text-slate-800'

  const tabContainerClass = isThemeBg
    ? 'flex flex-row items-center bg-black/25 rounded-2xl p-1 border border-white/5'
    : 'flex flex-row items-center bg-slate-100 rounded-2xl p-1'

  const tabButtonClass = (isActive: boolean) =>
    `flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
      isActive
        ? isThemeBg
          ? 'bg-white text-[#1490FE] shadow-sm'
          : 'bg-white text-slate-800 shadow-xs'
        : isThemeBg
        ? 'text-white/60 hover:text-white'
        : 'text-slate-500 hover:text-slate-800'
    }`

  const headerIconColor = isThemeBg ? 'text-white/50 hover:text-white' : 'text-slate-400 hover:text-slate-650'
  const dividerClass = isThemeBg ? 'bg-white/10' : 'bg-slate-150'
  const labelClass = isThemeBg ? 'text-white/50' : 'text-slate-400'

  const inputClass = isThemeBg
    ? 'w-full bg-slate-900/60 border border-white/10 text-white text-xs font-semibold py-2.5 pl-3 pr-8 rounded-xl outline-none appearance-none cursor-pointer hover:bg-slate-900/80 focus:bg-slate-900 transition-all'
    : 'w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-2.5 pl-3 pr-8 rounded-xl outline-none appearance-none cursor-pointer hover:bg-slate-100/50 focus:border-[#1490FE]/40 focus:bg-white transition-all'

  const selectColorStyle = {
    color: timerSubTab === 'Manual' && !manualProject ? (isThemeBg ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)') : (isThemeBg ? 'white' : '#334155')
  }

  const textareaClass = isThemeBg
    ? 'w-full bg-slate-900/60 border border-white/10 rounded-2xl p-3.5 text-xs text-white leading-relaxed outline-none resize-none placeholder-white/35 hover:bg-slate-900/80 focus:bg-slate-900 transition-all'
    : 'w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700 leading-relaxed outline-none resize-none placeholder-slate-400 hover:bg-slate-100/50 focus:border-[#1490FE]/40 focus:bg-white transition-all'

  const timerPanelClass = isThemeBg
    ? 'bg-black/15 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4'
    : 'bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4'

  const timerClockClass = isThemeBg ? 'text-white' : 'text-slate-800'

  const activeDotClass = isThemeBg
    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)] animate-pulse'
    : 'bg-[#1490FE] shadow-[0_0_8px_rgba(20,144,254,0.5)] animate-pulse'

  const footerBadgeClass = isThemeBg
    ? 'bg-white/10 text-white/80 border border-white/10'
    : 'bg-slate-100 text-slate-500 border border-slate-200'

  const playBtnClass = 'w-11 h-11 rounded-full bg-[#1490FE] hover:bg-[#0070DF] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all'

  const resetBtnClass = isThemeBg
    ? 'w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors'
    : 'w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-650 hover:bg-slate-100 transition-colors'

  const manualDatePanelClass = isThemeBg
    ? 'bg-black/15 border border-white/5 rounded-2xl p-3.5 flex items-center justify-between'
    : 'bg-slate-50 border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between'

  const manualDateTextClass = isThemeBg ? 'text-white' : 'text-slate-700'
  const manualDateLinkClass = isThemeBg
    ? 'text-[#1490FE] underline decoration-dotted decoration-[#1490FE]/50 cursor-pointer hover:opacity-85'
    : 'text-[#1490FE] underline decoration-dotted decoration-[#1490FE]/50 cursor-pointer hover:opacity-85'

  const manualInputClass = isThemeBg
    ? 'w-full bg-slate-900/60 border border-white/10 text-white text-xs font-semibold py-2.5 pl-3 pr-9 rounded-xl outline-none focus:bg-slate-900'
    : 'w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-2.5 pl-3 pr-9 rounded-xl outline-none focus:border-[#1490FE]/40 focus:bg-white'

  const saveBtnClass = 'bg-[#1490FE] hover:bg-[#0070DF] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-sm transition-colors'

  const clearBtnClass = isThemeBg
    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors'
    : 'bg-slate-50 hover:bg-slate-100 text-slate-650 border border-slate-250 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors'

  return (
    <>
      <div className="fixed inset-0 z-35 pointer-events-none" />
      <div
        className={`fixed bottom-[76px] right-5 z-40 transition-all duration-300 ${
          isExpanded ? 'w-[640px]' : 'w-[480px]'
        }`}
      >
        <div className={`rounded-3xl overflow-hidden ${containerClass}`}>
          {/* Header tabs bar */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className={tabContainerClass}>
              {(['Timer', 'Manual'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTimerSubTab(t)}
                  className={tabButtonClass(timerSubTab === t)}
                >
                  {t === 'Timer' ? (
                    <>
                      <AlarmClock className="w-3.5 h-3.5" />
                      Timer
                    </>
                  ) : (
                    <>
                      <Pencil className="w-3.5 h-3.5" />
                      Manual
                    </>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Color Theme Switcher Button */}
              <button
                onClick={() => setIsThemeBg(!isThemeBg)}
                className={`p-1.5 rounded-lg transition-colors ${headerIconColor}`}
                title="Toggle Theme Background"
              >
                <Palette className="w-4 h-4" />
              </button>

              {/* Maximize/Minimize Layout Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`p-1.5 rounded-lg transition-colors ${headerIconColor}`}
                title={isExpanded ? 'Minimize Widget' : 'Maximize Widget'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setShowTimerWidget(false)}
                className={`p-1.5 rounded-lg transition-colors ${headerIconColor}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className={`h-px mx-5 ${dividerClass}`} />

          {/* Body Content */}
          <div className="p-5 space-y-4">
            
            {/* RESTURED: TIMER CONTROL ROW ON TOP OF BODY */}
            {timerSubTab === 'Timer' && (
              <div className={timerPanelClass}>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-3xl font-black tracking-widest ${timerClockClass}`}>
                    {formatTime(secondsTracked)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${activeDotClass}`} />
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider hidden sm:inline">
                      {isClockedIn ? 'Recording' : 'Paused'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Reset button next to Play */}
                  <div className="relative cursor-pointer hover:opacity-85 transition-opacity">
                    <button className={resetBtnClass} title="Reset Timer">
                      <TimerReset className="w-4 h-4" />
                    </button>
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-[9px] font-black text-white flex items-center justify-center shadow-sm">1</span>
                  </div>
                  
                  {/* Play / Pause Toggle Button */}
                  <button
                    onClick={() => setIsClockedIn(!isClockedIn)}
                    className={playBtnClass}
                    title={isClockedIn ? 'Pause Timer' : 'Start Timer'}
                  >
                    {isClockedIn ? (
                      <Pause className="w-4.5 h-4.5 fill-white text-white" />
                    ) : (
                      <Play className="w-4.5 h-4.5 fill-white text-white ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* RESTURED: MANUAL INPUT CONTROLS ON TOP OF BODY */}
            {timerSubTab === 'Manual' && (
              <div className="space-y-3">
                {/* Date Display */}
                <div className={manualDatePanelClass}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#1490FE]" />
                    <span className={`text-xs font-bold ${manualDateTextClass}`}>Date of Log</span>
                  </div>
                  <span className={manualDateLinkClass}>
                    Mon, Jul 06, 2026
                  </span>
                </div>

                {/* Time range inputs side-by-side */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className={`block text-[9px] font-extrabold uppercase tracking-wider ${labelClass}`}>Start Time</label>
                    <div className="relative">
                      <input
                        type="time"
                        value={manualStartTime}
                        onChange={e => setManualStartTime(e.target.value)}
                        className={manualInputClass}
                      />
                      <Clock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={`block text-[9px] font-extrabold uppercase tracking-wider ${labelClass}`}>End Time</label>
                    <div className="relative">
                      <input
                        type="time"
                        value={manualEndTime}
                        onChange={e => setManualEndTime(e.target.value)}
                        className={manualInputClass}
                      />
                      <Clock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={`h-px ${dividerClass}`} />

            {/* Metadata Context fields */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1">
                <label className={`block text-[9px] font-extrabold uppercase tracking-wider ${labelClass}`}>
                  Project Name
                </label>
                <div className="relative">
                  <select
                    value={timerSubTab === 'Timer' ? timerProject : manualProject}
                    onChange={e => (timerSubTab === 'Timer' ? setTimerProject(e.target.value) : setManualProject(e.target.value))}
                    className={inputClass}
                    style={selectColorStyle}
                  >
                    <option value="" className="text-slate-800">
                      {timerSubTab === 'Timer' ? 'Learning And D...' : 'Select Project *'}
                    </option>
                    {availableProjects.map(p => (
                      <option key={p} value={p} className="text-slate-800">
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="col-span-1 space-y-1">
                <label className={`block text-[9px] font-extrabold uppercase tracking-wider ${labelClass}`}>
                  Ticket ID
                </label>
                <div className="relative">
                  <select className={inputClass}>
                    <option className="text-slate-800">Select Ticket</option>
                    <option className="text-slate-800">ZIG-219</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Task Description */}
            <div className="space-y-1">
              <label className={`block text-[9px] font-extrabold uppercase tracking-wider ${labelClass}`}>
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
              <span className={`text-[9px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full ${footerBadgeClass}`}>
                {timerSubTab === 'Timer' ? 'Task Entry' : 'Manual Entry'}
              </span>

              {timerSubTab === 'Manual' ? (
                <div className="flex gap-2">
                  <button
                    onClick={saveManualLog}
                    className={saveBtnClass}
                  >
                    Save Log
                  </button>
                  <button
                    onClick={clearManualLog}
                    className={clearBtnClass}
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <span className="text-[10px] font-semibold text-slate-400">
                  Logs save automatically on Stop
                </span>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
export default FloatingTimerWidget
