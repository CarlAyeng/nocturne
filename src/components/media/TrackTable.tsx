import { Clock } from 'lucide-react'
import type { PlaybackContext, ResolvedTrack } from '../../types'
import { SongRow } from './SongRow'
import { cn } from '../../utils/cn'

interface TrackTableProps {
  tracks: ResolvedTrack[]
  context: PlaybackContext
  showHeader?: boolean
  showAlbum?: boolean
  inPlaylistId?: string
  /** start numbering at this value (default 1) */
  startIndex?: number
}

export function TrackTable({
  tracks,
  context,
  showHeader = true,
  showAlbum = true,
  inPlaylistId,
}: TrackTableProps) {
  return (
    <div>
      {showHeader && (
        <div
          className={cn(
            'sticky top-[64px] z-10 mb-1 hidden items-center gap-4 border-b border-white/8 px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted backdrop-blur-sm sm:flex',
          )}
        >
          <span className="w-6 text-center">#</span>
          <span className="flex-1">Title</span>
          {showAlbum && <span className="hidden flex-1 md:block">Album</span>}
          <span className="w-10" />
          <span className="w-10 text-right">
            <Clock className="ml-auto h-4 w-4" />
          </span>
          <span className="w-8" />
        </div>
      )}
      <div className="flex flex-col">
        {tracks.map((t, i) => (
          <SongRow
            key={`${t.id}-${i}`}
            track={t}
            index={i + 1}
            contextTracks={tracks}
            context={context}
            showAlbum={showAlbum}
            inPlaylistId={inPlaylistId}
          />
        ))}
      </div>
    </div>
  )
}
