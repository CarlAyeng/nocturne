import type { ReactNode } from 'react'
import { Pause, Play, Shuffle } from 'lucide-react'
import { IconButton } from '../common/IconButton'
import { cn } from '../../utils/cn'

interface PlayActionBarProps {
  onPlay: () => void
  playing: boolean
  onShuffle?: () => void
  shuffleActive?: boolean
  disabled?: boolean
  children?: ReactNode
  playLabel?: string
}

export function PlayActionBar({
  onPlay,
  playing,
  onShuffle,
  shuffleActive,
  disabled,
  children,
  playLabel = 'Play',
}: PlayActionBarProps) {
  return (
    <div className="flex items-center gap-4 py-6">
      <button
        type="button"
        aria-label={playing ? 'Pause' : playLabel}
        onClick={onPlay}
        disabled={disabled}
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-glow transition',
          'hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100',
        )}
      >
        {playing ? (
          <Pause className="h-6 w-6" fill="currentColor" />
        ) : (
          <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
        )}
      </button>
      {onShuffle && (
        <IconButton label="Shuffle" size="lg" active={shuffleActive} onClick={onShuffle} disabled={disabled}>
          <Shuffle className="h-6 w-6" />
        </IconButton>
      )}
      {children}
    </div>
  )
}
