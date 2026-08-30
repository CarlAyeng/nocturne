import { NavLink } from 'react-router-dom'
import { Compass, Disc3, Home, Library, Search, Settings } from 'lucide-react'
import { Logo } from './Logo'
import { cn } from '../../utils/cn'

/**
 * Vertical icon rail — a single floating column on the left of the page,
 * similar to the reference. Active route gets the brand gradient bg.
 */
export function IconRail() {
  const items = [
    { to: '/', icon: Home, label: 'Home', end: true },
    { to: '/discover', icon: Compass, label: 'Discover' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/library', icon: Library, label: 'Library' },
  ]
  return (
    <nav
      aria-label="Primary"
      className="pointer-events-auto fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 lg:flex"
    >
      <div className="flex flex-col items-center gap-2 rounded-full border border-white/10 bg-black/30 px-2 py-3 backdrop-blur-md">
        <div className="mb-1">
          <Logo collapsed />
        </div>
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={label}
            aria-label={label}
            className={({ isActive }) =>
              cn(
                'flex h-10 w-10 items-center justify-center rounded-full text-muted transition',
                isActive
                  ? 'bg-gradient-to-br from-primary to-accent text-white shadow-glow'
                  : 'hover:bg-white/10 hover:text-ink',
              )
            }
          >
            <Icon className="h-5 w-5" />
          </NavLink>
        ))}
        <div className="mt-1 h-px w-6 bg-white/10" />
        <button
          type="button"
          aria-label="Settings"
          title="Settings"
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-ink"
        >
          <Settings className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Now playing"
          title="Now playing"
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-ink"
        >
          <Disc3 className="h-5 w-5" />
        </button>
      </div>
    </nav>
  )
}
