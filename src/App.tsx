import { useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider, useAppContext } from './context/AppContext'
import AppWrapper from './components/layout/AppWrapper'
import ClockInOutView from './components/views/ClockInOutView'
import TimesheetView from './components/views/TimesheetView'
import { TimesheetManageView } from './components/views/TimesheetManageView'
import { TimesheetStatusView } from './components/views/TimesheetStatusView'
import DashboardsView from './components/views/DashboardsView'
import ProjectsView from './components/views/ProjectsView'
import AddProjectModal from './components/modals/AddProjectModal'
import DayOutModal from './components/modals/DayOutModal'

function AppRoutes() {
  const { taskTimeLogView } = useAppContext()
  return (
    <Routes>
      <Route path="/dashboards" element={<DashboardsView />} />
      <Route path="/clock-in-out" element={<ClockInOutView />} />
      <Route 
        path="/timesheet" 
        element={taskTimeLogView === 'Daily' ? <TimesheetView /> : <TimesheetManageView />} 
      />
      <Route 
        path="/timesheet/manage" 
        element={taskTimeLogView === 'Daily' ? <TimesheetView /> : <TimesheetManageView />} 
      />
      <Route path="/timesheet/status" element={<TimesheetStatusView />} />
      <Route path="/projects" element={<ProjectsView />} />
      <Route path="*" element={<Navigate to="/dashboards" replace />} />
    </Routes>
  )
}

function AppContent() {
  const location = useLocation()
  const { setActiveTab } = useAppContext()

  useEffect(() => {
    const path = location.pathname
    if (path.startsWith('/projects')) {
      setActiveTab('Projects')
    } else if (path.startsWith('/clock-in-out')) {
      setActiveTab('Clock In/Out')
    } else if (path.startsWith('/timesheet/manage')) {
      setActiveTab('Timesheet Manage')
    } else if (path.startsWith('/timesheet/status')) {
      setActiveTab('Timesheet Status')
    } else if (path.startsWith('/timesheet')) {
      setActiveTab('Timesheet')
    } else {
      setActiveTab('Dashboards')
    }
  }, [location.pathname, setActiveTab])

  return (
    <AppWrapper>
      {/* Route-driven pages */}
      <AppRoutes />

      {/* Modals */}
      <AddProjectModal />
      <DayOutModal />
    </AppWrapper>
  )
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  )
}

export default App
