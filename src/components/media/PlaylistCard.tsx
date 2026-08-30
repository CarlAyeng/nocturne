import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { Playlist } from '../../types'
import { CoverArt } from './CoverArt'
import { PlayFab } from './PlayFab'
import { usePlayer } from '../../context/PlayerContext'
import { resolveTracks } from '../../data'

interface PlaylistCardProps {
  playlist: Playlist
  /** larger "Made For You"-style card */
  large?: boolean
}

function PlaylistCardBase({ playlist, large = false }: PlaylistCardProps) {
  const { playContext, isPlaying, togglePlay, playbackContext } = usePlayer()
  const isCurrent = playbackContext?.type === 'playlist' && playbackContext.id === playlist.id
  const showPause = isCurrent && isPlaying

  const handlePlay = () => {
    if (isCurrent) {
      togglePlay()
      return
    }
    const tracks = resolveTracks(playlist.trackIds)
    if (tracks.length) playContext(tracks, { type: 'playlist', id: playlist.id, title: playlist.title })
  }

  if (large) {
    return (
      <Link
        to={`/playlist/${playlist.id}`}
        className="card-hover group relative block overflow-hidden rounded-3xl shadow-card"
      >
        <CoverArt
          seed={playlist.seed}
          shape={playlist.shape}
          palette={playlist.palette}
          title={playlist.title}
          className="aspect-[4/3] w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">Made for you</p>
            <p className="mt-1 truncate font-display text-lg font-bold text-white">{playlist.title}</p>
            <p className="mt-0.5 line-clamp-1 text-xs text-white/70">{playlist.description}</p>
          </div>
          <PlayFab onClick={handlePlay} playing={showPause} label={`Play ${playlist.title}`} />
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/playlist/${playlist.id}`}
      className="card-hover group block rounded-2xl bg-white/[0.03] p-3 hover:bg-white/[0.06]"
    >
      <div className="relative">
        <CoverArt
          seed={playlist.seed}
          shape={playlist.shape}
          palette={playlist.palette}
          title={playlist.title}
          showText
          className="aspect-square w-full shadow-card"
        />
        <div className="absolute bottom-2 right-2">
          <PlayFab onClick={handlePlay} playing={showPause} label={`Play ${playlist.title}`} />
        </div>
      </div>
      <div className="mt-3 min-w-0">
        <p className="truncate font-semibold text-ink">{playlist.title}</p>
        <p className="mt-0.5 line-clamp-2 text-sm text-muted">{playlist.description || `By ${playlist.creator}`}</p>
      </div>
    </Link>
  )
}

export const PlaylistCard = memo(PlaylistCardBase)
