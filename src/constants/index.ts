// ─── TypeScript Interfaces ───────────────────────────────────────────────────

export interface TimeLog {
  id: number
  project: string
  description: string
  fullDescription: string
  duration: string
}

export interface ProjectTime {
  name: string
  duration: string
  hours: number
  percent: number
  color: string
}

export interface WatchlistProject {
  id: string
  name: string
}

export interface ActivityHistory {
  id: number
  user: string
  action: 'Day In' | 'Day Out'
  timestamp: string
  relativeTime: string
}

export interface ClockSession {
  id: number
  inTime: string
  outTime: string
  duration: string
  isActive?: boolean
}

export interface BiometricLog {
  id: number
  user: string
  type: 'clock-in' | 'clock-out'
  time: string
  location: string
  relativeTime: string
}

export interface Project {
  id: number
  name: string
  scope: string[]
  costType: string
  expectedStartDate: string
  expectedEndDate: string
  actualStartDate: string
  actualEndDate: string
  members: string[]
  status: 'In Progress' | 'Completed' | 'On Hold'
  timeSpent: string
  timeBillable: string
  maxTimePlanned: string
  color: string
}

export interface TaskTimeEntry {
  id: number
  description: string
  project: string
  projectColor: string
  entryType: 'Task' | 'Manual'
  timeRange: string
  duration: string
  canEdit: boolean
  date: string
  ticket?: string
}

export interface DropdownOption {
  value: string
  label: string
}

export interface PRRequest {
  id: number
  project: string
  date: string
  title: string
  prLink: string
  reviewBy: string
  prGeneratedBy: string
  status: 'Approved' | 'Open' | 'Rejected'
}

// ─── Constant Lookups ────────────────────────────────────────────────────────

export const projectColors: Record<string, string> = {
  'Learning and Development': '#a855f7',
  'Learning And Development': '#a855f7',
  'Tech General': '#1490FE',
  'ZigTrack Support': '#10B981',
  'ES AI Assessment': '#1490FE',
  'Prompts.AI': '#a855f7',
  'ShallWe Play': '#FF6347',
  'Freightro': '#F59E0B',
}

export const availableProjectsList = [
  'Freightro',
  'Tech General',
  'Learning and Development',
  'ZigTrack Support'
]

// ─── Mock Datasets ──────────────────────────────────────────────────────────

export const initialProjects: Project[] = [
  { id: 1, name: 'ES AI Assessment', scope: ['Mobile App-Hybrid', 'Web Application'], costType: 'Dedicated', expectedStartDate: 'Mar 03, 2025', expectedEndDate: 'N/A', actualStartDate: 'Mar 04, 2025', actualEndDate: 'N/A', members: ['H', 'J', 'M', 'L', 'K'], status: 'In Progress', timeSpent: '24170:12', timeBillable: '21400:53', maxTimePlanned: '3000:00', color: '#1490FE' },
  { id: 2, name: 'Prompts.AI', scope: ['Admin Panel'], costType: 'Dedicated', expectedStartDate: 'Nov 28, 2023', expectedEndDate: 'Feb 29, 2024', actualStartDate: 'Nov 28, 2023', actualEndDate: 'N/A', members: ['A', 'M', 'R'], status: 'In Progress', timeSpent: '31351:50', timeBillable: '29910:23', maxTimePlanned: '718:00', color: '#a855f7' },
  { id: 3, name: 'ShallWe Play', scope: ['Web Application', 'Mobile App-Hybrid'], costType: 'Dedicated', expectedStartDate: 'Jul 21, 2025', expectedEndDate: 'Dec 20, 2025', actualStartDate: 'Jul 21, 2025', actualEndDate: 'N/A', members: ['D', 'J', 'S', 'V', 'Y'], status: 'In Progress', timeSpent: '9252:50', timeBillable: '8817:50', maxTimePlanned: '2200:00', color: '#FF6347' },
  { id: 4, name: 'ZigTrack Support', scope: ['Web Application'], costType: 'Retainer', expectedStartDate: 'Jan 01, 2025', expectedEndDate: 'Dec 31, 2025', actualStartDate: 'Jan 05, 2025', actualEndDate: 'N/A', members: ['P', 'N', 'T'], status: 'In Progress', timeSpent: '5840:30', timeBillable: '5200:00', maxTimePlanned: '1000:00', color: '#10B981' },
  { id: 5, name: 'Freightro', scope: ['Mobile App-Hybrid'], costType: 'Fixed', expectedStartDate: 'Feb 10, 2024', expectedEndDate: 'Aug 30, 2024', actualStartDate: 'Feb 12, 2024', actualEndDate: 'Sep 04, 2024', members: ['A', 'B'], status: 'Completed', timeSpent: '12400:00', timeBillable: '11900:40', maxTimePlanned: '12000:00', color: '#F59E0B' },
  { id: 6, name: 'Tech General', scope: ['Admin Panel', 'Web Application'], costType: 'Dedicated', expectedStartDate: 'Mar 01, 2023', expectedEndDate: 'N/A', actualStartDate: 'Mar 01, 2023', actualEndDate: 'N/A', members: ['D', 'M', 'S', 'V'], status: 'On Hold', timeSpent: '8900:15', timeBillable: '7800:00', maxTimePlanned: '5000:00', color: '#6366f1' },
]

