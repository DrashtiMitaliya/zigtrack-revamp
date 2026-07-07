import React from 'react'
import { Download } from 'lucide-react'

interface ExportButtonProps {
  onClick: () => void
  label?: string
  className?: string
  variant?: 'toolbar' | 'group'
}

export const ExportButton: React.FC<ExportButtonProps> = ({
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
