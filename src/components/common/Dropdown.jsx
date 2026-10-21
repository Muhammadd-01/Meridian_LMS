import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useClickOutside } from '../../hooks/useUtils'
import { cn } from '../../utils/cn'

/**
 * Menu button with keyboard support (Enter/Space/ArrowDown to open, arrows to move,
 * Escape to close). Items: { label, icon, to, onClick, danger, divider, description }.
 */
export default function Dropdown({ trigger, items, align = 'right', label = 'Open menu', className, menuClassName, header }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const itemRefs = useRef([])
  const menuId = useId()
  useClickOutside(rootRef, () => setOpen(false), open)

  const actionable = items.filter((i) => !i.divider)

  useEffect(() => {
    if (open) itemRefs.current[0]?.focus()
  }, [open])

  const close = (focusButton = true) => {
    setOpen(false)
    if (focusButton) buttonRef.current?.focus()
  }

  const onMenuKeyDown = (event) => {
    const current = itemRefs.current.indexOf(document.activeElement)
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      itemRefs.current[(current + 1) % actionable.length]?.focus()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      itemRefs.current[(current - 1 + actionable.length) % actionable.length]?.focus()
    } else if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  const indexed = []
  let count = 0
  for (const item of items) {
    indexed.push(item.divider ? item : { ...item, index: count })
    if (!item.divider) count += 1
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={typeof trigger === 'string' ? undefined : label}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
          }
        }}
        className="inline-flex items-center rounded-lg"
      >
        {trigger}
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          onKeyDown={onMenuKeyDown}
          className={cn(
            'absolute z-50 mt-2 min-w-[220px] origin-top animate-slide-up overflow-hidden rounded-xl border border-line bg-white py-1.5 shadow-[var(--shadow-raised)]',
            align === 'right' ? 'right-0' : 'left-0',
            menuClassName,
          )}
        >
          {header && <div className="border-b border-line px-4 pt-2 pb-3">{header}</div>}
          {indexed.map((item, i) => {
            if (item.divider) return <div key={`d-${i}`} className="my-1.5 border-t border-line" role="separator" />
            const { index } = item
            const Icon = item.icon
            const classes = cn(
              'flex w-full items-center gap-3 px-4 py-2 text-left text-sm outline-none focus:bg-slate-100 hover:bg-slate-50',
              item.danger ? 'text-danger' : 'text-ink',
            )
            const inner = (
              <>
                {Icon && <Icon className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />}
                <span className="min-w-0 flex-1">
                  <span className="block">{item.label}</span>
                  {item.description && <span className="block text-xs text-muted">{item.description}</span>}
                </span>
              </>
            )
            return item.to ? (
              <Link key={item.label} ref={(el) => { itemRefs.current[index] = el }} role="menuitem" to={item.to} className={classes} onClick={() => close(false)}>
                {inner}
              </Link>
            ) : (
              <button
                key={item.label}
                ref={(el) => { itemRefs.current[index] = el }}
                role="menuitem"
                type="button"
                className={classes}
                onClick={() => {
                  close(false)
                  item.onClick?.()
                }}
              >
                {inner}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
