import type { Track } from '../types'

/* ============================================================= *
 *  Tracks. Durations in seconds. Audio is synth-generated at
 *  runtime (see useAudioEngine); `audioUrl` is intentionally
 *  omitted so the synth engine drives playback. Drop a file in
 *  /public/audio and set audioUrl to play real audio instead.
 * ============================================================= */

export const tracks: Track[] = [
  // Halcyon Bloom — Paper Constellations
  { id: 't-paper1', title: 'Paper Constellations', artistId: 'a-halcyon', albumId: 'al-paper', genre: 'Dream Pop', duration: 224, releaseDate: '2025-09-12', popularity: 88 },
  { id: 't-paper2', title: 'Slow Comet', artistId: 'a-halcyon', albumId: 'al-paper', genre: 'Dream Pop', duration: 251, releaseDate: '2025-09-12', popularity: 74 },
  { id: 't-paper3', title: 'Held in Amber', artistId: 'a-halcyon', albumId: 'al-paper', genre: 'Dream Pop', duration: 198, releaseDate: '2025-09-12', popularity: 69 },
  { id: 't-paper4', title: 'Northern Wired', artistId: 'a-halcyon', albumId: 'al-paper', genre: 'Dream Pop', duration: 236, releaseDate: '2025-09-12', popularity: 61 },
  // Halcyon Bloom — Glass Hours (single)
  { id: 't-glass1', title: 'Glass Hours', artistId: 'a-halcyon', albumId: 'al-glass', genre: 'Dream Pop', duration: 212, releaseDate: '2026-06-03', popularity: 91 },

  // Neon Vespers — Midnight Cassette
  { id: 't-mid1', title: 'Midnight Cassette', artistId: 'a-vespers', albumId: 'al-midnight', genre: 'Synthwave', duration: 243, releaseDate: '2026-01-24', popularity: 95 },
  { id: 't-mid2', title: 'Chrome Highway', artistId: 'a-vespers', albumId: 'al-midnight', genre: 'Synthwave', duration: 268, releaseDate: '2026-01-24', popularity: 83 },
  { id: 't-mid3', title: 'Afterhours Drive', artistId: 'a-vespers', albumId: 'al-midnight', genre: 'Synthwave', duration: 279, releaseDate: '2026-01-24', popularity: 77 },
  // Neon Vespers — Neon Requiem (single)
  { id: 't-req1', title: 'Neon Requiem', artistId: 'a-vespers', albumId: 'al-requiem', genre: 'Synthwave', duration: 257, releaseDate: '2026-07-18', popularity: 86 },

  // Marlowe Ash — Hollow Pines
  { id: 't-hollow1', title: 'Hollow Pines', artistId: 'a-marlowe', albumId: 'al-hollow', genre: 'Indie Folk', duration: 205, releaseDate: '2025-11-08', popularity: 80 },
  { id: 't-hollow2', title: 'Riverbend', artistId: 'a-marlowe', albumId: 'al-hollow', genre: 'Indie Folk', duration: 189, releaseDate: '2025-11-08', popularity: 66 },
  { id: 't-hollow3', title: 'Matchlight', artistId: 'a-marlowe', albumId: 'al-hollow', genre: 'Indie Folk', duration: 231, releaseDate: '2025-11-08', popularity: 72 },

  // Cassette Ghosts — Static Bloom (EP)
  { id: 't-static1', title: 'Dust & Vinyl', artistId: 'a-cassette', albumId: 'al-static', genre: 'Lo-Fi', duration: 168, releaseDate: '2026-03-15', popularity: 78 },
  { id: 't-static2', title: '4AM Study', artistId: 'a-cassette', albumId: 'al-static', genre: 'Lo-Fi', duration: 154, releaseDate: '2026-03-15', popularity: 84 },
  { id: 't-static3', title: 'Raincheck', artistId: 'a-cassette', albumId: 'al-static', genre: 'Lo-Fi', duration: 176, releaseDate: '2026-03-15', popularity: 70 },

  // Aurora Kane — Afterglow
  { id: 't-after1', title: 'Afterglow', artistId: 'a-aurora', albumId: 'al-afterglow', genre: 'Electropop', duration: 201, releaseDate: '2026-05-01', popularity: 97 },
  { id: 't-after2', title: 'Electric Bloom', artistId: 'a-aurora', albumId: 'al-afterglow', genre: 'Electropop', duration: 214, releaseDate: '2026-05-01', popularity: 89 },
  { id: 't-after3', title: 'Vivid', artistId: 'a-aurora', albumId: 'al-afterglow', genre: 'Electropop', duration: 193, releaseDate: '2026-05-01', popularity: 82 },

  // The Velvet Hours — Velvet Hours
  { id: 't-velvet1', title: 'Velvet Hours', artistId: 'a-velvet', albumId: 'al-velvet', genre: 'Neo-Soul', duration: 262, releaseDate: '2025-10-20', popularity: 85 },
  { id: 't-velvet2', title: 'Honey Dial', artistId: 'a-velvet', albumId: 'al-velvet', genre: 'Neo-Soul', duration: 238, releaseDate: '2025-10-20', popularity: 73 },
  { id: 't-velvet3', title: 'Slow Burn', artistId: 'a-velvet', albumId: 'al-velvet', genre: 'Neo-Soul', duration: 249, releaseDate: '2025-10-20', popularity: 68 },

  // Kōra — Tide & Tessellation
  { id: 't-tide1', title: 'Tide & Tessellation', artistId: 'a-kora', albumId: 'al-tide', genre: 'Ambient', duration: 312, releaseDate: '2026-02-11', popularity: 64 },
  { id: 't-tide2', title: 'Salt Air', artistId: 'a-kora', albumId: 'al-tide', genre: 'Ambient', duration: 287, releaseDate: '2026-02-11', popularity: 59 },
  { id: 't-tide3', title: 'Undertow', artistId: 'a-kora', albumId: 'al-tide', genre: 'Ambient', duration: 298, releaseDate: '2026-02-11', popularity: 62 },

  // Sable & Stone — Fault Lines
  { id: 't-fault1', title: 'Fault Lines', artistId: 'a-sable', albumId: 'al-fault', genre: 'Alt Rock', duration: 226, releaseDate: '2026-04-09', popularity: 87 },
  { id: 't-fault2', title: 'Concrete Sky', artistId: 'a-sable', albumId: 'al-fault', genre: 'Alt Rock', duration: 241, releaseDate: '2026-04-09', popularity: 75 },

  // Luna Meridian — Meridian
  { id: 't-mer1', title: 'Meridian', artistId: 'a-luna', albumId: 'al-meridian', genre: 'House', duration: 305, releaseDate: '2026-06-27', popularity: 90 },
  { id: 't-mer2', title: 'Nightform', artistId: 'a-luna', albumId: 'al-meridian', genre: 'House', duration: 288, releaseDate: '2026-06-27', popularity: 81 },
  { id: 't-mer3', title: 'Pulse Theory', artistId: 'a-luna', albumId: 'al-meridian', genre: 'House', duration: 296, releaseDate: '2026-06-27', popularity: 76 },

  // Fennec Gold — Golden Static
  { id: 't-gold1', title: 'Golden Static', artistId: 'a-fennec', albumId: 'al-golden', genre: 'Jazz-Hop', duration: 197, releaseDate: '2026-03-30', popularity: 79 },
  { id: 't-gold2', title: 'Brass & Smoke', artistId: 'a-fennec', albumId: 'al-golden', genre: 'Jazz-Hop', duration: 183, releaseDate: '2026-03-30', popularity: 71 },
]
