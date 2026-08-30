import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  to?: string
  action?: ReactNode
  className?: string
}

export function SectionHeader({ title, subtitle, to, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-0.5 truncate text-sm text-muted">{subtitle}</p>}
      </div>
      {to ? (
        <Link
          to={to}
          className="shrink-0 text-xs font-semibold uppercase tracking-wide text-muted transition hover:text-ink"
        >
          Show all
        </Link>
      ) : (
        action
      )}
    </div>
  )
}
