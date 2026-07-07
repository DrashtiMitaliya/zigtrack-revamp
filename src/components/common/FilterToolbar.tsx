import React from 'react'
import { SlidersHorizontal } from 'lucide-react'

interface FilterToolbarProps {
  /** Left-side filter controls */
  leftSlot?: React.ReactNode
  /** Right-side controls (search, export, action buttons) */
  rightSlot?: React.ReactNode
  className?: string
}

/**
 * FilterToolbar — consistent filter/toolbar strip used across Timesheet, Projects, and PR Requests.
 * Renders a white, bordered bar with a "Filters:" label on the left and right-side controls.
 * Wraps responsively on small screens.
 */
export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  leftSlot,
  rightSlot,
  className = '',
}) => {
  return (
    <div
      className={`bg-white border-b border-slate-100 px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3 flex-shrink-0 ${className}`}
    >
      {/* Filters label */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 flex-shrink-0">
        <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
        <span>Filters:</span>
      </div>

      {/* Left filter controls */}
      {leftSlot && (
        <div className="flex flex-wrap items-center gap-2">{leftSlot}</div>
      )}

      {/* Right controls pushed to end */}
      {rightSlot && (
        <div className="flex flex-wrap items-center gap-2 ml-auto">{rightSlot}</div>
      )}
    </div>
  )
}

export default FilterToolbar
