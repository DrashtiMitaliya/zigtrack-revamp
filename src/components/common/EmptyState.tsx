import React from 'react'
import { FileX2 } from 'lucide-react'
import Button from './Button'

interface EmptyStateProps {
  /** Lucide icon component to display */
  icon?: React.ElementType
  title: string
  description?: string
  /** Primary CTA */
  actionLabel?: string
  onAction?: () => void
  /** Secondary CTA */
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = FileX2,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#D9E8F5] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-[#1490FE] opacity-70" />
      </div>

      <h3 className="font-display font-bold text-sm text-slate-700 mb-1">{title}</h3>

      {description && (
        <p className="text-xs text-slate-400 font-medium max-w-xs leading-relaxed mb-4">
          {description}
        </p>
      )}

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-2 mt-2">
          {actionLabel && onAction && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="ghost" size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default EmptyState
