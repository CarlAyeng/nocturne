import { useCallback, useEffect, useRef, useState } from 'react'

/* ============================================================= *
 *  useLocalStorage — persisted state with SSR/exception safety.
 *  Reads/writes are wrapped in try/catch so private-mode or
 *  disabled storage never crashes the app.
 * ============================================================= */

const PREFIX = 'nocturne.'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function useLocalStorage<T>(key: string, initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => read(key, initial))
  const keyRef = useRef(key)
  keyRef.current = key

  const set = useCallback((value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value
      try {
        localStorage.setItem(PREFIX + keyRef.current, JSON.stringify(next))
      } catch {
        /* storage unavailable — keep state in memory only */
      }
      return next
    })
  }, [])

  // Sync across tabs / windows.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === PREFIX + keyRef.current && e.newValue != null) {
        try {
          setState(JSON.parse(e.newValue) as T)
        } catch {
          /* ignore malformed */
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return [state, set]
}
