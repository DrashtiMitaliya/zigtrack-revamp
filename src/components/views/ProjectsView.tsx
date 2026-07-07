import React, { useState } from 'react'
import {
  SlidersHorizontal,
  ChevronDown,
  Search,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Trash2,
  Send,
  FolderKanban,
  GitPullRequest
} from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import type { PRRequest } from '../../constants'
import { initialPRRequests } from '../../constants'

export const ProjectsView: React.FC = () => {
  const {
    projectSearch,
    setProjectSearch,
    projectStatusFilter,
    setProjectStatusFilter,
    projectsPerPage,
    projects
  } = useAppContext()

  const [subTab, setSubTab] = useState<'Projects' | 'PR Requests'>('Projects')
  const [prRequests] = useState<PRRequest[]>(initialPRRequests)
  const [prSearchQuery, setPrSearchQuery] = useState('')
  const [prStatusFilter, setPrStatusFilter] = useState('All')
  const [prProjectFilter, setPrProjectFilter] = useState('All')

  // PR summary stats
  const totalPRs = prRequests.length
  const openPRs = prRequests.filter(p => p.status === 'Open').length
  const approvedPRs = prRequests.filter(p => p.status === 'Approved').length
  const rejectedPRs = prRequests.filter(p => p.status === 'Rejected').length
  const successRatio = totalPRs > 0 ? Math.round((approvedPRs / totalPRs) * 100) : 0

  // Filter PRs
  const filteredPRs = prRequests.filter(pr => {
    const matchSearch = !prSearchQuery || pr.title.toLowerCase().includes(prSearchQuery.toLowerCase())
    const matchStatus = prStatusFilter === 'All' || pr.status === prStatusFilter
    const matchProject = prProjectFilter === 'All' || pr.project === prProjectFilter
    return matchSearch && matchStatus && matchProject
  })

  // Unique PR project names for filter
  const prProjects = [...new Set(prRequests.map(p => p.project))]

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Sub-tab selector */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="flex items-center gap-1 bg-slate-100 rounded-2xl p-1">
          {([
            { key: 'Projects' as const, icon: FolderKanban, label: 'Project List' },
            { key: 'PR Requests' as const, icon: GitPullRequest, label: 'PR Requests' },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setSubTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                subTab === tab.key ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5 text-[#1490FE]" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── PROJECT LIST TAB ─────────────────────────────────────── */}
      {subTab === 'Projects' && (
        <>
          {/* Projects sub-toolbar */}
          <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-3 flex-wrap flex-shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>
            {/* Status filter */}
            <div className="relative">
              <select value={projectStatusFilter} onChange={e => setProjectStatusFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-100 text-slate-600 font-semibold text-xs py-2 pl-3 pr-8 rounded-xl outline-none cursor-pointer">
                <option value="All">All Status</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {/* Cost Type filter */}
            <div className="relative">
              <select className="appearance-none bg-slate-50 border border-slate-100 text-slate-600 font-semibold text-xs py-2 pl-3 pr-8 rounded-xl outline-none cursor-pointer">
                <option>Project Type</option>
                <option>Dedicated</option>
                <option>Fixed</option>
                <option>Retainer</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={projectSearch} onChange={e => setProjectSearch(e.target.value)}
                  placeholder="Search by Project Name"
                  className="pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1490FE]/40 focus:bg-white transition-all text-slate-700 placeholder-slate-400 w-52" />
              </div>
              <button className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#FF6347] hover:bg-[#e05439] px-4 py-2 rounded-xl shadow-sm transition-colors">
                Apply Filter
              </button>
              <button onClick={() => { setProjectSearch(''); setProjectStatusFilter('All') }}
                className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">Clear</button>
            </div>
          </div>

          {/* Projects grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-3 gap-5">
              {projects
                .filter(p => {
                  const matchSearch = !projectSearch || p.name.toLowerCase().includes(projectSearch.toLowerCase())
                  const matchStatus = projectStatusFilter === 'All' || p.status === projectStatusFilter
                  return matchSearch && matchStatus
                })
                .map(project => (
                  <div key={project.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                    {/* Card header */}
                    <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-50"
                      style={{ borderTop: `3px solid ${project.color}` }}>
                      <h3 className="font-display font-bold text-sm text-slate-800">{project.name}</h3>
                      <button className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-[#1490FE] flex items-center justify-center border border-slate-100 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Card body */}
                    <div className="px-5 py-4 space-y-4">
                      {/* Scope + Cost Type */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Project Scope</p>
                          <div className="flex flex-wrap gap-1">
                            {project.scope.map((s, i) => (
                              <span key={i} className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cost Type</p>
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 border border-emerald-200 inline-block">{project.costType}</span>
                        </div>
                      </div>

                      {/* Dates grid */}
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="space-y-0.5">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Expected Start</p>
                          <div className="flex items-center gap-1 text-slate-700 font-semibold">
                            <Calendar className="w-3 h-3 text-slate-400" />{project.expectedStartDate}
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Expected End</p>
                          <div className="flex items-center gap-1 text-slate-700 font-semibold">
                            <Calendar className="w-3 h-3 text-slate-400" />{project.expectedEndDate}
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Actual Start</p>
                          <div className="flex items-center gap-1 text-slate-700 font-semibold">
                            <Calendar className="w-3 h-3 text-slate-400" />{project.actualStartDate}
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Actual End</p>
                          <div className="flex items-center gap-1 text-slate-700 font-semibold">
                            <Calendar className="w-3 h-3 text-slate-400" />{project.actualEndDate}
                          </div>
                        </div>
                      </div>

                      {/* Members + Status */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Members</p>
                          <div className="flex items-center">
                            {project.members.slice(0, 4).map((m, i) => (
                              <div key={i}
                                className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-[10px] -ml-1 first:ml-0"
                                style={{ backgroundColor: ['#1490FE','#a855f7','#FF6347','#10B981','#F59E0B'][i % 5], zIndex: 10 - i }}>
                                {m}
                              </div>
                            ))}
                            {project.members.length > 4 && (
                              <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 text-slate-500 font-bold text-[9px] -ml-1 flex items-center justify-center">
                                +{project.members.length - 4}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">Project Status</p>
                          <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-md inline-block border ${
                            project.status === 'In Progress' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : project.status === 'Completed' ? 'bg-blue-50 text-[#1490FE] border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>{project.status}</span>
                        </div>
                      </div>

                      {/* Time Stats */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-55 shadow-sm">
                        {[
                          { label: 'Time Spent', value: project.timeSpent },
                          { label: 'Time Billable', value: project.timeBillable },
                          { label: 'Max Planned', value: project.maxTimePlanned },
                        ].map((stat, i) => (
                          <div key={i} className="text-center space-y-0.5">
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">{stat.label}</p>
                            <p className="text-[11px] font-black text-slate-700 font-mono">{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-semibold">Showing 1 to {Math.min(projectsPerPage, projects.length)} of {projects.length} entries</span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
                <button className="w-7 h-7 rounded-lg bg-[#1490FE] text-white flex items-center justify-center text-xs font-bold shadow-sm">1</button>
                <button className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="h-20" />
          </div>
        </>
      )}

      {/* ─── PR REQUEST LIST TAB ──────────────────────────────────── */}
      {subTab === 'PR Requests' && (
        <>
          {/* PR toolbar */}
          <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-3 flex-wrap flex-shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>
            {/* Project filter */}
            <div className="relative">
              <select value={prProjectFilter} onChange={e => setPrProjectFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-100 text-slate-600 font-semibold text-xs py-2 pl-3 pr-8 rounded-xl outline-none cursor-pointer">
                <option value="All">All Projects</option>
                {prProjects.map(p => <option key={p}>{p}</option>)}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {/* Status filter */}
            <div className="relative">
              <select value={prStatusFilter} onChange={e => setPrStatusFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-100 text-slate-600 font-semibold text-xs py-2 pl-3 pr-8 rounded-xl outline-none cursor-pointer">
                <option value="All">All Status</option>
                <option>Approved</option>
                <option>Open</option>
                <option>Rejected</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={prSearchQuery} onChange={e => setPrSearchQuery(e.target.value)}
                  placeholder="Search by title"
                  className="pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-[#1490FE]/40 focus:bg-white transition-all text-slate-700 placeholder-slate-400 w-52" />
              </div>
              <button className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#FF6347] hover:bg-[#e05439] px-4 py-2 rounded-xl shadow-sm transition-colors">
                Apply Filter
              </button>
              <button onClick={() => { setPrSearchQuery(''); setPrStatusFilter('All'); setPrProjectFilter('All') }}
                className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors">Clear</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Summary stat cards */}
            <div className="grid grid-cols-5 gap-4">
              {[
                { label: 'Total', value: totalPRs, color: '#1490FE', bgColor: 'bg-blue-50', borderColor: 'border-blue-100' },
                { label: 'Open', value: openPRs, color: '#F59E0B', bgColor: 'bg-amber-50', borderColor: 'border-amber-100' },
                { label: 'Approved', value: approvedPRs, color: '#10B981', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-100' },
                { label: 'Rejected', value: rejectedPRs, color: '#FF6347', bgColor: 'bg-red-50', borderColor: 'border-red-100' },
                { label: 'Success Ratio', value: `${successRatio}%`, color: '#6366f1', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-100' },
              ].map((stat, i) => (
                <div key={i} className={`${stat.bgColor} border ${stat.borderColor} rounded-2xl p-4 text-center space-y-1.5 hover:shadow-sm transition-shadow`}>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: stat.color }}>{stat.label}</p>
                  <p className="text-2xl font-black font-mono" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* PR table */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50/80 border-b border-slate-100">
                <div className="col-span-2 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Project</div>
                <div className="col-span-1 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Date</div>
                <div className="col-span-3 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Title</div>
                <div className="col-span-2 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">PR Link</div>
                <div className="col-span-1 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Review By</div>
                <div className="col-span-1 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">PR By</div>
                <div className="col-span-1 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Status</div>
                <div className="col-span-1 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Action</div>
              </div>

              {/* Table rows */}
              {filteredPRs.map(pr => (
                <div key={pr.id} className="grid grid-cols-12 gap-3 px-5 py-3.5 border-b border-slate-50 items-center hover:bg-slate-50/40 transition-colors group">
                  {/* Project */}
                  <div className="col-span-2">
                    <span className="text-xs font-bold text-slate-700">{pr.project}</span>
                  </div>

                  {/* Date */}
                  <div className="col-span-1">
                    <span className="text-[11px] font-semibold text-slate-500 font-mono">{pr.date}</span>
                  </div>

                  {/* Title */}
                  <div className="col-span-3">
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed line-clamp-2">{pr.title}</p>
                  </div>

                  {/* PR Link */}
                  <div className="col-span-2">
                    <a
                      href={pr.prLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-[#1490FE] hover:underline truncate block"
                    >
                      {pr.prLink}
                    </a>
                  </div>

                  {/* Review By */}
                  <div className="col-span-1">
                    <span className="text-[11px] font-semibold text-slate-600">{pr.reviewBy}</span>
                  </div>

                  {/* PR Generated By */}
                  <div className="col-span-1">
                    <span className="text-[11px] font-semibold text-slate-600">{pr.prGeneratedBy}</span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg inline-block border ${
                      pr.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : pr.status === 'Open' ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-red-50 text-red-600 border-red-200'
                    }`}>{pr.status}</span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-center gap-1.5">
                    <button className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-[#1490FE] flex items-center justify-center border border-slate-100 transition-colors" title="View">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-[#FF6347] flex items-center justify-center border border-slate-100 transition-colors" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 flex items-center justify-center border border-slate-100 transition-colors" title="Send">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredPRs.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <p className="text-sm text-slate-400 font-semibold">No PR requests found matching your filters.</p>
                </div>
              )}
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-semibold">Showing 1 to {filteredPRs.length} entries out of {prRequests.length} entries</span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
                <button className="w-7 h-7 rounded-lg bg-[#1490FE] text-white flex items-center justify-center text-xs font-bold shadow-sm">1</button>
                <button className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="h-20" />
          </div>
        </>
      )}
    </div>
  )
}
export default ProjectsView
