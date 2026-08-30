import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BadgeCheck, Headphones, Link2 } from 'lucide-react'
import { DetailHero } from '../components/media/DetailHero'
import { PlayActionBar } from '../components/media/PlayActionBar'
import { TrackTable } from '../components/media/TrackTable'
import { EmptyState } from '../components/common/EmptyState'
import { Button } from '../components/common/Button'
import { PageMotion } from '../components/common/PageMotion'
import { SectionHeader } from '../components/media/SectionHeader'
import { usePlayer } from '../context/PlayerContext'
import { useLibrary } from '../context/LibraryContext'
import { getArtist, popularByArtist, albumsByArtist, relatedArtists } from '../data'
import { formatCompact } from '../utils/format'
import { AlbumCard } from '../components/media/AlbumCard'
import { ArtistCard } from '../components/media/ArtistCard'

export default function Artist() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { isFollowing, toggleFollow } = useLibrary()
  const { playContext, isPlaying, playbackContext, togglePlay } = usePlayer()
  const artist = getArtist(id)

  const popular = useMemo(() => (artist ? popularByArtist(artist.id, 10) : []), [artist])
  const albums = useMemo(() => (artist ? albumsByArtist(artist.id) : []), [artist])
  const related = useMemo(() => (artist ? relatedArtists(artist.id) : []), [artist])
  const following = isFollowing(id)

  if (!artist) {
    return (
      <PageMotion className="pt-16">
        <EmptyState
          icon={<span className="h-7 w-7" />}
          title="Artist not found"
          description="This artist may not exist."
          action={<Button onClick={() => navigate('/')}>Back to Home</Button>}
        />
      </PageMotion>
    )
  }

  const handlePlay = () => {
    if (popular.length) playContext(popular, { type: 'artist', id: artist.id, title: artist.name }, 0)
  }

  return (
    <PageMotion>
      <DetailHero
        palette={artist.palette}
        seed={artist.seed}
        shape={artist.shape}
        circular
        eyebrow="Artist"
        title={artist.name}
        meta={
          <>
            <span className="inline-flex items-center gap-1 text-ink">
              <Headphones className="h-4 w-4" /> {formatCompact(artist.monthlyListeners)} monthly listeners
            </span>
            {artist.verified && <BadgeCheck className="h-5 w-5 text-primary-soft" />}
          </>
        }
      />

      <div className="px-4 pt-2 sm:px-6 lg:px-8">
        <PlayActionBar onPlay={handlePlay} playing={isPlaying} playLabel={`Play ${artist.name}`}>
          <button
            type="button"
            onClick={() => toggleFollow(artist.id)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${following ? 'bg-white/10 text-ink hover:bg-white/20' : 'bg-white text-canvas hover:bg-white/90'}`}
          >
            {following ? 'Following' : 'Follow'}
          </button>
          <button type="button" aria-label="Share artist" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-ink transition hover:bg-white/10">
            <Link2 className="h-5 w-5" />
          </button>
        </PlayActionBar>

        <SectionHeader title="Popular songs" to="/" />
        <TrackTable tracks={popular} context={{ type: 'artist', id: artist.id, title: artist.name }} />

        {albums.length > 0 && (
          <>
            <SectionHeader title="Albums" to={`/artist/${artist.id}`} />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {albums.map((a) => (
                <AlbumCard key={a.id} album={a} />
              ))}
            </div>
          </>
        )}

        {related.length > 0 && (
          <>
            <SectionHeader title="Related artists" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {related.map((a) => (
                <ArtistCard key={a.id} artist={a} />
              ))}
            </div>
          </>
        )}
      </div>
    </PageMotion>
  )
}