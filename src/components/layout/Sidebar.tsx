import React from 'react'
import {
  Clock,
  Briefcase,
  LayoutDashboard,
  FileText,
  TrendingUp,
  Settings,
  HelpCircle,
  MessageSquare
} from 'lucide-react'
import { useAppContext } from '../../context/AppContext'

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isClockedIn,
    setIsClockedIn
  } = useAppContext()

  const navItems = [
    { name: 'Dashboards', icon: LayoutDashboard },
    { name: 'Clock In/Out', icon: Clock },
    { name: 'Timesheet', icon: FileText, badge: 'Active' },
    { name: 'Projects', icon: Briefcase, hasDot: true },
    { name: 'Reports', icon: TrendingUp },
    { name: 'Board', icon: Settings },
  ]

  return (
    <aside className="w-64 flex flex-col justify-between bg-zg-chinese-black border-r border-zg-gray-800 z-20 shadow-sm flex-shrink-0">
      <div className="p-5 border-b border-zg-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1490FE] to-[#00C6FF] flex items-center justify-center font-display font-black text-white text-xs shadow-[0_4px_12px_rgba(20,144,254,0.2)]">
            {"</>"}
          </div>
          <div>
            <span className="font-display font-bold text-sm text-white block leading-tight">ZigTrack</span>
            <span className="text-[9px] font-display font-bold tracking-widest text-zg-vivid-blue uppercase">TECHNOLAB</span>
          </div>
        </div>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-5">
        <div>
          <p className="text-[9px] font-display font-bold tracking-widest text-zg-gray-500 uppercase px-2 mb-2">WORKSPACES</p>
          <nav className="space-y-0.5">
            {navItems.map(({ name, icon: Icon, badge, hasDot }) => {
              const isActive = activeTab === name
              return (
                <button
                  key={name}
                  onClick={() => setActiveTab(name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                    isActive 
                      ? 'bg-zg-vivid-blue/15 text-zg-vivid-blue font-bold border-l-2 border-zg-vivid-blue rounded-l-none' 
                      : 'hover:bg-zg-gray-800 text-zg-gray-500 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-zg-vivid-blue' : 'text-zg-gray-500'}`} />
                    <span>{name}</span>
                  </div>
                  {hasDot && !isActive && <span className="w-1.5 h-1.5 rounded-full bg-zg-vivid-blue" />}
                  {badge && (
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-zg-vivid-blue/20 text-zg-vivid-blue' 
                        : 'bg-zg-gray-800 text-zg-gray-500'
                    }`}>
                      {badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        <div>
          <p className="text-[9px] font-display font-bold tracking-widest text-zg-gray-500 uppercase px-2 mb-2">SUPPORT</p>
          <nav className="space-y-0.5">
            {[
              { name: 'Help & Docs', icon: HelpCircle },
              { name: 'Feedback', icon: MessageSquare }
            ].map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  activeTab === name 
                    ? 'bg-zg-vivid-blue/15 text-zg-vivid-blue font-bold border-l-2 border-zg-vivid-blue rounded-l-none' 
                    : 'hover:bg-zg-gray-800 text-zg-gray-500 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-zg-gray-500" />
                <span>{name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-zg-gray-800 space-y-3">
        <button
          onClick={() => setActiveTab('Timesheet')}
          className="w-full flex items-center justify-between bg-gradient-to-r from-zg-coral to-rose-500 text-white py-2 px-3.5 rounded-xl text-xs font-semibold shadow-sm hover:brightness-105 transition-all"
        >
          <span>Pending Review</span>
          <span className="bg-white text-rose-600 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]">1</span>
        </button>

        <button
          onClick={() => setIsClockedIn(!isClockedIn)}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold text-xs transition-all ${
            isClockedIn 
              ? 'bg-zg-coral/10 text-zg-coral border border-zg-coral/20 hover:bg-zg-coral/20' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          {isClockedIn ? 'Day Out (Clock Out)' : 'Day In (Clock In)'}
        </button>

        <div className="flex items-center gap-2.5 pt-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1490FE] to-[#a855f7] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">D</div>
          <div className="min-w-0">
            <span className="font-semibold text-xs text-white block truncate">Dhaval Patel</span>
            <span className="text-[10px] text-zg-gray-500">Software Engineer</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
export default Sidebar
