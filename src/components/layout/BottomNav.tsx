import { NavLink } from 'react-router-dom'
import { Compass, Home, Library, LayoutGrid, Search, type LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'

const items: { to: string; icon: LucideIcon; label: string; end?: boolean }[] = [
  { to: '/', icon: Home, label: 'Home', end: true },
  { to: '/discover', icon: Compass, label: 'Discover' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/browse', icon: LayoutGrid, label: 'Browse' },
  { to: '/library', icon: Library, label: 'Library' },
]

export function BottomNav() {
  return (
    <nav
      className="glass-strong fixed inset-x-0 bottom-0 z-40 flex h-16 items-stretch border-t border-white/10 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary"
    >
      {items.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
              isActive ? 'text-ink' : 'text-muted',
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon className={cn('h-[22px] w-[22px]', isActive && 'text-primary-soft')} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
