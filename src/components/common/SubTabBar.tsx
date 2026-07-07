import React from 'react'

export interface SubTabItem<T extends string = string> {
  key: T
  label: string
  icon?: React.ElementType
}

interface SubTabBarProps<T extends string = string> {
  tabs: SubTabItem<T>[]
  activeTab: T
  onTabChange: (tab: T) => void
  className?: string
}

/**
 * SubTabBar — pill-style tab switcher used in ClockInOut, Projects, Header (Daily/Weekly),
 * and FloatingTimerWidget. Renders a bg-slate-100 container with white active pill.
 */
export const SubTabBar = <T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}: SubTabBarProps<T>): React.ReactElement => {
  return (
    <div
      className={`flex items-center gap-1 bg-slate-100 rounded-xl p-0.5 ${className}`}
      role="tablist"
    >
      {tabs.map(({ key, label, icon: Icon }) => {
        const isActive = activeTab === key
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              isActive
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default SubTabBar
