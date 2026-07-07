import React from 'react'
import { ChevronDown } from 'lucide-react'
import { type DropdownOption } from '../../constants'

interface DropdownSelectProps {
  value: string
  onChange: (val: string) => void
  options: DropdownOption[]
  placeholder?: string
  variant?: 'light' | 'dark-glass' | 'small'
  className?: string
  id?: string
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
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
