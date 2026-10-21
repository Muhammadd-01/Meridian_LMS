import { useState } from 'react'
import { Plus, X } from 'lucide-react'

/** Edits a list of short strings (learning outcomes, prerequisites, rubric items…). */
export default function ListEditor({ id, items, onChange, placeholder = 'Add an item', max = 12 }) {
  const [draft, setDraft] = useState('')
  const add = () => {
    const value = draft.trim()
    if (!value || items.includes(value) || items.length >= max) return
    onChange([...items, value])
    setDraft('')
  }
  return (
    <div>
      {items.length > 0 && (
        <ul className="mb-2 space-y-1.5">
          {items.map((item, i) => (
            <li key={`${item}-${i}`} className="flex items-center gap-2 rounded-lg border border-line bg-slate-50 px-3 py-1.5 text-sm">
              <span className="min-w-0 flex-1">{item}</span>
              <button type="button" className="rounded p-1 text-muted hover:text-danger" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={`Remove ${item}`}>
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          id={id}
          className="input"
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
        />
        <button type="button" className="btn btn-secondary" onClick={add} disabled={!draft.trim() || items.length >= max}><Plus className="h-4 w-4" aria-hidden="true" />Add</button>
      </div>
    </div>
  )
}
