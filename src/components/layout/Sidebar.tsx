import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Clock,
  Heart,
  Library,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search as SearchIcon,
  type LucideIcon,
} from 'lucide-react'
import { Logo } from './Logo'
import { useUI } from '../../context/UIContext'
import { useLibrary } from '../../context/LibraryContext'
import { editorialPlaylists, yourPlaylists } from '../../data'
import { CoverArt } from '../media/CoverArt'
import { cn } from '../../utils/cn'

type LibraryFilter = 'playlists' | 'artists' | 'albums'

/* Spotify-style "Your Library" sidebar.
   - Primary nav (Home, etc.) is moved to a horizontal row in the top bar
     (handled separately) — this sidebar is dedicated to the library.
   - Header: "Your Library" + collapse toggle (desktop) + Create button.
   - Filter pills: Playlists | Artists | Albums.
   - Filter input: a small search box that filters the list.
   - List: Liked Songs + Recently Played pinned at the top, then playlists
     (the 4 featured ones first, then user-created, then other editorial). */

const PALETTE_DUMMY = (i: number) => [
  { from: '#8B5CF6', via: '#A855F7', to: '#EC4899', deep: '#22103a', textOn: 'light' as const },
  { from: '#22D3EE', via: '#2DD4BF', to: '#0F766E', deep: '#042F2E', textOn: 'light' as const },
  { from: '#F472B6', via: '#EC4899', to: '#7C2D5E', deep: '#3B0A2A', textOn: 'light' as const },
  { from: '#FACC15', via: '#F97316', to: '#B45309', deep: '#3B2408', textOn: 'dark' as const },
][i % 4]

function FollowedArtists() {
  const { following } = useLibrary()
  if (following.length === 0) return null
  // Note: in a real app we'd map following → artists. Here we just show names.
  return (
    <div className="flex flex-col gap-0.5">
      {following.map((id, i) => (
        <LibraryRow
          key={id}
          to={`/artist/${id}`}
          title={id}
          subtitle="Artist"
          cover={null}
          circlePalette={PALETTE_DUMMY(i)}
        />
      ))}
    </div>
  )
}

