import { History, Info } from 'lucide-react'
import DataTable from '../../components/common/DataTable'
import Pagination from '../../components/common/Pagination'
import SearchInput from '../../components/common/SearchInput'
import { EmptyState, PageHeader } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useTableState } from '../../hooks/useTableState'
import { formatDateTime } from '../../utils/format'

const ACTION_STYLES = { created: 'badge-success', added: 'badge-success', published: 'badge-success', registered: 'badge-success', graded: 'badge-info', updated: 'badge-info', duplicated: 'badge-info', deleted: 'badge-danger', removed: 'badge-danger', archived: 'badge-warning', hidden: 'badge-warning', unpublished: 'badge-warning' }

const humanise = (action) => action.replace('.', ' · ').replace(/([a-z])([A-Z])/g, '$1 $2')

export default function AdminActivityLogs() {
  useDocumentTitle('Activity logs')
  const { activityLogs, settings } = useData()
  const table = useTableState({ initialSort: { key: 'createdAt', direction: 'desc' }, pageSize: settings.adminPageSize || 10, initialFilters: { type: '', source: '' } })
  const types = [...new Set(activityLogs.map((l) => l.entityType))].sort()

  const { items, filtered, ...pageInfo } = table.apply(activityLogs, {
    searchFields: ['action', 'entityLabel', 'details', 'actorName'],
    predicate: (l, f) => (!f.type || l.entityType === f.type) && (!f.source || (f.source === 'seed' ? l.seeded : !l.seeded)),
    getters: { createdAt: (l) => new Date(l.createdAt).getTime(), actorName: (l) => l.actorName },
  })

  return (
    <div>
      <PageHeader title="Activity logs" description="Local demo activity log — sample events plus actions performed in this browser." breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Activity logs' }]} />
      <div className="mb-4 flex items-start gap-2 rounded-xl border border-info/30 bg-info-soft p-3 text-sm text-[#1F4E5F]"><Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />These logs live in LocalStorage and are not an audit trail. They are capped at the 400 most recent entries.</div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <SearchInput className="flex-1" value={table.query} onChange={table.setQuery} placeholder="Search action, item or actor" label="Search activity" />
        <select className="input md:w-44" aria-label="Filter by type" value={table.filters.type} onChange={(e) => table.setFilter('type', e.target.value)}>
          <option value="">All types</option>{types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="input md:w-48" aria-label="Filter by source" value={table.filters.source} onChange={(e) => table.setFilter('source', e.target.value)}>
          <option value="">All events</option><option value="session">This browser’s actions</option><option value="seed">Sample events</option>
        </select>
      </div>
      <DataTable
        caption="Activity logs"
        rows={items}
        sort={table.sort}
        onSort={table.setSort}
        dense
        columns={[
          { key: 'createdAt', header: 'When', sortable: true, render: (l) => <span className="whitespace-nowrap text-muted">{formatDateTime(l.createdAt)}</span> },
          { key: 'action', header: 'Event', render: (l) => <span className={`badge ${ACTION_STYLES[l.action.split('.')[1]] || 'badge-neutral'}`}>{humanise(l.action)}</span> },
          { key: 'entityLabel', header: 'Item', render: (l) => <span className="line-clamp-1 max-w-[280px] font-medium">{l.entityLabel}</span> },
          { key: 'details', header: 'Details', render: (l) => <span className="text-sm text-muted">{l.details || '—'}</span> },
          { key: 'actorName', header: 'Actor', sortable: true, render: (l) => <span className="whitespace-nowrap">{l.actorName}{l.seeded && <span className="ml-1 text-[11px] text-slate-400">(sample)</span>}</span> },
        ]}
        empty={<EmptyState icon={History} title="No activity matches" />}
      />
      <Pagination className="mt-4" {...pageInfo} total={filtered.length} pageSize={table.pageSize} onPageSizeChange={table.setPageSize} onChange={table.setPage} />
    </div>
  )
}
