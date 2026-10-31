import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

const tones: Record<string, string> = {
  gray: 'bg-mist-50 text-ink-700 ring-mist-200',
  blue: 'bg-sky-50 text-royal-700 ring-royal-100',
  green: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  orange: 'bg-orange-50 text-orange-700 ring-orange-200',
  red: 'bg-red-50 text-red-800 ring-red-200',
  navy: 'bg-navy-950 text-white ring-navy-900',
};

const statusTone: Record<string, keyof typeof tones> = {
  PUBLISHED: 'green',
  ACCEPTED: 'green',
  ACTIVE: 'green',
  APPROVED: 'green',
  VERIFIED: 'green',
  ISSUED: 'green',
  COMPLETED: 'green',
  PRESENT: 'green',
  CONTACTED: 'green',
  SUBMITTED: 'blue',
  NEW: 'blue',
  PLANNED: 'blue',
  UNDER_REVIEW: 'orange',
  IN_REVIEW: 'orange',
  PENDING: 'orange',
  SHORTLISTED: 'orange',
  WAITLISTED: 'orange',
  LATE: 'orange',
  PROSPECT: 'orange',
  DRAFT: 'gray',
  ARCHIVED: 'gray',
  INACTIVE: 'gray',
  CLOSED: 'gray',
  NOT_SUBMITTED: 'gray',
  GRADUATED: 'navy',
  EXCUSED: 'gray',
  REJECTED: 'red',
  REVOKED: 'red',
  CANCELLED: 'red',
  WITHDRAWN: 'red',
  ABSENT: 'red',
};

export function Badge({ tone = 'gray', children, className }: { tone?: keyof typeof tones; children: ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset', tones[tone], className)}>{children}</span>;
}

export function StatusBadge({ status, label }: { status: string; label: string }) {
  return <Badge tone={statusTone[status] ?? 'gray'}>{label}</Badge>;
}
