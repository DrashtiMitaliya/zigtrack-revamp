import React, { useState } from 'react'
import {
  ChevronDown,
  ArrowLeft,
  Calendar,
  Users,
  ListTodo,
  Map,
  ShieldAlert,
  FileText,
  GitPullRequest,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Bell,
  AlertTriangle
} from 'lucide-react'
import type { Project } from '../../constants'
import { initialPRRequests } from '../../constants'
import { StatusBadge } from '../common'

interface ProjectDetailViewProps {
  project: Project
  onBack: () => void
  projects: Project[]
  onSelectProject: (id: number) => void
}

// ─── Helpers to map members ──────────────────────────────────────────────────
const MEMBER_MAP: Record<string, { name: string; role: string }> = {
  H: { name: 'Harsh Shah', role: 'Project Lead' },
  J: { name: 'Jigar Patel', role: 'Sr. Frontend Engineer' },
  M: { name: 'Mansi Sharma', role: 'UI/UX Designer' },
  L: { name: 'Lalit Kumar', role: 'QA Lead' },
  K: { name: 'Kunal Vyas', role: 'DevOps Engineer' },
  A: { name: 'Amit Patel', role: 'Full Stack Engineer' },
  B: { name: 'Bhavesh Joshi', role: 'Product Manager' },
  R: { name: 'Riya Sen', role: 'Technical Writer' },
  D: { name: 'Dhaval Patel', role: 'Software Engineer' },
  S: { name: 'Siddharth Shah', role: 'QA Automation' },
  V: { name: 'Vijay Parmar', role: 'Backend Developer' },
  Y: { name: 'Yash Dave', role: 'Android Developer' },
  P: { name: 'Pooja Mehta', role: 'Scrum Master' },
  N: { name: 'Nitin Vyas', role: 'Support Specialist' },
  T: { name: 'Tushar Patel', role: 'Database Engineer' },
}

const getMemberDetails = (initial: string) => {
  return MEMBER_MAP[initial] || { name: `Team Member ${initial}`, role: 'Engineer' }
}

