import { useState } from 'react'
import { useUI } from '../../context/UIContext'
import { useLibrary } from '../../context/LibraryContext'
import { Input } from './Input'
import { Button } from './Button'

export function CreatePlaylistModal() {
  const { closeModal } = useUI()
  const { createPlaylist } = useLibrary()
  const [title, setTitle] = useState('')

  const handleCreate = () => {
    if (!title.trim()) return
    createPlaylist({ title })
    closeModal()
  }

  return (
    <>
      <p className="text-sm text-muted">Give your new playlist a name.</p>
      <Input label="Playlist name" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My playlist..." autoFocus />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={closeModal}>Cancel</Button>
        <Button onClick={handleCreate} disabled={!title.trim()}>Create</Button>
      </div>
    </>
  )
}

export function RenamePlaylistModal() {
  const { modal, closeModal } = useUI()
  const { renamePlaylist } = useLibrary()
  const [title, setTitle] = useState('')

  return (
    <>
      <p className="text-sm text-muted">Rename this playlist.</p>
      <Input label="Playlist name" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New name..." autoFocus />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={closeModal}>Cancel</Button>
        <Button onClick={() => { renamePlaylist(modal?.targetId ?? '', { title }); closeModal() }} disabled={!title.trim()}>Save</Button>
      </div>
    </>
  )
}
