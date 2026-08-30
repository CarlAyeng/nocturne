import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface MarqueeProps {
  children: ReactNode
  className?: string
}

/**
 * Seamless single-line marquee for overflowing titles/artists.
 * Only scrolls when the content is wider than its container, pauses on
 * hover/focus, and is frozen by the global `prefers-reduced-motion` override.
 * Pure CSS animation — no JS loop.
 */
export function Marquee({ children, className }: MarqueeProps) {
  const maskRef = useRef<HTMLSpanElement>(null)
  const itemRef = useRef<HTMLSpanElement>(null)
  const [overflow, setOverflow] = useState(false)
  const [textW, setTextW] = useState(0)

  useEffect(() => {
    const mask = maskRef.current
    const item = itemRef.current
    if (!mask || !item) return
    const measure = () => {
      const w = item.scrollWidth
      setTextW(w)
      setOverflow(w > mask.clientWidth)
    }
    measure()
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(measure)
      ro.observe(mask)
      return () => ro.disconnect()
    }
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [children])

  // Scale duration with width so the speed feels consistent across titles.
  const maskStyle = overflow
    ? ({ '--marquee-duration': `${Math.max(6, Math.round(textW / 28))}s` } as React.CSSProperties)
    : undefined

  if (!overflow) {
    return (
      <span ref={maskRef} className={cn('block overflow-hidden whitespace-nowrap', className)}>
        <span ref={itemRef} className="block truncate">{children}</span>
      </span>
    )
  }

  return (
    <span
      ref={maskRef}
      style={maskStyle}
      className={cn('marquee-mask block', className)}
    >
      <span className="marquee-track">
        <span ref={itemRef} className="marquee-item">{children}</span>
        <span className="marquee-item" aria-hidden="true">{children}</span>
      </span>
    </span>
  )
}