const avatarColors = ['bg-[#1490FE]', 'bg-[#a855f7]', 'bg-[#FF6347]', 'bg-[#10B981]', 'bg-[#F59E0B]']

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onBack,
  projects,
  onSelectProject,
}) => {
  const [activeTab, setActiveTab] = useState<'Summary' | 'Team' | 'List' | 'Master Plan' | 'QAssure' | 'Notes' | 'PR Request'>('Summary')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // ─── Task Checklist Local State ────────────────────────────────────────────
  const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean; priority: 'High' | 'Medium' | 'Low' }[]>([
    { id: 1, text: 'Implement Student Feedback for Admin dashboard', completed: true, priority: 'High' },
    { id: 2, text: 'Fix assessment score calculation for weighted rubrics', completed: true, priority: 'High' },
    { id: 3, text: 'Vite migration and package updates compatibility check', completed: false, priority: 'Medium' },
    { id: 4, text: 'Design system component integration in dashboard overview', completed: false, priority: 'Medium' },
    { id: 5, text: 'Configure automatic daily email reports on Clock Out', completed: false, priority: 'Low' },
  ])
  const [newTaskText, setNewTaskText] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium')

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskText.trim()) return
    setTasks([...tasks, { id: Date.now(), text: newTaskText, completed: false, priority: newTaskPriority }])
    setNewTaskText('')
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  // ─── QAssure Local State ───────────────────────────────────────────────────
  const [defects] = useState([
    { id: 'BUG-101', title: 'Score rounding error on student feedback submission form', severity: 'High', status: 'Resolved' },
    { id: 'BUG-102', title: 'Session timeouts occurring after short inactivity on client portal', severity: 'Critical', status: 'Open' },
    { id: 'BUG-103', title: 'Profile initials alignment in header is slightly shifted', severity: 'Low', status: 'Close' },
    { id: 'BUG-104', title: 'Search filter clears selected status parameters in projects list', severity: 'Medium', status: 'Reopen' },
  ])

  // ─── Notes Local State ─────────────────────────────────────────────────────
  const [notes, setNotes] = useState<{ id: number; text: string; date: string }[]>([
    { id: 1, text: 'Discussed scope details with ES Dubai team. Milestone 1 deadline shifted to August.', date: 'July 05, 2026' },
    { id: 2, text: 'Need to review Vite build configuration for nested routing compatibility.', date: 'July 06, 2026' },
  ])
  const [newNoteText, setNewNoteText] = useState('')

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoteText.trim()) return
    setNotes([{ id: Date.now(), text: newNoteText, date: 'Today' }, ...notes])
    setNewNoteText('')
  }

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  // ─── PR Requests Filtered for this Project ───────────────────────────────
  const filteredPRs = initialPRRequests.filter(pr => pr.project.toLowerCase() === project.name.toLowerCase())

  // ─── Pie Chart Calculations ───────────────────────────────────────────────
  const parseHours = (tStr: string): number => {
    const parts = tStr.split(':')
    if (parts.length >= 1) {
      const hrs = parseFloat(parts[0]) || 0
      const mins = parts[1] ? parseFloat(parts[1]) / 60 : 0
      return hrs + mins
    }
    return 0
  }

  const spentHrs = parseHours(project.timeSpent)
  const billableHrs = parseHours(project.timeBillable)
  const billablePercent = spentHrs > 0 ? Math.min(100, Math.round((billableHrs / spentHrs) * 1000) / 10) : 0
  const nonBillablePercent = spentHrs > 0 ? Math.round((100 - billablePercent) * 10) / 10 : 0

  // SVG Pie chart parameters
  const radius = 35
  const circ = 2 * Math.PI * radius
  const billableStrokeDash = circ * (billablePercent / 100)
  const nonBillableStrokeDash = circ * (nonBillablePercent / 100)

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-zg-whitesmoke text-zg-chinese-black">
      {/* ─── Detail View Header ──────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-shrink-0">
        
        {/* Project Selector / Name */}
        <div className="flex items-center gap-3 relative">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm" style={{ backgroundColor: project.color }}>
            {project.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <h2 className="font-display font-black text-base text-slate-800 tracking-tight">
                {project.name}
              </h2>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5">
              Project Dashboard
            </p>
          </div>

          {/* Project switch dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute top-12 left-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-4 py-1.5 border-b border-slate-100">
                Switch Project
              </p>
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p.id)
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2 ${
                    p.id === project.id ? 'text-[var(--accent)] bg-[#EFF6FF]' : 'text-slate-650'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sub-tab Navigation */}
        <nav className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl md:mx-auto">
          {([
            { key: 'Summary', icon: FileText },
            { key: 'Team', icon: Users },
            { key: 'List', icon: ListTodo },
            { key: 'Master Plan', icon: Map },
            { key: 'QAssure', icon: ShieldAlert },
            { key: 'Notes', icon: FileText },
            { key: 'PR Request', icon: GitPullRequest },
          ] as const).map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === key
                  ? 'bg-white text-[var(--accent)] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{key}</span>
            </button>
          ))}
        </nav>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition-all self-start md:self-auto hover:scale-101 active:scale-99"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </header>

      {/* ─── Scrollable Tab Content ────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* ══════════════════════════════════════════════════════════════════
            SUMMARY TAB
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Summary' && (
          <div className="space-y-6">
            
            {/* Top row: Overview & Stats Grid & Pie Chart */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Project Overview Card (6 cols) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs xl:col-span-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                    Project Overview
                  </h3>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Project Description
                    </p>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium">
                      {project.name === 'ES AI Assessment' 
                        ? 'Dedicated team engagement monthly for the existing project to extend the features and solution'
                        : `Standard operating workflow and modular feature expansion suite tailored for the ${project.name} framework.`}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Project Scope
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.scope.map((tag, i) => (
                        <span key={i} className="text-[10px] font-extrabold px-3 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Project Status
                    </p>
                    <StatusBadge status={project.status} size="sm" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Cost Type
                    </p>
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-lg bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                      {project.costType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project Stats (4 cols) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs xl:col-span-4 grid grid-cols-2 gap-4">
                <div className="col-span-2 border-b border-slate-100 pb-2">
                  <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                    Project Metadata
                  </h3>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Client Name</p>
                  <p className="text-sm font-black text-slate-800">{project.name === 'ES AI Assessment' ? 'ES Dubai' : 'Internal Client'}</p>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Project Code</p>
                  <p className="text-sm font-black text-slate-800 font-mono">
                    {project.name === 'ES AI Assessment' ? 'ESAIA' : project.name.split(' ').map(w => w.charAt(0)).join('').toUpperCase()}
                  </p>
                </div>

                <div className="space-y-0.5 pt-2 border-t border-slate-50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Time Spent</p>
                  <p className="text-sm font-black text-slate-700 font-mono">{project.timeSpent}</p>
                </div>

                <div className="space-y-0.5 pt-2 border-t border-slate-50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Planned Limit</p>
                  <p className="text-sm font-black text-slate-700 font-mono">{project.maxTimePlanned}</p>
                </div>

                <div className="space-y-0.5 col-span-2 pt-3 border-t border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Time Billable</p>
                  <p className="text-base font-black text-[var(--accent)] font-mono">{project.timeBillable}</p>
                </div>
              </div>

              {/* Pie Chart Card (3 cols) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs xl:col-span-3 flex flex-col items-center justify-center">
                <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider mb-4 self-start">
                  Billable Ratio
                </h3>

                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background track circle */}
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#E2E8F0" strokeWidth="12" />
                    
                    {/* Billable Arc (Blue) */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke="#1490FE"
                      strokeWidth="12"
                      strokeDasharray={`${billableStrokeDash} ${circ}`}
                      strokeLinecap="round"
                    />

                    {/* Non-Billable Arc (Orange/Gray) */}
                    {nonBillablePercent > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="#FF6347"
                        strokeWidth="12"
                        strokeDasharray={`${nonBillableStrokeDash} ${circ}`}
                        strokeDashoffset={-billableStrokeDash}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>

                  {/* Inner text overlay */}
                  <div className="absolute text-center">
                    <span className="block text-lg font-black text-slate-800 font-mono leading-none">
                      {billablePercent}%
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                      Billable
                    </span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="flex gap-4 mt-4 text-[10px] font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1490FE]" />
                    <span className="text-slate-600">Billable ({billablePercent}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF6347]" />
                    <span className="text-slate-600">Non-Billable ({nonBillablePercent}%)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Timeline Overview Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                Timeline Overview
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Estimated Start Date', date: project.expectedStartDate, icon: Calendar, color: 'text-blue-500 bg-blue-50 border-blue-100' },
                  { label: 'Estimated End Date', date: project.expectedEndDate, icon: Calendar, color: 'text-indigo-500 bg-indigo-50 border-indigo-100' },
                  { label: 'Actual Start Date', date: project.actualStartDate, icon: Calendar, color: 'text-green-500 bg-green-50 border-green-100' },
                  { label: 'Actual End Date', date: project.actualEndDate, icon: Calendar, color: 'text-rose-500 bg-rose-50 border-rose-100' },
                ].map(({ label, date, icon: Icon, color }, i) => (
                  <div key={i} className={`p-4 rounded-2xl border flex items-center gap-4 ${color}`}>
                    <div className="p-2.5 rounded-xl bg-white shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">{label}</p>
                      <p className="text-xs font-black text-slate-850 mt-0.5">Start: {date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row: QAssure Summary & Recent Activities / Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* QAssure Report Cards (8 cols) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs lg:col-span-8 space-y-4">
                <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                  QAssure Report Summary
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { label: 'Total Defects', value: defects.length, bg: 'bg-purple-50 border-purple-100 text-purple-700' },
                    { label: 'Open', value: defects.filter(d => d.status === 'Open').length, bg: 'bg-rose-50 border-rose-100 text-rose-700' },
                    { label: 'Reopen', value: defects.filter(d => d.status === 'Reopen').length, bg: 'bg-amber-50 border-amber-100 text-amber-700' },
                    { label: 'Resolved', value: defects.filter(d => d.status === 'Resolved').length, bg: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
                    { label: 'Not An Issue', value: defects.filter(d => d.severity === 'Low').length, bg: 'bg-sky-50 border-sky-100 text-sky-700' },
                    { label: 'Close', value: defects.filter(d => d.status === 'Close').length, bg: 'bg-slate-50 border-slate-100 text-slate-700' },
                  ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-2xl border text-center space-y-1 hover:shadow-xs transition-shadow ${stat.bg}`}>
                      <p className="text-[9px] font-extrabold uppercase tracking-wider truncate">
                        {stat.label}
                      </p>
                      <p className="text-xl font-black font-mono">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications Panel (4 cols) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs lg:col-span-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-500" />
                    <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                      Notifications
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-[#EFF6FF] border border-[#BFDBFE]/60 rounded-2xl p-3 flex gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-slate-650 font-semibold leading-relaxed">
                        Pruthvi Darji approved Pull Request <span className="text-slate-800 font-bold">#582</span>.
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 flex gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-slate-650 font-semibold leading-relaxed">
                        Dhaval Patel updated task description for <span className="text-slate-850 font-bold">ZIG-219</span>.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5 text-[10px] text-amber-800 font-medium mt-4">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>Next sprint planning is scheduled for July 12th. Please ensure all time log entries are submitted by Friday.</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            TEAM TAB
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Team' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                Project Resource Allocation
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Active dedicated members and task leaders for {project.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {project.members.map((initial, i) => {
                const info = getMemberDetails(initial)
                const colorCls = avatarColors[i % 5]
                return (
                  <div key={i} className="border border-slate-100 hover:border-slate-200 rounded-2xl p-4.5 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex items-center gap-4 group">
                    <div className={`w-11 h-11 rounded-full ${colorCls} text-white flex items-center justify-center font-bold text-sm shadow-xs relative flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      {initial}
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" title="Active now" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-800 truncate">{info.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{info.role}</p>
                      <span className="inline-block mt-2 text-[9px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        Allocated: 100%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            LIST TAB
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'List' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                Tasks & Checklist
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Manage milestones and backlog tickets checklist.
              </p>
            </div>

            {/* Quick add form */}
            <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-[var(--accent)] transition-all font-medium"
              />
              <div className="flex gap-2">
                <select
                  value={newTaskPriority}
                  onChange={e => setNewTaskPriority(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-650 font-bold outline-none cursor-pointer focus:bg-white"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button
                  type="submit"
                  className="bg-[var(--accent)] hover:brightness-105 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
            </form>

            {/* Task list list */}
            <div className="divide-y divide-slate-100 max-w-3xl">
              {tasks.map(t => (
                <div key={t.id} className="py-3.5 flex items-center justify-between gap-4 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleTask(t.id)}
                      className={`flex-shrink-0 transition-colors ${t.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-400'}`}
                    >
                      {t.completed ? <CheckCircle2 className="w-5 h-5 fill-current" /> : <Circle className="w-5 h-5" />}
                    </button>
                    <span className={`text-xs font-semibold leading-relaxed truncate ${t.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {t.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      t.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                      t.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {t.priority}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteTask(t.id)}
                      className="text-slate-300 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50/50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            MASTER PLAN TAB
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Master Plan' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                Project Milestone Roadmap
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Phase-based project roadmap representing estimated completion metrics.
              </p>
            </div>

            <div className="relative pl-6 border-l-2 border-slate-100 space-y-8 max-w-2xl py-2">
              {[
                { phase: 'Phase 1: Architecture & Layout Discovery', date: 'March 2025', desc: 'Requirements analysis, API specs defined, wireframes completed, brand style-guide aligned.', status: 'Completed' },
                { phase: 'Phase 2: UI Engineering & Design System Integration', date: 'April 2025', desc: 'Vite build initialization, design tokens mapping, CSS setup, basic view templates built.', status: 'Completed' },
                { phase: 'Phase 3: Core Business Logic & State Engine', date: 'May - June 2025', desc: 'Task time tracking modules, biometric logs dashboard integration, daily email reports workflow.', status: 'Active' },
                { phase: 'Phase 4: QAssure Cycle & Performance Testing', date: 'July 2025', desc: 'Bug squashing sessions, cross-browser compatibility, loading optimizations, security checks.', status: 'Scheduled' },
                { phase: 'Phase 5: Production Launch & Warm hand-off', date: 'August 2025', desc: 'Final build creation, customer onboarding session, hand-off of logs database, server deployment.', status: 'Scheduled' },
              ].map((m, i) => (
                <div key={i} className="relative">
                  {/* Timeline dot */}
                  <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                    m.status === 'Completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                    m.status === 'Active' ? 'bg-blue-500 shadow-[0_0_8px_rgba(20,144,254,0.4)]' :
                    'bg-slate-200'
                  }`} />
                  
                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="text-xs font-black text-slate-850">{m.phase}</h4>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md self-start ${
                        m.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        m.status === 'Active' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                    <p className="text-[9px] font-bold text-slate-400">{m.date}</p>
                    <p className="text-xs text-slate-650 leading-relaxed font-semibold max-w-xl">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            QASSURE TAB
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'QAssure' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                Defect Tracking Table
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Reported bugs, verification state, and severity mappings.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-display font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4 w-[15%]">Bug ID</th>
                    <th className="py-3 px-4 w-[50%]">Defect Details</th>
                    <th className="py-3 px-4 w-[15%] text-center">Severity</th>
                    <th className="py-3 px-4 w-[20%] text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
                  {defects.map(d => (
                    <tr key={d.id} className="hover:bg-slate-55/30 transition-colors">
                      <td className="py-3 px-4 font-black font-mono text-slate-800">{d.id}</td>
                      <td className="py-3 px-4 text-slate-700 leading-relaxed font-semibold">{d.title}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          d.severity === 'Critical' ? 'bg-red-50 text-red-600 border border-red-100' :
                          d.severity === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                          d.severity === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          'bg-slate-100 text-slate-450 border border-slate-200'
                        }`}>
                          {d.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block ${
                          d.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          d.status === 'Open' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                          d.status === 'Close' ? 'bg-slate-100 text-slate-500 border border-slate-200' :
                          'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            NOTES TAB
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'Notes' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                Project Notepad
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Keep quick text logs or reminders specific to {project.name}.
              </p>
            </div>

            {/* Note form */}
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                value={newNoteText}
                onChange={e => setNewNoteText(e.target.value)}
                placeholder="Type a note here... (Markdown supported)"
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-800 outline-none focus:bg-white focus:border-[var(--accent)] transition-all font-medium placeholder-slate-400"
              />
              <button
                type="submit"
                className="bg-[var(--accent)] hover:brightness-105 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all hover:scale-101 active:scale-99 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Note
              </button>
            </form>

            {/* Notes list */}
            <div className="space-y-4">
              {notes.map(n => (
                <div key={n.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/40 relative group">
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-xs text-slate-650 leading-relaxed font-semibold max-w-2xl">{n.text}</p>
                    <button
                      type="button"
                      onClick={() => deleteNote(n.id)}
                      className="text-slate-300 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50/50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 block mt-2">{n.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            PR REQUESTS TAB
        ══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'PR Request' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="font-display font-black text-sm text-slate-800 uppercase tracking-wider">
                Project Pull Requests
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                Open, approved, or rejected pull requests logged for {project.name}.
              </p>
            </div>

            {filteredPRs.length === 0 ? (
              <div className="p-8 text-center border border-slate-100 rounded-2xl text-slate-400 text-xs font-semibold">
                No PR requests found specifically for this project.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-display font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4 w-[40%]">PR Title</th>
                      <th className="py-3 px-4 w-[25%]">Reviewer</th>
                      <th className="py-3 px-4 w-[20%]">Generated By</th>
                      <th className="py-3 px-4 w-[15%] text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
                    {filteredPRs.map(pr => (
                      <tr key={pr.id} className="hover:bg-slate-55/30 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-800 leading-relaxed">
                          <a href={pr.prLink} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-start gap-2 text-slate-700 font-bold hover:text-[var(--accent)]">
                            <GitPullRequest className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                            <span>{pr.title}</span>
                          </a>
                          <span className="text-[9px] font-bold text-slate-400 block mt-1">{pr.date}</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-600">{pr.reviewBy}</td>
                        <td className="py-3.5 px-4 text-slate-500 font-bold">{pr.prGeneratedBy}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block ${
                            pr.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            pr.status === 'Open' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-rose-50 text-rose-600 border border-rose-100'
                          }`}>
                            {pr.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  )
}

export default ProjectDetailView
