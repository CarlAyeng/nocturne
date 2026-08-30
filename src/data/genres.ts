import type { Genre } from '../types'
import { palette } from '../utils/palette'

/* ============================================================= *
 *  Genres / moods for the Browse page.
 * ============================================================= */

export const genres: Genre[] = [
  { id: 'g-dreampop', name: 'Dream Pop', palette: palette('violetHaze'), seed: 101, shape: 'blobs' },
  { id: 'g-synthwave', name: 'Synthwave', palette: palette('midnight'), seed: 102, shape: 'prism' },
  { id: 'g-indiefolk', name: 'Indie Folk', palette: palette('gold'), seed: 103, shape: 'waves' },
  { id: 'g-lofi', name: 'Lo-Fi Beats', palette: palette('slate'), seed: 104, shape: 'grid' },
  { id: 'g-electropop', name: 'Electropop', palette: palette('aurora'), seed: 105, shape: 'rings' },
  { id: 'g-neosoul', name: 'Neo-Soul', palette: palette('rose'), seed: 106, shape: 'blobs' },
  { id: 'g-ambient', name: 'Ambient', palette: palette('mint'), seed: 107, shape: 'waves' },
  { id: 'g-altrock', name: 'Alt Rock', palette: palette('ember'), seed: 108, shape: 'bars' },
  { id: 'g-house', name: 'House', palette: palette('cobalt'), seed: 109, shape: 'orbits' },
  { id: 'g-jazzhop', name: 'Jazz-Hop', palette: palette('citrus'), seed: 110, shape: 'bars' },
  { id: 'g-focus', name: 'Focus', palette: palette('cobalt'), seed: 111, shape: 'grid' },
  { id: 'g-workout', name: 'Workout', palette: palette('magma'), seed: 112, shape: 'bars' },
  { id: 'g-chill', name: 'Chill', palette: palette('mint'), seed: 113, shape: 'waves' },
  { id: 'g-party', name: 'Party', palette: palette('sunset'), seed: 114, shape: 'orbits' },
  { id: 'g-sleep', name: 'Sleep', palette: palette('nebula'), seed: 115, shape: 'blobs' },
  { id: 'g-mood', name: 'Mood Booster', palette: palette('coral'), seed: 116, shape: 'rings' },
]
