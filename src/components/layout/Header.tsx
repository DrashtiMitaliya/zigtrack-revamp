import React from 'react'
import {
  Clock,
  AlarmClock,
  LayoutDashboard,
  Bell,
  Menu
} from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { DatePickerWidget, DropdownSelect, SubTabBar } from '../common'

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
    setTaskTimeLogView
  } = useAppContext()

  const viewTabs = [
    { key: 'Daily' as const, label: 'Daily' },
    { key: 'Weekly' as const, label: 'Weekly' },
  ]

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
          className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors flex-shrink-0"
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

        {/* Dashboard pending dropdown */}
        {activeTab === 'Dashboards' && (
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider whitespace-nowrap">
              PENDING:
            </span>
            <DropdownSelect
              value="29-06-2026 To 05-07-2026"
              onChange={() => {}}
              variant="small"
              options={[{ value: '29-06-2026 To 05-07-2026', label: '29-06-2026 To 05-07-2026' }]}
            />
          </div>
        )}

        {/* Notification bell */}
        <button
          className="relative p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors flex-shrink-0"
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
