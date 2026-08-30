import { Link } from 'react-router-dom'
import { genres } from '../../data'
import { CoverArt } from './CoverArt'
import { cn } from '../../utils/cn'

export function GenreTiles() {
  return (
    <div className="flex flex-wrap gap-3">
      {genres.map((g) => (
        <Link
          key={g.id}
          to={`/search?q=${encodeURIComponent(g.name)}`}
          className="group flex min-w-[120px] items-center gap-3 rounded-2xl bg-white/[0.04] p-3 pr-4 text-left transition hover:bg-white/[0.08]"
        >
          <CoverArt seed={g.seed} shape={g.shape} palette={g.palette} className="h-12 w-12 shrink-0 rounded-xl" />
          <span className="text-sm font-medium text-ink group-hover:text-primary-soft">{g.name}</span>
        </Link>
      ))}
    </div>
  )
}