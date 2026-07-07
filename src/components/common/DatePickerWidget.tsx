import React, { useState, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  ChevronDown
} from 'lucide-react'

interface DatePickerWidgetProps {
  startDate: Date
  endDate: Date
  onRangeChange: (start: Date, end: Date) => void
  viewMode?: 'Daily' | 'Weekly'
  singleDateOnly?: boolean
  className?: string
}

export const DatePickerWidget: React.FC<DatePickerWidgetProps> = ({
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

      {/* Date display & trigger */}
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

      {/* Advanced Datepicker popup overlay */}
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
