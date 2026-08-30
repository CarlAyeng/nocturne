import type { Palette } from '../types'

/* ============================================================= *
 *  Curated palettes.
 *  Each album / artist / playlist references one of these to get a
 *  distinct visual identity. The palette also drives the dynamic
 *  Now Playing background + subtle page theming.
 * ============================================================= */

export const PALETTES: Record<string, Palette> = {
  nebula: { from: '#8B5CF6', via: '#6366F1', to: '#312E81', deep: '#1E1B4B', textOn: 'light' },
  magma: { from: '#F43F5E', via: '#EC4899', to: '#7C2D5E', deep: '#3B0A2A', textOn: 'light' },
  aurora: { from: '#22D3EE', via: '#2DD4BF', to: '#0F766E', deep: '#042F2E', textOn: 'light' },
  sunset: { from: '#FB923C', via: '#F43F5E', to: '#9A3412', deep: '#3B1206', textOn: 'light' },
  midnight: { from: '#60A5FA', via: '#4338CA', to: '#1E1B4B', deep: '#0B1026', textOn: 'light' },
  citrus: { from: '#FACC15', via: '#F97316', to: '#B45309', deep: '#3B2408', textOn: 'dark' },
  forest: { from: '#4ADE80', via: '#16A34A', to: '#14532D', deep: '#052E16', textOn: 'light' },
  rose: { from: '#FDA4AF', via: '#F472B6', to: '#BE185D', deep: '#4C0519', textOn: 'dark' },
  cobalt: { from: '#38BDF8', via: '#2563EB', to: '#1E3A8A', deep: '#0C1A3B', textOn: 'light' },
  amethyst: { from: '#C084FC', via: '#A855F7', to: '#6B21A8', deep: '#2E1065', textOn: 'light' },
  ember: { from: '#FCA5A5', via: '#EF4444', to: '#7F1D1D', deep: '#340a0a', textOn: 'light' },
  mint: { from: '#6EE7B7', via: '#14B8A6', to: '#0F766E', deep: '#04302B', textOn: 'dark' },
  slate: { from: '#94A3B8', via: '#475569', to: '#1E293B', deep: '#0B1220', textOn: 'light' },
  gold: { from: '#FDE68A', via: '#D4A017', to: '#92610E', deep: '#2E1F04', textOn: 'dark' },
  violetHaze: { from: '#DDD6FE', via: '#8B5CF6', to: '#5B21B6', deep: '#25104f', textOn: 'light' },
  coral: { from: '#FDBA74', via: '#FB7185', to: '#BE123C', deep: '#450a18', textOn: 'light' },
}

export type PaletteKey = keyof typeof PALETTES

export const palette = (key: PaletteKey): Palette => PALETTES[key]

/** Nocturne brand palette — used as the default theme when nothing is playing. */
export const BRAND_PALETTE: Palette = {
  from: '#8B5CF6',
  via: '#A855F7',
  to: '#EC4899',
  deep: '#22103a',
  textOn: 'light',
}

/* ---- color math (for gradients / glows) ---- */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h,
    16,
  )
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** Mix two hex colors, t in [0,1]. */
export function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a)
  const [br, bg, bb] = hexToRgb(b)
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return `#${[r, g, bl].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

export const onColor = (p: Palette) => (p.textOn === 'dark' ? '#0B0B14' : '#F8FAFF')

/**
 * Apply a palette as the live document theme by setting CSS custom
 * properties. Consumed by the dynamic background + accents.
 */
export function applyTheme(p: Palette | null): void {
  const root = document.documentElement
  const t = p ?? BRAND_PALETTE
  root.style.setProperty('--theme-1', t.from)
  root.style.setProperty('--theme-2', t.via)
  root.style.setProperty('--theme-3', t.deep)
}
