import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Clock, Heart, ListMusic, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import type { CoverShape, Palette, PlaybackContext, ResolvedTrack } from '../types'
import { DetailHero, Dot } from '../components/media/DetailHero'
import { PlayActionBar } from '../components/media/PlayActionBar'
import { TrackTable } from '../components/media/TrackTable'
import { EmptyState } from '../components/common/EmptyState'
import { Button } from '../components/common/Button'
import { Menu } from '../components/common/Menu'
import { PageMotion } from '../components/common/PageMotion'
import { usePlayer } from '../context/PlayerContext'
import { useLibrary } from '../context/LibraryContext'
import { useUI } from '../context/UIContext'
import { resolveTracks } from '../data'
import { formatTotalDuration } from '../utils/format'

interface PlaylistView {
  id: string
  kind: 'liked' | 'recent' | 'playlist'
  title: string
  description?: string
  creator: string
  palette: Palette
  seed: number
  shape: CoverShape
  tracks: ResolvedTrack[]
  editable: boolean
}

const LIKED_PALETTE: Palette = { from: '#8B5CF6', via: '#A855F7', to: '#EC4899', deep: '#3b0a2a', textOn: 'light' }
const RECENT_PALETTE: Palette = { from: '#38BDF8', via: '#2563EB', to: '#1E3A8A', deep: '#0C1A3B', textOn: 'light' }

export default function PlaylistDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { liked, recentlyPlayed, getPlaylist, deletePlaylist } = useLibrary()
  const { playContext, shuffleContext, togglePlay, isPlaying, playbackContext, shuffle } = usePlayer()
  const { openModal } = useUI()

  const view = useMemo<PlaylistView | null>(() => {
    if (id === 'liked') {
      return {
        id: 'liked',
        kind: 'liked',
        title: 'Liked Songs',
        creator: 'You',
        palette: LIKED_PALETTE,
        seed: 42,
        shape: 'blobs',
        tracks: resolveTracks(liked),
        editable: false,
      }
    }
    if (id === 'recent') {
      return {
        id: 'recent',
        kind: 'recent',
        title: 'Recently Played',
        creator: 'You',
        palette: RECENT_PALETTE,
        seed: 77,
        shape: 'waves',
        tracks: resolveTracks(recentlyPlayed),
        editable: false,
      }
    }
    const pl = getPlaylist(id)
    if (!pl) return null
    return {
      id: pl.id,
      kind: 'playlist',
      title: pl.title,
      description: pl.description,
      creator: pl.creator,
      palette: pl.palette,
      seed: pl.seed,
      shape: pl.shape,
      tracks: resolveTracks(pl.trackIds),
      editable: pl.editable,
    }
  }, [id, liked, recentlyPlayed, getPlaylist])

  if (!view) {
    return (
      <PageMotion className="pt-16">
        <EmptyState
          icon={<ListMusic className="h-7 w-7" />}
          title="Playlist not found"
          description="This playlist may have been removed."
          action={<Button onClick={() => navigate('/')}>Back to Home</Button>}
        />
      </PageMotion>
    )
  }

  const ctx: PlaybackContext = { type: view.kind === 'playlist' ? 'playlist' : view.kind, id: view.id, title: view.title }
  const isCurrent = playbackContext?.id === view.id
  const totalDuration = view.tracks.reduce((s, t) => s + t.duration, 0)

  const handlePlay = () => {
    if (isCurrent) return togglePlay()
    if (view.tracks.length) playContext(view.tracks, ctx, 0)
  }
  const handleShuffle = () => {
    if (view.tracks.length) shuffleContext(view.tracks, ctx)
  }

  const empty = view.tracks.length === 0

  return (
    <PageMotion>
      <DetailHero
        palette={view.palette}
        seed={view.seed}
        shape={view.shape}
        eyebrow={view.kind === 'playlist' ? 'Playlist' : view.kind === 'liked' ? 'Playlist' : 'Recently played'}
        title={view.title}
        description={view.description}
        meta={
          <>
            <span className="font-medium text-ink">{view.creator}</span>
            {view.tracks.length > 0 && (
              <>
                <Dot />
                <span>
                  {view.tracks.length} {view.tracks.length === 1 ? 'song' : 'songs'}
                </span>
                <Dot />
                <span className="text-ink/60">{formatTotalDuration(totalDuration)}</span>
              </>
            )}
          </>
        }
      />

      {empty ? (
        <div className="pt-8">
          {view.kind === 'liked' ? (
            <EmptyState
              icon={<Heart className="h-7 w-7" />}
              title="Songs you like will appear here"
              description="Save tracks by tapping the heart. They'll collect here for easy access."
              action={<Button onClick={() => navigate('/browse')}>Find something to like</Button>}
            />
          ) : view.kind === 'recent' ? (
            <EmptyState
              icon={<Clock className="h-7 w-7" />}
              title="Nothing played yet"
              description="Start playing a track and your recent history will show up here."
              action={<Button onClick={() => navigate('/')}>Explore Home</Button>}
            />
          ) : (
            <EmptyState
              icon={<ListMusic className="h-7 w-7" />}
              title="Let's find some songs"
              description="This playlist is empty. Search for music and add it here."
              action={<Button onClick={() => navigate('/search')}>Search for music</Button>}
            />
          )}
        </div>
      ) : (
        <>
          <PlayActionBar
            onPlay={handlePlay}
            playing={isCurrent && isPlaying}
            onShuffle={handleShuffle}
            shuffleActive={shuffle && isCurrent}
            playLabel={`Play ${view.title}`}
          >
            {view.editable && (
              <Menu
                triggerLabel="Playlist options"
                trigger={<MoreHorizontal className="h-6 w-6" />}
                triggerClassName="flex h-12 w-12 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-ink"
                items={[
                  {
                    label: 'Edit details',
                    icon: <Pencil className="h-4 w-4" />,
                    onClick: () => openModal({ kind: 'rename-playlist', targetId: view.id }),
                  },
                  {
                    label: 'Delete playlist',
                    icon: <Trash2 className="h-4 w-4" />,
                    danger: true,
                    onClick: () => {
                      deletePlaylist(view.id)
                      navigate('/library')
                    },
                    separatorBefore: true,
                  },
                ]}
              />
            )}
          </PlayActionBar>

          <TrackTable
            tracks={view.tracks}
            context={ctx}
            inPlaylistId={view.editable ? view.id : undefined}
          />
        </>
      )}
    </PageMotion>
  )
}
