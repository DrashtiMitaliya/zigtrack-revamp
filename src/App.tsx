import React, { useState, useEffect } from 'react'
import {
  Clock,
  Briefcase,
  LayoutDashboard,
  FileText,
  TrendingUp,
  Settings,
  HelpCircle,
  MessageSquare,
  Plus,
  ChevronDown,
  Bell,
  ChevronRight,
  ChevronLeft,
  X,
  Copy,
  List,
  ClipboardList,
  MinusCircle,
  Play,
  Pause,
  Maximize2,
  Calendar,
  Activity,
  UserCheck,
  ArrowDownRight,
  ArrowUpLeft,
  CalendarRange,
  Clock3,
  Fingerprint,
  Zap,
  PieChart,
  Pencil,
  Trash2,
  Check,
  Download,
  AlarmClock,
  TimerReset,
  Search,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react'

// ─── Interfaces ────────────────────────────────────────────────────────────────
interface TimeLog {
  id: number
  project: string
  description: string
  duration: string
  fullDescription: string
}

interface ProjectTime {
  name: string
  duration: string
  hours: number
  percent: number
  color: string
}

interface WatchlistProject {
  id: string
  name: string
}

interface ActivityHistory {
  id: number
  user: string
  action: 'Day In' | 'Day Out'
  timestamp: string
  relativeTime: string
}

interface ClockSession {
  id: number
  inTime: string
  outTime: string
  duration: string
  isActive?: boolean
}

interface BiometricLog {
  id: number
  user: string
  type: 'clock-in' | 'clock-out'
  time: string
  location: string
  relativeTime: string
}

interface Project {
  id: number
  name: string
  scope: string[]
  costType: string
  expectedStartDate: string
  expectedEndDate: string
  actualStartDate: string
  actualEndDate: string
  members: string[]
  status: 'In Progress' | 'Completed' | 'On Hold'
  timeSpent: string
  timeBillable: string
  maxTimePlanned: string
  color: string
}

interface TaskTimeEntry {
  id: number
  description: string
  project: string
  projectColor: string
  entryType: 'Task' | 'Manual'
  timeRange: string
  duration: string
  canEdit: boolean
  date: string
  ticket?: string
}

// ─── REUSABLE COMPONENTS ───────────────────────────────────────────────────────

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  variant?: 'light' | 'dark-glass' | 'small';
  className?: string;
  id?: string;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  variant = 'light',
  className = '',
  id,
}) => {
  let baseClass = "appearance-none w-full font-semibold text-xs py-2 pl-3.5 pr-9 rounded-xl outline-none cursor-pointer transition-all "
  let iconColor = "text-slate-400"

  if (variant === 'light') {
    baseClass += "bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-300 focus:border-[#1490FE]/40 focus:bg-white"
  } else if (variant === 'dark-glass') {
    baseClass += "bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/15"
    iconColor = "text-white/60"
  } else if (variant === 'small') {
    baseClass = "appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-[11px] py-1.5 pl-2.5 pr-6 rounded-lg outline-none cursor-pointer transition-all hover:border-slate-300"
  }

  return (
    <div className={`relative ${variant === 'small' ? 'inline-block' : 'w-full'} ${className}`}>
      <select
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={baseClass}
        style={variant === 'dark-glass' && !value ? { color: 'rgba(255,255,255,0.5)' } : {}}
      >
        {placeholder && <option value="" className={variant === 'dark-glass' ? 'text-slate-800' : ''}>{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className={variant === 'dark-glass' ? 'text-slate-800' : ''}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className={`w-3.5 h-3.5 ${iconColor} absolute ${variant === 'small' ? 'right-2' : 'right-2.5'} top-1/2 -translate-y-1/2 pointer-events-none`} />
    </div>
  )
}

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#1490FE]/40 focus:bg-white transition-all text-slate-700 placeholder-slate-400"
      />
    </div>
  )
}

interface ExportButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
  variant?: 'toolbar' | 'group';
}

