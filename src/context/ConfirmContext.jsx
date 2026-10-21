/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { TriangleAlert, Info, Trash2, LogOut, CircleCheck, X } from 'lucide-react'
import Modal from '../components/common/Modal'
import { cn } from '../utils/cn'

const ConfirmContext = createContext(null)

const TONES = {
  danger: { icon: Trash2, ring: 'from-danger to-[#f87171]', soft: 'bg-danger-soft', button: 'bg-gradient-to-r from-danger to-[#b91c1c] text-white hover:shadow-[0_10px_24px_-10px_rgb(220_38_38/0.8)]', label: 'Destructive action' },
  warning: { icon: TriangleAlert, ring: 'from-warning to-accent', soft: 'bg-warning-soft', button: 'bg-gradient-to-r from-accent to-[#e07100] text-ink hover:shadow-[0_10px_24px_-10px_rgb(247_141_0/0.8)]', label: 'Please confirm' },
  logout: { icon: LogOut, ring: 'from-primary to-info', soft: 'bg-primary-soft', button: 'bg-gradient-to-r from-primary to-deep text-white hover:shadow-[0_10px_24px_-10px_rgb(9_63_80/0.8)]', label: 'Sign out' },
  success: { icon: CircleCheck, ring: 'from-success to-[#4ade80]', soft: 'bg-success-soft', button: 'bg-gradient-to-r from-success to-[#166534] text-white', label: 'Confirm' },
  default: { icon: Info, ring: 'from-info to-primary', soft: 'bg-info-soft', button: 'bg-gradient-to-r from-primary to-deep text-white hover:shadow-[0_10px_24px_-10px_rgb(9_63_80/0.8)]', label: 'Please confirm' },
}

/**
 * Promise-based, brand-styled confirmation dialog: `if (await confirm({...})) doThing()`.
 * tone: 'danger' | 'warning' | 'logout' | 'success' | 'default'; optional `details` list.
 */
export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null)
  const resolver = useRef(null)
  const cancelRef = useRef(null)

  const confirm = useCallback((options) => new Promise((resolve) => {
    resolver.current = resolve
    setDialog({ confirmLabel: 'Confirm', cancelLabel: 'Cancel', tone: 'default', ...options })
  }), [])

  const close = (result) => {
    resolver.current?.(result)
    resolver.current = null
    setDialog(null)
  }

  const tone = TONES[dialog?.tone] || TONES.default
  const Icon = tone.icon

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal open={Boolean(dialog)} onClose={() => close(false)} size="sm" hideClose initialFocusRef={cancelRef} className="overflow-hidden">
        {dialog && (
          <div className="relative -mx-5 -my-5 px-6 pt-8 pb-6 text-center sm:-mx-6">
            <div className={cn('pointer-events-none absolute inset-x-0 top-0 h-28 opacity-60', tone.soft)} aria-hidden="true" />
            <button type="button" onClick={() => close(false)} className="absolute top-3 right-3 rounded-lg p-1.5 text-muted transition hover:rotate-90 hover:bg-slate-100 hover:text-ink" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
            <span className="relative mx-auto flex h-16 w-16 items-center justify-center">
              <span className={cn('absolute inset-0 animate-ping rounded-full bg-gradient-to-br opacity-20', tone.ring)} aria-hidden="true" />
              <span className={cn('relative flex h-16 w-16 animate-pop-in items-center justify-center rounded-full bg-gradient-to-br text-white shadow-lg', tone.ring)}>
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
            </span>
            <p className="relative mt-4 text-[11px] font-bold tracking-[0.18em] text-muted uppercase">{tone.label}</p>
            <h2 className="relative mt-1 text-lg font-bold text-ink">{dialog.title}</h2>
            {dialog.message && <div className="relative mt-2 text-sm leading-6 text-muted">{dialog.message}</div>}
            {dialog.details?.length > 0 && (
              <ul className="relative mt-4 space-y-1 rounded-xl border border-line bg-slate-50 p-3 text-left text-xs text-slate-600">
                {dialog.details.map((d) => <li key={d} className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />{d}</li>)}
              </ul>
            )}
            <div className="relative mt-6 flex flex-col-reverse gap-2 sm:flex-row">
              <button ref={cancelRef} type="button" className="btn btn-secondary flex-1 rounded-full" onClick={() => close(false)}>{dialog.cancelLabel}</button>
              <button type="button" className={cn('btn flex-1 rounded-full transition-all hover:-translate-y-0.5', tone.button)} onClick={() => close(true)}>{dialog.confirmLabel}</button>
            </div>
          </div>
        )}
      </Modal>
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used inside <ConfirmProvider>')
  return ctx
}
