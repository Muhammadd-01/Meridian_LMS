import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

function FilterGroup({ group, selected, onToggle }) {
  const [open, setOpen] = useState(group.defaultOpen !== false)
  const [showAll, setShowAll] = useState(false)
  const options = showAll ? group.options : group.options.slice(0, group.limit || 6)
  const panelId = `filter-${group.id}`
  return (
    <fieldset className="border-b border-line py-4 first:pt-0 last:border-b-0">
      <legend className="w-full">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={panelId} className="flex w-full items-center justify-between text-sm font-semibold text-ink">
          {group.label}
          {selected.length > 0 && <span className="mr-auto ml-2 rounded-full bg-primary px-1.5 text-[11px] text-white">{selected.length}</span>}
          <ChevronDown className={cn('h-4 w-4 text-muted transition-transform', open && 'rotate-180')} aria-hidden="true" />
        </button>
      </legend>
      <div id={panelId} hidden={!open} className="mt-3 space-y-2">
        {options.map((opt) => {
          const id = `${group.id}-${opt.value}`
          const checked = selected.includes(opt.value)
          return (
            <label key={opt.value} htmlFor={id} className={cn('flex cursor-pointer items-center gap-2.5 text-sm', opt.count === 0 && !checked ? 'text-slate-400' : 'text-slate-700')}>
              <input
                id={id}
                type={group.type === 'radio' ? 'radio' : 'checkbox'}
                name={group.type === 'radio' ? group.id : undefined}
                className="checkbox"
                checked={checked}
                onChange={() => onToggle(group.id, opt.value)}
                onClick={(e) => {
                  // Allow un-selecting a radio by clicking it again.
                  if (group.type === 'radio' && checked) {
                    e.preventDefault()
                    onToggle(group.id, opt.value)
                  }
                }}
              />
              <span className="flex-1">{opt.label}</span>
              {opt.count != null && <span className="text-xs text-muted">{opt.count}</span>}
            </label>
          )
        })}
        {group.options.length > (group.limit || 6) && (
          <button type="button" className="text-sm font-semibold text-secondary hover:underline" onClick={() => setShowAll((s) => !s)}>
            {showAll ? 'Show less' : `Show all ${group.options.length}`}
          </button>
        )}
      </div>
    </fieldset>
  )
}

/** groups: [{ id, label, type: 'checkbox' | 'radio', options: [{ value, label, count }] }] */
export default function FilterSidebar({ groups, selected, onToggle, onClear, activeCount }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">Filters</h2>
        {activeCount > 0 && (
          <button type="button" onClick={onClear} className="text-sm font-semibold text-secondary hover:underline">Clear all</button>
        )}
      </div>
      {groups.map((group) => (
        <FilterGroup key={group.id} group={group} selected={selected[group.id] || []} onToggle={onToggle} />
      ))}
    </div>
  )
}
