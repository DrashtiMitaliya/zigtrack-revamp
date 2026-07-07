import React from 'react'
import {
  Clock,
  AlarmClock,
  LayoutDashboard,
  Bell,
  Menu,
  Play,
  Pause
} from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { DatePickerWidget, SubTabBar } from '../common'
import FloatingTimerWidget from '../widgets/FloatingTimerWidget'

interface HeaderProps {
  onMenuClick?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const {
    activeTab,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    taskTimeLogView,
    setTaskTimeLogView,
    isTimerRunning,
    setIsTimerRunning,
    secondsTracked,
    timerProject,
    showTimerWidget,
    setShowTimerWidget
  } = useAppContext()

  const viewTabs = [
    { key: 'Daily' as const, label: 'Daily' },
    { key: 'Weekly' as const, label: 'Weekly' },
  ]



  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  return (
    <header
      className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 z-[var(--z-header)] flex-shrink-0 gap-3"
      role="banner"
    >
      {/* ── Left: hamburger (mobile) + page title ── */}
      <div className="flex items-center gap-2.5 flex-shrink-0 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors flex-shrink-0 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page icon */}
        <div className="p-1.5 rounded-lg bg-[#D9E8F5] text-[#1490FE] flex-shrink-0">
          {activeTab === 'Clock In/Out' ? (
            <Clock className="w-4 h-4" aria-hidden="true" />
          ) : (activeTab === 'Timesheet' || activeTab === 'Timesheet Manage' || activeTab === 'Timesheet Status') ? (
            <AlarmClock className="w-4 h-4" aria-hidden="true" />
          ) : (
            <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
          )}
        </div>

        <h1 className="font-display font-bold text-[16px] text-slate-800 tracking-tight truncate">
          {(activeTab === 'Timesheet' || activeTab === 'Timesheet Manage') ? 'Task Time Log' : activeTab}
        </h1>
      </div>

      {/* ── Right controls ──────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto flex-shrink-0">
        {/* Clock In/Out date picker */}
        {activeTab === 'Clock In/Out' && (
          <DatePickerWidget
            startDate={startDate}
            endDate={endDate}
            onRangeChange={(start, end) => {
              setStartDate(start)
              setEndDate(end)
            }}
            singleDateOnly={true}
          />
        )}

        {/* Timesheet controls */}
        {(activeTab === 'Timesheet' || activeTab === 'Timesheet Manage') && (
          <div className="flex items-center gap-2">
            {/* Date range picker */}
            <DatePickerWidget
              startDate={startDate}
              endDate={endDate}
              onRangeChange={(start, end) => {
                setStartDate(start)
                setEndDate(end)
              }}
              viewMode={taskTimeLogView}
            />

            {/* Daily / Weekly toggle - hidden on mobile/tablet */}
            <div className="hidden md:block">
              <SubTabBar
                tabs={viewTabs}
                activeTab={taskTimeLogView}
                onTabChange={setTaskTimeLogView}
              />
            </div>
          </div>
        )}


        {/* Header Active Time Tracker (Beside notifications) */}
        <div className="relative flex items-center header-time-tracker">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 pl-3.5 pr-2 py-1 rounded-full shadow-xs">
            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setShowTimerWidget(!showTimerWidget)}>
              <span className={`w-1.5 h-1.5 rounded-full ${isTimerRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-350'}`} />
              <span className="font-mono text-xs font-black text-slate-800 tracking-wider">
                {formatTime(secondsTracked)}
              </span>
              {timerProject && (
                <span className="hidden md:inline text-[9px] font-extrabold text-[#1490FE] bg-blue-50 border border-blue-100/50 px-2 py-0.5 rounded-md truncate max-w-[100px]" title={timerProject}>
                  {timerProject}
                </span>
              )}
            </div>
            
            <span className="w-px h-3.5 bg-slate-200" />
            
            <button
              type="button"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer text-white shadow-xs ${
                isTimerRunning
                  ? 'bg-gradient-to-r from-[#FF6347] to-rose-500'
                  : 'bg-emerald-600 hover:bg-emerald-550'
              }`}
              title={isTimerRunning ? 'Pause Time Log' : 'Start Time Log'}
            >
              {isTimerRunning ? (
                <Pause className="w-2.5 h-2.5 fill-white text-white" />
              ) : (
                <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
              )}
            </button>
          </div>

          <FloatingTimerWidget />
        </div>

        {/* Notification bell */}
        <button
          className="relative p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors flex-shrink-0 cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px]" />
          <span
            className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#FF6347] border border-white"
            aria-label="Unread notifications"
          />
        </button>
      </div>
    </header>
  )
}

export default Header
