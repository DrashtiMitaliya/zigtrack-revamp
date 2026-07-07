import { type TaskTimeEntry } from '../constants'

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

// Calculate total hours of filtered logs
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
