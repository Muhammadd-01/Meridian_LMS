import { Search, X } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function SearchInput({ value, onChange, placeholder = 'Search…', label = 'Search', className, inputClassName, onSubmit, size = 'md', id }) {
  const content = (
    <div className={cn('relative', className)}>
      <Search className={cn('pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted', size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')} aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className={cn('input pr-9', size === 'lg' ? 'py-3.5 pl-11 text-base' : 'pl-9', inputClassName, '[&::-webkit-search-cancel-button]:hidden')}
      />
      {value && (
        <button type="button" onClick={() => onChange('')} className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1 text-muted hover:bg-slate-100 hover:text-ink" aria-label="Clear search">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
  if (!onSubmit) return content
  return (
    <form role="search" onSubmit={(e) => { e.preventDefault(); onSubmit(value) }}>
      {content}
    </form>
  )
}
