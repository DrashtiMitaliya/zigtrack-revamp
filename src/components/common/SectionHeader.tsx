import React from 'react'

interface SectionHeaderProps {
  /** Lucide icon component */
  icon: React.ElementType
  /** Background + text colour class for the icon container (e.g. "bg-blue-50 text-[#1490FE]") */
  iconBg?: string
  title: string
  /** Optional right-side content (badge, button, etc.) */
  rightSlot?: React.ReactNode
  className?: string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  iconBg = 'bg-[#D9E8F5] text-[#1490FE]',
  title,
  rightSlot,
  className = '',
}) => {
  return (
    <div
      className={`flex justify-between items-center pb-3 border-b border-slate-50 ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${iconBg}`}>
          <Icon className="w-4 h-4" aria-hidden="true" />
        </div>
        <h3 className="font-display font-semibold text-sm text-slate-800">{title}</h3>
      </div>
      {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
    </div>
  )
}

export default SectionHeader
