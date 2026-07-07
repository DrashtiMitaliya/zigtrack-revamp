import React from 'react'

type BadgeVariant =
  | 'default'   // sky-blue — #D9E8F5 bg, #141414 text
  | 'blue'      // vivid blue fill
  | 'coral'     // coral fill
  | 'success'   // emerald
  | 'warning'   // amber
  | 'error'     // red
  | 'info'      // info blue
  | 'muted'     // slate grey
  | 'purple'    // purple accent

type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean          // show a coloured dot before label
  dotColor?: string      // custom dot colour
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[#D9E8F5] text-[#141414] border-[#1490FE]/10',
  blue:    'bg-[#1490FE]/10 text-[#1490FE] border-[#1490FE]/15',
  coral:   'bg-[#FF6347]/10 text-[#FF6347] border-[#FF6347]/15',
  success: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
  warning: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
  error:   'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
  info:    'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
  muted:   'bg-slate-100 text-slate-500 border-slate-200',
  purple:  'bg-purple-50 text-purple-700 border-purple-200',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-[9px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-lg',
  md: 'text-[10px] font-extrabold tracking-wide uppercase px-2.5 py-1 rounded-lg',
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  dot = false,
  dotColor,
  children,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 border font-display ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={dotColor ? { backgroundColor: dotColor } : {}}
        />
      )}
      {children}
    </span>
  )
}

export default Badge
