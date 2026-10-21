/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CircleCheck, CircleAlert, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '../utils/cn'

const ToastContext = createContext(null)

const STYLES = {
  success: { icon: CircleCheck, accent: 'text-success', bar: 'bg-success' },
  error: { icon: CircleAlert, accent: 'text-danger', bar: 'bg-danger' },
  warning: { icon: TriangleAlert, accent: 'text-warning', bar: 'bg-warning' },
  info: { icon: Info, accent: 'text-info', bar: 'bg-info' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
  }, [])

  const push = useCallback((type, message, options = {}) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    setToasts((list) => [...list.slice(-3), { id, type, message, title: options.title }])
    timers.current.set(id, setTimeout(() => dismiss(id), options.duration || 4200))
    return id
  }, [dismiss])

  const toast = useMemo(() => ({
    success: (message, options) => push('success', message, options),
    error: (message, options) => push('error', message, options),
    warning: (message, options) => push('warning', message, options),
    info: (message, options) => push('info', message, options),
    dismiss,
  }), [push, dismiss])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:items-end"
      >
        {toasts.map((t) => {
          const style = STYLES[t.type] || STYLES.info
          const Icon = style.icon
          return (
            <div
              key={t.id}
              role={t.type === 'error' ? 'alert' : 'status'}
              className="pointer-events-auto relative flex w-full max-w-sm animate-slide-up items-start gap-3 overflow-hidden rounded-xl border border-line bg-white py-3 pr-3 pl-4 shadow-[var(--shadow-raised)]"
            >
              <span className={cn('absolute inset-y-0 left-0 w-1', style.bar)} aria-hidden="true" />
              <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', style.accent)} aria-hidden="true" />
              <div className="min-w-0 flex-1 text-sm">
                {t.title && <p className="font-semibold text-ink">{t.title}</p>}
                <p className="text-slate-700">{t.message}</p>
              </div>
              <button type="button" onClick={() => dismiss(t.id)} className="rounded-md p-1 text-muted hover:bg-slate-100 hover:text-ink" aria-label="Dismiss notification">
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
