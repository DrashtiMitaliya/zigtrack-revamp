import React from 'react'
import Badge from './Badge'
import type { ComponentProps } from 'react'

type BadgeVariant = ComponentProps<typeof Badge>['variant']

type KnownStatus =
  | 'In Progress'
  | 'Completed'
  | 'On Hold'
  | 'Open'
  | 'Approved'
  | 'Rejected'
  | 'Running'
  | 'Paused'
  | 'Active'
  | 'Task'
  | 'Manual'
  | 'Pending'
  | 'Submitted'

const statusMap: Record<KnownStatus, BadgeVariant> = {
  'In Progress': 'success',
  'Completed':   'blue',
  'On Hold':     'warning',
  'Open':        'warning',
  'Approved':    'success',
  'Rejected':    'error',
  'Running':     'success',
  'Paused':      'muted',
  'Active':      'blue',
  'Task':        'blue',
  'Manual':      'muted',
  'Pending':     'warning',
  'Submitted':   'coral',
}

interface StatusBadgeProps {
  status: KnownStatus | string
  size?: 'sm' | 'md'
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  className = '',
}) => {
  const variant: BadgeVariant = statusMap[status as KnownStatus] ?? 'muted'
  return (
    <Badge variant={variant} size={size} className={className}>
      {status}
    </Badge>
  )
}

export default StatusBadge
