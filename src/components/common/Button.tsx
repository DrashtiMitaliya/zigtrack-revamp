import React from 'react'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  /** If true, renders a square icon-only button — provide aria-label */
  iconOnly?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#1490FE] hover:bg-[#0070DF] active:bg-[#005EC2] text-white border border-transparent shadow-sm',
  secondary:
    'bg-[#141414] hover:bg-[#292929] active:bg-[#000] text-white border border-transparent shadow-sm',
  ghost:
    'bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-transparent',
  danger:
    'bg-[#FF6347] hover:bg-[#e05439] active:bg-[#c44430] text-white border border-transparent shadow-sm',
  outline:
    'bg-transparent hover:bg-[#1490FE]/5 active:bg-[#1490FE]/10 text-[#1490FE] border border-[#1490FE]/40',
  success:
    'bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white border border-transparent shadow-sm',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs font-bold px-3 py-1.5 rounded-xl gap-1.5 h-8',
  md: 'text-xs font-bold px-4 py-2 rounded-xl gap-2 h-9',
  lg: 'text-sm font-bold px-5 py-2.5 rounded-xl gap-2 h-11',
}

const iconOnlySizeClasses: Record<ButtonSize, string> = {
  sm: 'w-7 h-7 rounded-lg',
  md: 'w-8 h-8 rounded-xl',
  lg: 'w-10 h-10 rounded-xl',
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  children,
  disabled,
  className = '',
  ...rest
}) => {
  const isDisabled = disabled || isLoading

  const base =
    'inline-flex items-center justify-center transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1490FE] disabled:opacity-50 disabled:cursor-not-allowed select-none'

  const sizeClass = iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size]

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={`${base} ${variantClasses[variant]} ${sizeClass} ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}

export default Button
