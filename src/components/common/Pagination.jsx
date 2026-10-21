import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'

function pageList(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const pages = new Set([1, totalPages, page, page - 1, page + 1])
  if (page <= 3) [2, 3, 4].forEach((p) => pages.add(p))
  if (page >= totalPages - 2) [totalPages - 1, totalPages - 2, totalPages - 3].forEach((p) => pages.add(p))
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
  const result = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push(`gap-${p}`)
    result.push(p)
  })
  return result
}

export default function Pagination({ page, totalPages, onChange, total, start, end, pageSize, onPageSizeChange, pageSizeOptions = [10, 20, 50], className }) {
  if (!total) return null
  return (
    <div className={cn('flex flex-col items-center justify-between gap-3 sm:flex-row', className)}>
      <div className="flex items-center gap-3 text-sm text-muted">
        <p>
          Showing <span className="font-semibold text-ink">{start}–{end}</span> of <span className="font-semibold text-ink">{total}</span>
        </p>
        {onPageSizeChange && (
          <label className="flex items-center gap-2">
            <span className="sr-only sm:not-sr-only">Rows</span>
            <select className="input w-auto py-1.5" value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
              {pageSizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        )}
      </div>
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Prev</span>
          </button>
          {pageList(page, totalPages).map((p) =>
            typeof p === 'string' ? (
              <span key={p} className="px-1 text-muted" aria-hidden="true">…</span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onChange(p)}
                aria-current={p === page ? 'page' : undefined}
                aria-label={`Page ${p}`}
                className={cn('h-9 min-w-9 rounded-lg px-2 text-sm font-semibold', p === page ? 'bg-primary text-white' : 'text-ink hover:bg-slate-100')}
              >
                {p}
              </button>
            ),
          )}
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => onChange(page + 1)} disabled={page >= totalPages} aria-label="Next page">
            <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  )
}
