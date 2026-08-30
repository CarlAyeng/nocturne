import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Maximize2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import { CoverArt } from '../media/CoverArt'
import { Marquee } from '../media/Marquee'
import { ProgressBar } from './ProgressBar'
import { cn } from '../../utils/cn'

function TopProgressLine() {
  const { duration, subscribeTime, getTime } = usePlayer()
  const [t, setT] = useState(() => getTime())
  useEffect(() => subscribeTime(setT), [subscribeTime])
  const pct = duration > 0 ? Math.min(100, (t / duration) * 100) : 0
  return (
    <div className="absolute inset-x-0 top-0 h-[2px] bg-white/10">
      <div
        className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-150"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/**
 * Floating player pill — a single rounded bar centered near the bottom of
 * the page card. Sits over the page content, not at the screen edge.
 */
export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    shuffle,
    repeat,
    togglePlay,
    next,
    prev,
    toggleShuffle,
    cycleRepeat,
    openNowPlaying,
    volume,
    muted,
    setVolume,
    toggleMute,
  } = usePlayer()
  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat
  const hasTrack = Boolean(currentTrack)
  const track = currentTrack

  return (
    <footer
      className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 lg:px-16"
      aria-label="Player"
    >
      <div
        className={cn(
          'player-pill pointer-events-auto relative flex w-full max-w-[1100px] items-center gap-3 rounded-full border border-white/10 px-3 py-2 sm:gap-4 sm:px-4 sm:py-2.5',
        )}
      >
        <TopProgressLine />

        {/* cover + meta */}
        {track ? (
          <button
            onClick={openNowPlaying}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
          >
            <CoverArt
              seed={track.album.seed}
              shape={track.album.shape}
              palette={track.album.palette}
              className="h-10 w-10 shrink-0"
              rounded="rounded-lg"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">
                <Marquee>{track.title}</Marquee>
              </p>
              <p className="truncate text-xs text-muted">{track.artist.name}</p>
            </div>
          </button>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-3 text-muted">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-xs">
              ♪
            </div>
            <p className="text-sm">Pick a track to begin</p>
          </div>
        )}

        {/* transport — center */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            aria-label="Shuffle"
            onClick={toggleShuffle}
            disabled={!hasTrack}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:text-ink',
              shuffle && 'text-accent',
            )}
          >
            <Shuffle className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Previous"
            onClick={prev}
            disabled={!hasTrack}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:text-ink"
          >
            <SkipBack className="h-5 w-5" fill="currentColor" />
          </button>
          <button
            type="button"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={togglePlay}
            disabled={!hasTrack}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-canvas shadow-glow transition hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" fill="currentColor" />
            ) : (
              <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
            )}
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={next}
            disabled={!hasTrack}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:text-ink"
          >
            <SkipForward className="h-5 w-5" fill="currentColor" />
          </button>
          <button
            type="button"
            aria-label="Repeat"
            onClick={cycleRepeat}
            disabled={!hasTrack}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:text-ink',
              repeat !== 'off' && 'text-accent',
            )}
          >
            <RepeatIcon className="h-4 w-4" />
          </button>
        </div>

        {/* progress + volume — right (hidden on tiny screens) */}
        <div className="ml-2 hidden items-center gap-3 lg:flex">
          <div className="w-44">
            <ProgressBar compact />
          </div>
          <button
            type="button"
            aria-label={muted ? 'Unmute' : 'Mute'}
            onClick={toggleMute}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:text-ink"
          >
            {muted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Volume"
            className="range h-1 w-24 cursor-pointer appearance-none rounded-full bg-white/10"
          />
          <Link
            to="/discover"
            aria-label="Open now playing"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:text-ink"
          >
            <Maximize2 className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
