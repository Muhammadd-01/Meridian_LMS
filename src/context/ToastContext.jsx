/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CircleCheck, CircleAlert, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '../utils/cn'

const ToastContext = createContext(null)

const STYLES = {
  success: { icon: CircleCheck, chip: 'bg-success-soft text-success', bar: 'from-success to-[#4ade80]', title: 'Success' },
  error: { icon: CircleAlert, chip: 'bg-danger-soft text-danger', bar: 'from-danger to-[#f87171]', title: 'Something went wrong' },
  warning: { icon: TriangleAlert, chip: 'bg-warning-soft text-warning', bar: 'from-warning to-accent', title: 'Heads up' },
  info: { icon: Info, chip: 'bg-info-soft text-info', bar: 'from-info to-primary', title: 'Notice' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())
  const last = useRef({ key: '', at: 0 })

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
  }, [])

  // Play the exit animation, then remove.
  const dismiss = useCallback((id) => {
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
    clearTimeout(timers.current.get(id))
    timers.current.set(id, setTimeout(() => remove(id), 260))
  }, [remove])

  const push = useCallback((type, message, options = {}) => {
    // Ignore an identical toast fired again within a moment (e.g. effects re-run in StrictMode).
    const key = `${type}:${message}`
    if (last.current.key === key && Date.now() - last.current.at < 800) return null
    last.current = { key, at: Date.now() }
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const duration = options.duration || 4500
    setToasts((list) => [...list.slice(-3), { id, type, message, title: options.title, duration }])
    timers.current.set(id, setTimeout(() => dismiss(id), duration))
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
        className="pointer-events-none fixed inset-x-0 top-0 z-[90] flex flex-col items-center gap-2.5 p-3 sm:inset-x-auto sm:top-20 sm:right-4 sm:items-end"
      >
        {toasts.map((t) => {
          const style = STYLES[t.type] || STYLES.info
          const Icon = style.icon
          return (
            <div
              key={t.id}
              role={t.type === 'error' ? 'alert' : 'status'}
              className={cn(
                'pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-[0_20px_45px_-18px_rgb(9_63_80/0.55)] ring-1 ring-black/5 backdrop-blur-xl',
                t.leaving ? 'toast-leave' : 'toast-enter',
              )}
            >
              <div className="flex items-start gap-3 p-3.5 pr-3">
                <span className={cn('flex h-10 w-10 shrink-0 animate-pop-in items-center justify-center rounded-xl', style.chip)}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5 text-sm">
                  <p className="font-semibold text-ink">{t.title || style.title}</p>
                  <p className="mt-0.5 leading-5 text-slate-600">{t.message}</p>
                </div>
                <button type="button" onClick={() => dismiss(t.id)} className="rounded-lg p-1 text-muted transition hover:rotate-90 hover:bg-slate-100 hover:text-ink" aria-label="Dismiss notification">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <span className={cn('toast-progress absolute bottom-0 left-0 h-1 bg-gradient-to-r', style.bar)} style={{ animationDuration: `${t.duration}ms` }} aria-hidden="true" />
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
