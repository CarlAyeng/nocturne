import { useSearchParams } from 'react-router-dom'
import { Compass, Music, Search as SearchIcon, TrendingUp } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { SearchBar } from '../components/search/SearchBar'
import { SearchResults } from '../components/search/SearchResults'
import { SectionHeader } from '../components/media/SectionHeader'
import { GenreTiles } from '../components/media/GenreTiles'
import { Shelf } from '../components/media/Shelf'
import { AlbumCard } from '../components/media/AlbumCard'
import { PlaylistCard } from '../components/media/PlaylistCard'
import { ArtistCard } from '../components/media/ArtistCard'
import { trendingTracks } from '../data'
import { PageMotion } from '../components/common/PageMotion'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const [recents, setRecents] = useLocalStorage<string[]>('search.recents', [])

  const recordSearch = (q: string) => {
    setRecents((prev) => [q, ...prev.filter((x) => x !== q)].slice(0, 8))
  }

  const trending = trendingTracks(10)

  const handleFocusSearch = () => {
    if (!params.has('q')) setParams({ q: '' }, { replace: true })
  }

  return (
    <PageMotion>
      <section className="pb-8">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1">
            <SearchBar onSubmit={recordSearch} />
          </div>
          <button
            type="button"
            onClick={handleFocusSearch}
            className="hidden items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs text-muted transition hover:bg-white/10 hover:text-ink lg:flex"
          >
            <SearchIcon className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </button>
        </div>

        {/* Trending when no query */}
        {!query && (
          <section>
            <SectionHeader title="Trending now" subtitle="Right now on Nocturne" to="/search" />
            <div className="flex flex-col gap-2">
              {trending.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setParams({ q: t.title })}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-white/[0.06]"
                >
                  <span className="w-7 text-center font-display text-lg font-bold text-muted group-hover:text-ink">
                    {i + 1}
                  </span>
                  <span className="truncate font-medium text-ink">{t.title}</span>
                  <span className="truncate text-sm text-muted">{t.artist.name}</span>
                  <span className="hidden text-sm tabular-nums text-muted sm:block">{t.duration}s</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Recent searches */}
        {recents.length > 0 && (
          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <SectionHeader title="Recent searches" />
              <button
                type="button"
                onClick={() => setRecents([])}
                className="text-xs font-semibold text-muted transition hover:text-ink"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recents.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setParams({ q: r })}
                  className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-sm text-ink transition hover:bg-white/10 hover:text-primary-soft"
                >
                  <SearchIcon className="h-3.5 w-3.5 text-muted" />
                  <span className="max-w-[16rem] truncate">{r}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Browse by genre */}
        <section className="mt-8">
          <SectionHeader title="Browse" subtitle="Genres and moods" />
          <GenreTiles />
        </section>
      </section>

      {/* Results */}
      {query && <SearchResults />}
    </PageMotion>
  )
}