import type { Album, Artist, Playlist, ResolvedTrack } from '../types'
import { albums, artists, allResolvedTracks, getArtist } from '../data'

/* ============================================================= *
 *  Lightweight fuzzy-ish search with relevance scoring.
 * ============================================================= */

export interface SearchResults {
  query: string
  top: { kind: 'artist' | 'album' | 'track' | 'playlist'; item: Artist | Album | ResolvedTrack | Playlist } | null
  tracks: ResolvedTrack[]
  artists: Artist[]
  albums: Album[]
  playlists: Playlist[]
  isEmpty: boolean
}

/** Score how well `haystack` matches `needle`. 0 = no match. */
function score(haystack: string, needle: string): number {
  const h = haystack.toLowerCase()
  const n = needle.toLowerCase().trim()
  if (!n) return 0
  if (h === n) return 100
  if (h.startsWith(n)) return 80
  // word-boundary start
  if (h.split(/\s+/).some((w) => w.startsWith(n))) return 60
  if (h.includes(n)) return 40
  // all query words appear somewhere
  const words = n.split(/\s+/)
  if (words.length > 1 && words.every((w) => h.includes(w))) return 30
  return 0
}

export function search(query: string, allPlaylists: Playlist[]): SearchResults {
  const q = query.trim()
  if (!q) {
    return { query: q, top: null, tracks: [], artists: [], albums: [], playlists: [], isEmpty: true }
  }

  const scoredArtists = artists
    .map((a) => ({ item: a, s: Math.max(score(a.name, q), score(a.genre, q) * 0.5) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)

  const scoredAlbums = albums
    .map((a) => {
      const artist = getArtist(a.artistId)
      return { item: a, s: Math.max(score(a.title, q), artist ? score(artist.name, q) * 0.6 : 0) }
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)

  const scoredTracks = allResolvedTracks
    .map((t) => ({
      item: t,
      s: Math.max(score(t.title, q), score(t.artist.name, q) * 0.7, score(t.genre, q) * 0.4),
    }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || b.item.popularity - a.item.popularity)

  const scoredPlaylists = allPlaylists
    .map((p) => ({ item: p, s: Math.max(score(p.title, q), score(p.description, q) * 0.3) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)

  // Choose the single best "top result" across categories.
  type TopKind = 'artist' | 'album' | 'track' | 'playlist'
  const candidates: Array<{ kind: TopKind; s: number; item: Artist | Album | ResolvedTrack | Playlist }> = []
  if (scoredArtists[0]) candidates.push({ kind: 'artist', s: scoredArtists[0].s + 5, item: scoredArtists[0].item })
  if (scoredAlbums[0]) candidates.push({ kind: 'album', s: scoredAlbums[0].s, item: scoredAlbums[0].item })
  if (scoredTracks[0]) candidates.push({ kind: 'track', s: scoredTracks[0].s, item: scoredTracks[0].item })
  if (scoredPlaylists[0]) candidates.push({ kind: 'playlist', s: scoredPlaylists[0].s, item: scoredPlaylists[0].item })
  candidates.sort((a, b) => b.s - a.s)
  const top = candidates[0] ? { kind: candidates[0].kind, item: candidates[0].item } : null

  const tracks = scoredTracks.map((x) => x.item).slice(0, 8)
  const artistList = scoredArtists.map((x) => x.item).slice(0, 8)
  const albumList = scoredAlbums.map((x) => x.item).slice(0, 8)
  const playlistList = scoredPlaylists.map((x) => x.item).slice(0, 8)

  const isEmpty =
    tracks.length === 0 && artistList.length === 0 && albumList.length === 0 && playlistList.length === 0

  return { query: q, top, tracks, artists: artistList, albums: albumList, playlists: playlistList, isEmpty }
}
