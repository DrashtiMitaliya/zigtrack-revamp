import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  type Project,
  type ClockSession,
  type BiometricLog,
  type TaskTimeEntry,
  type WatchlistProject,
  initialProjects,
  initialClockSessions,
  initialBiometricLogs,
  initialTaskEntries,
  projectColors,
  availableProjectsList
} from '../constants'
import { convertTo24Hour, convertTo12Hour } from '../utils'

interface AppContextType {
  activeTab: string
  setActiveTab: (tab: string) => void

  // Projects state
  projectSearch: string
  setProjectSearch: (s: string) => void
  projectStatusFilter: string
  setProjectStatusFilter: (s: string) => void
  projectsPerPage: number
  projects: Project[]
  watchlist: WatchlistProject[]
  setWatchlist: (list: WatchlistProject[]) => void
  showAddProjectModal: boolean
  setShowAddProjectModal: (show: boolean) => void
  selectedProjectToAdd: string
  setSelectedProjectToAdd: (s: string) => void
  availableProjects: string[]

  // Clock state
  isClockedIn: boolean
  setIsClockedIn: (inState: boolean) => void
  secondsTracked: number
  setSecondsTracked: React.Dispatch<React.SetStateAction<number>>
  bottomSeconds: number
  setBottomSeconds: React.Dispatch<React.SetStateAction<number>>
  clockSubTab: 'System' | 'Biometrics'
  setClockSubTab: (tab: 'System' | 'Biometrics') => void
  clockSessions: ClockSession[]
  setClockSessions: React.Dispatch<React.SetStateAction<ClockSession[]>>
  biometricLogs: BiometricLog[]

  // Timesheet / Task log state
  taskTimeLogView: 'Daily' | 'Weekly'
  setTaskTimeLogView: (view: 'Daily' | 'Weekly') => void
  startDate: Date
  setStartDate: (d: Date) => void
  endDate: Date
  setEndDate: (d: Date) => void
  taskEntries: TaskTimeEntry[]
  setTaskEntries: React.Dispatch<React.SetStateAction<TaskTimeEntry[]>>

  // Inline editing
  editingId: number | null
  setEditingId: (id: number | null) => void
  editDescription: string
  setEditDescription: (s: string) => void
  editProject: string
  setEditProject: (s: string) => void
  editStartTime: string
  setEditStartTime: (s: string) => void
  editEndTime: string
  setEditEndTime: (s: string) => void
  editDuration: string
  setEditDuration: (s: string) => void
  editTicket: string
  setEditTicket: (s: string) => void
  editType: 'Task' | 'Manual'
  setEditType: (t: 'Task' | 'Manual') => void

  // Filters & Toggles
  expandedLogId: number | null
  setExpandedLogId: (id: number | null) => void
  timelogSearchQuery: string
  setTimelogSearchQuery: (s: string) => void
  timelogProjectFilter: string
  setTimelogProjectFilter: (s: string) => void
  timelogTypeFilter: string
  setTimelogTypeFilter: (s: string) => void

  // Floating timer widget state
  showTimerWidget: boolean
  setShowTimerWidget: (show: boolean) => void
  timerSubTab: 'Timer' | 'Manual'
  setTimerSubTab: (tab: 'Timer' | 'Manual') => void
  timerProject: string
  setTimerProject: (s: string) => void
  timerDescription: string
  setTimerDescription: (s: string) => void
  manualProject: string
  setManualProject: (s: string) => void
  manualDescription: string
  setManualDescription: (s: string) => void
  manualStartTime: string
  setManualStartTime: (s: string) => void
  manualEndTime: string
  setManualEndTime: (s: string) => void
  manualDuration: string
  setManualDuration: (s: string) => void

  // Handlers
  handleAddProject: (e: React.FormEvent) => void
  handleCopy: (text: string) => void
  startEditing: (entry: TaskTimeEntry) => void
  saveEditing: (id: number) => void
  deleteEntry: (id: number) => void
  saveManualLog: () => void
  clearManualLog: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('Dashboards')

