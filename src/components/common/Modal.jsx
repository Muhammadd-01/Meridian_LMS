import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

const SIZES = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-6xl' }

/**
 * Accessible dialog: focus moves into the panel, Tab is trapped, Escape closes,
 * focus returns to the trigger and page scrolling is locked while open.
 * `variant="drawer"` slides in from the right (or left with side="left").
 */
export default function Modal({
  open, onClose, title, description, children, footer, size = 'md', variant = 'dialog', side = 'right',
  hideClose = false, initialFocusRef, className,
}) {
  const panelRef = useRef(null)
  const titleId = useId()
  const descId = useId()
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return undefined
    const previouslyFocused = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    const target = initialFocusRef?.current || panel?.querySelector('[data-autofocus]') || panel?.querySelector(FOCUSABLE) || panel
    target?.focus({ preventScroll: true })

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onCloseRef.current?.()
        return
      }
      if (event.key !== 'Tab' || !panel) return
      const items = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!items.length) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') previouslyFocused.focus({ preventScroll: true })
    }
  }, [open, initialFocusRef])

  if (!open) return null
  const isDrawer = variant === 'drawer'

  return createPortal(
    <div className={cn('fixed inset-0 z-[70] flex', isDrawer ? (side === 'left' ? 'justify-start' : 'justify-end') : 'items-end justify-center p-0 sm:items-center sm:p-4')}>
      <div className="absolute inset-0 animate-fade-in bg-slate-900/50" onClick={() => onCloseRef.current?.()} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-full w-full flex-col bg-white shadow-2xl outline-none',
          isDrawer
            ? cn('h-full max-w-md', side === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right')
            : cn('max-h-[92vh] animate-slide-up rounded-t-2xl sm:rounded-2xl', SIZES[size]),
          className,
        )}
      >
        {(title || !hideClose) && (
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
            <div className="min-w-0">
              {title && <h2 id={titleId} className="text-lg font-semibold text-ink">{title}</h2>}
              {description && <p id={descId} className="mt-0.5 text-sm text-muted">{description}</p>}
            </div>
            {!hideClose && (
              <button type="button" onClick={() => onCloseRef.current?.()} className="-mr-2 rounded-lg p-2 text-muted hover:bg-slate-100 hover:text-ink" aria-label="Close dialog">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line bg-slate-50/60 px-5 py-3.5 sm:px-6">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
