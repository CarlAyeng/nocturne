import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'
import type { Palette, Playlist } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useUI } from './UIContext'
import { editorialPlaylists, getArtist } from '../data'
import { PALETTES } from '../utils/palette'
import { hashString } from '../utils/seededRandom'
import type { CoverShape } from '../types'

const PALETTE_KEYS = Object.keys(PALETTES)
const SHAPES: CoverShape[] = ['orbits', 'waves', 'bars', 'blobs', 'prism', 'rings', 'grid']

function paletteForTitle(title: string): Palette {
  const h = hashString(title || 'playlist')
  return PALETTES[PALETTE_KEYS[h % PALETTE_KEYS.length]]
}
function shapeForTitle(title: string): CoverShape {
  return SHAPES[hashString(title + 'x') % SHAPES.length]
}

interface LibraryContextValue {
  liked: string[]
  isLiked: (trackId: string) => boolean
  toggleLike: (trackId: string) => void

  userPlaylists: Playlist[]
  allPlaylists: Playlist[]
  getPlaylist: (id: string) => Playlist | undefined
  createPlaylist: (opts?: { title?: string; description?: string; firstTrackId?: string }) => Playlist
  renamePlaylist: (id: string, patch: { title: string; description?: string }) => void
  deletePlaylist: (id: string) => void
  addToPlaylist: (playlistId: string, trackId: string) => void
  removeFromPlaylist: (playlistId: string, trackId: string) => void

  following: string[]
  isFollowing: (artistId: string) => boolean
  toggleFollow: (artistId: string) => void

  recentlyPlayed: string[]
  addRecentlyPlayed: (trackId: string) => void
}

const LibraryContext = createContext<LibraryContextValue | null>(null)

export function LibraryProvider({ children }: { children: ReactNode }) {
  const { toast } = useUI()
  const [liked, setLiked] = useLocalStorage<string[]>('lib.liked', [])
  const [userPlaylists, setUserPlaylists] = useLocalStorage<Playlist[]>('lib.playlists', [])
  const [following, setFollowing] = useLocalStorage<string[]>('lib.following', [])
  const [recentlyPlayed, setRecentlyPlayed] = useLocalStorage<string[]>('lib.recent', [])

  const isLiked = useCallback((id: string) => liked.includes(id), [liked])

  const toggleLike = useCallback(
    (id: string) => {
      setLiked((prev) => {
        if (prev.includes(id)) {
          toast('Removed from Liked Songs', { icon: 'heart' })
          return prev.filter((x) => x !== id)
        }
        toast('Added to Liked Songs', { kind: 'success', icon: 'heart' })
        return [id, ...prev]
      })
    },
    [setLiked, toast],
  )

  const createPlaylist = useCallback<LibraryContextValue['createPlaylist']>(
    (opts) => {
      const title = opts?.title?.trim() || `My Playlist #${userPlaylists.length + 1}`
      const pl: Playlist = {
        id: `user-${Date.now()}`,
        title,
        description: opts?.description?.trim() || '',
        creator: 'You',
        trackIds: opts?.firstTrackId ? [opts.firstTrackId] : [],
        palette: paletteForTitle(title),
        seed: Date.now() % 100000,
        shape: shapeForTitle(title),
        editable: true,
        createdAt: Date.now(),
      }
      setUserPlaylists((prev) => [pl, ...prev])
      toast(`Created "${title}"`, { kind: 'success', icon: 'plus' })
      return pl
    },
    [setUserPlaylists, userPlaylists.length, toast],
  )

  const renamePlaylist = useCallback<LibraryContextValue['renamePlaylist']>(
    (id, patch) => {
      setUserPlaylists((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                title: patch.title.trim() || p.title,
                description: patch.description !== undefined ? patch.description : p.description,
                palette: paletteForTitle(patch.title || p.title),
                shape: shapeForTitle(patch.title || p.title),
              }
            : p,
        ),
      )
      toast('Playlist updated', { kind: 'success', icon: 'check' })
    },
    [setUserPlaylists, toast],
  )

  const deletePlaylist = useCallback(
    (id: string) => {
      setUserPlaylists((prev) => prev.filter((p) => p.id !== id))
      toast('Playlist deleted', { icon: 'trash' })
    },
    [setUserPlaylists, toast],
  )

  const addToPlaylist = useCallback(
    (playlistId: string, trackId: string) => {
      setUserPlaylists((prev) =>
        prev.map((p) => {
          if (p.id !== playlistId) return p
          if (p.trackIds.includes(trackId)) {
            toast('Already in playlist', { kind: 'info' })
            return p
          }
          toast(`Added to ${p.title}`, { kind: 'success', icon: 'plus' })
          return { ...p, trackIds: [...p.trackIds, trackId] }
        }),
      )
    },
    [setUserPlaylists, toast],
  )

  const removeFromPlaylist = useCallback(
    (playlistId: string, trackId: string) => {
      setUserPlaylists((prev) =>
        prev.map((p) => (p.id === playlistId ? { ...p, trackIds: p.trackIds.filter((t) => t !== trackId) } : p)),
      )
      toast('Removed from playlist', { icon: 'trash' })
    },
    [setUserPlaylists, toast],
  )

  const isFollowing = useCallback((id: string) => following.includes(id), [following])
  const toggleFollow = useCallback(
    (id: string) => {
      setFollowing((prev) => {
        if (prev.includes(id)) {
          toast(`Unfollowed ${getArtist(id)?.name ?? 'artist'}`)
          return prev.filter((x) => x !== id)
        }
        toast(`Following ${getArtist(id)?.name ?? 'artist'}`, { kind: 'success', icon: 'check' })
        return [id, ...prev]
      })
    },
    [setFollowing, toast],
  )

  const addRecentlyPlayed = useCallback(
    (trackId: string) => {
      setRecentlyPlayed((prev) => [trackId, ...prev.filter((t) => t !== trackId)].slice(0, 30))
    },
    [setRecentlyPlayed],
  )

  const allPlaylists = useMemo(() => [...userPlaylists, ...editorialPlaylists], [userPlaylists])
  const getPlaylist = useCallback(
    (id: string) => allPlaylists.find((p) => p.id === id),
    [allPlaylists],
  )

  const value = useMemo<LibraryContextValue>(
    () => ({
      liked,
      isLiked,
      toggleLike,
      userPlaylists,
      allPlaylists,
      getPlaylist,
      createPlaylist,
      renamePlaylist,
      deletePlaylist,
      addToPlaylist,
      removeFromPlaylist,
      following,
      isFollowing,
      toggleFollow,
      recentlyPlayed,
      addRecentlyPlayed,
    }),
    [
      liked,
      isLiked,
      toggleLike,
      userPlaylists,
      allPlaylists,
      getPlaylist,
      createPlaylist,
      renamePlaylist,
      deletePlaylist,
      addToPlaylist,
      removeFromPlaylist,
      following,
      isFollowing,
      toggleFollow,
      recentlyPlayed,
      addRecentlyPlayed,
    ],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider')
  return ctx
}
