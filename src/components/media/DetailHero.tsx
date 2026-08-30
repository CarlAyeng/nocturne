import type { ReactNode } from 'react'
import type { CoverShape, Palette } from '../../types'
import { CoverArt } from './CoverArt'
import { rgba } from '../../utils/palette'
import { cn } from '../../utils/cn'

interface DetailHeroProps {
  palette: Palette
  seed: number
  shape: CoverShape
  eyebrow: ReactNode
  title: string
  description?: string
  meta: ReactNode
  circular?: boolean
}

export function DetailHero({ palette, seed, shape, eyebrow, title, description, meta, circular = false }: DetailHeroProps) {
  return (
    <div className="relative -mx-4 -mt-1 sm:-mx-6 lg:-mx-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[440px]"
        style={{
          background: `linear-gradient(180deg, ${rgba(palette.from, 0.85)} 0%, ${rgba(palette.deep, 0.65)} 42%, rgba(11,11,20,0) 100%)`,
        }}
      />
      <div className="relative px-4 pt-10 sm:px-6 sm:pt-16 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
          <CoverArt
            seed={seed}
            shape={shape}
            palette={palette}
            title={title}
            showText
            className={cn('w-44 shrink-0 shadow-lift sm:w-52 lg:w-56', circular && 'aspect-square')}
            rounded={circular ? 'rounded-full' : 'rounded-2xl'}
          />
          <div className="min-w-0 text-center sm:pb-2 sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink/80">{eyebrow}</p>
            <h1 className="mt-2 font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {description && <p className="mx-auto mt-3 max-w-xl text-sm text-ink/70 sm:mx-0">{description}</p>}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-ink/80 sm:justify-start">
              {meta}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Small round "dot" separator for meta rows. */
export function Dot() {
  return <span className="text-ink/40">•</span>
}
