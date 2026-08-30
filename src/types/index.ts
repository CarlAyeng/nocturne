/* ============================================================= *
 *  Nocturne — domain types
 * ============================================================= */

/** A color palette that drives an entity's generated artwork + dynamic UI theming. */
export interface Palette {
  /** primary gradient start */
  from: string
  /** primary gradient mid/via */
  via: string
  /** primary gradient end */
  to: string
  /** deep shade used for backgrounds / glows */
  deep: string
  /** text color that sits legibly on the artwork */
  textOn: 'light' | 'dark'
}

export type CoverShape = 'orbits' | 'waves' | 'bars' | 'blobs' | 'prism' | 'rings' | 'grid'

export interface Artist {
  id: string
  name: string
  /** short tagline / genre descriptor */
  genre: string
  bio: string
  verified: boolean
  monthlyListeners: number
  palette: Palette
  seed: number
  shape: CoverShape
  /** ids of related artists */
  relatedIds: string[]
}

export type AlbumType = 'album' | 'single' | 'ep'

export interface Album {
  id: string
  title: string
  artistId: string
  type: AlbumType
  releaseDate: string // ISO yyyy-mm-dd
  genre: string
  palette: Palette
  seed: number
  shape: CoverShape
}

export interface Track {
  id: string
  title: string
  artistId: string
  albumId: string
  genre: string
  /** duration in seconds */
  duration: number
  releaseDate: string
  /** popularity 0-100, used for "trending" + artist "popular" ordering */
  popularity: number
  /** optional real audio file — when present the engine plays it instead of the synth */
  audioUrl?: string
  /** synth voicing seed (defaults to a hash of the id) */
  seed?: number
}

export interface Playlist {
  id: string
  title: string
  description: string
  creator: string
  trackIds: string[]
  palette: Palette
  seed: number
  shape: CoverShape
  /** user-created playlists can be renamed / deleted */
  editable: boolean
  /** epoch ms — used to sort the library */
  createdAt: number
}

export interface Genre {
  id: string
  name: string
  palette: Palette
  seed: number
  shape: CoverShape
}

/** A single line of time-coded (approximate) lyrics. */
export interface LyricLine {
  time: number // seconds
  text: string
}

/* ---------------- player ---------------- */

export type RepeatMode = 'off' | 'all' | 'one'

/** How the current queue was assembled — used for the "playing from" label. */
export interface PlaybackContext {
  type: 'playlist' | 'album' | 'artist' | 'search' | 'liked' | 'recent' | 'single'
  id?: string
  title: string
}

/* ---------------- resolved / joined view-models ---------------- */

/** A track with its artist + album eagerly resolved for convenient rendering. */
export interface ResolvedTrack extends Track {
  artist: Artist
  album: Album
}

/* ---------------- ui ---------------- */

export type ToastKind = 'default' | 'success' | 'info' | 'error'

export interface Toast {
  id: string
  message: string
  kind: ToastKind
  /** optional small icon key rendered by the Toaster */
  icon?: 'heart' | 'plus' | 'play' | 'trash' | 'check' | 'music'
}

export type ModalKind = 'create-playlist' | 'rename-playlist' | 'add-to-playlist'

export interface ModalState {
  kind: ModalKind
  /** playlist id for rename, track id for add-to-playlist */
  targetId?: string
}
