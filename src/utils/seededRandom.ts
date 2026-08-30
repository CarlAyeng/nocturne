/* ============================================================= *
 *  Deterministic pseudo-random helpers.
 *  Same seed -> same sequence, so generated artwork is stable
 *  across renders and reloads.
 * ============================================================= */

/** Mulberry32 — fast, decent-quality seeded PRNG returning [0,1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Deterministic 32-bit string hash (FNV-1a style) -> unsigned int seed. */
export function hashString(str: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** A stateful, seedable random source with convenience helpers. */
export class Rng {
  private next: () => number
  constructor(seed: number | string) {
    this.next = mulberry32(typeof seed === 'string' ? hashString(seed) : seed)
  }
  /** float in [0,1) */
  float(): number {
    return this.next()
  }
  /** float in [min,max) */
  range(min: number, max: number): number {
    return min + this.next() * (max - min)
  }
  /** integer in [min,max] inclusive */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1))
  }
  /** pick a random element */
  pick<T>(arr: readonly T[]): T {
    return arr[this.int(0, arr.length - 1)]
  }
  /** true with probability p */
  chance(p: number): boolean {
    return this.next() < p
  }
}
