import { Pause, Play } from 'lucide-react'
import { cn } from '../../utils/cn'

interface PlayFabProps {
  onClick: (e: React.MouseEvent) => void
  playing?: boolean
  label: string
  size?: 'sm' | 'md' | 'lg'
  /** when true, the button is visible; otherwise it reveals on group-hover */
  visible?: boolean
  className?: string
}

const sizes = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-14 w-14',
}
const icon = { sm: 18, md: 22, lg: 26 }

export function PlayFab({ onClick, playing = false, label, size = 'md', visible = false, className }: PlayFabProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick(e)
      }}
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-glow',
        'transition-all duration-300 ease-out-back hover:scale-105 active:scale-95',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
        'group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100',
        sizes[size],
        className,
      )}
    >
      {playing ? (
        <Pause width={icon[size]} height={icon[size]} fill="currentColor" />
      ) : (
        <Play width={icon[size]} height={icon[size]} fill="currentColor" className="ml-0.5" />
      )}
    </button>
  )
}
