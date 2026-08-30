import { memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ListPlus, ListStart, MoreHorizontal, Disc3, User, Trash2, X, GripVertical } from 'lucide-react'
import type { PlaybackContext, ResolvedTrack } from '../../types'
import { CoverArt } from './CoverArt'
import { LikeButton } from '../common/LikeButton'
import { Menu, type MenuItem } from '../common/Menu'
import { usePlayer } from '../../context/PlayerContext'
import { useLibrary } from '../../context/LibraryContext'
import { useUI } from '../../context/UIContext'
import { formatTime } from '../../utils/format'
import { cn } from '../../utils/cn'

interface SongRowProps {
  track: ResolvedTrack
  index?: number
  contextTracks?: ResolvedTrack[]
  context?: PlaybackContext
  showAlbum?: boolean
  showArt?: boolean
  /** if set, offers "Remove from this playlist" and treats the row as editable */
  inPlaylistId?: string
  /** queue mode: show a remove (X) button + drag handle instead of the more menu */
  queueMode?: boolean
  onRemove?: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>
}

function EqBars() {
  return (
    <span className="flex h-4 items-end gap-[2px]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="eq-bar w-[3px] rounded-full bg-accent"
          style={{ height: '100%', animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

function SongRowBase({
  track,
  index,
  contextTracks,
  context,
  showAlbum = true,
  showArt = true,
  inPlaylistId,
  queueMode = false,
  onRemove,
  dragHandleProps,
}: SongRowProps) {
  const navigate = useNavigate()
  const { currentTrack, isPlaying, playContext, playNext, enqueue } = usePlayer()
  const { isLiked, removeFromPlaylist } = useLibrary()
  const { openModal } = useUI()

  const isCurrent = currentTrack?.id === track.id
  const playingThis = isCurrent && isPlaying
  const liked = isLiked(track.id)

  const play = () => {
    const list = contextTracks && contextTracks.length ? contextTracks : [track]
    const idx = Math.max(0, list.findIndex((t) => t.id === track.id))
    playContext(list, context ?? { type: 'single', title: track.title }, idx)
  }

  const menuItems: MenuItem[] = [
    { label: 'Play next', icon: <ListStart className="h-4 w-4" />, onClick: () => playNext(track) },
    { label: 'Add to queue', icon: <ListPlus className="h-4 w-4" />, onClick: () => enqueue(track) },
    {
      label: 'Add to playlist',
      icon: <ListPlus className="h-4 w-4" />,
      onClick: () => openModal({ kind: 'add-to-playlist', targetId: track.id }),
    },
    {
      label: 'Go to artist',
      icon: <User className="h-4 w-4" />,
      onClick: () => navigate(`/artist/${track.artistId}`),
      separatorBefore: true,
    },
    { label: 'Go to album', icon: <Disc3 className="h-4 w-4" />, onClick: () => navigate(`/album/${track.albumId}`) },
  ]
  if (inPlaylistId) {
    menuItems.push({
      label: 'Remove from this playlist',
      icon: <Trash2 className="h-4 w-4" />,
      danger: true,
      separatorBefore: true,
      onClick: () => removeFromPlaylist(inPlaylistId, track.id),
    })
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={play}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          play()
        }
      }}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-2 py-2 outline-none transition-colors sm:gap-4 sm:px-3',
        'hover:bg-white/[0.06] focus-visible:bg-white/[0.06]',
        isCurrent && 'bg-white/[0.04]',
      )}
    >
      {/* leading: drag handle (queue) / index / play / eq */}
      <div className="flex w-6 shrink-0 items-center justify-center text-sm text-muted">
        {queueMode && dragHandleProps ? (
          <button
            {...dragHandleProps}
            aria-label="Drag to reorder"
            className="cursor-grab text-muted/60 hover:text-ink active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ) : playingThis ? (
          <EqBars />
        ) : (
          <>
            <span className={cn('tabular-nums group-hover:hidden', isCurrent && 'text-accent')}>
              {index ?? '•'}
            </span>
            <span className="hidden group-hover:inline" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-ink">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </>
        )}
      </div>

      {showArt && (
        <CoverArt
          seed={track.album.seed}
          shape={track.album.shape}
          palette={track.album.palette}
          className="h-10 w-10 shrink-0"
          rounded="rounded-lg"
        />
      )}

      <div className="min-w-0 flex-1">
        <p className={cn('truncate font-medium', isCurrent ? 'text-accent' : 'text-ink')}>{track.title}</p>
        <Link
          to={`/artist/${track.artistId}`}
          onClick={(e) => e.stopPropagation()}
          className="truncate text-sm text-muted transition hover:text-ink hover:underline"
        >
          {track.artist.name}
        </Link>
      </div>

      {showAlbum && (
        <Link
          to={`/album/${track.albumId}`}
          onClick={(e) => e.stopPropagation()}
          className="hidden min-w-0 flex-1 truncate text-sm text-muted transition hover:text-ink hover:underline md:block"
        >
          {track.album.title}
        </Link>
      )}

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <span className={cn('transition-opacity', liked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100')}>
          <LikeButton trackId={track.id} />
        </span>
        <span className="w-10 text-right text-sm tabular-nums text-muted">{formatTime(track.duration)}</span>
        {queueMode ? (
          <button
            type="button"
            aria-label="Remove from queue"
            onClick={(e) => {
              e.stopPropagation()
              onRemove?.()
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <Menu
            triggerLabel={`More options for ${track.title}`}
            trigger={<MoreHorizontal className="h-5 w-5" />}
            items={menuItems}
            triggerClassName="flex h-8 w-8 items-center justify-center rounded-full text-muted opacity-0 transition hover:bg-white/10 hover:text-ink group-hover:opacity-100 focus-visible:opacity-100 focus-within:opacity-100"
          />
        )}
      </div>
    </div>
  )
}

export const SongRow = memo(SongRowBase)
