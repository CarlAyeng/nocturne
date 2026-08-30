import { cn } from '../../utils/cn'

export function Logo({ collapsed = false, className }: { collapsed?: boolean; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 6.5a1 1 0 0 1 1.28-.96l7 2.1a1 1 0 0 1 .72.96V17a2.5 2.5 0 1 1-2-2.45V10.1L11 8.72v8.28A2.5 2.5 0 1 1 9 14.55V6.5Z"
            fill="white"
          />
        </svg>
      </span>
      {!collapsed && (
        <span className="font-display text-xl font-bold tracking-tight">
          <span className="text-gradient">Nocturne</span>
        </span>
      )}
    </div>
  )
}
