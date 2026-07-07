import React from 'react'
import { Calendar, Plus } from 'lucide-react'
import { StatusBadge } from '../common'
import type { Project } from '../../constants'

interface ProjectCardProps {
  project: Project
  onSelect?: () => void
}

/**
 * ProjectCard — individual card in the Projects grid.
 * Extracted from ProjectsView to keep file size manageable.
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const avatarColors = ['#1490FE', '#a855f7', '#FF6347', '#10B981', '#F59E0B']

  return (
    <div 
      onClick={onSelect}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-zg-vivid-blue/30 transition-all overflow-hidden group cursor-pointer"
    >
      {/* Card header with accent top border */}
      <div
        className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-50"
        style={{ borderTop: `3px solid ${project.color}` }}
      >
        <h3 className="font-display font-bold text-sm text-slate-800 truncate">{project.name}</h3>
        <button
          onClick={(e) => { e.stopPropagation(); }}
          className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-[#EFF6FF] text-slate-400 hover:text-[#1490FE] flex items-center justify-center border border-slate-100 transition-colors flex-shrink-0"
          aria-label={`Add task to ${project.name}`}
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Card body */}
      <div className="px-5 py-4 space-y-4">
        {/* Scope + Cost type */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Project Scope
            </p>
            <div className="flex flex-wrap gap-1">
              {project.scope.map((s, i) => (
                <span
                  key={i}
                  className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Cost Type
            </p>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] inline-block">
              {project.costType}
            </span>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {[
            { label: 'Expected Start', date: project.expectedStartDate },
            { label: 'Expected End', date: project.expectedEndDate },
            { label: 'Actual Start', date: project.actualStartDate },
            { label: 'Actual End', date: project.actualEndDate },
          ].map(({ label, date }) => (
            <div key={label} className="space-y-0.5">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">{label}</p>
              <div className="flex items-center gap-1 text-slate-700 font-semibold">
                <Calendar className="w-3 h-3 text-slate-400" aria-hidden="true" />
                {date}
              </div>
            </div>
          ))}
        </div>

        {/* Members + Status */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Members</p>
            <div className="flex items-center" role="list" aria-label="Project members">
              {project.members.slice(0, 4).map((m, i) => (
                <div
                  key={i}
                  role="listitem"
                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-[10px] -ml-1 first:ml-0"
                  style={{ backgroundColor: avatarColors[i % 5], zIndex: 10 - i }}
                  title={m}
                  aria-label={m}
                >
                  {m}
                </div>
              ))}
              {project.members.length > 4 && (
                <div
                  role="listitem"
                  className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 text-slate-500 font-bold text-[9px] -ml-1 flex items-center justify-center"
                  aria-label={`${project.members.length - 4} more members`}
                >
                  +{project.members.length - 4}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Status</p>
            <StatusBadge status={project.status} size="sm" />
          </div>
        </div>

        {/* Time stats */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
          {[
            { label: 'Time Spent', value: project.timeSpent },
            { label: 'Billable', value: project.timeBillable },
            { label: 'Planned', value: project.maxTimePlanned },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-0.5">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-[11px] font-black text-slate-700 font-mono">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
