import React from 'react'
import {
  Fingerprint,
  ArrowRight
} from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { DataCard } from '../common'

export const ClockInOutView: React.FC = () => {
  const {
    clockSubTab,
    setClockSubTab,
    clockSessions,
    biometricLogs
  } = useAppContext()

  const calculateTotalClockDuration = () => {
    let totalMinutes = 0
    clockSessions.forEach(s => {
      if (s.isActive) {
        // Assume active session duration is 01:53 for mock display (from 05:34 PM to 07:27 PM)
        totalMinutes += 113
      } else {
        const parts = s.duration.split(':')
        if (parts.length === 2) {
          totalMinutes += parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
        }
      }
    })
    const hrs = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
      {/* Sub tabs bar & Total Time info */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
          {(['System', 'Biometrics'] as const).map(t => (
            <button
              key={t}
              onClick={() => setClockSubTab(t)}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                clockSubTab === t ? 'bg-white text-[#1490FE] shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t === 'System' ? 'System' : 'Biometrics'}
            </button>
          ))}
        </div>

        {clockSubTab === 'System' && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-display font-extrabold text-slate-400 tracking-wider uppercase">Total Time:</span>
            <span className="text-[13px] font-black text-[#FF6347] font-mono bg-rose-50 border border-rose-100/50 px-3 py-1.5 rounded-xl shadow-2xs">
              {calculateTotalClockDuration()}
            </span>
          </div>
        )}
      </div>

      {/* System tab grid layout */}
      {clockSubTab === 'System' && (
        <div className="space-y-3">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-1 text-[9px] font-display font-bold uppercase tracking-widest text-slate-400/80">
            <div className="col-span-5">IN</div>
            <div className="col-span-5">OUT</div>
            <div className="col-span-2 text-right">TIME</div>
          </div>

          {/* List of sessions */}
          <div className="space-y-2">
            {clockSessions.map(session => (
              <DataCard key={session.id} isActive={session.isActive} display="grid" className="grid-cols-12 gap-4 px-6 py-4 items-center">
                {/* IN Column */}
                <div className="col-span-5 flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <span className="text-xs font-bold text-slate-700 font-mono">{session.inTime}</span>
                </div>

                {/* OUT Column */}
                <div className="col-span-5 flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${session.isActive ? 'bg-slate-300' : 'bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`} />
                  <span className="text-xs font-bold text-slate-700 font-mono">
                    {session.isActive ? '--:--' : session.outTime}
                  </span>
                </div>

                {/* TIME Column */}
                <div className="col-span-2 text-right">
                  {session.isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Running
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

      {/* Biometrics Feed tab */}
      {clockSubTab === 'Biometrics' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-display font-black tracking-widest text-slate-600 uppercase">Device Log Feed</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today</span>
          </div>

          <div className="divide-y divide-slate-50">
            {biometricLogs.map((log, idx) => {
              const isIn = log.type === 'clock-in'
              const timeLabels = ['JUST NOW', '17 MINS AGO', '2 HRS AGO', '2 HRS AGO', '4 HRS AGO', '4.5 HRS AGO', '7 HRS AGO']
              return (
                <div key={log.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors relative group"
                  style={{ borderLeft: `3px solid ${isIn ? '#22c55e' : '#ef4444'}` }}>
                  
                  <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center border-2 ${isIn ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-500'}`}>
                    {isIn ? <ArrowRight className="w-4 h-4" /> : <ArrowRight className="w-4 h-4 rotate-180" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 leading-snug">
                      <span className="font-bold">{log.user}</span> biometric {isIn ? 'clock-in' : 'clock-out'} at {log.time} in {log.location}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${isIn ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {isIn ? 'CLOCK IN' : 'CLOCK OUT'}
                      </span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className="text-[11px] text-slate-400 font-medium">{log.time}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full whitespace-nowrap tracking-wide flex-shrink-0">
                    {timeLabels[idx] || log.relativeTime.toUpperCase()}
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
