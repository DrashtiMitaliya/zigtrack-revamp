import React, { useState } from 'react'
import {
  Clock,
  Briefcase,
  LayoutDashboard,
  FileText,
  X,
  ChevronDown
} from 'lucide-react'
import { useAppContext } from '../../context/AppContext'

interface SidebarProps {
  /** Called when the mobile close (X) button is pressed */
  onClose?: () => void
}

interface NavSubItem {
  readonly name: string
  readonly key: string
}

interface NavItem {
  readonly name: string
  readonly icon: React.ComponentType<any>
  readonly badge?: string
  readonly hasDot?: boolean
  readonly subItems?: readonly NavSubItem[]
}

const navItems: readonly NavItem[] = [
  { name: 'Dashboards', icon: LayoutDashboard },
  { name: 'Clock In/Out', icon: Clock },
  {
    name: 'Timesheet',
    icon: FileText,
    badge: 'Active',
    subItems: [
      { name: 'Timesheet Manage', key: 'Timesheet Manage' },
      { name: 'Timesheet Status', key: 'Timesheet Status' }
    ] as const
  },
  { name: 'Projects', icon: Briefcase, hasDot: true },

]

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const {
    activeTab,
    setActiveTab,
    isClockedIn,
    setShowDayOutModal,
    handleClockIn
  } = useAppContext()

  const [isTimesheetExpanded, setIsTimesheetExpanded] = useState(true)

  const handleNav = (name: string) => {
    setActiveTab(name)
    onClose?.() // close drawer on mobile after navigation
  }

  const navBtnClass = (isActive: boolean) =>
    `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${isActive
      ? 'bg-zg-vivid-blue/15 text-zg-vivid-blue font-bold border-l-2 border-zg-vivid-blue rounded-l-none'
      : 'hover:bg-zg-gray-800 text-zg-gray-500 hover:text-white'
    }`

  const isTimesheetActive = activeTab === 'Timesheet Manage' || activeTab === 'Timesheet Status' || activeTab === 'Timesheet'

  return (
    <aside
      className="w-64 flex flex-col justify-between bg-zg-chinese-black border-r border-zg-gray-800 shadow-sm flex-shrink-0 h-full"
      aria-label="Primary navigation"
    >
      <div className="p-4 border-b border-zg-gray-800 flex items-center justify-between flex-shrink-0">
        {/* Brand logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-zg-vivid-blue flex items-center justify-center text-white font-extrabold shadow-[0_4px_12px_rgba(20,144,254,0.3)]">
            Z
          </div>
          <div>
            <h1 className="font-display font-black text-sm text-white tracking-wide uppercase">
              ZigTrack
            </h1>
            <p className="text-[9px] text-zg-gray-500 font-semibold leading-none mt-0.5">
              WORKSPACE
            </p>
          </div>
        </div>

        {/* Mobile close menu trigger */}
        <div className="md:hidden">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-zg-gray-500 hover:text-white hover:bg-zg-gray-800 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* ── Nav items ─────────────────────────────── */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-5">
        <div>
          <p className="text-[9px] font-display font-bold tracking-widest text-zg-gray-500 uppercase px-2 mb-2">
            WORKSPACES
          </p>
          <nav className="space-y-0.5">
            {navItems.map(({ name, icon: Icon, badge, hasDot, subItems }) => {
              const isActive = activeTab === name || (name === 'Timesheet' && isTimesheetActive)
              return (
                <div key={name}>
                  <button
                    type="button"
                    onClick={() => {
                      if (subItems) {
                        setIsTimesheetExpanded(!isTimesheetExpanded)
                        if (!isTimesheetActive) {
                          handleNav('Timesheet Manage')
                        }
                      } else {
                        handleNav(name)
                      }
                    }}
                    className={navBtnClass(isActive)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${isActive ? 'text-zg-vivid-blue' : 'text-zg-gray-500'}`}
                        aria-hidden="true"
                      />
                      <span>{name}</span>
                    </div>

                    {subItems ? (
                      <div className="flex items-center gap-1.5">
                        {badge && !isTimesheetActive && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-zg-gray-800 text-zg-gray-500">
                            {badge}
                          </span>
                        )}
                        <ChevronDown className={`w-3.5 h-3.5 text-zg-gray-500 transition-transform duration-150 ${isTimesheetExpanded ? 'rotate-0' : '-rotate-90'}`} />
                      </div>
                    ) : (
                      <>
                        {hasDot && !isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-zg-vivid-blue" aria-hidden="true" />
                        )}
                        {badge && (
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isActive
                              ? 'bg-zg-vivid-blue/20 text-zg-vivid-blue'
                              : 'bg-zg-gray-800 text-zg-gray-500'
                              }`}
                          >
                            {badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>

                  {/* Submenu items */}
                  {subItems && isTimesheetExpanded && (
                    <div className="mt-1 pl-4 space-y-1">
                      {subItems.map(sub => {
                        const isSubActive = activeTab === sub.key
                        return (
                          <button
                            key={sub.key}
                            type="button"
                            onClick={() => handleNav(sub.key)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${isSubActive
                              ? 'bg-zg-vivid-blue text-white shadow-xs'
                              : 'hover:bg-zg-gray-800 text-zg-gray-500 hover:text-white'
                              }`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full border ${isSubActive ? 'border-white bg-white' : 'border-zg-gray-500 bg-transparent'}`} />
                            <span>{sub.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>


      </div>

      {/* ── Footer actions ─────────────────────────── */}
      <div className="p-4 border-t border-zg-gray-800 space-y-3">


        <button
          onClick={() => isClockedIn ? setShowDayOutModal(true) : handleClockIn()}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold text-xs transition-all ${isClockedIn
            ? 'bg-gradient-to-r from-zg-coral to-rose-500 text-white shadow-sm hover:brightness-105'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          aria-pressed={isClockedIn}
          aria-label={isClockedIn ? 'Clock out — end your day' : 'Clock in — start your day'}
        >
          <Clock className="w-4 h-4" aria-hidden="true" />
          {isClockedIn ? 'Day Out ' : 'Day In '}
        </button>

        {/* User profile */}
        <div className="flex items-center gap-2.5 pt-1">
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1490FE] to-[#a855f7] text-white font-bold text-xs flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            D
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-xs text-white block truncate">
              Dhaval Patel
            </span>
            <span className="text-[10px] text-zg-gray-500">Software Engineer</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
