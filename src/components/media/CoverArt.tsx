import { memo, useId, useMemo } from 'react'
import type { CoverShape, Palette } from '../../types'
import { Rng } from '../../utils/seededRandom'
import { blobPath, wavePath } from '../../utils/cover'
import { onColor, rgba } from '../../utils/palette'
import { cn } from '../../utils/cn'

interface CoverArtProps {
  seed: number
  shape: CoverShape
  palette: Palette
  /** used to derive a monogram + optional label */
  title?: string
  /** show the monogram/label typography (use on larger art) */
  showText?: boolean
  className?: string
  rounded?: string
}

function monogram(title?: string): string {
  if (!title) return ''
  const words = title.replace(/[^\w\s]/g, '').trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

/**
 * Deterministic, offline album/playlist/artist artwork.
 * Same (seed, shape, palette) always renders the same cover.
 */
function CoverArtBase({ seed, shape, palette, title, showText = false, className, rounded = 'rounded-2xl' }: CoverArtProps) {
  const uid = useId().replace(/:/g, '')
  const gid = `g-${uid}`
  const rid = `r-${uid}`
  const nid = `n-${uid}`
  const cid = `c-${uid}`
  const ink = onColor(palette)

  const shapes = useMemo(() => buildShapes(seed, shape, palette), [seed, shape, palette])
  const mono = useMemo(() => monogram(title), [title])

  return (
    <div className={cn('relative overflow-hidden', rounded, className)}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="h-full w-full block">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.from} />
            <stop offset="55%" stopColor={palette.via} />
            <stop offset="100%" stopColor={palette.to} />
          </linearGradient>
          <radialGradient id={rid} cx="30%" cy="25%" r="90%">
            <stop offset="0%" stopColor={rgba('#ffffff', 0.28)} />
            <stop offset="55%" stopColor={rgba('#ffffff', 0)} />
          </radialGradient>
          <clipPath id={cid}>
            <rect width="100" height="100" />
          </clipPath>
          <filter id={nid}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.55" intercept="0" />
            </feComponentTransfer>
          </filter>
        </defs>

        <g clipPath={`url(#${cid})`}>
          {/* base gradient */}
          <rect width="100" height="100" fill={`url(#${gid})`} />
          {/* generated shapes */}
          {shapes}
          {/* top-left light source */}
          <rect width="100" height="100" fill={`url(#${rid})`} />
          {/* vignette */}
          <rect width="100" height="100" fill={rgba(palette.deep, 0.35)} style={{ mixBlendMode: 'multiply' }} />
          {/* grain */}
          <rect width="100" height="100" filter={`url(#${nid})`} opacity="0.32" style={{ mixBlendMode: 'overlay' }} />

          {showText && mono && (
            <text
              x="8"
              y="92"
              fontFamily="'Space Grotesk', sans-serif"
              fontSize="30"
              fontWeight="700"
              fill={ink}
              opacity="0.9"
              style={{ letterSpacing: '-0.03em' }}
            >
              {mono}
            </text>
          )}
        </g>
      </svg>
    </div>
  )
}

/* ---------------- per-shape generators ---------------- */

function buildShapes(seed: number, shape: CoverShape, palette: Palette): JSX.Element[] {
  const rng = new Rng(seed * 2654435761)
  const out: JSX.Element[] = []
  const light = rgba('#ffffff', 0.16)
  const lightStrong = rgba('#ffffff', 0.28)
  const dark = rgba(palette.deep, 0.5)

  switch (shape) {
    case 'orbits': {
      const cx = rng.range(30, 70)
      const cy = rng.range(30, 70)
      for (let i = 0; i < 5; i++) {
        const r = 12 + i * rng.range(9, 13)
        out.push(
          <ellipse
            key={`o${i}`}
            cx={cx}
            cy={cy}
            rx={r}
            ry={r * rng.range(0.55, 0.9)}
            fill="none"
            stroke={i % 2 ? light : dark}
            strokeWidth={rng.range(0.6, 1.6)}
            transform={`rotate(${rng.range(-40, 40)} ${cx} ${cy})`}
          />,
        )
      }
      out.push(<circle key="sun" cx={cx} cy={cy} r={rng.range(6, 10)} fill={lightStrong} />)
      break
    }
    case 'waves': {
      const bands = 3
      for (let i = 0; i < bands; i++) {
        const y = 30 + i * 22
        out.push(
          <path
            key={`w${i}`}
            d={wavePath(rng, y, rng.range(6, 12))}
            fill={i % 2 ? dark : light}
            opacity={0.9 - i * 0.15}
          />,
        )
      }
      break
    }
    case 'bars': {
      const n = rng.int(7, 11)
      const gap = 100 / n
      for (let i = 0; i < n; i++) {
        const h = rng.range(20, 82)
        out.push(
          <rect
            key={`b${i}`}
            x={i * gap + gap * 0.18}
            y={100 - h}
            width={gap * 0.64}
            height={h}
            rx={gap * 0.3}
            fill={i % 3 === 0 ? lightStrong : i % 2 ? light : dark}
          />,
        )
      }
      break
    }
    case 'blobs': {
      const n = rng.int(2, 3)
      for (let i = 0; i < n; i++) {
        out.push(
          <path
            key={`bl${i}`}
            d={blobPath(rng, rng.range(25, 75), rng.range(25, 75), rng.range(22, 40))}
            fill={i % 2 ? light : dark}
            opacity={0.85}
          />,
        )
      }
      out.push(
        <circle key="dot" cx={rng.range(20, 80)} cy={rng.range(20, 80)} r={rng.range(4, 8)} fill={lightStrong} />,
      )
      break
    }
    case 'prism': {
      const cx = rng.range(35, 65)
      for (let i = 0; i < 6; i++) {
        const x = cx + (i - 3) * rng.range(6, 10)
        out.push(
          <polygon
            key={`p${i}`}
            points={`${x},110 ${x + rng.range(6, 12)},-10 ${x + rng.range(14, 22)},110`}
            fill={i % 2 ? light : dark}
            opacity={0.7}
            transform={`rotate(${rng.range(-8, 8)} 50 50)`}
          />,
        )
      }
      break
    }
    case 'rings': {
      for (let i = 0; i < 6; i++) {
        const cx = rng.range(20, 80)
        const cy = rng.range(20, 80)
        out.push(
          <circle
            key={`r${i}`}
            cx={cx}
            cy={cy}
            r={rng.range(8, 26)}
            fill="none"
            stroke={i % 2 ? lightStrong : dark}
            strokeWidth={rng.range(1, 3)}
          />,
        )
      }
      break
    }
    case 'grid': {
      const n = rng.int(4, 6)
      const cell = 100 / n
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          if (rng.chance(0.45)) continue
          out.push(
            <rect
              key={`g${r}-${c}`}
              x={c * cell + cell * 0.12}
              y={r * cell + cell * 0.12}
              width={cell * 0.76}
              height={cell * 0.76}
              rx={2}
              fill={(r + c) % 2 ? light : dark}
              opacity={rng.range(0.5, 1)}
            />,
          )
        }
      }
      break
    }
  }
  return out
}

export const CoverArt = memo(CoverArtBase)