const ExportButton: React.FC<ExportButtonProps> = ({
  onClick,
  label = "Export",
  className = '',
  variant = 'toolbar',
}) => {
  if (variant === 'group') {
    return (
      <button
        onClick={onClick}
        className={`p-1.5 bg-white text-[#1490FE] hover:bg-[#1490FE] hover:text-white rounded-lg border border-slate-200 shadow-2xs hover:border-[#1490FE] transition-colors ${className}`}
        title="Export group logs"
      >
        <Download className="w-3.5 h-3.5" />
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 text-xs font-bold text-[#1490FE] bg-[#1490FE]/8 border border-[#1490FE]/15 hover:bg-[#1490FE] hover:text-white px-3.5 py-2 rounded-xl shadow-xs transition-all ${className}`}
    >
      <Download className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  )
}

interface DatePickerWidgetProps {
  startDate: Date;
  endDate: Date;
  onRangeChange: (start: Date, end: Date) => void;
  viewMode?: 'Daily' | 'Weekly';
  singleDateOnly?: boolean;
  className?: string;
}

const DatePickerWidget: React.FC<DatePickerWidgetProps> = ({
  startDate,
  endDate,
  onRangeChange,
  viewMode = 'Daily',
  singleDateOnly = false,
  className = '',
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [tempStartDate, setTempStartDate] = useState<Date>(startDate)
  const [tempEndDate, setTempEndDate] = useState<Date>(endDate)
  const [activePreset, setActivePreset] = useState<string>('Custom Range')
  const [calendarMonth, setCalendarMonth] = useState<number>(startDate.getMonth())
  const [calendarYear, setCalendarYear] = useState<number>(startDate.getFullYear())

  useEffect(() => {
    if (showDatePicker) {
      setTempStartDate(startDate)
      setTempEndDate(endDate)
      setCalendarMonth(startDate.getMonth())
      setCalendarYear(startDate.getFullYear())
    }
  }, [showDatePicker, startDate, endDate])

  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDateString = (d: Date) => {
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' })
  }

  const formatDateShort = (d: Date) => {
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
  }

  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1)
    const startDayOfWeek = firstDay.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const prevDaysInMonth = new Date(year, month, 0).getDate()

    const days: { date: Date; isCurrentMonth: boolean }[] = []

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevDaysInMonth - i),
        isCurrentMonth: false,
      })
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      })
    }
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      })
    }
    return days
  }

  const handlePresetClick = (preset: string) => {
    setActivePreset(preset)
    const today = new Date(2026, 6, 6) // Mocking today as July 6, 2026
    let start = new Date(today)
    let end = new Date(today)

    if (preset === 'Today') {
      // already set
    } else if (preset === 'Yesterday') {
      start.setDate(today.getDate() - 1)
      end.setDate(today.getDate() - 1)
    } else if (preset === 'Last 7 Days') {
      start.setDate(today.getDate() - 6)
    } else if (preset === 'Last 2 Weeks') {
      start.setDate(today.getDate() - 13)
    } else if (preset === 'This Month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1)
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    } else if (preset === 'Last Month') {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      end = new Date(today.getFullYear(), today.getMonth(), 0)
    } else if (preset === 'Custom Range') {
      return
    }

    if (singleDateOnly) {
      setTempStartDate(start)
      setTempEndDate(start)
      setCalendarMonth(start.getMonth())
      setCalendarYear(start.getFullYear())
    } else {
      setTempStartDate(start)
      setTempEndDate(end)
      setCalendarMonth(start.getMonth())
      setCalendarYear(start.getFullYear())
    }
  }

  const handleDayClick = (dayDate: Date) => {
    setActivePreset('Custom Range')
    if (singleDateOnly) {
      setTempStartDate(dayDate)
      setTempEndDate(dayDate)
      return
    }

    const isSameDate = (d1: Date, d2: Date) => 
      d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()

    if (tempStartDate && tempEndDate && isSameDate(tempStartDate, tempEndDate)) {
      if (dayDate < tempStartDate) {
        setTempStartDate(dayDate)
      } else {
        setTempEndDate(dayDate)
      }
    } else {
      setTempStartDate(dayDate)
      setTempEndDate(dayDate)
    }
  }

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11)
      setCalendarYear(y => y - 1)
    } else {
      setCalendarMonth(m => m - 1)
    }
  }

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0)
      setCalendarYear(y => y + 1)
    } else {
      setCalendarMonth(m => m + 1)
    }
  }

  const shiftRange = (direction: 'prev' | 'next') => {
    const daysToShift = singleDateOnly ? 1 : (viewMode === 'Daily' ? 1 : 7)
    const multiplier = direction === 'prev' ? -1 : 1
    
    const newStart = new Date(startDate)
    newStart.setDate(newStart.getDate() + (daysToShift * multiplier))
    const newEnd = new Date(endDate)
    newEnd.setDate(newEnd.getDate() + (daysToShift * multiplier))
    
    onRangeChange(newStart, singleDateOnly ? newStart : newEnd)
  }

  return (
    <div className={`relative flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 ${className}`}>
      {/* Left shift chevron */}
      <button
        type="button"
        onClick={() => shiftRange('prev')}
        className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Date display & dropdown trigger */}
      <button
        type="button"
        onClick={() => setShowDatePicker(!showDatePicker)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg shadow-xs hover:border-[#1490FE]/30 transition-colors"
      >
        <Calendar className="w-3.5 h-3.5 text-[#1490FE]" />
        <span>
          {singleDateOnly || getLocalDateString(startDate) === getLocalDateString(endDate)
            ? formatDateString(startDate)
            : `${formatDateShort(startDate)} - ${formatDateShort(endDate)}`}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {/* Right shift chevron */}
      <button
        type="button"
        onClick={() => shiftRange('next')}
        className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Advanced Datepicker popover overlay */}
      {showDatePicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)} />
          <div className="absolute right-0 top-12 w-[540px] rounded-2xl bg-white shadow-2xl border border-slate-200 p-0 z-50 overflow-hidden flex flex-col">
            <div className="flex min-h-[300px]">
              {/* Presets Sidebar */}
              <div className="w-[180px] bg-slate-50/50 border-r border-slate-200 p-3 flex flex-col gap-1 flex-shrink-0">
                {(singleDateOnly 
                  ? ['Today', 'Yesterday'] 
                  : ['Today', 'Yesterday', 'Last 7 Days', 'Last 2 Weeks', 'This Month', 'Last Month', 'Custom Range']
                ).map(preset => {
                  const isPresetActive = activePreset === preset
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        isPresetActive
                          ? 'bg-[#1490FE]/10 text-[#1490FE]'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {preset}
                    </button>
                  )
                })}
              </div>

              {/* Calendar Grid */}
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex justify-between items-center mb-3">
                  <button type="button" onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs font-display font-bold text-slate-700">
                    {new Date(calendarYear, calendarMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button type="button" onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                </div>

                {/* Weekdays */}
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                    <span key={d} className="text-[10px] font-bold text-[#1490FE] py-1">{d}</span>
                  ))}
                </div>

                {/* Days cells */}
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {getDaysInMonth(calendarYear, calendarMonth).map(({ date: dayDate, isCurrentMonth }, idx) => {
                    const dStr = getLocalDateString(dayDate)
                    const sStr = getLocalDateString(tempStartDate)
                    const eStr = getLocalDateString(tempEndDate)
                    const isStart = dStr === sStr
                    const isEnd = dStr === eStr
                    const inRange = !singleDateOnly && dStr > sStr && dStr < eStr

                    let cellStyle = "text-slate-600 hover:bg-slate-100 rounded-lg"
                    if (!isCurrentMonth) {
                      cellStyle = "text-slate-300 pointer-events-none"
                    }

                    let highlightClass = ""
                    if (isStart) {
                      highlightClass = "bg-[#1490FE] text-white rounded-full font-bold shadow-md"
                    } else if (isEnd && !singleDateOnly) {
                      highlightClass = "bg-slate-700 text-white rounded-full font-bold shadow-md"
                    } else if (inRange) {
                      highlightClass = "bg-[#1490FE]/10 text-[#1490FE]/80 rounded-none"
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleDayClick(dayDate)}
                        className={`h-8 w-8 text-xs font-medium flex items-center justify-center transition-all ${cellStyle} ${highlightClass}`}
                      >
                        {dayDate.getDate()}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  onRangeChange(tempStartDate, tempEndDate)
                  setShowDatePicker(false)
                }}
                className="bg-[#FF6347] hover:bg-[#e05439] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date(2026, 6, 6)
                  setTempStartDate(today)
                  setTempEndDate(today)
                  onRangeChange(today, today)
                  setActivePreset('Today')
                  setCalendarMonth(6)
                  setCalendarYear(2026)
                  setShowDatePicker(false)
                }}
                className="border border-[#FF6347] text-[#FF6347] hover:bg-[#FF6347]/5 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── App ───────────────────────────────────────────────────────────────────────
