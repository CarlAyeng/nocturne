import type { Album, Artist, Genre, Playlist, ResolvedTrack, Track } from '../types'
import { artists } from './artists'
import { albums } from './albums'
import { tracks } from './tracks'
import { playlists as editorialPlaylists } from './playlists'
import { genres } from './genres'
import { lyrics } from './lyrics'

export { artists, albums, tracks, editorialPlaylists, genres, lyrics }

/* ---------------- lookup maps ---------------- */

const artistMap = new Map(artists.map((a) => [a.id, a]))
const albumMap = new Map(albums.map((a) => [a.id, a]))
const trackMap = new Map(tracks.map((t) => [t.id, t]))
const genreMap = new Map(genres.map((g) => [g.id, g]))

export const getArtist = (id: string): Artist | undefined => artistMap.get(id)
export const getAlbum = (id: string): Album | undefined => albumMap.get(id)
export const getTrack = (id: string): Track | undefined => trackMap.get(id)
export const getGenre = (id: string): Genre | undefined => genreMap.get(id)

export const getEditorialPlaylist = (id: string): Playlist | undefined =>
  editorialPlaylists.find((p) => p.id === id)

/* ---------------- resolution ---------------- */

export function resolveTrack(track: Track): ResolvedTrack {
  const artist = artistMap.get(track.artistId)!
  const album = albumMap.get(track.albumId)!
  return { ...track, artist, album }
}

export function resolveTracks(ids: string[]): ResolvedTrack[] {
  const out: ResolvedTrack[] = []
  for (const id of ids) {
    const t = trackMap.get(id)
    if (t) out.push(resolveTrack(t))
  }
  return out
}

export const allResolvedTracks: ResolvedTrack[] = tracks.map(resolveTrack)

/* ---------------- relationships ---------------- */

export const tracksByAlbum = (albumId: string): ResolvedTrack[] =>
  allResolvedTracks.filter((t) => t.albumId === albumId)

export const tracksByArtist = (artistId: string): ResolvedTrack[] =>
  allResolvedTracks.filter((t) => t.artistId === artistId)

export const albumsByArtist = (artistId: string): Album[] =>
  albums.filter((a) => a.artistId === artistId && a.type === 'album')

export const singlesByArtist = (artistId: string): Album[] =>
  albums.filter((a) => a.artistId === artistId && a.type !== 'album')

export const popularByArtist = (artistId: string, n = 5): ResolvedTrack[] =>
  tracksByArtist(artistId)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, n)

export const relatedArtists = (artistId: string): Artist[] => {
  const a = artistMap.get(artistId)
  if (!a) return []
  return a.relatedIds.map((id) => artistMap.get(id)).filter((x): x is Artist => Boolean(x))
}

export const tracksByGenreName = (name: string): ResolvedTrack[] =>
  allResolvedTracks.filter((t) => t.genre.toLowerCase() === name.toLowerCase())

/* ---------------- curated home feeds ---------------- */

export const trendingTracks = (n = 8): ResolvedTrack[] =>
  [...allResolvedTracks].sort((a, b) => b.popularity - a.popularity).slice(0, n)

export const newReleaseAlbums = (n = 8): Album[] =>
  [...albums].sort((a, b) => +new Date(b.releaseDate) - +new Date(a.releaseDate)).slice(0, n)

export const madeForYouPlaylists = (): Playlist[] =>
  ['pl-afterdark', 'pl-focus', 'pl-euphoria', 'pl-golden', 'pl-bloom']
    .map(getEditorialPlaylist)
    .filter((p): p is Playlist => Boolean(p))

export const quickPickPlaylists = (): Playlist[] =>
  ['pl-nightdrive', 'pl-bloom', 'pl-pulse', 'pl-mellow', 'pl-euphoria', 'pl-focus', 'pl-golden', 'pl-afterdark']
    .map(getEditorialPlaylist)
    .filter((p): p is Playlist => Boolean(p))

/** A stable "featured" pick for the Discover hero. */
export const featuredPlaylist = (): Playlist => getEditorialPlaylist('pl-nightdrive')!

/** The user's personal playlists — featured on the Home page. */
export const yourPlaylists = (): Playlist[] =>
  ['pl-lou', 'pl-kasalanan', 'pl-unsure', 'pl-fingerstyle']
    .map(getEditorialPlaylist)
    .filter((p): p is Playlist => Boolean(p))

/** Real artists for the Discover "Featured artists" rail — sorted by monthly listeners. */
export const featuredArtists = (n = 8): Artist[] =>
  [...artists].sort((a, b) => b.monthlyListeners - a.monthlyListeners).slice(0, n)

export const getLyrics = (trackId: string) => lyrics[trackId] ?? null
