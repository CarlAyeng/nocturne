import { useRef } from 'react'
import { cn } from '../../utils/cn'

interface SliderProps {
  value: number
  max: number
  onChange: (v: number) => void
  onCommit?: (v: number) => void
  onScrubStart?: () => void
  ariaLabel: string
  className?: string
  size?: 'sm' | 'md'
  /** keep the thumb visible even without hover */
  thumbAlways?: boolean
}

/**
 * Accessible custom slider: an invisible native <input type=range> handles
 * keyboard + pointer, while a styled track/fill/thumb renders the visuals.
 */
export function Slider({
  value,
  max,
  onChange,
  onCommit,
  onScrubStart,
  ariaLabel,
  className,
  size = 'sm',
  thumbAlways = false,
}: SliderProps) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0
  const trackH = size === 'md' ? 'h-1.5' : 'h-1'
  const boxH = size === 'md' ? 'h-4' : 'h-3'
  const scrubbing = useRef(false)

  const commit = () => {
    if (scrubbing.current) {
      scrubbing.current = false
      onCommit?.(value)
    }
  }

  return (
    <div className={cn('group/slider relative flex items-center', boxH, className)}>
      <div className={cn('absolute inset-x-0 rounded-full bg-white/15', trackH)} />
      <div
        className={cn('absolute rounded-full bg-gradient-to-r from-primary to-accent', trackH)}
        style={{ width: `${pct}%` }}
      />
      <div
        className={cn(
          'pointer-events-none absolute h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow transition-opacity',
          thumbAlways ? 'opacity-100' : 'opacity-0 group-hover/slider:opacity-100',
        )}
        style={{ left: `${pct}%` }}
      />
      <input
        type="range"
        min={0}
        max={max || 0}
        step="any"
        value={Math.min(value, max || 0)}
        aria-label={ariaLabel}
        aria-valuetext={`${Math.round(pct)}%`}
        onPointerDown={() => {
          scrubbing.current = true
          onScrubStart?.()
        }}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={commit}
        onKeyUp={() => onCommit?.(value)}
        onBlur={commit}
        className="range absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  )
}
