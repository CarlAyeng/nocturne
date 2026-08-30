import type { Track } from '../../types'
import { getLyrics } from '../../data'
import { usePlayer } from '../../context/PlayerContext'

export function LyricsPanel({ track }: Props) {
  const { getTime } = usePlayer()
  const lines = getLyrics(track.id)
  const currentTime = getTime()

  if (!lines || lines.length === 0) {
    return (
      <div className="rounded-2xl bg-white/[0.03] p-6 text-center">
        <p className="text-sm text-muted">No lyrics available yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-1 overflow-y-auto scroll-area px-2 py-1">
      {lines.map((line, i) => {
        const active = !!(i < lines.length - 1 && currentTime >= line.time && currentTime < lines[i + 1].time)
        return (
          <p
            key={i}
            className={`text-center text-sm leading-relaxed transition-colors ${active ? 'text-ink' : 'text-muted'}`}
          >
            {line.text}
          </p>
        )
      })}
    </div>
  )
}

interface Props {
  track: Track
}