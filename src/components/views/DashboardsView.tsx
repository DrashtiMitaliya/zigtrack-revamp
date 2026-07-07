import React from 'react'
import {
  Clock,
  Zap,
  Briefcase,
  TrendingUp,
  UserCheck,
  PieChart,
  Plus,
  MinusCircle,
  Copy,
  List,
  ClipboardList,
  ChevronRight
} from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { SectionHeader, Badge } from '../common'
import { initialTimeLogs, initialActivityHistory, initialProjectTimes } from '../../constants'

// ─── Stat card ───────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string
  sub: string
  subColor: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

const StatCard: React.FC<StatCardProps> = ({
  label, value, sub, subColor, icon: Icon, iconBg, iconColor
}) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
    <div className="space-y-1">
      <span className="text-[10px] font-display font-bold text-slate-400 tracking-wider uppercase block">
        {label}
      </span>
      <h3 className="text-xl font-display font-black text-slate-800">{value}</h3>
      <span className={`text-[11px] font-bold ${subColor}`}>{sub}</span>
    </div>
    <div className={`w-11 h-11 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center`}>
      <Icon className="w-5 h-5" aria-hidden="true" />
    </div>
  </div>
)

// ─── Dashboard view ──────────────────────────────────────────────────────────
export const DashboardsView: React.FC = () => {
  const {
    watchlist,
    setWatchlist,
    setShowAddProjectModal,
    expandedLogId,
    setExpandedLogId,
    handleCopy
  } = useAppContext()

  const statCards: StatCardProps[] = [
    {
      label: 'Hours Logged Today',
      value: '6hr 21m',
      sub: 'On track for shift target',
      subColor: 'text-[#10B981]',
      icon: Clock,
      iconBg: 'bg-[#D9E8F5]',
      iconColor: 'text-[#1490FE]',
    },
    {
      label: 'Efficiency Rating',
      value: '96.8%',
      sub: 'Top project: Tech General',
      subColor: 'text-[#1490FE]',
      icon: Zap,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Project Watchlist',
      value: `${watchlist.length} Active`,
      sub: 'Monitoring Freightro efforts',
      subColor: 'text-slate-400',
      icon: Briefcase,
      iconBg: 'bg-[#FF6347]/10',
      iconColor: 'text-[#FF6347]',
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
      {/* ── Stat cards ── responsive: 1 col → 2 col → 3 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* ── Main content grid: 2/3 + 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Time Blocks Today */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
            <SectionHeader
              icon={Clock}
              title="Time Blocks Today"
              rightSlot={
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-lg">
                  {initialTimeLogs.length} Blocks
                </span>
              }
            />
            <div className="space-y-2">
              {initialTimeLogs.map(log => {
                const isExpanded = expandedLogId === log.id
                const isLnD = log.project === 'Learning and Development'
                return (
                  <div
                    key={log.id}
                    className="group p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <Badge variant={isLnD ? 'purple' : 'blue'}>
                            {log.project}
                          </Badge>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {isExpanded ? log.fullDescription : log.description}
                            <button
                              onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                              className="text-[#1490FE] hover:underline ml-1 font-bold"
                              aria-label={isExpanded ? 'Show less' : 'Show more'}
                            >
                              {isExpanded ? 'less' : 'more'}
                            </button>
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0">
                        {log.duration}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
            <SectionHeader icon={TrendingUp} title="Activity Logs" />
            <div className="relative pl-5 border-l border-slate-100 space-y-4 py-1">
              {initialActivityHistory.map(item => {
                const isDayIn = item.action === 'Day In'
                return (
                  <div key={item.id} className="relative group">
                    <span
                      className={`absolute -left-[29px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center ${
                        isDayIn ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FEF2F2] text-[#DC2626]'
                      }`}
                      aria-hidden="true"
                    >
                      <UserCheck className="w-2.5 h-2.5" />
                    </span>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50/60 transition-all gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {item.user.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            {item.user}
                            <Badge
                              variant={isDayIn ? 'success' : 'error'}
                              className="ml-1.5"
                            >
                              {item.action}
                            </Badge>
                          </p>
                          <p className="text-[10px] text-slate-400">{item.timestamp}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                        {item.relativeTime}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Effort Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
            <SectionHeader
              icon={PieChart}
              iconBg="bg-purple-50 text-purple-600"
              title="Effort Breakdown"
            />
            <div className="space-y-4">
              {initialProjectTimes.map((p, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-slate-600 font-semibold text-[11px]">{p.name}</span>
                    <span className="text-slate-700 font-bold text-[11px]">{p.duration}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${p.percent}%`, backgroundColor: p.color }}
                      role="progressbar"
                      aria-valuenow={p.percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${p.name}: ${p.percent}%`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 text-right">{p.percent}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Watchlist */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
            <SectionHeader
              icon={Briefcase}
              iconBg="bg-[#FF6347]/10 text-[#FF6347]"
              title="Watchlist"
              rightSlot={
                <button
                  onClick={() => setShowAddProjectModal(true)}
                  className="p-1.5 bg-[#1490FE] hover:bg-[#0070DF] text-white rounded-lg shadow-sm transition-all"
                  aria-label="Add project to watchlist"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              }
            />
            <div className="space-y-2">
              {watchlist.map(proj => (
                <div
                  key={proj.id}
                  className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50/40 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold text-xs flex items-center justify-center"
                        aria-hidden="true"
                      >
                        {proj.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-xs text-slate-800">{proj.name}</span>
                    </div>
                    <button
                      onClick={() => setWatchlist(watchlist.filter(p => p.id !== proj.id))}
                      className="p-1 text-slate-400 hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                      aria-label={`Remove ${proj.name} from watchlist`}
                    >
                      <MinusCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                    {[
                      { Icon: Copy,          fn: () => handleCopy(proj.name), label: 'Copy project name' },
                      { Icon: List,          fn: () => {},                    label: 'View tasks' },
                      { Icon: ClipboardList, fn: () => {},                    label: 'View logs' },
                      { Icon: ChevronRight,  fn: () => {},                    label: 'View details', color: 'hover:text-[#1490FE]' },
                    ].map(({ Icon, fn, label, color }, i) => (
                      <button
                        key={i}
                        onClick={fn}
                        aria-label={label}
                        className={`p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-md transition-colors ${color ?? ''}`}
                      >
                        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-20" />
    </div>
  )
}

export default DashboardsView
