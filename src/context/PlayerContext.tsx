import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { PlaybackContext, RepeatMode, ResolvedTrack } from '../types'
import { getEngine } from '../audio/engine'
import { hashString } from '../utils/seededRandom'
import { applyTheme } from '../utils/palette'
import { useLibrary } from './LibraryContext'
import { useUI } from './UIContext'

interface PlayerContextValue {
  currentTrack: ResolvedTrack | null
  isPlaying: boolean
  duration: number
  volume: number
  muted: boolean
  shuffle: boolean
  repeat: RepeatMode
  queue: ResolvedTrack[]
  currentIndex: number
  playbackContext: PlaybackContext | null
  nowPlayingOpen: boolean
  queueOpen: boolean

  /** Start playback. Pass a context list to build the queue (album/playlist). */
  playTrack: (track: ResolvedTrack, contextTracks?: ResolvedTrack[], context?: PlaybackContext) => void
  /** Play a whole list from the top (or a given start index). */
  playContext: (tracks: ResolvedTrack[], context: PlaybackContext, startIndex?: number) => void
  /** Play a list shuffled (enables shuffle and starts from a random track). */
  shuffleContext: (tracks: ResolvedTrack[], context: PlaybackContext) => void
  togglePlay: () => void
  next: () => void
  prev: () => void
  seek: (seconds: number) => void
  seekBy: (delta: number) => void
  setVolume: (v: number) => void
  toggleMute: () => void
  toggleShuffle: () => void
  cycleRepeat: () => void
  enqueue: (track: ResolvedTrack) => void
  playNext: (track: ResolvedTrack) => void
  removeFromQueue: (index: number) => void
  reorderQueue: (from: number, to: number) => void
  clearQueue: () => void

  openNowPlaying: () => void
  closeNowPlaying: () => void
  toggleNowPlaying: () => void
  toggleQueue: () => void