  // Projects state
  const [projectSearch, setProjectSearch] = useState('')
  const [projectStatusFilter, setProjectStatusFilter] = useState('All')
  const [projectsPerPage] = useState(6)
  const [projects] = useState<Project[]>(initialProjects)

  // Clock In/Out state
  const [isClockedIn, setIsClockedIn] = useState(true)
  const [secondsTracked, setSecondsTracked] = useState(1855)
  const [bottomSeconds, setBottomSeconds] = useState(2566)
  const [clockSubTab, setClockSubTab] = useState<'System' | 'Biometrics'>('System')
  const [watchlist, setWatchlist] = useState<WatchlistProject[]>([{ id: '1', name: 'Freightro' }])
  const [showAddProjectModal, setShowAddProjectModal] = useState(false)
  const [selectedProjectToAdd, setSelectedProjectToAdd] = useState('Freightro')
  const [availableProjects] = useState<string[]>(availableProjectsList)

  const [clockSessions, setClockSessions] = useState<ClockSession[]>(initialClockSessions)
  const [biometricLogs] = useState<BiometricLog[]>(initialBiometricLogs)

  // Task entries
  const [taskTimeLogView, setTaskTimeLogView] = useState<'Daily' | 'Weekly'>('Daily')
  const [startDate, setStartDate] = useState<Date>(new Date(2026, 6, 6)) // Jul 6, 2026
  const [endDate, setEndDate] = useState<Date>(new Date(2026, 6, 6))
  const [taskEntries, setTaskEntries] = useState<TaskTimeEntry[]>(initialTaskEntries)

  // Inline editing state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDescription, setEditDescription] = useState('')
  const [editProject, setEditProject] = useState('')
  const [editStartTime, setEditStartTime] = useState('')
  const [editEndTime, setEditEndTime] = useState('')
  const [editDuration, setEditDuration] = useState('')
  const [editTicket, setEditTicket] = useState('')
  const [editType, setEditType] = useState<'Task' | 'Manual'>('Manual')