function LibraryRow({
  to,
  title,
  subtitle,
  cover,
  circlePalette,
  circleLetter,
}: {
  to: string
  title: string
  subtitle: string
  cover: { seed: number; shape: 'orbits' | 'waves' | 'bars' | 'blobs' | 'prism' | 'rings' | 'grid'; palette: { from: string; via: string; to: string; deep: string; textOn: 'light' | 'dark' } } | null
  circlePalette?: { from: string; via: string; to: string; deep: string; textOn: 'light' | 'dark' }
  circleLetter?: string
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-2 py-2 transition-colors',
          isActive ? 'bg-white/10' : 'hover:bg-white/5',
        )
      }
    >
      {cover ? (
        <CoverArt
          seed={cover.seed}
          shape={cover.shape}
          palette={cover.palette}
          className="h-12 w-12 shrink-0"
          rounded="rounded-lg"
        />
      ) : (
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg font-display text-base font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${circlePalette?.from} 0%, ${circlePalette?.via ?? circlePalette?.from} 100%)`,
          }}
          aria-hidden="true"
        >
          {circleLetter ?? title.slice(0, 1).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{title}</p>
        <p className="truncate text-xs text-muted">{subtitle}</p>
      </div>
    </NavLink>
  )
}

export function SidebarContent({ collapsed = false, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const { openModal } = useUI()
  const { userPlaylists, liked, recentlyPlayed } = useLibrary()
  const [filter, setFilter] = useState<LibraryFilter>('playlists')
  const [q, setQ] = useState('')

  const your = yourPlaylists()
  const playlists = [...your, ...userPlaylists, ...editorialPlaylists.filter((p) => !your.some((y) => y.id === p.id))]
  const norm = q.trim().toLowerCase()
  const filtered = norm ? playlists.filter((p) => p.title.toLowerCase().includes(norm)) : playlists

  if (collapsed) {
    return (
      <div className="flex h-full flex-col items-center gap-3">
        <NavLink
          to="/library"
          className={({ isActive }) =>
            cn(
              'flex h-10 w-10 items-center justify-center rounded-full text-muted transition',
              isActive ? 'bg-white/10 text-ink' : 'hover:bg-white/5 hover:text-ink',
            )
          }
          title="Your Library"
          aria-label="Your Library"
        >
          <Library className="h-5 w-5" />
        </NavLink>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-2">
      {/* header */}
      <div className="flex items-center justify-between px-2 pt-1">
        <NavLink
          to="/library"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 text-sm font-semibold transition-colors',
              isActive ? 'text-ink' : 'text-muted hover:text-ink',
            )
          }
          onClick={onNavigate}
        >
          <Library className="h-5 w-5" />
          Your Library
        </NavLink>
        <button
          type="button"
          aria-label="Create playlist"
          title="Create playlist"
          onClick={() => {
            openModal({ kind: 'create-playlist' })
            onNavigate?.()
          }}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-ink"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* filter pills + search */}
      <div className="flex items-center gap-1.5 px-1 pt-1">
        {(
          [
            { id: 'playlists', label: 'Playlists' },
            { id: 'artists', label: 'Artists' },
            { id: 'albums', label: 'Albums' },
          ] as { id: LibraryFilter; label: string }[]
        ).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold transition',
              filter === f.id
                ? 'bg-white/15 text-ink'
                : 'bg-white/5 text-muted hover:bg-white/10 hover:text-ink',
            )}
            aria-pressed={filter === f.id}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-ink">
          <SearchIcon className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      {norm && (
        <input
          autoFocus
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search in Your Library"
          aria-label="Filter your library"
          className="mx-1 mt-1 h-8 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-ink outline-none placeholder:text-muted focus:border-white/20 focus:bg-white/10"
        />
      )}

      {/* list */}
      <div className="scroll-area -mr-2 mt-1 flex-1 overflow-y-auto pr-2">
        {/* pinned: Liked Songs + Recently Played */}
        {!norm && filter === 'playlists' && (
          <div className="mb-1 flex flex-col gap-0.5">
            <LibraryRow
              to="/playlist/liked"
              title="Liked Songs"
              subtitle={`Playlist • ${liked.length} song${liked.length === 1 ? '' : 's'}`}
              cover={null}
              circlePalette={{ from: '#8B5CF6', via: '#A855F7', to: '#EC4899', deep: '#22103a', textOn: 'light' }}
              circleLetter="♥"
            />
            <LibraryRow
              to="/playlist/recent"
              title="Recently Played"
              subtitle={`Playlist • ${recentlyPlayed.length} song${recentlyPlayed.length === 1 ? '' : 's'}`}
              cover={null}
              circlePalette={{ from: '#38BDF8', via: '#2563EB', to: '#1E3A8A', deep: '#0C1A3B', textOn: 'light' }}
              circleLetter="R"
            />
          </div>
        )}

        {/* playlists */}
        {filter === 'playlists' && (
          <div className="flex flex-col gap-0.5">
            {filtered.map((p) => (
              <LibraryRow
                key={p.id}
                to={`/playlist/${p.id}`}
                title={p.title}
                subtitle={`${p.editable ? 'Playlist' : 'Nocturne'} • ${p.trackIds.length} song${p.trackIds.length === 1 ? '' : 's'}`}
                cover={{ seed: p.seed, shape: p.shape, palette: p.palette }}
              />
            ))}
            {filtered.length === 0 && (
              <p className="px-2 py-4 text-xs text-muted">No playlists match “{q}”.</p>
            )}
          </div>
        )}

        {filter === 'artists' && (
          <div className="px-2 py-4 text-xs text-muted">
            <FollowedArtists />
            <p>Follow artists from the app to see them here.</p>
          </div>
        )}

        {filter === 'albums' && (
          <p className="px-2 py-4 text-xs text-muted">Albums you save will appear here.</p>
        )}
      </div>
    </div>
  )
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUI()

  return (
    <aside
      className="relative hidden shrink-0 flex-col gap-3 border-r border-white/8 bg-canvas/60 p-3 lg:flex"
      style={{ width: sidebarCollapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)' }}
    >
      <div className={cn('flex items-center px-2 pt-1', sidebarCollapsed ? 'justify-center' : 'justify-between')}>
        <Logo collapsed={sidebarCollapsed} />
        {!sidebarCollapsed && (
          <button
            type="button"
            aria-label="Collapse sidebar"
            onClick={toggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-ink"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        )}
      </div>

      {sidebarCollapsed && (
        <button
          type="button"
          aria-label="Expand sidebar"
          onClick={toggleSidebar}
          className="mx-auto flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-ink"
        >
          <PanelLeftOpen className="h-5 w-5" />
        </button>
      )}

      <div className="min-h-0 flex-1">
        <SidebarContent collapsed={sidebarCollapsed} />
      </div>
    </aside>
  )
}
