import { memo } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck } from 'lucide-react'
import type { Artist } from '../../types'
import { CoverArt } from './CoverArt'
import { PlayFab } from './PlayFab'
import { usePlayer } from '../../context/PlayerContext'
import { popularByArtist } from '../../data'
import { formatCompact } from '../../utils/format'

function ArtistCardBase({ artist }: { artist: Artist }) {
  const { playContext, isPlaying, togglePlay, playbackContext } = usePlayer()
  const isCurrent = playbackContext?.type === 'artist' && playbackContext.id === artist.id
  const showPause = isCurrent && isPlaying

  const handlePlay = () => {
    if (isCurrent) {
      togglePlay()
      return
    }
    const tracks = popularByArtist(artist.id, 10)
    if (tracks.length) playContext(tracks, { type: 'artist', id: artist.id, title: artist.name })
  }

  return (
    <Link
      to={`/artist/${artist.id}`}
      className="card-hover group block rounded-2xl bg-white/[0.03] p-3 text-center hover:bg-white/[0.06]"
    >
      <div className="relative">
        <CoverArt
          seed={artist.seed}
          shape={artist.shape}
          palette={artist.palette}
          title={artist.name}
          className="mx-auto aspect-square w-full rounded-full shadow-card"
          rounded="rounded-full"
        />
        <div className="absolute bottom-1 right-1">
          <PlayFab onClick={handlePlay} playing={showPause} label={`Play ${artist.name}`} />
        </div>
      </div>
      <div className="mt-3">
        <p className="flex items-center justify-center gap-1 truncate font-semibold text-ink">
          <span className="truncate">{artist.name}</span>
          {artist.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-primary-soft" />}
        </p>
        <p className="mt-0.5 truncate text-sm text-muted">{formatCompact(artist.monthlyListeners)} monthly</p>
      </div>
    </Link>
  )
}

export const ArtistCard = memo(ArtistCardBase)
