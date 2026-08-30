import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface MenuItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  danger?: boolean
  separatorBefore?: boolean
}

interface MenuProps {
  /** the trigger button content */
  trigger: ReactNode
  triggerLabel: string
  items: MenuItem[]
  align?: 'start' | 'end'
  triggerClassName?: string
}

export function Menu({ trigger, triggerLabel, items, align = 'end', triggerClassName }: MenuProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const place = useCallback(() => {
    const b = btnRef.current?.getBoundingClientRect()
    if (!b) return
    const menuW = 220
    const menuH = Math.min(items.length * 44 + 12, 360)
    let left = align === 'end' ? b.right - menuW : b.left
    left = Math.max(8, Math.min(left, window.innerWidth - menuW - 8))
    let top = b.bottom + 6
    if (top + menuH > window.innerHeight - 8) top = Math.max(8, b.top - menuH - 6)
    setPos({ top, left })
  }, [align, items.length])

  useLayoutEffect(() => {
    if (open) place()
  }, [open, place])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !btnRef.current?.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onScroll = () => setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open])

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={triggerLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open && (
        <div
          ref={menuRef}
          role="menu"
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: 220 }}
          className="glass-strong z-[140] animate-scale-in rounded-2xl p-1.5 shadow-lift"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, i) => (
            <div key={i}>
              {item.separatorBefore && <div className="my-1 h-px bg-white/10" />}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  item.onClick()
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition',
                  item.danger ? 'text-danger hover:bg-danger/10' : 'text-ink hover:bg-white/10',
                )}
              >
                {item.icon && <span className="shrink-0 text-muted">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
