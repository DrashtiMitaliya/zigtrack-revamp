import React, { useState, useRef, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface TimePickerProps {
  value: string // 24-hour style e.g. "14:30" or ""
  onChange: (val: string) => void
  variant?: 'light' | 'dark-glass' | 'small' | 'input-field'
  className?: string
  id?: string
  placeholder?: string
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  variant = 'light',
  className = '',
  id,
  placeholder = '--:-- --',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Hours: 12, 01 - 11
  const hours = ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
  // Minutes: 00 - 59
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
  // AM/PM
  const periods = ['AM', 'PM']

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto scroll active items into view when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const activeElements = containerRef.current?.querySelectorAll('[data-active="true"]')
        activeElements?.forEach(el => {
          el.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior })
        })
      }, 50)
    }
  }, [isOpen])

  // Parse 24h string "14:30" into 12h pieces
  const parseTime = (val: string) => {
    if (!val) return { hour: '12', minute: '00', period: 'AM', isEmpty: true }
    const parts = val.split(':')
    if (parts.length < 2) return { hour: '12', minute: '00', period: 'AM', isEmpty: true }
    let h = parseInt(parts[0], 10)
    const m = parts[1]
    const period = h >= 12 ? 'PM' : 'AM'
    h = h % 12
    if (h === 0) h = 12
    return {
      hour: String(h).padStart(2, '0'),
      minute: m,
      period,
      isEmpty: false
    }
  }

  const { hour, minute, period, isEmpty } = parseTime(value)

  // Format 12h pieces back into 24h string
  const updateTime = (newH: string, newM: string, newP: string) => {
    let h = parseInt(newH, 10)
    if (newP === 'PM' && h < 12) h += 12
    if (newP === 'AM' && h === 12) h = 0
    onChange(`${String(h).padStart(2, '0')}:${newM}`)
  }

  // Display text in button trigger
  const getDisplayText = () => {
    if (isEmpty) return placeholder
    return `${hour}:${minute} ${period}`
  }

  // Styles based on variant
  let btnClass = "w-full flex items-center justify-between font-mono font-semibold text-xs py-2 pl-3 px-3 rounded-xl outline-none cursor-pointer transition-all text-center "
  let iconColor = "text-slate-400"

  if (variant === 'light') {
    btnClass += `bg-slate-50 border ${isOpen ? 'border-[#1490FE] ring-2 ring-[#1490FE]/15 bg-white' : 'border-slate-200 hover:border-slate-300'} text-slate-700`
  } else if (variant === 'input-field') {
    btnClass = `w-full flex items-center justify-between font-mono font-semibold text-xs py-3.5 px-4 rounded-2xl bg-slate-50/70 border ${isOpen ? 'border-[#1490FE] ring-4 ring-[#1490FE]/10 bg-white' : 'border-slate-200 hover:border-slate-300'} text-slate-800 outline-none cursor-pointer transition-all text-left`
    iconColor = "text-slate-400"
  } else if (variant === 'dark-glass') {
    btnClass += `bg-white/10 border ${isOpen ? 'border-[#10B981]/50 bg-white/15' : 'border-white/10 hover:bg-white/15'} text-white`
    iconColor = "text-white/60"
  } else if (variant === 'small') {
    btnClass = `w-full flex items-center justify-center gap-1 bg-transparent border-none text-[#141414] text-[11px] font-semibold font-mono outline-none text-center py-0.5 px-1 cursor-pointer transition-all hover:bg-slate-100 rounded-md`
  }

  const dropdownBg = variant === 'dark-glass'
    ? 'bg-slate-900 border-slate-800 text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
    : 'bg-white border-slate-200 text-slate-800 shadow-xl'

  const columnBorder = variant === 'dark-glass' ? 'border-white/10' : 'border-slate-100'

  const itemClass = (isActive: boolean) => {
    if (isActive) {
      return 'w-full py-1.5 px-2.5 text-center text-xs font-black bg-[#1490FE] text-white rounded-lg shadow-sm transition-all'
    }
    return variant === 'dark-glass'
      ? 'w-full py-1.5 px-2.5 text-center text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors'
      : 'w-full py-1.5 px-2.5 text-center text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors'
  }

  return (
    <div 
      ref={containerRef} 
      className={`relative ${variant === 'small' ? 'w-full' : 'w-full'} ${className}`} 
      id={id}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={btnClass}
      >
        <span className="truncate">{getDisplayText()}</span>
        {variant !== 'small' && (
          <Clock className={`w-3.5 h-3.5 ${iconColor} flex-shrink-0`} />
        )}
      </button>

      {isOpen && (
        <div 
          className={`absolute z-[999] top-full mt-1.5 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 rounded-2xl border p-2 flex gap-1 ${dropdownBg} animate-in fade-in slide-in-from-top-1 duration-150`}
        >
          {/* Hour Column */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 select-none">H</span>
            <div className={`overflow-y-auto h-36 w-11 flex flex-col gap-0.5 border-r pr-0.5 ${columnBorder} scrollbar-none`}>
              {hours.map(h => {
                const isActive = h === hour
                return (
                  <button
                    key={h}
                    type="button"
                    data-active={isActive}
                    onClick={() => updateTime(h, minute, period)}
                    className={itemClass(isActive)}
                  >
                    {h}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Minute Column */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 select-none">M</span>
            <div className={`overflow-y-auto h-36 w-11 flex flex-col gap-0.5 border-r pr-0.5 ${columnBorder} scrollbar-none`}>
              {minutes.map(m => {
                const isActive = m === minute
                return (
                  <button
                    key={m}
                    type="button"
                    data-active={isActive}
                    onClick={() => updateTime(hour, m, period)}
                    className={itemClass(isActive)}
                  >
                    {m}
                  </button>
                )
              })}
            </div>
          </div>

          {/* AM/PM Column */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 select-none">P</span>
            <div className="flex flex-col gap-1 w-11">
              {periods.map(p => {
                const isActive = p === period
                return (
                  <button
                    key={p}
                    type="button"
                    data-active={isActive}
                    onClick={() => updateTime(hour, minute, p)}
                    className={itemClass(isActive)}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default TimePicker
