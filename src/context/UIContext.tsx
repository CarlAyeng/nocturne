import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import type { ModalState, Toast, ToastKind } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface UIContextValue {
  // sidebar
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  // mobile slide-out menu
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  // toasts
  toasts: Toast[]
  toast: (message: string, opts?: { kind?: ToastKind; icon?: Toast['icon'] }) => void
  dismissToast: (id: string) => void
  // modals
  modal: ModalState | null
  openModal: (modal: ModalState) => void
  closeModal: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('ui.sidebarCollapsed', false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [modal, setModal] = useState<ModalState | null>(null)
  const counter = useRef(0)

  const toggleSidebar = useCallback(() => setSidebarCollapsed((v) => !v), [setSidebarCollapsed])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback<UIContextValue['toast']>(
    (message, opts) => {
      const id = `toast-${Date.now()}-${counter.current++}`
      const t: Toast = { id, message, kind: opts?.kind ?? 'default', icon: opts?.icon }
      setToasts((prev) => [...prev, t])
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id))
      }, 3600)
    },
    [],
  )

  const openModal = useCallback((m: ModalState) => setModal(m), [])
  const closeModal = useCallback(() => setModal(null), [])

  const value = useMemo<UIContextValue>(
    () => ({
      sidebarCollapsed,
      toggleSidebar,
      mobileMenuOpen,
      setMobileMenuOpen,
      toasts,
      toast,
      dismissToast,
      modal,
      openModal,
      closeModal,
    }),
    [sidebarCollapsed, toggleSidebar, mobileMenuOpen, toasts, toast, dismissToast, modal, openModal, closeModal],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
