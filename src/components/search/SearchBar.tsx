import { useEffect } from 'react'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { cn } from '../../utils/cn'

interface SearchBarProps {
  /** called when the user submits the field (Enter), so the page can record the query */
  onSubmit?: (q: string) => void
}

export function SearchBar({ onSubmit }: SearchBarProps) {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const input = document.querySelector<HTMLElement>('[data-search-input]')
        input?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    if (v) setParams({ q: v })
    else setParams({}, { replace: true })
  }

  return (
    <form
      className="relative flex-1"
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        const q = query.trim()
        if (q) onSubmit?.(q)
      }}
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
      <input
        data-search-input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="Search songs, artists, albums, playlists…"
        aria-label="Search"
        className="h-12 w-full rounded-full bg-white/5 pl-12 pr-4 text-sm text-ink outline-none backdrop-blur-sm placeholder:text-muted focus:bg-white/10 focus:text-ink"
      />
    </form>
  )
}