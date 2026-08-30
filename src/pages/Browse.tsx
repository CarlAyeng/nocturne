import { Link } from 'react-router-dom'
import { GenreTiles } from '../components/media/GenreTiles'
import { Shelf } from '../components/media/Shelf'
import { AlbumCard } from '../components/media/AlbumCard'
import { PlaylistCard } from '../components/media/PlaylistCard'
import { ArtistCard } from '../components/media/ArtistCard'
import { SectionHeader } from '../components/media/SectionHeader'
import { PageMotion } from '../components/common/PageMotion'
import { getArtist, genres, newReleaseAlbums, editorialPlaylists } from '../data'

export default function Browse() {
  const newReleases = newReleaseAlbums(10)

  return (
    <PageMotion className="space-y-10 pt-2">
      <section>
        <h1 className="mb-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Browse <span className="text-gradient">by genre</span>
        </h1>
        <p className="text-sm text-muted">Explore moods and sounds. Tap any genre to find tracks.</p>
        <GenreTiles />
      </section>

      <section>
        <Shelf title="New releases" subtitle="Fresh from your favorite artists" to="/album">
          {newReleases.map((a) => (
            <div key={a.id} className="w-40 shrink-0 snap-start sm:w-44 md:w-48">
              <AlbumCard album={a} />
            </div>
          ))}
        </Shelf>
      </section>

      <section>
        <SectionHeader title="Featured editorial" to="/playlist/pl-nightdrive" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {editorialPlaylists.slice(0, 8).map((p) => (
            <PlaylistCard key={p.id} playlist={p} />
          ))}
        </div>
      </section>
    </PageMotion>
  )
}