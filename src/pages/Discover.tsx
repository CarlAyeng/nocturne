import { Link } from 'react-router-dom'
import { Shelf } from '../components/media/Shelf'
import { AlbumCard } from '../components/media/AlbumCard'
import { PlaylistCard } from '../components/media/PlaylistCard'
import { ArtistCard } from '../components/media/ArtistCard'
import { CoverArt } from '../components/media/CoverArt'
import { PlayFab } from '../components/media/PlayFab'
import { usePlayer } from '../context/PlayerContext'
import { featuredArtists, madeForYouPlaylists, newReleaseAlbums, trendingTracks } from '../data'
import { formatTime } from '../utils/format'
import { PageMotion } from '../components/common/PageMotion'

export default function Discover() {
  const { playContext } = usePlayer()
  const madeForYou = madeForYouPlaylists()
  const newReleases = newReleaseAlbums(10)
  const trending = trendingTracks(10)
  const featured = featuredArtists(6)

  return (
    <PageMotion className="space-y-12 pt-2">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 p-6 sm:p-10">
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Made for you</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Discover new music today
          </h1>
          <p className="mt-4 text-sm text-ink/70">
            Personalized picks from your listening history, updated every week.
          </p>
          <Link to="/playlist/pl-afterdark" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110">
            Start exploring
          </Link>
        </div>
        <div className="absolute right-0 top-1/2 hidden h-48 w-72 -translate-y-1/2 transform opacity-20 blur-3xl md:block" style={{ background: '#8B5CF6' }} />
      </section>

      <Shelf title="Made for you" subtitle="Personalized playlists just for you">
        {madeForYou.map((p) => (
          <div key={p.id} className="w-72 shrink-0 snap-start sm:w-80">
            <PlaylistCard playlist={p} large />
          </div>
        ))}
      </Shelf>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">Trending now</h2>
        </div>
        <div className="flex flex-col gap-1">
          {trending.map((t, i) => (
            <button key={t.id} onClick={() => playContext(trending, { type: 'search', title: 'Trending now' }, i)} className="group flex items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-white/[0.06]">
              <span className="w-8 text-center font-display text-lg font-bold text-muted group-hover:text-ink">{i + 1}</span>
              <div className="h-10 w-10 shrink-0 rounded-lg bg-white/5">
                <div className="h-full w-full rounded-lg bg-gradient-to-br from-white/10 to-transparent" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{t.title}</p>
                <p className="truncate text-sm text-muted">{t.artist.name}</p>
              </div>
              <span className="hidden text-sm tabular-nums text-muted sm:block">{formatTime(t.duration)}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">New releases</h2>
          <Link to="/browse" className="text-xs font-semibold uppercase tracking-wide text-muted transition hover:text-ink">Show all</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {newReleases.map((a) => (
            <AlbumCard key={a.id} album={a} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">Featured artists</h2>
          <Link to="/browse" className="text-xs font-semibold uppercase tracking-wide text-muted transition hover:text-ink">See all</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {featured.map((a) => (
            <ArtistCard key={a.id} artist={a} />
          ))}
        </div>
      </section>
    </PageMotion>
  )
}