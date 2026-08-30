import { useState } from 'react'
import { usePlayer } from '../../context/PlayerContext'
import { SongRow } from '../media/SongRow'
import { EmptyState } from '../common/EmptyState'
import { Button } from '../common/Button'
import { Trash2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export function QueuePanel() {
  const { queue, queueOpen, clearQueue, removeFromQueue, reorderQueue, currentIndex } = usePlayer()
  const [dragFrom, setDragFrom] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState<number | null>(null)

  if (!queueOpen) return null

  // Only upcoming tracks (after the one playing) may be reordered.
  const canMove = (i: number) => i >= 0 && i < queue.length && i > currentIndex

  const handleDrop = (to: number) => {
    if (dragFrom != null && dragFrom !== to && canMove(dragFrom) && canMove(to)) {
      reorderQueue(dragFrom, to)
    }
    setDragFrom(null)
    setDragOver(null)
  }

  // Keyboard alternative to drag: focus a row's handle, then use ↑/↓ to move it.
  const handleMoveKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
    e.preventDefault()
    e.stopPropagation()
    const to = e.key === 'ArrowUp' ? i - 1 : i + 1
    if (canMove(i) && canMove(to)) reorderQueue(i, to)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-ink">Queue</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => clearQueue()}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-danger transition hover:bg-danger/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
      </div>

      {queue.length === 0 ? (
        <EmptyState
          icon={<span className="h-7 w-7" />}
          title="Queue is empty"
          description="Search for music or add songs to build your queue."
          action={<Button onClick={() => {}}>Find music</Button>}
        />
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted">Drag a row, or focus its handle and use ↑/↓ to reorder.</p>
          <div className="flex flex-col divide-y divide-white/8">
            {queue.map((t, i) => (
              <div
                key={t.id}
                draggable={canMove(i)}
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = 'move'
                  setDragFrom(i)
                }}
                onDragOver={(e) => {
                  if (!canMove(i)) return
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'move'
                  setDragOver(i)
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  handleDrop(i)
                }}
                onDragEnd={() => {
                  setDragFrom(null)
                  setDragOver(null)
                }}
                className={cn(
                  'transition-opacity',
                  !canMove(i) && 'opacity-45',
                  dragOver === i && dragFrom !== i && 'opacity-60',
                )}
              >
                <SongRow
                  track={t}
                  index={i}
                  showArt={false}
                  showAlbum={false}
                  queueMode
                  onRemove={() => removeFromQueue(i)}
                  dragHandleProps={{
                    title: 'Reorder in queue — use up and down arrows',
                    'aria-disabled': !canMove(i),
                    onKeyDown: (e) => handleMoveKey(e, i),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
