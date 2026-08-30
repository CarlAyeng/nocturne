import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center',
        className,
      )}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-muted">
        {icon}
      </div>
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
