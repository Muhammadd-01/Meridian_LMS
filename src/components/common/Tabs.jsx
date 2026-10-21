import { useId, useRef } from 'react'
import { cn } from '../../utils/cn'

/**
 * Accessible tab list (arrow-key navigation). Render the active panel yourself and
 * give it `role="tabpanel"` with `aria-labelledby={tabId(value)}` if needed.
 */
export default function Tabs({ tabs, value, onChange, className, size = 'md', ariaLabel = 'Sections' }) {
  const baseId = useId()
  const refs = useRef([])

  const onKeyDown = (event, index) => {
    let next = null
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = tabs.length - 1
    if (next != null) {
      event.preventDefault()
      onChange(tabs[next].id)
      refs.current[next]?.focus()
    }
  }

  return (
    <div className={cn('no-scrollbar -mx-1 overflow-x-auto px-1', className)}>
      <div role="tablist" aria-label={ariaLabel} className="flex min-w-max gap-1 border-b border-line">
        {tabs.map((tab, index) => {
          const active = tab.id === value
          return (
            <button
              key={tab.id}
              ref={(el) => { refs.current[index] = el }}
              id={`${baseId}-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={cn(
                '-mb-px inline-flex items-center gap-2 border-b-2 font-semibold transition-colors',
                size === 'sm' ? 'px-3 py-2 text-[13px]' : 'px-4 py-3 text-sm',
                active ? 'border-accent text-ink' : 'border-transparent text-muted hover:border-slate-300 hover:text-ink',
              )}
            >
              {tab.icon && <tab.icon className="h-4 w-4" aria-hidden="true" />}
              {tab.label}
              {tab.count != null && (
                <span className={cn('rounded-full px-2 py-0.5 text-xs', active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600')}>{tab.count}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