  subscribeTime: (cb: (t: number) => void) => () => void
  getTime: () => number
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr]
  // deterministic-ish but varied per session
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const engine = getEngine()
  const { addRecentlyPlayed } = useLibrary()
  const { toast } = useUI()

  const [currentTrack, setCurrentTrack] = useState<ResolvedTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(() => {
    try {
      const raw = localStorage.getItem('nocturne.player.volume')
      return raw != null ? JSON.parse(raw) : 0.8
    } catch {
      return 0.8
    }
  })
  const [muted, setMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState<RepeatMode>('off')
  const [queue, setQueue] = useState<ResolvedTrack[]>([])
  const [baseOrder, setBaseOrder] = useState<ResolvedTrack[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [playbackContext, setPlaybackContext] = useState<PlaybackContext | null>(null)
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false)
  const [queueOpen, setQueueOpen] = useState(false)

  // refs to avoid stale closures in engine callbacks / keyboard handlers
  const repeatRef = useRef(repeat)
  const shuffleRef = useRef(shuffle)
  const queueRef = useRef(queue)
  const indexRef = useRef(currentIndex)
  repeatRef.current = repeat
  shuffleRef.current = shuffle
  queueRef.current = queue
  indexRef.current = currentIndex

  const seedFor = (t: ResolvedTrack) => t.seed ?? hashString(t.id)

  /** Internal: load a track into the engine and reflect it in state. */
  const startTrack = useCallback(
    (track: ResolvedTrack, announce = false) => {
      engine.load({ id: track.id, duration: track.duration, audioUrl: track.audioUrl, seed: seedFor(track) })
      setCurrentTrack(track)
      setDuration(track.duration)
      addRecentlyPlayed(track.id)
      void engine.play()
      setIsPlaying(true)
      if (announce) toast(`Playing "${track.title}"`, { icon: 'play' })
    },
    [engine, addRecentlyPlayed, toast],
  )

  const playContext = useCallback<PlayerContextValue['playContext']>(
    (tracks, context, startIndex = 0) => {
      if (tracks.length === 0) return
      const base = tracks
      let order = base
      let index = startIndex
      if (shuffleRef.current) {
        const first = base[startIndex]
        const rest = shuffled(base.filter((_, i) => i !== startIndex))
        order = [first, ...rest]
        index = 0
      }
      setBaseOrder(base)
      setQueue(order)
      setCurrentIndex(index)
      setPlaybackContext(context)
      startTrack(order[index], true)
    },
    [startTrack],
  )

  const playTrack = useCallback<PlayerContextValue['playTrack']>(
    (track, contextTracks, context) => {
      const list = contextTracks && contextTracks.length ? contextTracks : [track]
      const ctx = context ?? { type: 'single', title: track.title }
      const startIndex = Math.max(0, list.findIndex((t) => t.id === track.id))
      playContext(list, ctx, startIndex)
    },
    [playContext],
  )

  const shuffleContext = useCallback<PlayerContextValue['shuffleContext']>(
    (tracks, context) => {
      if (tracks.length === 0) return
      setShuffle(true)
      const start = Math.floor(Math.random() * tracks.length)
      const first = tracks[start]
      const rest = shuffled(tracks.filter((_, i) => i !== start))
      setBaseOrder(tracks)
      setQueue([first, ...rest])
      setCurrentIndex(0)
      setPlaybackContext(context)
      startTrack(first, true)
    },
    [startTrack],
  )

  const togglePlay = useCallback(() => {
    if (!currentTrack) {
      // nothing loaded — start the queue if present
      if (queueRef.current.length) startTrack(queueRef.current[Math.max(0, indexRef.current)])
      return
    }
    if (isPlaying) {
      engine.pause()
      setIsPlaying(false)
    } else {
      void engine.play()
      setIsPlaying(true)
    }
  }, [currentTrack, isPlaying, engine, startTrack])

  const advance = useCallback(
    (auto: boolean) => {
      const q = queueRef.current
      const idx = indexRef.current
      if (q.length === 0) return
      if (auto && repeatRef.current === 'one') {
        engine.seek(0)
        void engine.play()
        setIsPlaying(true)
        return
      }
      let nextIdx = idx + 1
      if (nextIdx >= q.length) {
        if (repeatRef.current === 'all') {
          nextIdx = 0
        } else {
          // end of queue
          engine.pause()
          setIsPlaying(false)
          engine.seek(q[idx]?.duration ?? 0)
          return
        }
      }
      setCurrentIndex(nextIdx)
      startTrack(q[nextIdx])
    },
    [engine, startTrack],
  )

  const next = useCallback(() => advance(false), [advance])

  const prev = useCallback(() => {
    if (engine.getCurrentTime() > 3) {
      engine.seek(0)
      return
    }
    const idx = indexRef.current
    if (idx > 0) {
      const nextIdx = idx - 1
      setCurrentIndex(nextIdx)
      startTrack(queueRef.current[nextIdx])
    } else {
      engine.seek(0)
    }
  }, [engine, startTrack])

  const seek = useCallback((s: number) => engine.seek(s), [engine])
  const seekBy = useCallback((delta: number) => engine.seek(engine.getCurrentTime() + delta), [engine])

  const setVolume = useCallback(
    (v: number) => {
      const clamped = Math.max(0, Math.min(1, v))
      setVolumeState(clamped)
      setMuted(clamped === 0)
      engine.setVolume(clamped)
      try {
        localStorage.setItem('nocturne.player.volume', JSON.stringify(clamped))
      } catch {
        /* noop */
      }
    },
    [engine],
  )

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const nm = !m
      engine.setMuted(nm)
      return nm
    })
  }, [engine])

  const toggleShuffle = useCallback(() => {
    setShuffle((s) => {
      const ns = !s
      const cur = currentTrack
      if (ns) {
        // shuffle upcoming, keep current first
        if (cur) {
          const rest = shuffled(baseOrder.filter((t) => t.id !== cur.id))
          const order = [cur, ...rest]
          setQueue(order)
          setCurrentIndex(0)
        }
      } else {
        // restore base order
        setQueue(baseOrder)
        if (cur) setCurrentIndex(Math.max(0, baseOrder.findIndex((t) => t.id === cur.id)))
      }
      return ns
    })
  }, [currentTrack, baseOrder])

  const cycleRepeat = useCallback(() => {
    setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'))
  }, [])

  const enqueue = useCallback(
    (track: ResolvedTrack) => {
      if (!currentTrack) {
        playTrack(track)
        return
      }
      setQueue((q) => [...q, track])
      setBaseOrder((b) => [...b, track])
      toast('Added to queue', { icon: 'plus' })
    },
    [currentTrack, playTrack, toast],
  )

  const playNext = useCallback(
    (track: ResolvedTrack) => {
      if (!currentTrack) {
        playTrack(track)
        return
      }
      setQueue((q) => {
        const copy = [...q]
        copy.splice(indexRef.current + 1, 0, track)
        return copy
      })
      setBaseOrder((b) => [...b, track])
      toast('Playing next', { icon: 'plus' })
    },
    [currentTrack, playTrack, toast],
  )

  const removeFromQueue = useCallback((index: number) => {
    setQueue((q) => {
      if (index <= indexRef.current || index >= q.length) return q // only future items
      const copy = [...q]
      copy.splice(index, 1)
      return copy
    })
  }, [])

  const reorderQueue = useCallback((from: number, to: number) => {
    setQueue((q) => {
      const cur = indexRef.current
      if (from <= cur || to <= cur || from >= q.length || to >= q.length) return q
      const copy = [...q]
      const [moved] = copy.splice(from, 1)
      copy.splice(to, 0, moved)
      return copy
    })
  }, [])

  const clearQueue = useCallback(() => {
    setQueue((q) => q.slice(0, indexRef.current + 1))
    setBaseOrder((b) => b.slice(0, indexRef.current + 1))
    toast('Queue cleared', { icon: 'trash' })
  }, [toast])

  const openNowPlaying = useCallback(() => setNowPlayingOpen(true), [])
  const closeNowPlaying = useCallback(() => setNowPlayingOpen(false), [])
  const toggleNowPlaying = useCallback(() => setNowPlayingOpen((v) => !v), [])
  const toggleQueue = useCallback(() => setQueueOpen((v) => !v), [])

  const subscribeTime = useCallback((cb: (t: number) => void) => engine.onTime(cb), [engine])
  const getTime = useCallback(() => engine.getCurrentTime(), [engine])

  // engine "ended" -> advance
  useEffect(() => {
    const off = engine.onEnded(() => advance(true))
    return off
  }, [engine, advance])

  // apply initial volume to engine
  useEffect(() => {
    engine.setVolume(volume)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // dynamic theme follows the current album
  useEffect(() => {
    applyTheme(currentTrack ? currentTrack.album.palette : null)
  }, [currentTrack])

  const value = useMemo<PlayerContextValue>(
    () => ({
      currentTrack,
      isPlaying,
      duration,
      volume,
      muted,
      shuffle,
      repeat,
      queue,
      currentIndex,
      playbackContext,
      nowPlayingOpen,
      queueOpen,
      playTrack,
      playContext,
      shuffleContext,
      togglePlay,
      next,
      prev,
      seek,
      seekBy,
      setVolume,
      toggleMute,
      toggleShuffle,
      cycleRepeat,
      enqueue,
      playNext,
      removeFromQueue,
      reorderQueue,
      clearQueue,
      openNowPlaying,
      closeNowPlaying,
      toggleNowPlaying,
      toggleQueue,
      subscribeTime,
      getTime,
    }),
    [
      currentTrack,
      isPlaying,
      duration,
      volume,
      muted,
      shuffle,
      repeat,
      queue,
      currentIndex,
      playbackContext,
      nowPlayingOpen,
      queueOpen,
      playTrack,
      playContext,
      shuffleContext,
      togglePlay,
      next,
      prev,
      seek,
      seekBy,
      setVolume,
      toggleMute,
      toggleShuffle,
      cycleRepeat,
      enqueue,
      playNext,
      removeFromQueue,
      reorderQueue,
      clearQueue,
      openNowPlaying,
      closeNowPlaying,
      toggleNowPlaying,
      toggleQueue,
      subscribeTime,
      getTime,
    ],
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}
