import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { type PlaybackContext } from '../types'
import { Dot, DetailHero } from '../components/media/DetailHero'
import { PlayActionBar } from '../components/media/PlayActionBar'
import { TrackTable } from '../components/media/TrackTable'
import { EmptyState } from '../components/common/EmptyState'
import { Button } from '../components/common/Button'
import { PageMotion } from '../components/common/PageMotion'
import { usePlayer } from '../context/PlayerContext'
import { getAlbum, tracksByAlbum } from '../data'
import { getArtist } from '../data'

export default function AlbumDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { playContext, isPlaying, playbackContext, togglePlay } = usePlayer()
  const album = getAlbum(id)

  const tracks = useMemo(() => (album ? tracksByAlbum(album.id) : []), [album])

  if (!album) {
    return (
      <PageMotion className="pt-16">
        <EmptyState
          icon={<span className="h-7 w-7" />}
          title="Album not found"
          description="This album may have been removed."
          action={<Button onClick={() => navigate('/')}>Back to Home</Button>}
        />
      </PageMotion>
    )
  }

  const ctx: PlaybackContext = { type: 'album', id: album.id, title: album.title }
  const isCurrent = playbackContext?.id === album.id
  const totalDuration = tracks.reduce((s, t) => s + t.duration, 0)
  const artistName = album.artistId ? getArtist(album.artistId)?.name ?? '' : ''

  return (
    <PageMotion>
      <DetailHero
        palette={album.palette}
        seed={album.seed}
        shape={album.shape}
        eyebrow="Album"
        title={album.title}
        meta={
          <>
            <span>{artistName}</span>
            <Dot />
            <span>{tracks.length} {tracks.length === 1 ? 'song' : 'songs'}</span>
            <Dot />
            <span>{album.releaseDate}</span>
            <Dot />
            <span className="text-ink/60">{album.type === 'album' ? 'Album' : album.type === 'ep' ? 'EP' : 'Single'} · {album.genre}</span>
          </>
        }
      />

      {tracks.length === 0 ? (
        <div className="pt-8">
          <EmptyState
            icon={<span className="h-7 w-7" />}
            title="No tracks available"
            action={<Button onClick={() => navigate('/')}>Back to Home</Button>}
          />
        </div>
      ) : (
        <>
          <PlayActionBar onPlay={() => { if (isCurrent) togglePlay(); else playContext(tracks, ctx, 0) }} playing={isCurrent && isPlaying} playLabel={`Play ${album.title}`} />
          <TrackTable tracks={tracks} context={ctx} />
        </>
      )}
    </PageMotion>
  )
}