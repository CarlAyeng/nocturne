import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Play,
  Shuffle,
  TrendingUp,
} from 'lucide-react'
import { AlbumCard } from '../components/media/AlbumCard'
import { PlaylistCard } from '../components/media/PlaylistCard'
import { CoverArt } from '../components/media/CoverArt'
import { PlayFab } from '../components/media/PlayFab'
import { Marquee } from '../components/media/Marquee'
import { usePlayer } from '../context/PlayerContext'
import { useLibrary } from '../context/LibraryContext'
import {
  featuredArtists,
  madeForYouPlaylists,
  newReleaseAlbums,
  resolveTracks,
  trendingTracks,
  yourPlaylists,
} from '../data'
import { greeting, formatTime } from '../utils/format'
import { PageMotion } from '../components/common/PageMotion'
import { cn } from '../utils/cn'

const USER = 'Carl'

/* ---------- generic horizontal scroller with chevron buttons ---------- */
function HScroller({
  children,
  className,
  step = 320,
}: {
  children: React.ReactNode
  className?: string
  step?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }
  return (
    <div className={cn('group relative', className)}>
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scroll(-1)}
        className="absolute -left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-muted backdrop-blur-md transition hover:bg-white/10 hover:text-ink md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scroll(1)}
        className="absolute -right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-muted backdrop-blur-md transition hover:bg-white/10 hover:text-ink md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div
        ref={ref}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2"
      >
        {children}
      </div>
    </div>
  )
}

