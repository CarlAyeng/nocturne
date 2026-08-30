import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { Album } from '../../types'
import { CoverArt } from './CoverArt'
import { PlayFab } from './PlayFab'
import { usePlayer } from '../../context/PlayerContext'
import { getArtist, tracksByAlbum } from '../../data'
import { formatYear } from '../../utils/format'

interface AlbumCardProps {
  album: Album
  subtitle?: string
}

function AlbumCardBase({ album, subtitle }: AlbumCardProps) {
  const { playContext, isPlaying, togglePlay, playbackContext } = usePlayer()
  const artist = getArtist(album.artistId)
  const isCurrent = playbackContext?.type === 'album' && playbackContext.id === album.id
  const showPause = isCurrent && isPlaying

  const handlePlay = () => {
    if (isCurrent) {
      togglePlay()
      return
    }
    const tracks = tracksByAlbum(album.id)
    if (tracks.length) playContext(tracks, { type: 'album', id: album.id, title: album.title })
  }

  const typeLabel = album.type === 'single' ? 'Single' : album.type === 'ep' ? 'EP' : 'Album'

  return (
    <Link
      to={`/album/${album.id}`}
      className="card-hover group block rounded-2xl bg-white/[0.03] p-3 hover:bg-white/[0.06]"
    >
      <div className="relative">
        <CoverArt
          seed={album.seed}
          shape={album.shape}
          palette={album.palette}
          title={album.title}
          showText
          className="aspect-square w-full shadow-card"
        />
        <div className="absolute bottom-2 right-2">
          <PlayFab onClick={handlePlay} playing={showPause} label={`Play ${album.title}`} />
        </div>
      </div>
      <div className="mt-3 min-w-0">
        <p className="truncate font-semibold text-ink">{album.title}</p>
        <p className="mt-0.5 truncate text-sm text-muted">
          {subtitle ?? `${formatYear(album.releaseDate)} · ${typeLabel} · ${artist?.name ?? ''}`}
        </p>
      </div>
    </Link>
  )
}

export const AlbumCard = memo(AlbumCardBase)
