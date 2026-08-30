import { AnimatePresence, motion } from 'framer-motion'
import { Check, Heart, Info, ListPlus, Music, Play, Trash2, X } from 'lucide-react'
import { useUI } from '../../context/UIContext'
import type { Toast } from '../../types'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'

function ToastIcon({ toast }: { toast: Toast }) {
  const cls = 'h-4 w-4'
  switch (toast.icon) {
    case 'heart':
      return <Heart className={cls} fill="currentColor" />
    case 'plus':
      return <ListPlus className={cls} />
    case 'play':
      return <Play className={cls} fill="currentColor" />
    case 'trash':
      return <Trash2 className={cls} />
    case 'check':
      return <Check className={cls} />
    case 'music':
      return <Music className={cls} />
    default:
      return toast.kind === 'info' ? <Info className={cls} /> : <Music className={cls} />
  }
}

const toneRing: Record<Toast['kind'], string> = {
  default: 'text-primary-soft',
  success: 'text-accent',
  info: 'text-sky-300',
  error: 'text-danger',
}

export function Toaster() {
  const { toasts, dismissToast } = useUI()
  const reduce = usePrefersReducedMotion()

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[calc(8.5rem+env(safe-area-inset-bottom))] z-[120] flex flex-col items-center gap-2 px-4 md:bottom-[calc(var(--player-h)+16px)]"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.9 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 34 }}
            className="glass-strong pointer-events-auto flex items-center gap-3 rounded-full py-2.5 pl-3 pr-2 shadow-lift"
          >
            <span className={`flex h-7 w-7 items-center justify-center rounded-full bg-white/10 ${toneRing[t.kind]}`}>
              <ToastIcon toast={t} />
            </span>
            <span className="text-sm font-medium text-ink">{t.message}</span>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismissToast(t.id)}
              className="ml-1 flex h-6 w-6 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