function App() {
  const [activeTab, setActiveTab] = useState<string>('Dashboards')

  // Projects page state
  const [projectSearch, setProjectSearch] = useState('')
  const [projectStatusFilter, setProjectStatusFilter] = useState('All')
  const [projectsPerPage] = useState(6)

  const [projects] = useState<Project[]>([
    { id: 1, name: 'ES AI Assessment', scope: ['Mobile App-Hybrid', 'Web Application'], costType: 'Dedicated', expectedStartDate: 'Mar 03, 2025', expectedEndDate: 'N/A', actualStartDate: 'Mar 04, 2025', actualEndDate: 'N/A', members: ['H', 'J', 'M', 'L', 'K'], status: 'In Progress', timeSpent: '24170:12', timeBillable: '21400:53', maxTimePlanned: '3000:00', color: '#1490FE' },
    { id: 2, name: 'Prompts.AI', scope: ['Admin Panel'], costType: 'Dedicated', expectedStartDate: 'Nov 28, 2023', expectedEndDate: 'Feb 29, 2024', actualStartDate: 'Nov 28, 2023', actualEndDate: 'N/A', members: ['A', 'M', 'R'], status: 'In Progress', timeSpent: '31351:50', timeBillable: '29910:23', maxTimePlanned: '718:00', color: '#a855f7' },
    { id: 3, name: 'ShallWe Play', scope: ['Web Application', 'Mobile App-Hybrid'], costType: 'Dedicated', expectedStartDate: 'Jul 21, 2025', expectedEndDate: 'Dec 20, 2025', actualStartDate: 'Jul 21, 2025', actualEndDate: 'N/A', members: ['D', 'J', 'S', 'V', 'Y'], status: 'In Progress', timeSpent: '9252:50', timeBillable: '8817:50', maxTimePlanned: '2200:00', color: '#FF6347' },
    { id: 4, name: 'ZigTrack Support', scope: ['Web Application'], costType: 'Retainer', expectedStartDate: 'Jan 01, 2025', expectedEndDate: 'Dec 31, 2025', actualStartDate: 'Jan 05, 2025', actualEndDate: 'N/A', members: ['P', 'N', 'T'], status: 'In Progress', timeSpent: '5840:30', timeBillable: '5200:00', maxTimePlanned: '1000:00', color: '#10B981' },
    { id: 5, name: 'Freightro', scope: ['Mobile App-Hybrid'], costType: 'Fixed', expectedStartDate: 'Feb 10, 2024', expectedEndDate: 'Aug 30, 2024', actualStartDate: 'Feb 12, 2024', actualEndDate: 'Sep 04, 2024', members: ['A', 'B'], status: 'Completed', timeSpent: '12400:00', timeBillable: '11900:40', maxTimePlanned: '12000:00', color: '#F59E0B' },
    { id: 6, name: 'Tech General', scope: ['Admin Panel', 'Web Application'], costType: 'Dedicated', expectedStartDate: 'Mar 01, 2023', expectedEndDate: 'N/A', actualStartDate: 'Mar 01, 2023', actualEndDate: 'N/A', members: ['D', 'M', 'S', 'V'], status: 'On Hold', timeSpent: '8900:15', timeBillable: '7800:00', maxTimePlanned: '5000:00', color: '#6366f1' },
  ])

  const [isClockedIn, setIsClockedIn] = useState(true)
  const [secondsTracked, setSecondsTracked] = useState(1855)
  const [bottomSeconds, setBottomSeconds] = useState(2566)
  const [clockSubTab, setClockSubTab] = useState<'System' | 'Biometrics'>('System')

  const [watchlist, setWatchlist] = useState<WatchlistProject[]>([{ id: '1', name: 'Freightro' }])
  const [showAddProjectModal, setShowAddProjectModal] = useState(false)
  const [selectedProjectToAdd, setSelectedProjectToAdd] = useState('Freightro')
  const [availableProjects] = useState(['Freightro', 'Tech General', 'Learning and Development', 'ZigTrack Support'])

  const [projectTimes] = useState<ProjectTime[]>([
    { name: 'Tech General', duration: '3hr 44m', hours: 3.73, percent: 58, color: '#1490FE' },
    { name: 'Learning and Development', duration: '2hr 38m', hours: 2.63, percent: 42, color: '#a855f7' },
  ])

  const [timeLogs] = useState<TimeLog[]>([
    { id: 1, project: 'Learning and Development', description: 'Admin Panel > System Config: Working on updating the Writing Config API han...', fullDescription: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', duration: '0hr 0m' },
    { id: 2, project: 'Learning and Development', description: 'Admin Panel > System Config: Working on updating the Writing Config API han...', fullDescription: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', duration: '0hr 12m' },
    { id: 3, project: 'Tech General', description: 'Admin Panel > System Config: Working on updating the Writing Config API han...', fullDescription: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', duration: '1hr 11m' },
    { id: 4, project: 'Tech General', description: 'Admin Panel > System Config: Working on updating the Writing Config API han...', fullDescription: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', duration: '0hr 50m' },
  ])

  const [activityHistory] = useState<ActivityHistory[]>([
    { id: 1, user: 'Drashti Mitaliya', action: 'Day In', timestamp: '2023-01-31 10:00:36', relativeTime: '3 years ago' },
    { id: 2, user: 'Drashti Mitaliya', action: 'Day In', timestamp: '2023-01-30 10:09:10', relativeTime: '3 years ago' },
    { id: 3, user: 'Drashti Mitaliya', action: 'Day Out', timestamp: '2023-01-28 15:04:54', relativeTime: '3 years ago' },
    { id: 4, user: 'Drashti Mitaliya', action: 'Day In', timestamp: '2023-01-28 14:17:00', relativeTime: '3 years ago' },
  ])

  const [clockSessions] = useState<ClockSession[]>([
    { id: 1, inTime: '5:34 PM', outTime: '-', duration: '-', isActive: true },
    { id: 2, inTime: '3:15 PM', outTime: '5:17 PM', duration: '02:02' },
    { id: 3, inTime: '1:30 PM', outTime: '3:14 PM', duration: '01:44' },
    { id: 4, inTime: '10:33 AM', outTime: '1:04 PM', duration: '02:30' },
  ])

  const [biometricLogs] = useState<BiometricLog[]>([
    { id: 1, user: 'Drashti Mitaliya', type: 'clock-in', time: '05:34 pm', location: 'staff passage in', relativeTime: 'an hour ago' },
    { id: 2, user: 'Drashti Mitaliya', type: 'clock-out', time: '05:17 pm', location: 'staff passage out', relativeTime: 'an hour ago' },
    { id: 3, user: 'Drashti Mitaliya', type: 'clock-in', time: '03:15 pm', location: 'staff passage in', relativeTime: '3 hours ago' },
    { id: 4, user: 'Drashti Mitaliya', type: 'clock-out', time: '03:14 pm', location: 'staff passage out', relativeTime: '3 hours ago' },
    { id: 5, user: 'Drashti Mitaliya', type: 'clock-in', time: '01:30 pm', location: 'staff passage in', relativeTime: '5 hours ago' },
    { id: 6, user: 'Drashti Mitaliya', type: 'clock-out', time: '01:04 pm', location: 'staff passage out', relativeTime: '5 hours ago' },
    { id: 7, user: 'Drashti Mitaliya', type: 'clock-in', time: '10:33 am', location: 'staff passage in', relativeTime: '8 hours ago' },
  ])

  // Task Time Log page data
  const [taskTimeLogView, setTaskTimeLogView] = useState<'Daily' | 'Weekly'>('Daily')
  
  // Custom Datepicker state
  const [startDate, setStartDate] = useState<Date>(new Date(2026, 6, 6)) // Jul 6, 2026
  const [endDate, setEndDate] = useState<Date>(new Date(2026, 6, 6))

  // Task entries state with dates and ticket keys
  const [taskEntries, setTaskEntries] = useState<TaskTimeEntry[]>([
    { id: 1, description: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', project: 'Learning and Development', projectColor: '#a855f7', entryType: 'Task', timeRange: '05:47 PM – 06:36 PM', duration: '00:49', canEdit: false, date: '2026-07-06', ticket: '' },
    { id: 2, description: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', project: 'Learning and Development', projectColor: '#a855f7', entryType: 'Manual', timeRange: '05:35 PM – 05:47 PM', duration: '00:12', canEdit: true, date: '2026-07-06', ticket: 'ZIG-219' },
    { id: 3, description: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', project: 'Tech General', projectColor: '#1490FE', entryType: 'Task', timeRange: '04:05 PM – 05:16 PM', duration: '01:11', canEdit: true, date: '2026-07-06', ticket: 'ZIG-219' },
    { id: 4, description: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', project: 'Tech General', projectColor: '#1490FE', entryType: 'Manual', timeRange: '03:15 PM – 04:05 PM', duration: '00:50', canEdit: true, date: '2026-07-06', ticket: '' },
    { id: 5, description: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', project: 'Tech General', projectColor: '#1490FE', entryType: 'Manual', timeRange: '01:31 PM – 03:14 PM', duration: '01:43', canEdit: true, date: '2026-07-06', ticket: '' },
    { id: 6, description: 'Admin Panel > System Config: Initial code review of config metrics API response fields.', project: 'Tech General', projectColor: '#1490FE', entryType: 'Task', timeRange: '10:00 AM – 11:30 AM', duration: '01:30', canEdit: true, date: '2026-07-05', ticket: '' },
    { id: 7, description: 'Learning and Development: Studied Vite and React 19 migration path.', project: 'Learning and Development', projectColor: '#a855f7', entryType: 'Manual', timeRange: '02:00 PM – 03:45 PM', duration: '01:45', canEdit: true, date: '2026-07-05', ticket: '' },
    { id: 8, description: 'ZigTrack Support: Addressed customer reports on biometric logging delays.', project: 'ZigTrack Support', projectColor: '#10B981', entryType: 'Manual', timeRange: '09:15 AM – 10:45 AM', duration: '01:30', canEdit: true, date: '2026-07-04', ticket: 'ZIG-220' },
  ])

  // Inline editing state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDescription, setEditDescription] = useState('')
  const [editProject, setEditProject] = useState('')
  const [editStartTime, setEditStartTime] = useState('')
  const [editEndTime, setEditEndTime] = useState('')
  const [editDuration, setEditDuration] = useState('')
  const [editTicket, setEditTicket] = useState('')
  const [editType, setEditType] = useState<'Task' | 'Manual'>('Manual')

  // Timer widget state
  const [showTimerWidget, setShowTimerWidget] = useState(false)
  const [timerSubTab, setTimerSubTab] = useState<'Timer' | 'Manual'>('Timer')
  const [timerProject, setTimerProject] = useState('Learning And Development')
  const [timerDescription, setTimerDescription] = useState(
    'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.'
  )
  const [manualProject, setManualProject] = useState('')
  const [manualDescription, setManualDescription] = useState('')
  const [manualStartTime, setManualStartTime] = useState('')
  const [manualEndTime, setManualEndTime] = useState('')

  const [expandedLogId, setExpandedLogId] = useState<number | null>(null)
  const [timelogSearchQuery, setTimelogSearchQuery] = useState('')
  const [timelogProjectFilter, setTimelogProjectFilter] = useState('All')
  const [timelogTypeFilter, setTimelogTypeFilter] = useState('All')

  // Live timer
  useEffect(() => {
    let interval: any = null
    if (isClockedIn) {
      interval = setInterval(() => {
        setSecondsTracked((p) => p + 1)
        setBottomSeconds((p) => p + 1)
      }, 1000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [isClockedIn])

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!watchlist.some((p) => p.name === selectedProjectToAdd)) {
      setWatchlist([...watchlist, { id: Date.now().toString(), name: selectedProjectToAdd }])
    }
    setShowAddProjectModal(false)
  }

  const handleCopy = (text: string) => navigator.clipboard.writeText(text)

  // Project colors lookup
  const projectColors: Record<string, string> = {
    'Learning and Development': '#a855f7',
    'Learning And Development': '#a855f7',
    'Tech General': '#1490FE',
    'ZigTrack Support': '#10B981',
    'ES AI Assessment': '#1490FE',
    'Prompts.AI': '#a855f7',
    'ShallWe Play': '#FF6347',
    'Freightro': '#F59E0B',
  }

  // Formatting Date objects to "Mon, Jul 06, 2026"
  const formatDateString = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`
  }


  // Get YYYY-MM-DD local string for sorting/filtering
  const getLocalDateString = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  // Time conversion helpers
  const convertTo24Hour = (timeStr: string) => {
    if (!timeStr) return ''
    const match = timeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i)
    if (!match) return ''
    let hrs = parseInt(match[1], 10)
    const mins = match[2]
    const ampm = match[3].toUpperCase()
    if (ampm === 'PM' && hrs < 12) hrs += 12
    if (ampm === 'AM' && hrs === 12) hrs = 0
    return `${String(hrs).padStart(2, '0')}:${mins}`
  }

  const convertTo12Hour = (timeStr: string) => {
    if (!timeStr) return ''
    const parts = timeStr.split(':')
    if (parts.length < 2) return ''
    let hrs = parseInt(parts[0], 10)
    const mins = parts[1]
    const ampm = hrs >= 12 ? 'PM' : 'AM'
    hrs = hrs % 12
    if (hrs === 0) hrs = 12
    return `${hrs}:${mins} ${ampm}`
  }



  // Dynamic duration updates in inline editing
  useEffect(() => {
    if (editStartTime && editEndTime && editingId !== null) {
      const startParts = editStartTime.split(':')
      const endParts = editEndTime.split(':')
      if (startParts.length === 2 && endParts.length === 2) {
        let startMin = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10)
        let endMin = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10)
        if (endMin < startMin) {
          endMin += 24 * 60
        }
        const diffMin = endMin - startMin
        const hrs = Math.floor(diffMin / 60)
        const mins = diffMin % 60
        setEditDuration(`${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`)
      }
    }
  }, [editStartTime, editEndTime, editingId])

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

  // Calculate total hours of filtered logs
  const calculateTotalDuration = (entries: TaskTimeEntry[]) => {
    let totalMinutes = 0
    entries.forEach(e => {
      const parts = e.duration.split(':')
      if (parts.length === 2) {
        const hrs = parseInt(parts[0], 10) || 0
        const mins = parseInt(parts[1], 10) || 0
        totalMinutes += hrs * 60 + mins
      }
    })
    const h = Math.floor(totalMinutes / 60)
    const m = totalMinutes % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  // Handle Edit Action
  const startEditing = (entry: TaskTimeEntry) => {
    setEditingId(entry.id)
    setEditDescription(entry.description)
    setEditProject(entry.project)
    setEditTicket(entry.ticket || '')
    setEditType(entry.entryType)
    
    const times = entry.timeRange.split(/[–-]/).map(t => t.trim())
    if (times.length === 2) {
      setEditStartTime(convertTo24Hour(times[0]))
      setEditEndTime(convertTo24Hour(times[1]))
    } else {
      setEditStartTime('')
      setEditEndTime('')
    }
    setEditDuration(entry.duration)
  }

  // Handle Save Action
  const saveEditing = (id: number) => {
    setTaskEntries(prev => prev.map(e => {
      if (e.id === id) {
        const formattedRange = `${convertTo12Hour(editStartTime)} – ${convertTo12Hour(editEndTime)}`
        return {
          ...e,
          description: editDescription,
          project: editProject,
          projectColor: projectColors[editProject] || '#6366f1',
          timeRange: formattedRange,
          duration: editDuration,
          ticket: editTicket,
          entryType: editType
        }
      }
      return e
    }))
    setEditingId(null)
  }

  // Handle Delete Action
  const deleteEntry = (id: number) => {
    setTaskEntries(prev => prev.filter(e => e.id !== id))
    if (editingId === id) setEditingId(null)
  }

  const navItems = [
    { name: 'Dashboards', icon: LayoutDashboard },
    { name: 'Clock In/Out', icon: Clock },
    { name: 'Timesheet', icon: FileText, badge: 'Active' },
    { name: 'Projects', icon: Briefcase, hasDot: true },
    { name: 'Reports', icon: TrendingUp },
    { name: 'Board', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-[#F5F7FA] text-[#141414] font-body overflow-hidden">

      {/* ─── SIDEBAR ───────────────────────────────────────────────────────────── */}
      <aside className="w-64 flex flex-col justify-between bg-zg-chinese-black border-r border-zg-gray-800 z-20 shadow-sm flex-shrink-0">
        <div className="p-5 border-b border-zg-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1490FE] to-[#00C6FF] flex items-center justify-center font-display font-black text-white text-xs shadow-[0_4px_12px_rgba(20,144,254,0.2)]">
              {"</>"}
            </div>
            <div>
              <span className="font-display font-bold text-sm text-white block leading-tight">ZigTrack</span>
              <span className="text-[9px] font-display font-bold tracking-widest text-zg-vivid-blue uppercase">TECHNOLAB</span>
            </div>
          </div>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-5">
          <div>
            <p className="text-[9px] font-display font-bold tracking-widest text-zg-gray-500 uppercase px-2 mb-2">WORKSPACES</p>
            <nav className="space-y-0.5">
              {navItems.map(({ name, icon: Icon, badge, hasDot }) => {
                const isActive = activeTab === name
                return (
                  <button key={name} onClick={() => setActiveTab(name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${isActive ? 'bg-zg-vivid-blue/15 text-zg-vivid-blue font-bold border-l-2 border-zg-vivid-blue rounded-l-none' : 'hover:bg-zg-gray-800 text-zg-gray-500 hover:text-white'}`}>
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-zg-vivid-blue' : 'text-zg-gray-500'}`} />
                      <span>{name}</span>
                    </div>
                    {hasDot && !isActive && <span className="w-1.5 h-1.5 rounded-full bg-zg-vivid-blue" />}
                    {badge && <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-zg-vivid-blue/20 text-zg-vivid-blue' : 'bg-zg-gray-800 text-zg-gray-550'}`}>{badge}</span>}
                  </button>
                )
              })}
            </nav>
          </div>

          <div>
            <p className="text-[9px] font-display font-bold tracking-widest text-zg-gray-500 uppercase px-2 mb-2">SUPPORT</p>
            <nav className="space-y-0.5">
              {[{ name: 'Help & Docs', icon: HelpCircle }, { name: 'Feedback', icon: MessageSquare }].map(({ name, icon: Icon }) => (
                <button key={name} onClick={() => setActiveTab(name)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${activeTab === name ? 'bg-zg-vivid-blue/15 text-zg-vivid-blue font-bold border-l-2 border-zg-vivid-blue rounded-l-none' : 'hover:bg-zg-gray-800 text-zg-gray-500 hover:text-white'}`}>
                  <Icon className="w-4 h-4 text-zg-gray-500" />
                  <span>{name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-zg-gray-800 space-y-3">
          <button onClick={() => setActiveTab('Timesheet')}
            className="w-full flex items-center justify-between bg-gradient-to-r from-zg-coral to-rose-500 text-white py-2 px-3.5 rounded-xl text-xs font-semibold shadow-sm hover:brightness-105 transition-all">
            <span>Pending Review</span>
            <span className="bg-white text-rose-600 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]">1</span>
          </button>

          <button onClick={() => setIsClockedIn(!isClockedIn)}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold text-xs transition-all ${isClockedIn ? 'bg-zg-coral/10 text-zg-coral border border-zg-coral/20 hover:bg-zg-coral/20' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}>
            <Clock className="w-4 h-4" />
            {isClockedIn ? 'Day Out (Clock Out)' : 'Day In (Clock In)'}
          </button>

          <div className="flex items-center gap-2.5 pt-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1490FE] to-[#a855f7] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">D</div>
            <div className="min-w-0">
              <span className="font-semibold text-xs text-white block truncate">Dhaval Patel</span>
              <span className="text-[10px] text-zg-gray-500">Software Engineer</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ──────────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">

        {/* HEADER */}
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

        {/* ═══════════════════════════════════════════════════════════════════════
            VIEW: TASK TIME LOG (Timesheet tab)
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Timesheet' && (
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
              
              {/* Dynamic date grouping */}
              {(() => {
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

                if (sortedDates.length === 0) {
                  return (
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
                  )
                }

                return sortedDates.map(dateGroup => {
                  // Construct Date object safely for header text
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

                          // Render standard Row Card
                          return (
                            <div key={entry.id}
                              className="group grid grid-cols-12 gap-3 px-5 py-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all items-center">

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
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              })()}

              {/* Bottom padding for FAB */}
              <div className="h-24" />
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            VIEW: CLOCK IN/OUT
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Clock In/Out' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">

            {/* Hero stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-[#1490FE]" /><span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Shift Progress</span></div>
                  <span className="text-xs font-black text-slate-700">87.5%</span>
                </div>
                <h3 className="text-2xl font-display font-black text-slate-800">07:01 <span className="text-xs text-slate-400 font-semibold">/ 8h</span></h3>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#1490FE] h-full rounded-full" style={{ width: '87.5%' }}></div>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><Clock3 className="w-4 h-4 text-[#1490FE]" /><span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Current Session</span></div>
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                </div>
                <h3 className="text-xl font-display font-bold text-slate-800">Active Now</h3>
                <p className="text-xs text-slate-400 font-semibold">Clocked in at <span className="text-[#1490FE] font-bold">5:34 PM</span></p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><CalendarRange className="w-4 h-4 text-[#1490FE]" /><span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Weekly Summary</span></div>
                  <span className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100">Avg: 7h</span>
                </div>
                <h3 className="text-2xl font-display font-black text-slate-800">28.2h</h3>
                <p className="text-xs text-slate-400 font-semibold">4 shifts this week</p>
              </div>
            </div>

            {/* Sub tabs */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                {(['System', 'Biometrics'] as const).map(t => (
                  <button key={t} onClick={() => setClockSubTab(t)}
                    className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${clockSubTab === t ? 'bg-white text-[#1490FE] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    {t === 'System' ? 'System Records' : 'Biometrics'}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 font-bold tracking-wide uppercase">For {formatDateString(startDate)}</span>
            </div>

            {/* System Records */}
            {clockSubTab === 'System' && (
              <div className="space-y-3">
                {clockSessions.map(session => (
                  <div key={session.id} className={`p-4 rounded-2xl bg-white border flex items-center justify-between gap-5 shadow-sm hover:shadow-md transition-all ${session.isActive ? 'border-zg-vivid-blue/30 bg-zg-vivid-blue/2' : 'border-slate-100'}`}>
                    
                    {/* Left Block: Session Block ID */}
                    <div className="flex items-center gap-3 w-40 flex-shrink-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                        session.isActive 
                          ? 'bg-zg-vivid-blue text-white shadow-[0_4px_12px_rgba(20,144,254,0.25)]' 
                          : 'bg-slate-50 text-slate-500 border border-slate-200'
                      }`}>
                        S{clockSessions.length - session.id + 1}
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none mb-0.5">SESSION</span>
                        <span className={`text-xs font-extrabold block ${session.isActive ? 'text-zg-vivid-blue' : 'text-slate-700'}`}>
                          {session.isActive ? 'Active Session' : 'Completed'}
                        </span>
                      </div>
                    </div>

                    {/* Middle Block: Interactive Timeline Bar */}
                    <div className="flex-1 flex items-center gap-5">
                      {/* IN Time */}
                      <div className="w-16">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none mb-0.5">IN</span>
                        <span className="text-xs font-bold text-slate-700 font-mono">{session.inTime}</span>
                      </div>

                      {/* The Timeline connection Track */}
                      <div className="flex-1 flex items-center relative py-2">
                        {/* Circle Node: IN */}
                        <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0 z-10">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        </div>

                        {/* Connection Track Line */}
                        <div className="flex-1 h-1 bg-slate-100 relative mx-1">
                          <div className={`absolute top-0 left-0 h-full rounded-full ${
                            session.isActive 
                              ? 'bg-gradient-to-r from-emerald-400 to-[#1490FE] animate-pulse w-full' 
                              : 'bg-zg-vivid-blue/30 w-full'
                          }`} />
                          {session.isActive && (
                            <span className="absolute top-1/2 right-0 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md animate-ping" />
                          )}
                        </div>

                        {/* Circle Node: OUT */}
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 z-10 border ${
                          session.isActive
                            ? 'bg-slate-50 border-slate-200 text-slate-400'
                            : 'bg-rose-50 border-rose-200 text-rose-500'
                        }`}>
                          {session.isActive ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          ) : (
                            <ArrowUpLeft className="w-3.5 h-3.5" />
                          )}
                        </div>
                      </div>

                      {/* OUT Time */}
                      <div className="w-16 text-right">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none mb-0.5">OUT</span>
                        <span className="text-xs font-bold text-slate-700 font-mono">
                          {session.isActive ? '-' : session.outTime}
                        </span>
                      </div>
                    </div>

                    {/* Right Block: Monospace Duration */}
                    <div className="w-28 text-right flex-shrink-0">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none mb-0.5">DURATION</span>
                      {session.isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg mt-0.5 uppercase tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Running
                        </span>
                      ) : (
                        <span className="inline-block bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-extrabold font-mono border border-slate-200 mt-0.5">
                          {session.duration}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Biometrics — Device Log Feed */}
            {clockSubTab === 'Biometrics' && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Feed Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-display font-black tracking-widest text-slate-600 uppercase">Device Log Feed</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today</span>
                </div>

                {/* Feed rows */}
                <div className="divide-y divide-slate-50">
                  {biometricLogs.map((log, idx) => {
                    const isIn = log.type === 'clock-in'
                    const timeLabels = ['JUST NOW', '17 MINS AGO', '2 HRS AGO', '2 HRS AGO', '4 HRS AGO', '4.5 HRS AGO', '7 HRS AGO']
                    return (
                      <div key={log.id}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors relative group"
                        style={{ borderLeft: `3px solid ${isIn ? '#22c55e' : '#ef4444'}` }}>

                        {/* Arrow icon circle */}
                        <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center border-2 ${isIn ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-500'}`}>
                          {isIn
                            ? <ArrowRight className="w-4 h-4" />
                            : <ArrowRight className="w-4 h-4 rotate-180" />}
                        </div>

                        {/* Description */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-slate-800 leading-snug">
                            <span className="font-bold">{log.user}</span> biometric {isIn ? 'clock-in' : 'clock-out'} at {log.time} in {log.location}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${isIn ? 'text-emerald-600' : 'text-rose-500'}`}>
                              {isIn ? 'CLOCK IN' : 'CLOCK OUT'}
                            </span>
                            <span className="text-slate-300 text-xs">•</span>
                            <span className="text-[11px] text-slate-400 font-medium">{log.time}</span>
                          </div>
                        </div>

                        {/* Time badge */}
                        <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full whitespace-nowrap tracking-wide flex-shrink-0">
                          {timeLabels[idx] || log.relativeTime.toUpperCase()}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            <div className="h-20" />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            VIEW: DASHBOARD
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Dashboards' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Hours Logged Today', value: '6hr 21m', sub: 'On track for shift target', subColor: 'text-emerald-500', icon: Clock, iconBg: 'bg-blue-50', iconColor: 'text-[#1490FE]' },
                { label: 'Efficiency Rating', value: '96.8%', sub: 'Top project: Tech General', subColor: 'text-[#1490FE]', icon: Zap, iconBg: 'bg-purple-50', iconColor: 'text-[#a855f7]' },
                { label: 'Project Watchlist', value: `${watchlist.length} Active`, sub: 'Monitoring Freightro efforts', subColor: 'text-slate-400', icon: Briefcase, iconBg: 'bg-rose-50', iconColor: 'text-[#FF6347]' },
              ].map((s, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-display font-bold text-slate-400 tracking-wider uppercase block">{s.label}</span>
                    <h3 className="text-xl font-display font-black text-slate-800">{s.value}</h3>
                    <span className={`text-[11px] font-bold ${s.subColor}`}>{s.sub}</span>
                  </div>
                  <div className={`w-11 h-11 rounded-2xl ${s.iconBg} ${s.iconColor} flex items-center justify-center`}><s.icon className="w-5 h-5" /></div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-5 items-start">
              <div className="col-span-2 space-y-5">
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-blue-50 text-[#1490FE]"><Clock className="w-4 h-4" /></div><h3 className="font-display font-semibold text-sm text-slate-800">Time Blocks Today</h3></div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-lg">{timeLogs.length} Blocks</span>
                  </div>
                  <div className="space-y-2">
                    {timeLogs.map(log => {
                      const isExpanded = expandedLogId === log.id
                      return (
                        <div key={log.id} className="group p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/40 hover:shadow-sm transition-all">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex items-start gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center"><Clock className="w-3.5 h-3.5" /></div>
                              <div className="space-y-1">
                                <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded ${log.project === 'Learning and Development' ? 'bg-purple-100/50 text-purple-700' : 'bg-blue-100/50 text-blue-700'}`}>{log.project}</span>
                                <p className="text-[11px] text-slate-600 leading-relaxed">
                                  {isExpanded ? log.fullDescription : log.description}
                                  <button onClick={() => setExpandedLogId(isExpanded ? null : log.id)} className="text-[#1490FE] hover:underline ml-1 font-bold">{isExpanded ? 'less' : 'more'}</button>
                                </p>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded whitespace-nowrap">{log.duration}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-blue-50 text-[#1490FE]"><TrendingUp className="w-4 h-4" /></div><h3 className="font-display font-semibold text-sm text-slate-800">Activity Logs</h3></div>
                  </div>
                  <div className="relative pl-5 border-l border-slate-100 space-y-4 py-1">
                    {activityHistory.map(item => {
                      const isDayIn = item.action === 'Day In'
                      return (
                        <div key={item.id} className="relative group">
                          <span className={`absolute -left-[29px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center ${isDayIn ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'}`}><UserCheck className="w-2.5 h-2.5" /></span>
                          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50/60 transition-all gap-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">{item.user.charAt(0)}</div>
                              <div>
                                <p className="text-xs font-semibold text-slate-800">{item.user} <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${isDayIn ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>{item.action}</span></p>
                                <p className="text-[10px] text-slate-400">{item.timestamp}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{item.relativeTime}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-purple-50 text-[#a855f7]"><PieChart className="w-4 h-4" /></div><h3 className="font-display font-semibold text-sm text-slate-800">Effort Breakdown</h3></div>
                  </div>
                  <div className="space-y-4">
                    {projectTimes.map((p, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-xs items-center">
                          <span className="text-slate-600 font-semibold text-[11px]">{p.name}</span>
                          <span className="text-slate-700 font-bold text-[11px]">{p.duration}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${p.percent}%`, backgroundColor: p.color }}></div>
                        </div>
                        <p className="text-[10px] text-slate-400 text-right">{p.percent}%</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-50">
                    <div className="flex items-center gap-2"><div className="p-1.5 rounded-lg bg-rose-50 text-[#FF6347]"><Briefcase className="w-4 h-4" /></div><h3 className="font-display font-semibold text-sm text-slate-800">Watchlist</h3></div>
                    <button onClick={() => setShowAddProjectModal(true)} className="p-1.5 bg-[#1490FE] hover:bg-[#0070DF] text-white rounded-lg shadow-sm transition-all"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="space-y-2">
                    {watchlist.map(proj => (
                      <div key={proj.id} className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50/40 transition-all space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold text-xs flex items-center justify-center">{proj.name.charAt(0)}</div>
                            <span className="font-semibold text-xs text-slate-800">{proj.name}</span>
                          </div>
                          <button onClick={() => setWatchlist(watchlist.filter(p => p.id !== proj.id))} className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><MinusCircle className="w-3.5 h-3.5" /></button>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                          {[{ Icon: Copy, fn: () => handleCopy(proj.name), title: 'Copy' }, { Icon: List, fn: () => { }, title: 'Tasks' }, { Icon: ClipboardList, fn: () => { }, title: 'Logs' }, { Icon: ChevronRight, fn: () => { }, title: 'Details', color: 'text-[#1490FE]' }].map(({ Icon, fn, title, color }, i) => (
                            <button key={i} onClick={fn} title={title} className={`p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors ${color || ''}`}><Icon className="w-3.5 h-3.5" /></button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="h-20" />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            VIEW: PROJECTS
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Projects' && (
          <div className="flex-1 overflow-hidden flex flex-col">

            {/* Projects sub-toolbar */}
            <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-3 flex-wrap flex-shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </div>
              {/* Status filter */}
              <div className="relative">
                <select value={projectStatusFilter} onChange={e => setProjectStatusFilter(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-100 text-slate-600 font-semibold text-xs py-2 pl-3 pr-8 rounded-xl outline-none cursor-pointer">
                  <option value="All">All Status</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {/* Cost Type filter */}
              <div className="relative">
                <select className="appearance-none bg-slate-50 border border-slate-100 text-slate-600 font-semibold text-xs py-2 pl-3 pr-8 rounded-xl outline-none cursor-pointer">
                  <option>Project Type</option>
                  <option>Dedicated</option>
                  <option>Fixed</option>
                  <option>Retainer</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <div className="flex items-center gap-2 ml-auto">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input value={projectSearch} onChange={e => setProjectSearch(e.target.value)}
                    placeholder="Search by Project Name"
                    className="pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1490FE]/40 focus:bg-white transition-all text-slate-700 placeholder-slate-400 w-52" />
                </div>
                <button className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#FF6347] hover:bg-[#e05439] px-4 py-2 rounded-xl shadow-sm transition-colors">
                  Apply Filter
                </button>
                <button onClick={() => { setProjectSearch(''); setProjectStatusFilter('All') }}
                  className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">Clear</button>
              </div>
            </div>

            {/* Projects grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-3 gap-5">
                {projects
                  .filter(p => {
                    const matchSearch = !projectSearch || p.name.toLowerCase().includes(projectSearch.toLowerCase())
                    const matchStatus = projectStatusFilter === 'All' || p.status === projectStatusFilter
                    return matchSearch && matchStatus
                  })
                  .map(project => (
                    <div key={project.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">

                      {/* Card header */}
                      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-50"
                        style={{ borderTop: `3px solid ${project.color}` }}>
                        <h3 className="font-display font-bold text-sm text-slate-800">{project.name}</h3>
                        <button className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-[#1490FE] flex items-center justify-center border border-slate-100 transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Card body */}
                      <div className="px-5 py-4 space-y-4">
                        {/* Scope + Cost Type */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Project Scope</p>
                            <div className="flex flex-wrap gap-1">
                              {project.scope.map((s, i) => (
                                <span key={i} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">{s}</span>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cost Type</p>
                            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 border border-emerald-200 inline-block">{project.costType}</span>
                          </div>
                        </div>

                        {/* Dates grid */}
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="space-y-0.5">
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Expected Start</p>
                            <div className="flex items-center gap-1 text-slate-700 font-semibold">
                              <Calendar className="w-3 h-3 text-slate-400" />{project.expectedStartDate}
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Expected End</p>
                            <div className="flex items-center gap-1 text-slate-700 font-semibold">
                              <Calendar className="w-3 h-3 text-slate-400" />{project.expectedEndDate}
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Actual Start</p>
                            <div className="flex items-center gap-1 text-slate-700 font-semibold">
                              <Calendar className="w-3 h-3 text-slate-400" />{project.actualStartDate}
                            </div>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Actual End</p>
                            <div className="flex items-center gap-1 text-slate-700 font-semibold">
                              <Calendar className="w-3 h-3 text-slate-400" />{project.actualEndDate}
                            </div>
                          </div>
                        </div>

                        {/* Members + Status */}
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Members</p>
                            <div className="flex items-center">
                              {project.members.slice(0, 4).map((m, i) => (
                                <div key={i}
                                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-[10px] -ml-1 first:ml-0"
                                  style={{ backgroundColor: ['#1490FE','#a855f7','#FF6347','#10B981','#F59E0B'][i % 5], zIndex: 10 - i }}>
                                  {m}
                                </div>
                              ))}
                              {project.members.length > 4 && (
                                <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 text-slate-500 font-bold text-[9px] -ml-1 flex items-center justify-center">
                                  +{project.members.length - 4}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Project Status</p>
                            <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-md inline-block border ${
                              project.status === 'In Progress' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : project.status === 'Completed' ? 'bg-blue-50 text-[#1490FE] border-blue-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>{project.status}</span>
                          </div>
                        </div>

                        {/* Time Stats */}
                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-50">
                          {[
                            { label: 'Time Spent', value: project.timeSpent },
                            { label: 'Time Billable', value: project.timeBillable },
                            { label: 'Max Planned', value: project.maxTimePlanned },
                          ].map((stat, i) => (
                            <div key={i} className="text-center space-y-0.5">
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">{stat.label}</p>
                              <p className="text-[11px] font-black text-slate-700 font-mono">{stat.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-semibold">Showing 1 to {Math.min(projectsPerPage, projects.length)} of {projects.length} entries</span>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
                  <button className="w-7 h-7 rounded-lg bg-[#1490FE] text-white flex items-center justify-center text-xs font-bold shadow-sm">1</button>
                  <button className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="h-20" />
            </div>
          </div>
        )}

        {/* ─── FLOATING ACTION BAR ──────────────────────────────────────────────── */}
        <div className="fixed bottom-5 right-5 flex items-center gap-2 z-30">
          <button onClick={() => { setShowTimerWidget(!showTimerWidget); setActiveTab('Timesheet') }}
            className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2.5 rounded-full shadow-lg text-xs font-bold transition-all hover:shadow-xl">
            <AlarmClock className="w-4 h-4" />
            Time Log
          </button>
          <button onClick={() => setIsClockedIn(!isClockedIn)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-xs font-bold transition-all hover:shadow-xl ${isClockedIn ? 'bg-[#FF6347] hover:bg-[#e05439] text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}>
            {isClockedIn ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isClockedIn ? `Clock Out  ${formatTime(bottomSeconds)}` : 'Clock In'}
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            FLOATING TIMER WIDGET
        ══════════════════════════════════════════════════════════════════════ */}
        {showTimerWidget && (
          <>
            <div className="fixed inset-0 z-35 pointer-events-none" />
            <div className="fixed bottom-[76px] right-5 w-[400px] z-40">
              <div className="bg-gradient-to-b from-[#061D42] to-[#1490FE] rounded-2xl shadow-2xl overflow-hidden border border-white/10" style={{ boxShadow: '0 20px 60px rgba(6, 29, 66, 0.4)' }}>

                {/* Widget top bar */}
                <div className="flex items-center justify-between px-4 pt-4 pb-3">
                  {/* Tabs */}
                  <div className="flex items-center gap-0.5 bg-black/20 rounded-xl p-0.5 border border-white/5">
                    {(['Timer', 'Manual'] as const).map(t => (
                      <button key={t} onClick={() => setTimerSubTab(t)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${timerSubTab === t ? 'bg-white text-[#061D42] shadow-sm' : 'text-white/70 hover:text-white'}`}>
                        {t === 'Timer'
                          ? <><AlarmClock className="w-3.5 h-3.5" />Timer</>
                          : <><Pencil className="w-3 h-3" />Manual</>
                        }
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-white/50 hover:text-white rounded-lg transition-colors"><Maximize2 className="w-4 h-4" /></button>
                    <button onClick={() => setShowTimerWidget(false)} className="p-1.5 text-white/50 hover:text-white rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Widget separator */}
                <div className="h-px bg-white/10 mx-4" />

                {/* Widget body */}
                <div className="p-4 space-y-3">

                  {/* Project + Ticket row */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <DropdownSelect
                        value={timerSubTab === 'Timer' ? timerProject : manualProject}
                        onChange={val => timerSubTab === 'Timer' ? setTimerProject(val) : setManualProject(val)}
                        variant="dark-glass"
                        placeholder={timerSubTab === 'Timer' ? 'Learning And D...' : 'Select Project *'}
                        options={availableProjects.map(p => ({ value: p, label: p }))}
                      />
                    </div>
                    <div className="relative">
                      <DropdownSelect
                        value=""
                        onChange={() => {}}
                        variant="dark-glass"
                        placeholder="Select Ticket"
                        options={[{ value: 'ZIG-219', label: 'ZIG-219' }]}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <textarea
                    rows={timerSubTab === 'Timer' ? 5 : 4}
                    value={timerSubTab === 'Timer' ? timerDescription : manualDescription}
                    onChange={e => timerSubTab === 'Timer' ? setTimerDescription(e.target.value) : setManualDescription(e.target.value)}
                    placeholder={timerSubTab === 'Timer' ? 'What are you working on?' : 'Describe your task details in max 2000 characters *'}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 text-xs text-white leading-relaxed outline-none resize-none placeholder-white/40 font-body hover:bg-white/15 transition-all"
                  />

                  {/* TIMER mode footer */}
                  {timerSubTab === 'Timer' && (
                    <div className="flex items-center justify-between pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-white/20 text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10">Task</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setIsClockedIn(!isClockedIn)}
                          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform">
                          {isClockedIn
                            ? <Pause className="w-5 h-5 text-[#1490FE] fill-[#1490FE]" />
                            : <Play className="w-5 h-5 text-[#1490FE] fill-[#1490FE] ml-0.5" />}
                        </button>
                        <span className="font-mono text-[22px] font-black tracking-widest text-white">{formatTime(secondsTracked)}</span>
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center">
                            <TimerReset className="w-4 h-4 text-white/70" />
                          </div>
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-[9px] font-black text-white flex items-center justify-center">1</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MANUAL mode footer */}
                  {timerSubTab === 'Manual' && (
                    <div className="space-y-3">
                      {/* When date */}
                      <div>
                        <p className="text-[11px] text-white/70 font-semibold mb-1.5">
                          When: <span className="underline decoration-dotted text-white font-bold cursor-pointer hover:opacity-80 transition-opacity">06-07-2026</span>
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <input type="time" value={manualStartTime} onChange={e => setManualStartTime(e.target.value)}
                              placeholder="--:--"
                              className="w-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-semibold py-2.5 pl-3 pr-9 rounded-xl outline-none" />
                            <Clock className="w-3.5 h-3.5 text-white/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                          <div className="relative">
                            <input type="time" value={manualEndTime} onChange={e => setManualEndTime(e.target.value)}
                              placeholder="--:--"
                              className="w-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-semibold py-2.5 pl-3 pr-9 rounded-xl outline-none" />
                            <Clock className="w-3.5 h-3.5 text-white/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-0.5">
                        <div className="flex gap-2">
                          <button className="bg-[#FF6347] hover:bg-[#e05439] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-colors">Save</button>
                          <button onClick={() => { setManualDescription(''); setManualStartTime(''); setManualEndTime(''); setManualProject('') }}
                            className="bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-colors">Clear</button>
                        </div>
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center">
                            <TimerReset className="w-4 h-4 text-white/70" />
                          </div>
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-[9px] font-black text-white flex items-center justify-center">1</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

      </main>

      {/* ─── ADD PROJECT MODAL ────────────────────────────────────────────────── */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm border border-slate-100 shadow-2xl">
            <div className="p-4 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-display font-bold text-[#1490FE]">Add to Watchlist</h3>
              <button onClick={() => setShowAddProjectModal(false)} className="text-slate-400 hover:text-slate-600 p-1"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddProject} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Project <span className="text-[#FF6347]">*</span></label>
                <div className="relative">
                  <select value={selectedProjectToAdd} onChange={e => setSelectedProjectToAdd(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-100 focus:border-[#1490FE]/40 rounded-xl text-xs text-slate-800 outline-none cursor-pointer appearance-none">
                    {availableProjects.map((p, i) => <option key={i} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="submit" className="bg-[#1490FE] hover:bg-[#0070DF] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors">Add</button>
                <button type="button" onClick={() => setShowAddProjectModal(false)} className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100 text-xs font-bold px-4 py-2 rounded-xl transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
