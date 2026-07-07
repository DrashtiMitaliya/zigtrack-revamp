import React from 'react'

interface DataCardProps {
  children: React.ReactNode
  isActive?: boolean
  onClick?: () => void
  className?: string
  display?: 'flex' | 'grid'
}

export const DataCard: React.FC<DataCardProps> = ({
  children,
  isActive = false,
  onClick,
  className = '',
  display = 'flex',
}) => {
  const layoutClass = display === 'grid'
    ? 'grid'
    : 'flex flex-col md:flex-row md:items-center justify-between gap-5'

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-white border shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-300 ${
        isActive 
          ? 'border-zg-vivid-blue/30 bg-zg-vivid-blue/2' 
          : 'border-slate-100'
      } ${onClick ? 'cursor-pointer' : ''} ${layoutClass} ${className}`}
    >
      {children}
    </div>
  )
}
export default DataCard
