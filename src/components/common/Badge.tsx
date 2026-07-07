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
  default: 'bg-[#D9E8F5] dark:bg-[#1490FE]/15 text-[#141414] dark:text-[#93c5fd] border-[#1490FE]/10 dark:border-[#1490FE]/25',
  blue:    'bg-[#1490FE]/10 dark:bg-[#1490FE]/15 text-[#1490FE] border-[#1490FE]/15 dark:border-[#1490FE]/30',
  coral:   'bg-[#FF6347]/10 dark:bg-[#FF6347]/15 text-[#FF6347] border-[#FF6347]/15 dark:border-[#FF6347]/30',
  success: 'bg-[#ECFDF5] dark:bg-emerald-500/10 text-[#059669] dark:text-emerald-400 border-[#A7F3D0] dark:border-emerald-500/25',
  warning: 'bg-[#FFFBEB] dark:bg-amber-500/10  text-[#B45309] dark:text-amber-400   border-[#FDE68A] dark:border-amber-500/25',
  error:   'bg-[#FEF2F2] dark:bg-red-500/10    text-[#DC2626] dark:text-red-400     border-[#FECACA] dark:border-red-500/25',
  info:    'bg-[#EFF6FF] dark:bg-blue-500/10   text-[#2563EB] dark:text-blue-400   border-[#BFDBFE] dark:border-blue-500/25',
  muted:   'bg-slate-100 dark:bg-[#2e3347]     text-slate-500 dark:text-[#8892aa]  border-slate-200 dark:border-[#3a4060]',
  purple:  'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/25',
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