export const initialClockSessions: ClockSession[] = [
  { id: 1, inTime: '5:34 PM', outTime: '-', duration: '-', isActive: true },
  { id: 2, inTime: '3:15 PM', outTime: '5:17 PM', duration: '02:02' },
  { id: 3, inTime: '1:30 PM', outTime: '3:14 PM', duration: '01:44' },
  { id: 4, inTime: '10:33 AM', outTime: '1:04 PM', duration: '02:30' },
]

export const initialBiometricLogs: BiometricLog[] = [
  { id: 1, user: 'Drashti Mitaliya', type: 'clock-in', time: '05:34 pm', location: 'staff passage in', relativeTime: 'an hour ago' },
  { id: 2, user: 'Drashti Mitaliya', type: 'clock-out', time: '05:17 pm', location: 'staff passage out', relativeTime: 'an hour ago' },
  { id: 3, user: 'Drashti Mitaliya', type: 'clock-in', time: '03:15 pm', location: 'staff passage in', relativeTime: '3 hours ago' },
  { id: 4, user: 'Drashti Mitaliya', type: 'clock-out', time: '03:14 pm', location: 'staff passage out', relativeTime: '3 hours ago' },
  { id: 5, user: 'Drashti Mitaliya', type: 'clock-in', time: '01:30 pm', location: 'staff passage in', relativeTime: '5 hours ago' },
  { id: 6, user: 'Drashti Mitaliya', type: 'clock-out', time: '01:04 pm', location: 'staff passage out', relativeTime: '5 hours ago' },
  { id: 7, user: 'Drashti Mitaliya', type: 'clock-in', time: '10:33 am', location: 'staff passage in', relativeTime: '8 hours ago' },
]

