import React from 'react'
import {
  Clock,
  AlarmClock,
  LayoutDashboard,
  Bell
} from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { DatePickerWidget, DropdownSelect } from '../common'

export const Header: React.FC = () => {
  const {
    activeTab,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    taskTimeLogView,
    setTaskTimeLogView,
    setTimelogSearchQuery,
    setTimelogProjectFilter,
    setTimelogTypeFilter
  } = useAppContext()

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-30 flex-shrink-0 gap-4">
      {/* Left Title block */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div className="p-1.5 rounded-lg bg-blue-50 text-[#1490FE]">
          {activeTab === 'Clock In/Out' ? <Clock className="w-4 h-4" />
            : activeTab === 'Timesheet' ? <AlarmClock className="w-4 h-4" />
              : <LayoutDashboard className="w-4 h-4" />}
        </div>
        <h1 className="font-display font-bold text-[16px] text-slate-800 tracking-tight">
          {activeTab === 'Timesheet' ? 'Task Time Log' : activeTab}
        </h1>
      </div>

      {/* Right Controls block - aligned using justify-end / ml-auto */}
      <div className="flex items-center gap-4 ml-auto flex-shrink-0">
        {/* Clock In/Out Date Picker */}
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

        {/* Timesheet header controls */}
        {activeTab === 'Timesheet' && (
          <div className="flex items-center gap-3">
            <DatePickerWidget
              startDate={startDate}
              endDate={endDate}
              onRangeChange={(start, end) => {
                setStartDate(start)
                setEndDate(end)
              }}
              viewMode={taskTimeLogView}
            />

            {/* Daily/Weekly Toggle */}
            <div className="flex bg-slate-100 rounded-xl p-0.5">
              {(['Daily', 'Weekly'] as const).map(v => {
                const isActive = taskTimeLogView === v
                return (
                  <button key={v} onClick={() => setTaskTimeLogView(v)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-[#10B981] text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}>
                    {v}
                  </button>
                )
              })}
            </div>

            {/* Filter Action Buttons */}
            <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
              <button onClick={() => {}} className="bg-[#FF6347] hover:bg-[#e05439] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-colors">
                Apply Filter
              </button>
              <button onClick={() => {
                setTimelogSearchQuery('')
                setTimelogProjectFilter('All')
                setTimelogTypeFilter('All')
                const today = new Date(2026, 6, 6)
                setStartDate(today)
                setEndDate(today)
              }} className="border border-[#FF6347] text-[#FF6347] hover:bg-[#FF6347]/5 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors">
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Specific dropdown */}
        {activeTab === 'Dashboards' && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider whitespace-nowrap">PENDING:</span>
            <DropdownSelect
              value="29-06-2026 To 05-07-2026"
              onChange={() => {}}
              variant="small"
              options={[{ value: '29-06-2026 To 05-07-2026', label: '29-06-2026 To 05-07-2026' }]}
            />
          </div>
        )}

        {/* Notification Bell */}
        <button className="relative p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#FF6347] border border-white"></span>
        </button>
      </div>
    </header>
  )
}
export default Header
