import { type TaskTimeEntry } from '../constants'
import { type ClockSession } from '../constants'

// Time conversion helpers
export const convertTo24Hour = (timeStr: string): string => {
  if (!timeStr) return ''
  const match = timeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i)
  if (!match) return ''
  let hrs = parseInt(match[1], 10)
  const mins = match[2]
  const ampm = match[3].toUpperCase()
  if (ampm === 'PM' && hrs < 12) hrs += 12
  if (ampm === 'AM' && hrs === 12) hrs = 0
  return `${String(hrs).padStart(2, '0')}:${mins}`
}

export const convertTo12Hour = (timeStr: string): string => {
  if (!timeStr) return ''
  const parts = timeStr.split(':')
  if (parts.length < 2) return ''
  let hrs = parseInt(parts[0], 10)
  const mins = parts[1]
  const ampm = hrs >= 12 ? 'PM' : 'AM'
  hrs = hrs % 12
  if (hrs === 0) hrs = 12
  return `${hrs}:${mins} ${ampm}`
}

// Calculate total hours of filtered task log entries
export const calculateTotalDuration = (entries: TaskTimeEntry[]): string => {
  let totalMinutes = 0
  entries.forEach(e => {
    const parts = e.duration.split(':')
    if (parts.length === 2) {
      const hrs = parseInt(parts[0], 10) || 0
      const mins = parseInt(parts[1], 10) || 0
      totalMinutes += hrs * 60 + mins
    }
  })
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Calculate total duration across clock-in/out sessions
// Active sessions use a mock duration of 113 minutes
export const calculateTotalClockDuration = (sessions: ClockSession[]): string => {
  let totalMinutes = 0
  sessions.forEach(s => {
    if (s.isActive) {
      totalMinutes += 113 // mock active session duration
    } else {
      const parts = s.duration.split(':')
      if (parts.length === 2) {
        totalMinutes += parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
      }
    }
  })
  const hrs = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}
