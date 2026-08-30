import { useEffect, useState } from 'react'

/** Subscribe to a CSS media query. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** true on tablet/desktop (>= 1024px). */
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
/** true on phones (< 768px). */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)')
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