/* ---------- section header with optional back/forward chevron pair (mirrors the reference) ---------- */
function SectionTitle({ title, subtitle, back, forward }: { title: string; subtitle?: string; back?: () => void; forward?: () => void }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">{title}</h2>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>
      {(back || forward) && (
        <div className="hidden gap-1 sm:flex">
          <button
            type="button"
            aria-label="Previous"
            onClick={back}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-muted transition hover:bg-white/10 hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={forward}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-muted transition hover:bg-white/10 hover:text-ink"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const { recentlyPlayed, isLiked, toggleLike } = useLibrary()
  const { playContext, playTrack, shuffleContext } = usePlayer()

  const your = yourPlaylists()
  const madeForYou = madeForYouPlaylists()
  const featured = featuredArtists(7)
  const trending = trendingTracks(10)
  const newReleases = newReleaseAlbums(8)
  const recent = useMemo(() => resolveTracks(recentlyPlayed).slice(0, 6), [recentlyPlayed])
  const continuePlaying = useMemo(() => trending.slice(0, 2), [trending])

  return (
    <PageMotion className="px-4 py-5 sm:px-7 sm:py-7">
      {/* greeting + greeting row */}
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Top Recommendation</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {greeting()}, <span className="text-gradient">{USER}</span>
          </h1>
        </div>
        <div className="hidden gap-1 sm:flex">
          <button
            type="button"
            aria-label="Previous"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-muted transition hover:bg-white/10 hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-muted transition hover:bg-white/10 hover:text-ink"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Top Recommendation — square album cards (matches reference) */}
      <section className="mb-8">
        <HScroller>
          {your.map((p) => (
            <div
              key={p.id}
              className="relative w-44 shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-2 transition hover:border-white/20 hover:bg-white/[0.07] sm:w-48"
            >
              <Link to={`/playlist/${p.id}`} className="block">
                <CoverArt
                  seed={p.seed}
                  shape={p.shape}
                  palette={p.palette}
                  showText
                  className="aspect-square w-full rounded-xl"
                />
              </Link>
              <div className="mt-2 flex items-center justify-between gap-2 px-1">
                <Link to={`/playlist/${p.id}`} className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{p.title}</p>
                  <p className="truncate text-xs text-muted">{p.description || 'Nocturne'}</p>
                </Link>
                <PlayFab
                  onClick={() => playContext(resolveTracks(p.trackIds), { type: 'playlist', id: p.id, title: p.title })}
                  label={`Play ${p.title}`}
                  size="sm"
                  visible
                />
              </div>
            </div>
          ))}
        </HScroller>
      </section>

      {/* Two-column: Following Artists (left) + Continue Playing (right) */}
      <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Following Artists — circle row */}
        <div>
          <SectionTitle title="Following Artists" subtitle="The people you follow" />
          <HScroller step={200}>
            {featured.map((a) => (
              <Link
                key={a.id}
                to={`/artist/${a.id}`}
                className="flex w-28 shrink-0 snap-start flex-col items-center text-center"
              >
                <CoverArt
                  seed={a.seed}
                  shape={a.shape}
                  palette={a.palette}
                  className="aspect-square w-24 rounded-full"
                  rounded="rounded-full"
                />
                <p className="mt-2 truncate text-sm font-semibold text-ink">{a.name}</p>
                <p className="truncate text-xs text-muted">{a.monthlyListeners.toLocaleString()} listeners</p>
              </Link>
            ))}
          </HScroller>
        </div>

        {/* Continue Playing — mini-list (matches reference) */}
        <div>
          <SectionTitle title="Continue Playing" />
          <div className="flex flex-col gap-2">
            {continuePlaying.map((t) => (
              <div
                key={t.id}
                className="group flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] p-2 transition hover:border-white/15 hover:bg-white/[0.07]"
              >
                <CoverArt
                  seed={t.album.seed}
                  shape={t.album.shape}
                  palette={t.album.palette}
                  className="h-14 w-14 shrink-0"
                  rounded="rounded-xl"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    <Marquee>{t.title}</Marquee>
                  </p>
                  <p className="truncate text-xs text-muted">{t.artist.name}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Play ${t.title}`}
                  onClick={() => playTrack(t, [t], { type: 'single', title: t.title })}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-canvas shadow-glow transition hover:scale-105 active:scale-95"
                >
                  <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
                </button>
                <span className="hidden w-12 shrink-0 text-right text-xs tabular-nums text-muted sm:inline">
                  {formatTime(t.duration)}
                </span>
                <button
                  type="button"
                  aria-label={isLiked(t.id) ? 'Unlike' : 'Like'}
                  onClick={(e) => {
                    e.preventDefault()
                    toggleLike(t.id)
                  }}
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-white/10',
                    isLiked(t.id) && 'text-accent',
                  )}
                >
                  <Heart className={cn('h-4 w-4', isLiked(t.id) && 'fill-current')} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recently played (if any) */}
      {recent.length > 0 && (
        <section className="mb-8">
          <SectionTitle title="Recently played" subtitle="Pick up where you left off" />
          <HScroller>
            {recent.map((t) => (
              <div key={t.id} className="w-40 shrink-0 snap-start sm:w-44">
                <AlbumCard album={t.album} subtitle={t.artist.name} />
              </div>
            ))}
          </HScroller>
        </section>
      )}

      {/* Made for you — large card grid */}
      <section className="mb-8">
        <SectionTitle title="Made for you" subtitle="Playlists we think you'll love" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {madeForYou.slice(0, 6).map((p) => (
            <PlaylistCard key={p.id} playlist={p} large />
          ))}
        </div>
      </section>

      {/* Trending — distinct panel */}
      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">Trending now</h2>
        </div>
        <div className="overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 p-2 sm:p-3">
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
            {trending.slice(0, 6).map((t, i) => {
              const rank = i + 1
              const play = () => playContext(trending, { type: 'search', title: 'Trending now' }, i)
              return (
                <button
                  key={t.id}
                  onClick={play}
                  className="group flex items-center gap-3 rounded-2xl px-2 py-2 text-left transition hover:bg-white/[0.06]"
                >
                  <span className="w-6 text-center font-display text-lg font-bold text-muted group-hover:text-ink">
                    {rank}
                  </span>
                  <CoverArt seed={t.album.seed} shape={t.album.shape} palette={t.album.palette} className="h-12 w-12 shrink-0" rounded="rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{t.title}</p>
                    <p className="truncate text-sm text-muted">{t.artist.name}</p>
                  </div>
                  <span className="hidden text-sm tabular-nums text-muted sm:block">{formatTime(t.duration)}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/0 text-ink opacity-0 transition group-hover:bg-white/10 group-hover:opacity-100">
                    <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        {trending.length > 0 && (
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => shuffleContext(trending, { type: 'search', title: 'Trending now' })}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-ink transition hover:bg-white/10"
            >
              <Shuffle className="h-3.5 w-3.5" />
              Shuffle trending
            </button>
          </div>
        )}
      </section>

      {/* New releases */}
      <section className="mb-8">
        <SectionTitle title="New releases" subtitle="Fresh from your favorite artists" />
        <HScroller>
          {newReleases.map((a) => (
            <div key={a.id} className="w-40 shrink-0 snap-start sm:w-44 md:w-48">
              <AlbumCard album={a} />
            </div>
          ))}
        </HScroller>
      </section>
    </PageMotion>
  )
}
