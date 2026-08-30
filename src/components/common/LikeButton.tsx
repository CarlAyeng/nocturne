import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useLibrary } from '../../context/LibraryContext'
import { cn } from '../../utils/cn'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'

interface LikeButtonProps {
  trackId: string
  size?: number
  className?: string
  /** show even when not hovered (row hover controls visibility otherwise) */
}

export function LikeButton({ trackId, size = 18, className }: LikeButtonProps) {
  const { isLiked, toggleLike } = useLibrary()
  const liked = isLiked(trackId)
  const reduce = usePrefersReducedMotion()

  return (
    <button
      type="button"
      aria-label={liked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
      aria-pressed={liked}
      onClick={(e) => {
        e.stopPropagation()
        toggleLike(trackId)
      }}
      className={cn(
        'inline-flex items-center justify-center rounded-full p-1.5 transition-colors',
        liked ? 'text-accent' : 'text-muted hover:text-ink',
        className,
      )}
    >
      <motion.span
        key={String(liked)}
        initial={reduce ? false : { scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 600, damping: 18 }}
        className="inline-flex"
      >
        <Heart width={size} height={size} fill={liked ? 'currentColor' : 'none'} />
      </motion.span>
    </button>
  )
}