  // Search & filters
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null)
  const [timelogSearchQuery, setTimelogSearchQuery] = useState('')
  const [timelogProjectFilter, setTimelogProjectFilter] = useState('All')
  const [timelogTypeFilter, setTimelogTypeFilter] = useState('All')

  // Timer widget state
  const [showTimerWidget, setShowTimerWidget] = useState(false)
  const [timerSubTab, setTimerSubTab] = useState<'Timer' | 'Manual'>('Timer')
  const [timerProject, setTimerProject] = useState('Learning And Development')
  const [timerDescription, setTimerDescription] = useState(
    'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.'
  )
  const [manualProject, setManualProject] = useState('')
  const [manualDescription, setManualDescription] = useState('')
  const [manualStartTime, setManualStartTime] = useState('')
  const [manualEndTime, setManualEndTime] = useState('')
  const [manualDuration, setManualDuration] = useState('')

  // Live timer side effect
  useEffect(() => {
    let interval: any = null
    if (isClockedIn) {
      interval = setInterval(() => {
        setSecondsTracked((p) => p + 1)
        setBottomSeconds((p) => p + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isClockedIn])

  // Handlers
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!watchlist.some((p) => p.name === selectedProjectToAdd)) {
      setWatchlist([...watchlist, { id: Date.now().toString(), name: selectedProjectToAdd }])
    }
    setShowAddProjectModal(false)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const startEditing = (entry: TaskTimeEntry) => {
    setEditingId(entry.id)
    setEditDescription(entry.description)
    setEditProject(entry.project)
    setEditTicket(entry.ticket || '')
    setEditType(entry.entryType)

    const times = entry.timeRange.split(/[–-]/).map((t) => t.trim())
    if (times.length === 2) {
      setEditStartTime(convertTo24Hour(times[0]))
      setEditEndTime(convertTo24Hour(times[1]))
    } else {
      setEditStartTime('')
      setEditEndTime('')
    }
    setEditDuration(entry.duration)
  }

  const saveEditing = (id: number) => {
    setTaskEntries((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const formattedRange = `${convertTo12Hour(editStartTime)} – ${convertTo12Hour(editEndTime)}`
          return {
            ...e,
            description: editDescription,
            project: editProject,
            projectColor: projectColors[editProject] || '#6366f1',
            timeRange: formattedRange,
            duration: editDuration,
            ticket: editTicket,
            entryType: editType,
          }
        }
        return e
      })
    )
    setEditingId(null)
  }

  const deleteEntry = (id: number) => {
    setTaskEntries((prev) => prev.filter((e) => e.id !== id))
    if (editingId === id) setEditingId(null)
  }

  const saveManualLog = () => {
    if (!manualProject || !manualStartTime || !manualEndTime) return
    const formattedRange = `${convertTo12Hour(manualStartTime)} – ${convertTo12Hour(manualEndTime)}`
    
    // Calculate duration
    const startParts = manualStartTime.split(':')
    const endParts = manualEndTime.split(':')
    let durationStr = '00:00'
    if (startParts.length === 2 && endParts.length === 2) {
      let startMin = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10)
      let endMin = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10)
      if (endMin < startMin) endMin += 24 * 60
      const diffMin = endMin - startMin
      const hrs = Math.floor(diffMin / 60)
      const mins = diffMin % 60
      durationStr = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
    }

    const newLog: TaskTimeEntry = {
      id: Date.now(),
      description: manualDescription || 'Manual time entry',
      project: manualProject,
      projectColor: projectColors[manualProject] || '#6366f1',
      entryType: 'Manual',
      timeRange: formattedRange,
      duration: durationStr,
      canEdit: true,
      date: '2026-07-06',
      ticket: ''
    }

    setTaskEntries(prev => [newLog, ...prev])
    clearManualLog()
    setShowTimerWidget(false)
  }

  const clearManualLog = () => {
    setManualDescription('')
    setManualStartTime('')
    setManualEndTime('')
    setManualProject('')
    setManualDuration('')
  }

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        projectSearch,
        setProjectSearch,
        projectStatusFilter,
        setProjectStatusFilter,
        projectsPerPage,
        projects,
        watchlist,
        setWatchlist,
        showAddProjectModal,
        setShowAddProjectModal,
        selectedProjectToAdd,
        setSelectedProjectToAdd,
        availableProjects,
        isClockedIn,
        setIsClockedIn,
        secondsTracked,
        setSecondsTracked,
        bottomSeconds,
        setBottomSeconds,
        clockSubTab,
        setClockSubTab,
        clockSessions,
        setClockSessions,
        biometricLogs,
        taskTimeLogView,
        setTaskTimeLogView,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        taskEntries,
        setTaskEntries,
        editingId,
        setEditingId,
        editDescription,
        setEditDescription,
        editProject,
        setEditProject,
        editStartTime,
        setEditStartTime,
        editEndTime,
        setEditEndTime,
        editDuration,
        setEditDuration,
        editTicket,
        setEditTicket,
        editType,
        setEditType,
        expandedLogId,
        setExpandedLogId,
        timelogSearchQuery,
        setTimelogSearchQuery,
        timelogProjectFilter,
        setTimelogProjectFilter,
        timelogTypeFilter,
        setTimelogTypeFilter,
        showTimerWidget,
        setShowTimerWidget,
        timerSubTab,
        setTimerSubTab,
        timerProject,
        setTimerProject,
        timerDescription,
        setTimerDescription,
        manualProject,
        setManualProject,
        manualDescription,
        setManualDescription,
        manualStartTime,
        setManualStartTime,
        manualEndTime,
        setManualEndTime,
        manualDuration,
        setManualDuration,
        handleAddProject,
        handleCopy,
        startEditing,
        saveEditing,
        deleteEntry,
        saveManualLog,
        clearManualLog
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
