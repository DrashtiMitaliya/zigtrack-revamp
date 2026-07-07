import { AppProvider, useAppContext } from './context/AppContext'
import AppWrapper from './components/layout/AppWrapper'
import ClockInOutView from './components/views/ClockInOutView'
import TimesheetView from './components/views/TimesheetView'
import { TimesheetManageView } from './components/views/TimesheetManageView'
import { TimesheetStatusView } from './components/views/TimesheetStatusView'
import DashboardsView from './components/views/DashboardsView'
import ProjectsView from './components/views/ProjectsView'
import FloatingTimerWidget from './components/widgets/FloatingTimerWidget'
import AddProjectModal from './components/modals/AddProjectModal'
import DayOutModal from './components/modals/DayOutModal'

function AppContent() {
  const { activeTab, taskTimeLogView } = useAppContext()

  return (
    <AppWrapper>
      {/* Tab routing */}
      {activeTab === 'Dashboards' && <DashboardsView />}
      {activeTab === 'Clock In/Out' && <ClockInOutView />}
      {(activeTab === 'Timesheet' || activeTab === 'Timesheet Manage') && (
        taskTimeLogView === 'Daily' ? <TimesheetView /> : <TimesheetManageView />
      )}
      {activeTab === 'Timesheet Status' && <TimesheetStatusView />}
      {activeTab === 'Projects' && <ProjectsView />}

      {/* Floating widgets */}
      <FloatingTimerWidget />

      {/* Modals */}
      <AddProjectModal />
      <DayOutModal />
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
