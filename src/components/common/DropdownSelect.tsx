import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { type DropdownOption } from '../../constants'

interface DropdownSelectProps {
  value: string
  onChange: (val: string) => void
  options: DropdownOption[]
  placeholder?: string
  variant?: 'light' | 'dark-glass' | 'small'
  className?: string
  id?: string
  isMulti?: boolean
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  variant = 'light',
  className = '',
  id,
  isMulti = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Listen for clicks outside of the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Parse multi-select values
  const selectedValues = isMulti
    ? (value ? value.split(',') : [])
    : [value]

  const handleOptionClick = (optValue: string) => {
    if (isMulti) {
      let nextValues: string[]
      if (optValue === 'All') {
        // Clicking "All" clears all other selections and keeps only "All"
        nextValues = ['All']
      } else {
        // Clicking any other option clears "All"
        const withoutAll = selectedValues.filter(v => v !== 'All')
        if (withoutAll.includes(optValue)) {
          nextValues = withoutAll.filter(v => v !== optValue)
        } else {
          nextValues = [...withoutAll, optValue]
        }
        // If no options are selected, default back to "All" (if "All" is in options)
        if (nextValues.length === 0 && options.some(o => o.value === 'All')) {
          nextValues = ['All']
        }
      }
      onChange(nextValues.join(','))
    } else {
      onChange(optValue)
      setIsOpen(false)
    }
  }

  const getDisplayText = () => {
    if (isMulti) {
      if (selectedValues.length === 0 || (selectedValues.length === 1 && selectedValues[0] === 'All')) {
        return options.find(o => o.value === 'All')?.label || placeholder || 'All'
      }
      const labels = selectedValues.map(val => options.find(o => o.value === val)?.label || val)
      return labels.join(', ')
    } else {
      const selectedOption = options.find(o => o.value === value)
      return selectedOption ? selectedOption.label : (placeholder || 'Select...')
    }
  }

  // Styles based on variant
  let btnClass = "w-full flex items-center justify-between font-semibold text-xs py-2 pl-3.5 pr-8.5 rounded-xl outline-none cursor-pointer transition-all text-left truncate "
  let iconColor = "text-slate-400"

  if (variant === 'light') {
    btnClass += `bg-slate-50 border ${isOpen ? 'border-[#1490FE] ring-2 ring-[#1490FE]/15 bg-white' : 'border-slate-200 hover:border-slate-300'} text-slate-700`
  } else if (variant === 'dark-glass') {
    btnClass += `bg-white/10 backdrop-blur-md border ${isOpen ? 'border-white/35 bg-white/15' : 'border-white/10 hover:bg-white/15'} text-white`
    iconColor = "text-white/60"
  } else if (variant === 'small') {
    btnClass = `w-full flex items-center justify-between bg-slate-50 border ${isOpen ? 'border-[#1490FE] ring-2 ring-[#1490FE]/15 bg-white' : 'border-slate-200 hover:border-slate-300'} text-slate-700 font-semibold text-[11px] py-1.5 pl-2.5 pr-7.5 rounded-lg outline-none cursor-pointer transition-all text-left truncate`
  }

  return (
    <div 
      ref={containerRef}
      className={`relative ${variant === 'small' ? 'inline-block' : 'w-full'} ${className}`}
      id={id}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={btnClass}
        style={variant === 'dark-glass' && !value ? { color: 'rgba(255,255,255,0.5)' } : {}}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate mr-1">{getDisplayText()}</span>
        <ChevronDown className={`w-3.5 h-3.5 ${iconColor} flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className={`absolute z-[999] left-0 right-0 mt-1.5 rounded-xl border max-h-60 overflow-y-auto shadow-lg py-1.5 animate-in fade-in slide-in-from-top-1 duration-150 ${
            variant === 'dark-glass' 
              ? 'bg-slate-900 border-slate-800 text-white' 
              : 'bg-white border-slate-200 text-slate-800'
          }`}
          role="listbox"
        >
          {placeholder && !isMulti && (
            <button
              type="button"
              onClick={() => { onChange(''); setIsOpen(false) }}
              className={`w-full px-3.5 py-2 text-xs font-semibold transition-colors text-left ${
                variant === 'dark-glass'
                  ? 'text-white/40 hover:bg-white/5'
                  : 'text-slate-400 hover:bg-slate-50'
              }`}
              role="option"
              aria-selected={!value}
            >
              {placeholder}
            </button>
          )}

          {options.map(opt => {
            const isSelected = selectedValues.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleOptionClick(opt.value)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold transition-colors text-left ${
                  isSelected
                    ? variant === 'dark-glass'
                      ? 'bg-[#10B981]/20 text-[#10B981] font-bold'
                      : 'bg-[#EFF6FF] text-[#1490FE]'
                    : variant === 'dark-glass'
                    ? 'hover:bg-white/5 text-white/90'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <span className="truncate mr-2">{opt.label}</span>
                {isMulti ? (
                  <div 
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                      isSelected 
                        ? 'bg-[#1490FE] border-[#1490FE] text-white shadow-xs' 
                        : variant === 'dark-glass'
                        ? 'border-white/20 bg-transparent'
                        : 'border-slate-300 bg-transparent'
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                      </svg>
                    )}
                  </div>
                ) : (
                  isSelected && <Check className="w-3.5 h-3.5 text-[#1490FE]" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
export default DropdownSelect
