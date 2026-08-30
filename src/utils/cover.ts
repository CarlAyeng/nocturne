import type { CoverShape } from '../types'
import { Rng } from './seededRandom'

/* ============================================================= *
 *  Geometry builders for generated cover art.
 *  All deterministic given a seeded Rng.
 * ============================================================= */

const ALL_SHAPES: CoverShape[] = ['orbits', 'waves', 'bars', 'blobs', 'prism', 'rings', 'grid']

export function shapeFromSeed(seed: number): CoverShape {
  return new Rng(seed).pick(ALL_SHAPES)
}

/** A closed, smooth "blob" path around center (cx,cy) with given base radius. */
export function blobPath(rng: Rng, cx: number, cy: number, radius: number, points = 8): string {
  const pts: Array<[number, number]> = []
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2
    const r = radius * rng.range(0.72, 1.28)
    pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r])
  }
  // Catmull-Rom -> cubic bezier for a smooth closed curve
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  const n = pts.length
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d + ' Z'
}

/** A horizontal wave path across a 100x100 viewport at vertical offset y. */
export function wavePath(rng: Rng, y: number, amp: number): string {
  const segs = 4
  let d = `M -5 ${y.toFixed(1)}`
  let x = -5
  const step = 110 / segs
  for (let i = 0; i < segs; i++) {
    const cx1 = x + step * 0.4
    const cx2 = x + step * 0.6
    const nx = x + step
    const dir = i % 2 === 0 ? -1 : 1
    const cy = y + dir * amp * rng.range(0.7, 1.2)
    d += ` C ${cx1.toFixed(1)} ${cy.toFixed(1)}, ${cx2.toFixed(1)} ${cy.toFixed(1)}, ${nx.toFixed(1)} ${y.toFixed(1)}`
    x = nx
  }
  // close down to the bottom so it can be filled
  return d + ` L 105 105 L -5 105 Z`
}

export { ALL_SHAPES }
