import { cn } from '../../utils/cn'

interface TabsProps<T extends string> {
  tabs: readonly { id: T; label: string }[]
  active: T
  onChange: (id: T) => void
  className?: string
}

export function Tabs<T extends string>({ tabs, active, onChange, className }: TabsProps<T>) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="tablist" aria-label="Sections">
      {tabs.map((t) => {
        const selected = t.id === active
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(t.id)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
              selected
                ? 'bg-white text-canvas'
                : 'bg-white/5 text-muted hover:bg-white/10 hover:text-ink',
            )}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
