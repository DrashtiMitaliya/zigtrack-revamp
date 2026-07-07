import React from 'react'
import { Fingerprint, ArrowRight } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { DataCard, SubTabBar } from '../common'
import { calculateTotalClockDuration } from '../../utils'

const systemTabs = [
  { key: 'System' as const, label: 'System' },
  { key: 'Biometrics' as const, label: 'Biometrics' },
]

export const ClockInOutView: React.FC = () => {
  const {
    clockSubTab,
    setClockSubTab,
    clockSessions,
    biometricLogs
  } = useAppContext()
  const timeLabels = ['JUST NOW', '17 MINS AGO', '2 HRS AGO', '2 HRS AGO', '4 HRS AGO', '4.5 HRS AGO', '7 HRS AGO']

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
      {/* Sub-tabs + total time */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <SubTabBar
          tabs={systemTabs}
          activeTab={clockSubTab}
          onTabChange={setClockSubTab}
        />

        {clockSubTab === 'System' && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-display font-extrabold text-slate-400 tracking-wider uppercase">
              Total Time:
            </span>
            <span
              className="text-[13px] font-black text-[#FF6347] font-mono bg-[#FEF2F2] border border-[#FECACA] px-3 py-1.5 rounded-xl shadow-sm"
              aria-label={`Total time: ${calculateTotalClockDuration(clockSessions)}`}
            >
              {calculateTotalClockDuration(clockSessions)}
            </span>
          </div>
        )}
      </div>

      {/* ── System tab ─────────────────────────────── */}
      {clockSubTab === 'System' && (
        <div className="space-y-3">
          {/* Table column headers */}
          <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-1 text-[9px] font-display font-bold uppercase tracking-widest text-slate-400/80">
            <div className="col-span-5">IN</div>
            <div className="col-span-5">OUT</div>
            <div className="col-span-2 text-right">TIME</div>
          </div>

          {/* Fluid responsive list container - fits on any viewport size without horizontal scrolling */}
          <div className="space-y-2">
            {clockSessions.map(session => (
              <DataCard
                key={session.id}
                isActive={session.isActive}
                display="grid"
                className="grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center"
              >
                {/* IN */}
                <div className="col-span-5 flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-bold text-slate-700 font-mono">
                    {session.inTime}
                  </span>
                </div>

                {/* OUT */}
                <div className="col-span-5 flex items-center gap-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      session.isActive
                        ? 'bg-slate-300'
                        : 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="text-xs font-bold text-slate-700 font-mono">
                    {session.isActive ? '--:--' : session.outTime}
                  </span>
                </div>

                {/* DURATION */}
                <div className="col-span-2 text-right">
                  {session.isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1 rounded-lg uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" aria-hidden="true" />
                      <span className="hidden xs:inline">Running</span>
                    </span>
                  ) : (
                    <span className="text-xs font-black text-slate-800 font-mono">
                      {session.duration}
                    </span>
                  )}
                </div>
              </DataCard>
            ))}
          </div>
        </div>
      )}

      {/* ── Biometrics tab ─────────────────────────── */}
      {clockSubTab === 'Biometrics' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-slate-400" aria-hidden="true" />
              <span className="text-xs font-display font-black tracking-widest text-slate-600 uppercase">
                Device Log Feed
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Today
            </span>
          </div>

          <div className="divide-y divide-slate-50" role="list" aria-label="Biometric events">
            {biometricLogs.map((log, idx) => {
              const isIn = log.type === 'clock-in'
              return (
                <div
                  key={log.id}
                  role="listitem"
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors relative group"
                  style={{ borderLeft: `3px solid ${isIn ? '#22c55e' : '#ef4444'}` }}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center border-2 ${
                      isIn
                        ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]'
                        : 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]'
                    }`}
                    aria-hidden="true"
                  >
                    <ArrowRight className={`w-4 h-4 ${isIn ? '' : 'rotate-180'}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 leading-snug">
                      <span className="font-bold">{log.user}</span>{' '}
                      biometric {isIn ? 'clock-in' : 'clock-out'} at {log.time} in {log.location}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-widest ${
                          isIn ? 'text-[#059669]' : 'text-[#DC2626]'
                        }`}
                      >
                        {isIn ? 'CLOCK IN' : 'CLOCK OUT'}
                      </span>
                      <span className="text-slate-300 text-xs" aria-hidden="true">•</span>
                      <span className="text-[11px] text-slate-400 font-medium">{log.time}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full whitespace-nowrap tracking-wide flex-shrink-0">
                    {timeLabels[idx] ?? log.relativeTime.toUpperCase()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="h-20" />
    </div>
  )
}

export default ClockInOutView
