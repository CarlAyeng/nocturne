import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useUI } from '../../context/UIContext'
import { useLibrary } from '../../context/LibraryContext'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { Button } from './Button'
import { CreatePlaylistModal, RenamePlaylistModal } from './PlaylistsModal'
import { AddToPlaylistModal } from './AddToPlaylistModal'

export function Modal({ open, onClose, title, children, labelId = 'modal-title' }: { open: boolean; onClose: () => void; title: string; children: ReactNode; labelId?: string }) {
  const { modal } = useUI()
  const panelRef = useRef<HTMLDivElement>(null)
  const reduce = usePrefersReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => {
      const el = panelRef.current?.querySelector<HTMLElement>('input, textarea, button:not([data-close])')
      el?.focus()
    }, 40)
    return () => { document.removeEventListener('keydown', onKey); window.clearTimeout(t) }
  }, [open, onClose])

  const titleMap: Record<string, string> = { 'create-playlist': 'New Playlist', 'rename-playlist': 'Edit Playlist', 'add-to-playlist': 'Add to Playlist' }

  const content = modal ? (
    <>
      {modal.kind === 'create-playlist' && <CreatePlaylistModal />}
      {modal.kind === 'rename-playlist' && <RenamePlaylistModal />}
      {modal.kind === 'add-to-playlist' && <AddToPlaylistModal trackId={modal.targetId ?? ''} />}
    </>
  ) : (
    children
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[130] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <motion.div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={labelId} initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }} animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }} transition={{ type: 'spring', stiffness: 380, damping: 30 }} className="glass-strong relative z-10 w-full max-w-md rounded-3xl p-6 shadow-lift">
            <div className="mb-5 flex items-center justify-between">
              <h2 id={labelId} className="font-display text-xl font-semibold text-ink">{titleMap[modal?.kind ?? ''] ?? title}</h2>
              <button type="button" data-close aria-label="Close dialog" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-ink"><X className="h-5 w-5" /></button>
            </div>
            {content}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}