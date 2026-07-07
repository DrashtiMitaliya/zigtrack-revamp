import React, { useState } from 'react'
import {
  Clock,
  Briefcase,
  LayoutDashboard,
  FileText,
  ChevronDown
} from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { useLocation, useNavigate } from 'react-router-dom'

interface SidebarProps {
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

/**
 * Sidebar — retractable sidebar layout.
 * Toggles expand/collapse on hover (mouseenter/mouseleave).
 * Features a permanent Clock In/Out Day button and User Profile at the bottom.
 */
export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const {
    isClockedIn,
    setShowDayOutModal,
    handleClockIn
  } = useAppContext()

  const location = useLocation()
  const navigate = useNavigate()

  // Starts collapsed by default
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isTimesheetExpanded, setIsTimesheetExpanded] = useState(true)

  const handleNav = (name: string) => {
    if (name === 'Dashboards') navigate('/dashboards')
    else if (name === 'Clock In/Out') navigate('/clock-in-out')
    else if (name === 'Timesheet') navigate('/timesheet')
    else if (name === 'Timesheet Manage') navigate('/timesheet/manage')
    else if (name === 'Timesheet Status') navigate('/timesheet/status')
    else if (name === 'Projects') navigate('/projects')
    onClose?.() // close drawer on mobile
  }

  const navBtnClass = (isActive: boolean) =>
    `w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer ${isActive
      ? 'bg-zg-vivid-blue/15 text-zg-vivid-blue font-bold border-l-2 border-zg-vivid-blue rounded-l-none'
      : 'hover:bg-zg-gray-800 text-zg-gray-500 hover:text-white'
    }`

  const isTimesheetActive = location.pathname.startsWith('/timesheet')

  return (
    <aside
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
      className={`flex flex-col justify-between bg-zg-chinese-black border-r border-zg-gray-800 shadow-sm flex-shrink-0 h-full transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      aria-label="Primary navigation"
    >
      {/* Header section (Brand Logo) */}
      <div className="p-4 border-b border-zg-gray-800 flex items-center flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-zg-vivid-blue flex items-center justify-center text-white font-extrabold shadow-[0_4px_12px_rgba(20,144,254,0.3)] flex-shrink-0">
            Z
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-display font-black text-sm text-white tracking-wide uppercase">
                ZigTrack
              </h1>
              <p className="text-[9px] text-zg-gray-500 font-semibold leading-none mt-0.5">
                WORKSPACE
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nav items list */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-4">
        {!isCollapsed && (
          <p className="text-[9px] font-display font-bold tracking-widest text-zg-gray-500 uppercase px-2 mb-2">
            WORKSPACES
          </p>
        )}
        <nav className="space-y-1">
          {navItems.map(({ name, icon: Icon, badge, hasDot, subItems }) => {
            const isActive = 
              (name === 'Dashboards' && (location.pathname === '/dashboards' || location.pathname === '/')) ||
              (name === 'Clock In/Out' && location.pathname === '/clock-in-out') ||
              (name === 'Projects' && location.pathname.startsWith('/projects')) ||
              (name === 'Timesheet' && isTimesheetActive)

            // Collapsed navigation button
            if (isCollapsed) {
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    if (subItems) {
                      handleNav('Timesheet Manage')
                    } else {
                      handleNav(name)
                    }
                  }}
                  className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zg-vivid-blue/15 text-zg-vivid-blue font-bold shadow-xs'
                      : 'hover:bg-zg-gray-800 text-zg-gray-500 hover:text-white'
                  }`}
                  title={name}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-zg-vivid-blue' : 'text-zg-gray-500'}`} />
                </button>
              )
            }

            // Expanded navigation button
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

                {/* Expanded submenu items */}
                {subItems && isTimesheetExpanded && (
                  <div className="mt-1 pl-4 space-y-1">
                    {subItems.map(sub => {
                      const isSubActive = 
                        (sub.key === 'Timesheet Manage' && location.pathname === '/timesheet/manage') ||
                        (sub.key === 'Timesheet Status' && location.pathname === '/timesheet/status')
                      return (
                        <button
                          key={sub.key}
                          type="button"
                          onClick={() => handleNav(sub.key)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isSubActive
                            ? 'bg-zg-vivid-blue text-white shadow-xs'
                            : 'hover:bg-zg-gray-800 text-zg-gray-500 hover:text-white'
                            }`}
                        >
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

      {/* Footer permanent Day In/Out and User Profile */}
      {isCollapsed ? (
        <div className="p-3 border-t border-zg-gray-800 space-y-3 flex flex-col items-center flex-shrink-0">
          <button
            onClick={() => isClockedIn ? setShowDayOutModal(true) : handleClockIn()}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer text-white ${
              isClockedIn
                ? 'bg-gradient-to-r from-zg-coral to-rose-500'
                : 'bg-emerald-600 hover:bg-emerald-550'
            }`}
            title={isClockedIn ? 'Day Out' : 'Day In'}
          >
            <Clock className="w-5 h-5" />
          </button>

          <div
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1490FE] to-[#a855f7] text-white font-bold text-xs flex items-center justify-center flex-shrink-0"
            title="Dhaval Patel (Software Engineer)"
          >
            D
          </div>
        </div>
      ) : (
        <div className="p-4 border-t border-zg-gray-800 space-y-3 flex-shrink-0">
          <button
            onClick={() => isClockedIn ? setShowDayOutModal(true) : handleClockIn()}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              isClockedIn
                ? 'bg-gradient-to-r from-zg-coral to-rose-500 text-white shadow-sm hover:brightness-105'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            {isClockedIn ? 'Day Out' : 'Day In'}
          </button>

          <div className="flex items-center gap-2.5 pt-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1490FE] to-[#a855f7] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
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
      )}
    </aside>
  )
}

export default Sidebar
