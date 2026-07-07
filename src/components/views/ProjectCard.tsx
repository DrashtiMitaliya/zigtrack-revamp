import React, { useState } from 'react'
import { Plus, Clock, Briefcase, Award } from 'lucide-react'
import { StatusBadge } from '../common'
import type { Project } from '../../constants'

interface ProjectCardProps {
  project: Project
  onSelect?: () => void
}

/**
 * ProjectCard — Restructured card in the Projects grid.
 * Features a circular SVG progress dial for the Billable Ratio, dynamic border hover transitions, and clean spacing.
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false)
  const avatarColors = [
    'bg-[#1490FE] text-white', 
    'bg-[#a855f7] text-white', 
    'bg-[#FF6347] text-white', 
    'bg-[#10B981] text-white', 
    'bg-[#F59E0B] text-white'
  ]

  // Time parsing and billable ratio calculation
  const parseHours = (tStr: string): number => {
    const parts = (tStr || '0').split(':')
    return parseFloat(parts[0]) || 0
  }

  const spent = parseHours(project.timeSpent)
  const billable = parseHours(project.timeBillable)
  const progressPercent = spent > 0 ? Math.round((billable / spent) * 100) : 0

  return (
    <div 
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        borderColor: isHovered ? project.color : '#E2E8F0',
        boxShadow: isHovered ? `0 24px 48px rgba(0,0,0,0.03), 0 0 16px ${project.color}15` : 'none'
      }}
      className="bg-white border-2 rounded-[32px] p-6 flex flex-col justify-between h-[410px] transition-all duration-300 ease-out group cursor-pointer"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <span 
              className="w-3.5 h-3.5 rounded-full flex-shrink-0" 
              style={{ backgroundColor: project.color }}
            />
            <h3 className="font-display font-black text-base sm:text-lg text-slate-800 truncate group-hover:text-[#1490FE] transition-colors leading-tight">
              {project.name}
            </h3>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-[#1490FE] text-slate-400 hover:text-white flex items-center justify-center border border-slate-200 transition-all flex-shrink-0 hover:scale-105 active:scale-95"
            aria-label={`Add task to ${project.name}`}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Card Body */}
        <div className="space-y-4">
          {/* Main Info Columns: Left Details, Right Circular Progress */}
          <div className="grid grid-cols-12 gap-3 items-center">
            
            {/* Left Details */}
            <div className="col-span-8 space-y-3">
              <div className="space-y-1">
                <span className="text-[9px] font-display font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-slate-400" /> Scope
                </span>
                <div className="flex flex-wrap gap-1">
                  {project.scope.map((s, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-650 border border-slate-200/50"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-[9px] font-display font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Award className="w-3 h-3 text-slate-400" /> Cost Type
                </span>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-emerald-55 text-emerald-700 border border-[#A7F3D0] inline-block">
                  {project.costType}
                </span>
              </div>
            </div>

            {/* Right Circular Gauge */}
            <div className="col-span-4 flex justify-end">
              <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 p-2.5 rounded-2xl w-full max-w-[85px] shadow-xs">
                <span className="text-[8px] font-display font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5 text-slate-400" /> Billable
                </span>
                <div className="relative w-11 h-11 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="22"
                      cy="22"
                      r="16"
                      stroke="#F1F5F9"
                      strokeWidth="3.5"
                      fill="transparent"
                    />
                    <circle
                      cx="22"
                      cy="22"
                      r="16"
                      stroke={project.color}
                      strokeWidth="3.5"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={2 * Math.PI * 16 * (1 - progressPercent / 100)}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute font-mono font-black text-[9px] text-slate-700">{progressPercent}%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Timelines comparison grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50/50 border border-slate-100 p-3.5 rounded-2xl">
            <div className="space-y-1.5 border-r border-slate-200/60 pr-2">
              <span className="text-[8px] font-display font-black text-slate-400 uppercase tracking-wider block">Start Dates</span>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-350" />
                  <span>Exp: {project.expectedStartDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1490FE]" />
                  <span>Act: {project.actualStartDate}</span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 pl-2">
              <span className="text-[8px] font-display font-black text-slate-400 uppercase tracking-wider block">End Dates</span>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-350" />
                  <span>Exp: {project.expectedEndDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6347]" />
                  <span>Act: {project.actualEndDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="space-y-1">
          <p className="text-[8px] font-display font-black text-slate-400 uppercase tracking-widest">Members</p>
          <div className="flex items-center" role="list" aria-label="Project members">
            {project.members.slice(0, 4).map((m, i) => (
              <div
                key={i}
                role="listitem"
                className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center font-black text-[9px] -ml-2 first:ml-0 shadow-xs ${avatarColors[i % 5]}`}
                style={{ zIndex: 10 - i }}
                title={m}
                aria-label={m}
              >
                {m}
              </div>
            ))}
            {project.members.length > 4 && (
              <div
                role="listitem"
                className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 text-slate-500 font-black text-[8px] -ml-2 flex items-center justify-center shadow-xs"
                aria-label={`${project.members.length - 4} more members`}
              >
                +{project.members.length - 4}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1 text-right">
          <p className="text-[8px] font-display font-black text-slate-400 uppercase tracking-widest">Status</p>
          <StatusBadge status={project.status} size="sm" />
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
