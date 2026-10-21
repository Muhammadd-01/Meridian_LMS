/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { TriangleAlert, Info } from 'lucide-react'
import Modal from '../components/common/Modal'

const ConfirmContext = createContext(null)

/** Promise-based confirmation dialog: `if (await confirm({...})) doThing()`. */
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

  const danger = dialog?.tone === 'danger'
  const Icon = danger ? TriangleAlert : Info

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={Boolean(dialog)}
        onClose={() => close(false)}
        size="sm"
        hideClose
        initialFocusRef={cancelRef}
        footer={(
          <>
            <button ref={cancelRef} type="button" className="btn btn-secondary" onClick={() => close(false)}>{dialog?.cancelLabel}</button>
            <button type="button" className={danger ? 'btn btn-danger' : 'btn btn-primary'} onClick={() => close(true)}>{dialog?.confirmLabel}</button>
          </>
        )}
      >
        {dialog && (
          <div className="flex gap-4">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${danger ? 'bg-danger-soft text-danger' : 'bg-info-soft text-info'}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-ink">{dialog.title}</h2>
              {dialog.message && <div className="mt-1 text-sm text-muted">{dialog.message}</div>}
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
