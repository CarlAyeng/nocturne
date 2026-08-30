import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Search } from 'lucide-react'
import { TrackTable } from '../components/media/TrackTable'
import { PlaylistCard } from '../components/media/PlaylistCard'
import { EmptyState } from '../components/common/EmptyState'
import { Button } from '../components/common/Button'
import { Tabs } from '../components/common/Tabs'
import { useUI } from '../context/UIContext'
import { useLibrary } from '../context/LibraryContext'
import { resolveTracks } from '../data'
import { PageMotion } from '../components/common/PageMotion'
import { SectionHeader } from '../components/media/SectionHeader'
import type { Playlist, ResolvedTrack } from '../types'

type Tab = 'playlists' | 'songs' | 'albums' | 'artists'

export default function Library() {
  const [tab, setTab] = useState<Tab>('playlists')
  const { userPlaylists, liked } = useLibrary()
  const { openModal } = useUI()
  const { isLiked, toggleLike, deletePlaylist } = useLibrary()
  const navigate = useNavigate()

  const allPlaylistTracks: ResolvedTrack[] = (() => {
    const seen = new Set<string>()
    const out: ResolvedTrack[] = []
    for (const p of userPlaylists) {
      for (const id of p.trackIds) {
        if (seen.has(id)) continue
        seen.add(id)
        const t = resolveTracks([id])[0]
        if (t) out.push(t)
      }
    }
    return out
  })()

  const likedTracks = resolveTracks(liked)

  const tabs: { id: Tab; label: string }[] = [
    { id: 'playlists', label: 'Playlists' },
    { id: 'songs', label: 'Songs' },
    { id: 'albums', label: 'Albums' },
    { id: 'artists', label: 'Artists' },
  ]

  return (
    <PageMotion>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Your <span className="text-gradient">Library</span>
        </h1>
        <button
          type="button"
          onClick={() => openModal({ kind: 'create-playlist' })}
          className="flex h-11 items-center gap-2 rounded-full bg-gradient-to-br from-primary to-accent px-5 py-2 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Create playlist</span>
        </button>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={(t) => setTab(t as Tab)} />

      {tab === 'playlists' && (
        <>
          {userPlaylists.length === 0 ? (
            <EmptyState
              icon={<Plus className="h-7 w-7" />}
              title="No playlists yet"
              description="Create your first playlist to curate your own listening experience."
              action={<Button onClick={() => openModal({ kind: 'create-playlist' })}>Create playlist</Button>}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {userPlaylists.map((p) => (
                <div key={p.id} className="group relative">
                  <Link to={`/playlist/${p.id}`} className="block">
                    <PlaylistCard playlist={p} />
                  </Link>
                  <button
                    type="button"
                    aria-label={`Delete ${p.title}`}
                    onClick={() => deletePlaylist(p.id)}
                    className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'songs' && (
        <>
          {allPlaylistTracks.length === 0 ? (
            <EmptyState
              icon={<Search className="h-7 w-7" />}
              title="No songs yet"
              description="Add tracks to playlists or search to discover music."
              action={<Button onClick={() => navigate('/search')}>Explore</Button>}
            />
          ) : (
            <TrackTable tracks={allPlaylistTracks} context={{ type: 'search', title: 'Library' }} />
          )}
        </>
      )}

      {tab === 'albums' && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {[...new Map(likedTracks.map((t) => [t.albumId, t])).values()].map((t) => (
            <Link key={t.albumId} to={`/album/${t.albumId}`} className="w-40 shrink-0">
              <PlaylistCard playlist={{ id: t.albumId, title: t.album.title, description: t.artist.name, creator: 'Nocturne', trackIds: [], palette: t.album.palette, seed: t.album.seed, shape: t.album.shape, editable: false, createdAt: 0 }} />
            </Link>
          ))}
        </div>
      )}

      {tab === 'artists' && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {[...new Map(likedTracks.map((t) => [t.artistId, t])).values()].map((t) => (
            <Link key={t.artistId} to={`/artist/${t.artistId}`} className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                <span className="font-display text-lg font-bold text-primary-soft">{t.artist.name.slice(0, 2)}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-ink">{t.artist.name}</p>
            </Link>
          ))}
        </div>
      )}
    </PageMotion>
  )
}