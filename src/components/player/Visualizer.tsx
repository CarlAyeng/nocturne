import { useEffect, useRef } from 'react'
import { usePlayer } from '../../context/PlayerContext'
import { getEngine } from '../../audio/engine'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'

/** Bars visualizer fed by the AudioEngine analyser. Reduced-motion → static glow. */
export function Visualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentTrack = usePlayer().currentTrack
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    if (reduce) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const unsub = getEngine().onAnalyser((data) => {
      const w = canvas.width
      const h = canvas.height
      if (w === 0 || h === 0) return
      ctx.clearRect(0, 0, w, h)

      const barCount = Math.min(data.length, 64)
      const barW = w / barCount
      const midY = h / 2

      for (let i = 0; i < barCount; i++) {
        const val = data[i] / 255
        const barH = Math.max(1, val * h * 0.65)
        const t = i / barCount
        const r = Math.round(139 + (236 - 139) * t)
        const g = Math.round(92 + (72 - 92) * t)
        const b = Math.round(246 + (153 - 246) * t)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.25 + val * 0.75})`
        const x = i * barW
        ctx.fillRect(x, midY - barH / 2, Math.max(1, barW - 1), barH)
      }
    })

    return unsub
  }, [reduce, currentTrack])

  if (reduce) {
    return (
      <div className="flex h-16 w-48 items-end justify-center gap-[3px]" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="w-1.5 rounded-full bg-gradient-to-t from-primary to-accent" style={{ height: `${20 + i * 12}px`, opacity: 0.5 - i * 0.08 }} />
        ))}
      </div>
    )
  }

  return <canvas ref={canvasRef} className="h-24 w-full max-w-2xl" />
}