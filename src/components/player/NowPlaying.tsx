import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ChevronDown,
  ListMusic,
  Maximize2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import { usePlayer } from '../../context/PlayerContext'
import { useLibrary } from '../../context/LibraryContext'
import { CoverArt } from '../media/CoverArt'
import { Marquee } from '../media/Marquee'
import { IconButton } from '../common/IconButton'
import { ProgressBar } from './ProgressBar'
import { VolumeControl } from './VolumeControl'
import { QueuePanel } from './QueuePanel'
import { Visualizer } from './Visualizer'
import { LyricsPanel } from './LyricsPanel'
import { cn } from '../../utils/cn'

const RepeatIcon = ({ repeat }: { repeat: string }) =>
  repeat === 'one' ? <Repeat1 className="h-6 w-6" /> : <Repeat className="h-6 w-6" />

export function NowPlaying() {
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
    queueOpen,
    nowPlayingOpen,
    closeNowPlaying,
    toggleQueue,
    queue,
  } = usePlayer()
  const { isLiked, toggleLike } = useLibrary()

  const track = currentTrack
  if (!track) return null

  const liked = isLiked(track.id)
  const RepeatCmp = RepeatIcon

  return (
    <AnimatePresence>
      {nowPlayingOpen && (
        <motion.div
          className="fixed inset-0 z-[150] flex flex-col bg-canvas"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Dynamic background */}
          <div
            aria-hidden="true"
            className="absolute inset-0 transition-colors duration-700"
            style={{
              background: `linear-gradient(180deg, ${track.album.palette.deep} 0%, #0b0b14 100%)`,
            }}
          />
          <div
            aria-hidden="true"
            className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full opacity-40 blur-[180px]"
            style={{ background: track.album.palette.from }}
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full opacity-35 blur-[160px]"
            style={{ background: track.album.palette.via }}
          />
          <Visualizer />

          {/* Header */}
          <header className="relative z-10 flex items-center justify-between px-4 pt-3 sm:px-6">
            <button
              type="button"
              aria-label="Close now playing"
              onClick={closeNowPlaying}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-ink transition hover:bg-white/20"
            >
              <ChevronDown className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Toggle queue"
                onClick={toggleQueue}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition',
                  queueOpen ? 'bg-white/15 text-ink' : 'bg-white/5 text-muted hover:text-ink',
                )}
              >
                <ListMusic className="h-4 w-4" />
                Queue
              </button>
              <button
                type="button"
                aria-label="Expand player"
                onClick={closeNowPlaying}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-ink transition hover:bg-white/20"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center overflow-y-auto scroll-area px-4 pb-4 pt-4 sm:px-6">
            <div className="flex w-full max-w-2xl flex-col items-center gap-6">
              {/* Art */}
              <div className="relative shrink-0">
                <CoverArt
                  seed={track.album.seed}
                  shape={track.album.shape}
                  palette={track.album.palette}
                  title={track.album.title}
                  className="h-64 w-64 shadow-lift sm:h-72 sm:w-72"
                />
                <div className="absolute inset-0 rounded-2xl animate-spin-slow opacity-[0.12]" style={{ background: `conic-gradient(from 0deg, ${track.album.palette.from}, ${track.album.palette.via}, ${track.album.palette.from})` }} />
              </div>

              {/* Info */}
              <div className="flex w-full max-w-2xl flex-col items-center gap-2">
                <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                  <Marquee>{track.title}</Marquee>
                </h2>
                <Link to={`/artist/${track.artistId}`} className="text-sm text-muted transition hover:text-ink hover:underline">
                  <Marquee>{track.artist.name}</Marquee>
                </Link>
              </div>

              <ProgressBar />

              <div className="flex items-center gap-3">
                <IconButton label="Shuffle" size="sm" active={shuffle} onClick={toggleShuffle}>
                  <Shuffle className="h-[18px] w-[18px]" />
                </IconButton>
                <IconButton label="Previous" onClick={prev}>
                  <SkipBack className="h-6 w-6" fill="currentColor" />
                </IconButton>
                <button
                  type="button"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  onClick={togglePlay}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-canvas shadow-xl transition hover:scale-105 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" fill="currentColor" />
                  ) : (
                    <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
                  )}
                </button>
                <IconButton label="Next" onClick={next}>
                  <SkipForward className="h-6 w-6" fill="currentColor" />
                </IconButton>
                <IconButton label={repeat === 'one' ? 'Repeat one' : repeat === 'all' ? 'Repeat all' : 'Repeat'} size="sm" active={repeat !== 'off'} onClick={cycleRepeat}>
                  <RepeatCmp repeat={repeat} />
                </IconButton>
              </div>

              <VolumeControl />

              {/* Tabs */}
              <div className="flex w-full max-w-2xl flex-col gap-4 pt-4">
                <div className="flex items-center gap-4 border-b border-white/10">
                  <button type="button" className="pb-2 text-sm font-semibold text-ink underline-offset-4 decoration-primary">
                    Lyrics
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!queueOpen) toggleQueue()
                    }}
                    className="pb-2 text-sm font-semibold text-muted transition hover:text-ink"
                  >
                    Queue ({queue.length})
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {queueOpen ? <QueuePanel /> : <LyricsPanel track={track} />}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}