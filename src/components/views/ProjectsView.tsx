import React, { useState } from 'react'
import { FolderKanban, GitPullRequest } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import type { PRRequest } from '../../constants'
import { initialPRRequests } from '../../constants'
import {
  Button,
  DropdownSelect,
  SearchBar,
  FilterToolbar,
  SubTabBar,
  Pagination,
} from '../common'
import { ProjectCard } from './ProjectCard'
import { PRTable } from './PRTable'
import { ProjectDetailView } from './ProjectDetailView'
import { AddEditPRPanel } from './AddEditPRPanel'

// ─── Sub-tab definitions ──────────────────────────────────────────────────────
const viewTabs = [
  { key: 'Projects' as const,    label: 'Project List', icon: FolderKanban },
  { key: 'PR Requests' as const, label: 'PR Requests',  icon: GitPullRequest },
]

// ─── Static filter options ────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'All',         label: 'All Status' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed',   label: 'Completed' },
  { value: 'On Hold',     label: 'On Hold' },
]

const COST_TYPE_OPTIONS = [
  { value: '',          label: 'Project Type' },
  { value: 'Dedicated', label: 'Dedicated' },
  { value: 'Fixed',     label: 'Fixed' },
  { value: 'Retainer',  label: 'Retainer' },
]

const PR_STATUS_OPTIONS = [
  { value: 'All',      label: 'All Status' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Open',     label: 'Open' },
  { value: 'Rejected', label: 'Rejected' },
]

// ─── Projects view ───────────────────────────────────────────────────────────
export const ProjectsView: React.FC = () => {
  const {
    projectSearch, setProjectSearch,
    projectStatusFilter, setProjectStatusFilter,
    projectsPerPage,
    projects,
  } = useAppContext()

  const [subTab, setSubTab] = useState<'Projects' | 'PR Requests'>('Projects')
  const [prRequests, setPrRequests] = useState<PRRequest[]>(initialPRRequests)
  const [prSearchQuery, setPrSearchQuery] = useState('')
  const [prStatusFilter, setPrStatusFilter] = useState('All')
  const [prProjectFilter, setPrProjectFilter] = useState('All')
  const [projectPage, setProjectPage] = useState(1)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  const [isPrPanelOpen, setIsPrPanelOpen] = useState(false)
  const [editingPR, setEditingPR] = useState<PRRequest | null>(null)

  const handleSavePR = (prData: Omit<PRRequest, 'id'> & { id?: number }) => {
    if (prData.id !== undefined) {
      setPrRequests(prev => prev.map(pr => pr.id === prData.id ? { ...pr, ...prData } as PRRequest : pr))
    } else {
      const newPR: PRRequest = {
        ...prData,
        id: Date.now(),
      }
      setPrRequests(prev => [newPR, ...prev])
    }
    setIsPrPanelOpen(false)
    setEditingPR(null)
  }

  const handleEditPR = (pr: PRRequest) => {
    setEditingPR(pr)
    setIsPrPanelOpen(true)
  }

  const handleDeletePR = (id: number) => {
    setPrRequests(prev => prev.filter(pr => pr.id !== id))
  }

  // ── PR stats ─────────────────────────────────────────────────────────────
  const totalPRs = prRequests.length
  const openPRs = prRequests.filter(p => p.status === 'Open').length
  const approvedPRs = prRequests.filter(p => p.status === 'Approved').length
  const rejectedPRs = prRequests.filter(p => p.status === 'Rejected').length
  const successRatio = totalPRs > 0 ? Math.round((approvedPRs / totalPRs) * 100) : 0

  // ── PR filter ────────────────────────────────────────────────────────────
  const prProjects = [...new Set(prRequests.map(p => p.project))]
  const prProjectOptions = [
    { value: 'All', label: 'All Projects' },
    ...prProjects.map(p => ({ value: p, label: p })),
  ]

  const filteredPRs = prRequests.filter(pr => {
    const matchSearch = !prSearchQuery || pr.title.toLowerCase().includes(prSearchQuery.toLowerCase())
    const matchStatus = prStatusFilter === 'All' || pr.status === prStatusFilter
    const matchProject = prProjectFilter === 'All' || pr.project === prProjectFilter
    return matchSearch && matchStatus && matchProject
  })

  // ── Project filter ───────────────────────────────────────────────────────
  const filteredProjects = projects.filter(p => {
    const matchSearch = !projectSearch || p.name.toLowerCase().includes(projectSearch.toLowerCase())
    const matchStatus = projectStatusFilter === 'All' || p.status === projectStatusFilter
    return matchSearch && matchStatus
  })
  const totalProjectPages = Math.max(1, Math.ceil(filteredProjects.length / projectsPerPage))
  const paginatedProjects = filteredProjects.slice(
    (projectPage - 1) * projectsPerPage,
    projectPage * projectsPerPage
  )

  const clearProjectFilters = () => {
    setProjectSearch('')
    setProjectStatusFilter('All')
    setProjectPage(1)
  }

  const clearPRFilters = () => {
    setPrSearchQuery('')
    setPrStatusFilter('All')
    setPrProjectFilter('All')
  }

  const selectedProject = projects.find(p => p.id === selectedProjectId)
  if (selectedProject) {
    return (
      <ProjectDetailView
        project={selectedProject}
        onBack={() => setSelectedProjectId(null)}
        projects={projects}
        onSelectProject={setSelectedProjectId}
      />
    )
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* ── Sub-tab selector ─────────────────────── */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center gap-3 flex-shrink-0">
        <SubTabBar tabs={viewTabs} activeTab={subTab} onTabChange={setSubTab} />
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          PROJECT LIST TAB
      ══════════════════════════════════════════════════════════════════ */}
      {subTab === 'Projects' && (
        <>
          <FilterToolbar
            leftSlot={
              <>
                <DropdownSelect
                  value={projectStatusFilter}
                  onChange={v => { setProjectStatusFilter(v); setProjectPage(1) }}
                  options={STATUS_OPTIONS}
                  id="project-status-filter"
                  className="w-40 sm:w-44"
                />
                <DropdownSelect
                  value=""
                  onChange={() => {}}
                  options={COST_TYPE_OPTIONS}
                  id="project-type-filter"
                  className="w-40 sm:w-44"
                />
              </>
            }
            rightSlot={
              <>
                <SearchBar
                  value={projectSearch}
                  onChange={v => { setProjectSearch(v); setProjectPage(1) }}
                  placeholder="Search by Project Name"
                  className="w-44 sm:w-52"
                />
                <Button variant="danger" size="sm" onClick={() => {}}>
                  Apply Filter
                </Button>
                <Button variant="ghost" size="sm" onClick={clearProjectFilters}>
                  Clear
                </Button>
              </>
            }
          />

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Project statistics banner */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Projects', value: projects.length, color: 'text-blue-700 bg-blue-50 border-blue-100' },
                { label: 'In Progress', value: projects.filter(p => p.status === 'In Progress').length, color: 'text-amber-700 bg-amber-50 border-amber-100' },
                { label: 'Completed', value: projects.filter(p => p.status === 'Completed').length, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
                { label: 'Total Hours Spent', value: `${Math.round(projects.reduce((acc, p) => acc + parseFloat(p.timeSpent.split(':')[0]), 0))} hrs`, color: 'text-purple-700 bg-purple-50 border-purple-100' }
              ].map((stat, i) => (
                <div key={i} className={`p-4 rounded-2xl border flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-xs hover:scale-[1.01] transition-all duration-250 ${stat.color}`}>
                  <span className="text-[10px] font-display font-black uppercase tracking-widest opacity-70">{stat.label}</span>
                  <span className="text-xl font-mono font-black mt-1.5">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Responsive grid: 1 → 2 → 3 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginatedProjects.map(project => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onSelect={() => setSelectedProjectId(project.id)}
                />
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Pagination
                currentPage={projectPage}
                totalPages={totalProjectPages}
                totalItems={filteredProjects.length}
                pageSize={projectsPerPage}
                onPageChange={setProjectPage}
              />
            </div>
            <div className="h-20" />
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          PR REQUESTS TAB
      ══════════════════════════════════════════════════════════════════ */}
      {subTab === 'PR Requests' && (
        <>
          <FilterToolbar
            leftSlot={
              <>
                <DropdownSelect
                  value={prProjectFilter}
                  onChange={setPrProjectFilter}
                  options={prProjectOptions}
                  id="pr-project-filter"
                  className="w-40 sm:w-44"
                />
                <DropdownSelect
                  value={prStatusFilter}
                  onChange={setPrStatusFilter}
                  options={PR_STATUS_OPTIONS}
                  id="pr-status-filter"
                  className="w-40 sm:w-44"
                />
              </>
            }
            rightSlot={
              <>
                <SearchBar
                  value={prSearchQuery}
                  onChange={setPrSearchQuery}
                  placeholder="Search by title"
                  className="w-44 sm:w-52"
                />
                <Button variant="danger" size="sm" onClick={() => {}}>
                  Apply Filter
                </Button>
                <Button variant="ghost" size="sm" onClick={clearPRFilters}>
                  Clear
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setEditingPR(null)
                    setIsPrPanelOpen(true)
                  }}
                >
                  Add Request
                </Button>
              </>
            }
          />

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* PR summary stat cards — responsive 2→3→5 cols */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {([
                { label: 'Total',         value: totalPRs,           labelCls: 'text-[var(--accent)]',   valueCls: 'text-[var(--accent)]',   bg: 'bg-[var(--info-bg)]',     border: 'border-[var(--info-border)]' },
                { label: 'Open',          value: openPRs,            labelCls: 'text-[var(--warning)]',  valueCls: 'text-[var(--warning)]',  bg: 'bg-[var(--warning-bg)]',  border: 'border-[var(--warning-border)]' },
                { label: 'Approved',      value: approvedPRs,        labelCls: 'text-[var(--success)]',  valueCls: 'text-[var(--success)]',  bg: 'bg-[var(--success-bg)]',  border: 'border-[var(--success-border)]' },
                { label: 'Rejected',      value: rejectedPRs,        labelCls: 'text-[var(--error)]',    valueCls: 'text-[var(--error)]',    bg: 'bg-[var(--error-bg)]',    border: 'border-[var(--error-border)]' },
                { label: 'Success Ratio', value: `${successRatio}%`, labelCls: 'text-purple-700',        valueCls: 'text-purple-700',        bg: 'bg-purple-50',            border: 'border-purple-200' },
              ] as const).map((stat, i) => (
                <div
                  key={i}
                  className={`${stat.bg} border ${stat.border} rounded-2xl p-3 sm:p-4 text-center space-y-1.5 hover:shadow-sm transition-shadow`}
                >
                  <p className={`text-[10px] font-extrabold uppercase tracking-wider ${stat.labelCls}`}>
                    {stat.label}
                  </p>
                  <p className={`text-xl sm:text-2xl font-black font-mono ${stat.valueCls}`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* PR table */}
            <PRTable 
              filteredPRs={filteredPRs} 
              onEdit={handleEditPR} 
              onDelete={handleDeletePR} 
            />

            <div className="h-20" />
          </div>
        </>
      )}

      <AddEditPRPanel
        isOpen={isPrPanelOpen}
        onClose={() => {
          setIsPrPanelOpen(false)
          setEditingPR(null)
        }}
        onSave={handleSavePR}
        editingPR={editingPR}
        projects={projects.map(p => p.name)}
      />
    </div>
  )
}

export default ProjectsView
