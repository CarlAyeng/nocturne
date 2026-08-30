import { useEffect, useRef, useState } from 'react'
import { Slider } from '../common/Slider'
import { usePlayer } from '../../context/PlayerContext'
import { formatTime } from '../../utils/format'
import { cn } from '../../utils/cn'

/** Seek bar with live current-time / duration readouts. */
export function ProgressBar({ className, hideTimes = false, compact = false }: { className?: string; hideTimes?: boolean; compact?: boolean }) {
  const { duration, seek, subscribeTime, getTime } = usePlayer()
  const [time, setTime] = useState(() => getTime())
  const dragging = useRef(false)

  useEffect(() => {
    setTime(getTime())
    return subscribeTime((t) => {
      if (!dragging.current) setTime(t)
    })
  }, [subscribeTime, getTime])

  return (
    <div className={cn('flex w-full items-center gap-2', className)}>
      {!hideTimes && !compact && (
        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted">{formatTime(time)}</span>
      )}
      <Slider
        value={time}
        max={duration}
        ariaLabel="Seek"
        size={compact ? 'sm' : 'md'}
        className="flex-1"
        onScrubStart={() => (dragging.current = true)}
        onChange={(v) => {
          dragging.current = true
          setTime(v)
          seek(v)
        }}
        onCommit={(v) => {
          seek(v)
          dragging.current = false
        }}
      />
      {!hideTimes && !compact && (
        <span className="w-10 shrink-0 text-left text-xs tabular-nums text-muted">{formatTime(duration)}</span>
      )}
    </div>
  )
}
