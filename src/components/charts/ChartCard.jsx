import { useState } from 'react'
import { Table2, BarChart3 } from 'lucide-react'
import { DemoPill } from '../common/ui'
import { cn } from '../../utils/cn'

/**
 * Card wrapper for charts with an accessible table view toggle.
 * table: { columns: [{ key, label }], rows: [] } — rendered when the user switches views.
 */
export default function ChartCard({ title, description, sample = false, table, actions, children, className, height = 260 }) {
  const [showTable, setShowTable] = useState(false)
  return (
    <section className={cn('card flex flex-col p-5', className)} aria-label={title}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="flex flex-wrap items-center gap-2 text-base font-semibold text-ink">
            {title}
            {sample && <DemoPill />}
          </h2>
          {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
        </div>
        <div className="flex items-center gap-1">
          {actions}
          {table && (
            <button type="button" onClick={() => setShowTable((s) => !s)} className="btn btn-ghost btn-sm text-muted" aria-pressed={showTable} aria-label={showTable ? 'Show chart' : 'Show data table'}>
              {showTable ? <BarChart3 className="h-4 w-4" aria-hidden="true" /> : <Table2 className="h-4 w-4" aria-hidden="true" />}
            </button>
          )}
        </div>
      </div>
      {showTable && table ? (
        <div className="max-h-[320px] overflow-auto rounded-lg border border-line">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{title}</caption>
            <thead className="sticky top-0 bg-slate-50">
              <tr>{table.columns.map((c) => <th key={c.key} scope="col" className="px-3 py-2 text-xs font-semibold text-slate-600">{c.label}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-line">
              {table.rows.map((row, i) => (
                <tr key={i}>{table.columns.map((c) => <td key={c.key} className="px-3 py-2 tabular-nums">{row[c.key]}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ height }} className="w-full min-w-0">{children}</div>
      )}
    </section>
  )
}