export const initialTaskEntries: TaskTimeEntry[] = [
  { id: 1, description: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', project: 'Learning and Development', projectColor: '#a855f7', entryType: 'Task', timeRange: '05:47 PM – 06:36 PM', duration: '00:49', canEdit: false, date: '2026-07-06', ticket: '' },
  { id: 2, description: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', project: 'Learning and Development', projectColor: '#a855f7', entryType: 'Manual', timeRange: '05:35 PM – 05:47 PM', duration: '00:12', canEdit: true, date: '2026-07-06', ticket: 'ZIG-219' },
  { id: 3, description: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', project: 'Tech General', projectColor: '#1490FE', entryType: 'Task', timeRange: '04:05 PM – 05:16 PM', duration: '01:11', canEdit: true, date: '2026-07-06', ticket: 'ZIG-219' },
  { id: 4, description: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', project: 'Tech General', projectColor: '#1490FE', entryType: 'Manual', timeRange: '03:15 PM – 04:05 PM', duration: '00:50', canEdit: true, date: '2026-07-06', ticket: '' },
  { id: 5, description: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', project: 'Tech General', projectColor: '#1490FE', entryType: 'Manual', timeRange: '01:31 PM – 03:14 PM', duration: '01:43', canEdit: true, date: '2026-07-06', ticket: '' },
  { id: 6, description: 'Admin Panel > System Config: Initial code review of config metrics API response fields.', project: 'Tech General', projectColor: '#1490FE', entryType: 'Task', timeRange: '10:00 AM – 11:30 AM', duration: '01:30', canEdit: true, date: '2026-07-05', ticket: '' },
  { id: 7, description: 'Learning and Development: Studied Vite and React 19 migration path.', project: 'Learning and Development', projectColor: '#a855f7', entryType: 'Manual', timeRange: '02:00 PM – 03:45 PM', duration: '01:45', canEdit: true, date: '2026-07-05', ticket: '' },
  { id: 8, description: 'ZigTrack Support: Addressed customer reports on biometric logging delays.', project: 'ZigTrack Support', projectColor: '#10B981', entryType: 'Manual', timeRange: '09:15 AM – 10:45 AM', duration: '01:30', canEdit: true, date: '2026-07-04', ticket: 'ZIG-220' },
]

export const initialTimeLogs: TimeLog[] = [
  { id: 1, project: 'Learning and Development', description: 'Admin Panel > System Config: Working on updating the Writing Config API han...', fullDescription: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', duration: '0hr 0m' },
  { id: 2, project: 'Learning and Development', description: 'Admin Panel > System Config: Working on updating the Writing Config API han...', fullDescription: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', duration: '0hr 12m' },
  { id: 3, project: 'Tech General', description: 'Admin Panel > System Config: Working on updating the Writing Config API han...', fullDescription: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', duration: '1hr 11m' },
  { id: 4, project: 'Tech General', description: 'Admin Panel > System Config: Working on updating the Writing Config API han...', fullDescription: 'Admin Panel > System Config: Working on updating the Writing Config API handling. If metrics and dimensions are not received from the API response, the dimensions will be fetched from the dropdown-options API and updated accordingly.', duration: '0hr 50m' },
]

export const initialActivityHistory: ActivityHistory[] = [
  { id: 1, user: 'Drashti Mitaliya', action: 'Day In', timestamp: '2023-01-31 10:00:36', relativeTime: '3 years ago' },
  { id: 2, user: 'Drashti Mitaliya', action: 'Day In', timestamp: '2023-01-30 10:09:10', relativeTime: '3 years ago' },
  { id: 3, user: 'Drashti Mitaliya', action: 'Day Out', timestamp: '2023-01-28 15:04:54', relativeTime: '3 years ago' },
  { id: 4, user: 'Drashti Mitaliya', action: 'Day In', timestamp: '2023-01-28 14:17:00', relativeTime: '3 years ago' },
]

export const initialProjectTimes: ProjectTime[] = [
  { name: 'Tech General', duration: '3hr 44m', hours: 3.73, percent: 58, color: '#1490FE' },
  { name: 'Learning and Development', duration: '2hr 38m', hours: 2.63, percent: 42, color: '#a855f7' },
]

export const initialPRRequests: PRRequest[] = [
  { id: 1, project: 'ES AI Assessment', date: '16-06-2026 12:32', title: 'Admin Portal : 582 : Feature : Implement Student Feedback For Admin With Its Roles And Permissions', prLink: 'https://github.com/studyboxworld/za-ai-a...', reviewBy: 'Pruthvi Darji', prGeneratedBy: 'Drashti Mitaliya', status: 'Approved' },
  { id: 2, project: 'ES AI Assessment', date: '16-06-2026 12:32', title: 'Client Portal : 120 : Feature : Implement Student Feedback For Client Admin With Its Roles And Permissions', prLink: 'https://github.com/studyboxworld/za-clie...', reviewBy: 'Pruthvi Darji', prGeneratedBy: 'Drashti Mitaliya', status: 'Approved' },
  { id: 3, project: 'Prompts.AI', date: '14-06-2026 09:15', title: 'Admin Panel : 340 : Bugfix : Fix prompt template rendering with special characters', prLink: 'https://github.com/promptsai/admin/pull/340', reviewBy: 'Arun Mehta', prGeneratedBy: 'Drashti Mitaliya', status: 'Open' },
  { id: 4, project: 'ShallWe Play', date: '12-06-2026 16:45', title: 'Mobile App : 88 : Feature : Add real-time game lobby with WebSocket integration', prLink: 'https://github.com/shallweplay/mobile/pull/88', reviewBy: 'Sahil Verma', prGeneratedBy: 'Drashti Mitaliya', status: 'Rejected' },
  { id: 5, project: 'ES AI Assessment', date: '10-06-2026 11:20', title: 'Admin Portal : 575 : Bugfix : Fix assessment score calculation for weighted rubrics', prLink: 'https://github.com/studyboxworld/za-ai-a...', reviewBy: 'Pruthvi Darji', prGeneratedBy: 'Drashti Mitaliya', status: 'Approved' },
]
