import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Bell, ChevronLeft, ChevronRight, Download, Home, Menu as MenuIcon, Plus, Search } from 'lucide-react'
import { Logo } from './Logo'
import { useUI } from '../../context/UIContext'
import { cn } from '../../utils/cn'

/**
 * Spotify-style top bar: history chevrons + Home button (left), centered search
 * with rounded pill input, and account-style right pills. Mobile collapses to
 * a logo + hamburger + small search.
 */
export function TopBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { setMobileMenuOpen } = useUI()
  const onSearch = location.pathname === '/search'
  const value = onSearch ? params.get('q') ?? '' : ''

  const goSearch = (v: string) => {
    navigate(`/search${v ? `?q=${encodeURIComponent(v)}` : ''}`, { replace: onSearch })
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-canvas via-canvas/80 to-transparent backdrop-blur-sm" />

      {/* mobile: hamburger + logo */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setMobileMenuOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-ink transition hover:bg-white/10 lg:hidden"
      >
        <MenuIcon className="h-5 w-5" />
      </button>
      <Link to="/" className="lg:hidden" aria-label="Nocturne home">
        <Logo />
      </Link>

      {/* desktop: history chevrons + Home button */}
      <div className="hidden items-center gap-2 lg:flex">
        <button
          type="button"
          aria-label="Go back"
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-ink transition hover:bg-black/50 disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Go forward"
          onClick={() => navigate(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-ink transition hover:bg-black/50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <Link
          to="/"
          aria-label="Go to home"
          className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-ink transition hover:bg-white/15"
        >
          <Home className="h-5 w-5" />
        </Link>
      </div>

      {/* centered search (Spotify style: pill, max-w, with kbd hint on lg+) */}
      <div className="relative ml-auto max-w-md flex-1 sm:ml-0 sm:max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
        <input
          data-search-input
          type="search"
          value={value}
          onChange={(e) => goSearch(e.target.value)}
          onFocus={() => {
            if (!onSearch) navigate('/search')
          }}
          placeholder="What do you want to play?"
          aria-label="Search"
          className={cn(
            'h-11 w-full rounded-full bg-white/[0.08] pl-11 pr-16 text-sm font-medium text-ink outline-none transition',
            'placeholder:text-muted/80 placeholder:font-normal hover:bg-white/[0.12] focus:bg-white/[0.12] focus:placeholder:text-muted/60',
          )}
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 bg-black/30 px-1.5 py-0.5 text-[10px] font-medium text-muted sm:block">
          Ctrl K
        </kbd>
      </div>

      {/* right: notifications + install + avatar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="hidden h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-muted transition hover:bg-white/[0.12] hover:text-ink sm:flex"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Install app"
          className="hidden items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-ink transition hover:bg-white/[0.12] lg:inline-flex"
        >
          <Download className="h-4 w-4" />
          Install App
        </button>
        <Link
          to="/library"
          aria-label="Create playlist or folder"
          title="Create"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-muted transition hover:bg-white/[0.12] hover:text-ink"
        >
          <Plus className="h-5 w-5" />
        </Link>
        <button
          type="button"
          aria-label="Your profile"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-glow"
        >
          C
        </button>
      </div>
    </header>
  )
}
