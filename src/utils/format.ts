/* ============================================================= *
 *  Formatting helpers
 * ============================================================= */

/** Seconds -> "m:ss" (or "h:mm:ss" for long durations). */
export function formatTime(totalSeconds: number): string {
  if (!isFinite(totalSeconds) || totalSeconds < 0) return '0:00'
  const s = Math.floor(totalSeconds)
  const hours = Math.floor(s / 3600)
  const minutes = Math.floor((s % 3600) / 60)
  const seconds = s % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`
  return `${minutes}:${pad(seconds)}`
}

/** Sum of track durations -> a human phrase like "1 hr 12 min" or "42 min". */
export function formatTotalDuration(totalSeconds: number): string {
  const mins = Math.round(totalSeconds / 60)
  if (mins < 60) return `${mins} min`
  const hrs = Math.floor(mins / 60)
  const rem = mins % 60
  return rem === 0 ? `${hrs} hr` : `${hrs} hr ${rem} min`
}

/** 1234567 -> "1,234,567" */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

/** 1234567 -> "1.2M", 12345 -> "12.3K" */
export function formatCompact(n: number): string {
  if (n < 1000) return String(n)
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}K`
  return `${(n / 1_000_000).toFixed(n < 10_000_000 ? 1 : 0)}M`
}

/** ISO date -> "Aug 30, 2026" */
export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/** ISO date -> "2026" */
export function formatYear(iso: string): string {
  return String(new Date(iso).getFullYear())
}

/** Time-of-day greeting. */
export function greeting(date = new Date()): string {
  const h = date.getHours()
  if (h < 5) return 'Good night'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
