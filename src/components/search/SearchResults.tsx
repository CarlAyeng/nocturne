import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SectionHeader } from '../media/SectionHeader'
import { Shelf } from '../media/Shelf'
import { SongRow } from '../media/SongRow'
import { AlbumCard } from '../media/AlbumCard'
import { PlaylistCard } from '../media/PlaylistCard'
import { ArtistCard } from '../media/ArtistCard'
import { EmptyState } from '../common/EmptyState'
import { SearchIcon } from 'lucide-react'
import { search } from '../../utils/search'
import { editorialPlaylists } from '../../data'
import { formatTime } from '../../utils/format'
import { cn } from '../../utils/cn'

const TopResult = ({ item }: { item: { kind: string; item: any } }) => {
  const kindLabel = { artist: 'Artist', album: 'Album', track: 'Track', playlist: 'Playlist' }[item.kind] ?? ''
  return (
    <button
      onClick={() => {}}
      className={cn(
        'flex w-full items-center gap-4 rounded-xl bg-white/[0.06] p-3 text-left transition hover:bg-white/[0.1]',
        'focus-visible:bg-white/[0.1]',
      )}
    >
      <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-primary-soft">{kindLabel}</span>
      <span className="truncate font-semibold text-ink">
        {'artist' in item ? (item.item as any).name : 'title' in item ? (item.item as any).title : (item.item as any).title}
      </span>
      {('artist' in item || 'artistName' in item) && (
        <span className="truncate text-sm text-muted">{(item.item as any).name ?? (item.item as any).artistName}</span>
      )}
    </button>
  )
}

export function SearchResults() {
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''
  const results = useMemo(() => search(query, editorialPlaylists), [query])

  if (results.isEmpty) {
    return (
      <div className="mt-10">
        <EmptyState
          icon={<SearchIcon className="h-7 w-7" />}
          title="Nothing found"
          description={`We couldn't find anything matching "${query}". Try a different search term.`}
          action={
            <button
              type="button"
              onClick={() => params.set('q', '')}
              className="rounded-full bg-gradient-to-br from-primary to-accent px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
            >
              Clear search
            </button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-8">
      {results.top && (
        <section>
          <SectionHeader title="Top result" subtitle={`Best match for "${query}"`} />
          <div className="rounded-xl bg-white/[0.04] p-2">
            <TopResult item={results.top} />
          </div>
        </section>
      )}

      {results.tracks.length > 0 && (
        <section>
          <SectionHeader title="Songs" subtitle={`${results.tracks.length} result${results.tracks.length > 1 ? 's' : ''}`} />
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02]">
            {results.tracks.map((t, i) => (
              <SongRow key={t.id} track={t} index={i} contextTracks={results.tracks} context={{ type: 'search', title: query }} showAlbum />
            ))}
          </div>
        </section>
      )}

      {results.artists.length > 0 && (
        <section>
          <SectionHeader title="Artists" subtitle={`${results.artists.length} result${results.artists.length > 1 ? 's' : ''}`} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {results.artists.map((a) => (
              <ArtistCard key={a.id} artist={a} />
            ))}
          </div>
        </section>
      )}

      {results.albums.length > 0 && (
        <section>
          <Shelf title="Albums" subtitle={`${results.albums.length} result${results.albums.length > 1 ? 's' : ''}`}>
            {results.albums.map((a) => (
              <div key={a.id} className="w-40 shrink-0 snap-start sm:w-44 md:w-48">
                <AlbumCard album={a} />
              </div>
            ))}
          </Shelf>
        </section>
      )}

      {results.playlists.length > 0 && (
        <section>
          <SectionHeader title="Playlists" subtitle={`${results.playlists.length} result${results.playlists.length > 1 ? 's' : ''}`} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {results.playlists.map((p) => (
              <PlaylistCard key={p.id} playlist={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}