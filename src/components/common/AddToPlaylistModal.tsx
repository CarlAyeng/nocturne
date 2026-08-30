import { useState } from 'react'
import { useUI } from '../../context/UIContext'
import { useLibrary } from '../../context/LibraryContext'
import { Button } from './Button'

interface Props {
  trackId: string
}

export function AddToPlaylistModal({ trackId }: Props) {
  const { closeModal } = useUI()
  const { userPlaylists, addToPlaylist } = useLibrary()

  if (userPlaylists.length === 0) {
    return (
      <>
        <p className="text-sm text-muted">You don't have any playlists yet.</p>
        <Button className="mt-3 w-full" onClick={closeModal}>Create one</Button>
      </>
    )
  }

  return (
    <div className="space-y-2 max-h-[60vh] overflow-y-auto scroll-area">
      {userPlaylists.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => { addToPlaylist(p.id, trackId); closeModal() }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-ink transition hover:bg-white/10"
        >
          <div className="h-8 w-8 shrink-0 rounded-lg bg-white/5" />
          {p.title}
        </button>
      ))}
    </div>
  )
}