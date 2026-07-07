import { AppProvider, useAppContext } from './context/AppContext'
import AppWrapper from './components/layout/AppWrapper'
import ClockInOutView from './components/views/ClockInOutView'
import TimesheetView from './components/views/TimesheetView'
import DashboardsView from './components/views/DashboardsView'
import ProjectsView from './components/views/ProjectsView'
import FloatingTimerWidget from './components/widgets/FloatingTimerWidget'
import AddProjectModal from './components/modals/AddProjectModal'

function AppContent() {
  const { activeTab } = useAppContext()

  return (
    <AppWrapper>
      {/* Tab routing */}
      {activeTab === 'Dashboards' && <DashboardsView />}
      {activeTab === 'Clock In/Out' && <ClockInOutView />}
      {activeTab === 'Timesheet' && <TimesheetView />}
      {activeTab === 'Projects' && <ProjectsView />}

      {/* Floating widgets */}
      <FloatingTimerWidget />

      {/* Modals */}
      <AddProjectModal />
    </AppWrapper>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
