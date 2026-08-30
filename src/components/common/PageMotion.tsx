import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { cn } from '../../utils/cn'

/** Wraps a page in a subtle entrance transition (respects reduced-motion). */
export function PageMotion({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = usePrefersReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
