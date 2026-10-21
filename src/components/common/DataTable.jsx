import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * Generic table. columns: [{ key, header, render(row), sortable, className, headerClassName }]
 * sort: { key, direction } — the parent owns sorting so it can combine with search/pagination.
 * The table scrolls horizontally inside its card on narrow screens.
 */
export default function DataTable({ columns, rows, rowKey = 'id', sort, onSort, empty, caption, onRowClick, className, dense = false }) {
  const toggleSort = (key) => {
    if (!onSort) return
    const direction = sort?.key === key && sort.direction === 'asc' ? 'desc' : 'asc'
    onSort({ key, direction })
  }

  return (
    <div className={cn('card overflow-hidden', className)}>
      <div className="relative overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[640px] text-left text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="border-b border-line bg-slate-50/80">
            <tr>
              {columns.map((col) => {
                const active = sort?.key === col.key
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                    className={cn('px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-slate-600 uppercase', col.headerClassName)}
                  >
                    {col.sortable ? (
                      <button type="button" onClick={() => toggleSort(col.key)} className="inline-flex items-center gap-1 rounded uppercase hover:text-ink">
                        {col.header}
                        {active ? (
                          sort.direction === 'asc' ? <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" /> : <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr
                key={typeof rowKey === 'function' ? rowKey(row) : row[rowKey]}
                className={cn('bg-white transition-colors hover:bg-slate-50/70', onRowClick && 'cursor-pointer')}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 align-middle text-ink', dense ? 'py-2' : 'py-3', col.className)}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length && empty}
    </div>
  )
}
