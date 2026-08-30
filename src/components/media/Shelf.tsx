import { useRef, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionHeader } from './SectionHeader'

interface ShelfProps {
  title: string
  subtitle?: string
  to?: string
  children: ReactNode
}

/** A titled, horizontally-scrollable row of cards (swipe on touch, arrows on desktop). */
export function Shelf({ title, subtitle, to, children }: ShelfProps) {
  const scroller = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 720), behavior: 'smooth' })
  }

  return (
    <section className="group/shelf">
      <div className="relative flex items-end justify-between gap-4">
        <SectionHeader title={title} subtitle={subtitle} to={to} className="mb-4 flex-1" />
        <div className="mb-4 hidden shrink-0 gap-1.5 md:flex">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollBy(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-muted transition hover:bg-white/10 hover:text-ink"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollBy(1)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-muted transition hover:bg-white/10 hover:text-ink"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2"
      >
        {children}
      </div>
    </section>
  )
}
