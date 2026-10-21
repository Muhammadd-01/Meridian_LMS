import { Link } from 'react-router-dom'
import { Users, ChevronRight } from 'lucide-react'
import DataTable from '../../components/common/DataTable'
import Pagination from '../../components/common/Pagination'
import SearchInput from '../../components/common/SearchInput'
import { Avatar, EmptyState, PageHeader, ProgressBar, StatusBadge, StatCard } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useTableState } from '../../hooks/useTableState'
import { enrollmentRows } from '../../utils/analytics'
import { formatDate, relativeTime } from '../../utils/format'
import { UserCheck, UserX, GraduationCap } from 'lucide-react'

export default function AdminLearners() {
  useDocumentTitle('Learners')
  const data = useData()
  const { users, settings } = data
  const rows = enrollmentRows(data)
  const table = useTableState({ initialSort: { key: 'joinedAt', direction: 'desc' }, pageSize: settings.adminPageSize || 10, initialFilters: { status: '', enrolled: '' } })

  const learners = users.filter((u) => u.role === 'learner').map((u) => {
    const mine = rows.filter((r) => r.userId === u.id)
    const lastActivity = mine.reduce((m, r) => (new Date(r.lastAccessedAt) > new Date(m || 0) ? r.lastAccessedAt : m), null)
    return {
      ...u,
      enrolledCount: mine.length,
      completedCount: mine.filter((r) => r.completed).length,
      avgProgress: mine.length ? Math.round(mine.reduce((s, r) => s + r.progress, 0) / mine.length) : 0,
      lastActivity,
    }
  })

  const { items, filtered, ...pageInfo } = table.apply(learners, {
    searchFields: ['name', 'email', 'title', 'location', (u) => u.interests],
    predicate: (u, f) => (!f.status || u.status === f.status) && (!f.enrolled || (f.enrolled === 'yes' ? u.enrolledCount > 0 : u.enrolledCount === 0)),
    getters: { name: (u) => u.name, enrolledCount: (u) => u.enrolledCount, avgProgress: (u) => u.avgProgress, lastActivity: (u) => new Date(u.lastActivity || 0).getTime(), joinedAt: (u) => new Date(u.joinedAt).getTime() },
  })

  return (
    <div>
      <PageHeader title="Learners" description="Fictional demo learner records. Status changes here are mock metadata, not real account controls." breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Learners' }]} />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total learners" value={learners.length} icon={Users} />
        <StatCard label="Active" value={learners.filter((l) => l.status === 'active').length} icon={UserCheck} tone="success" />
        <StatCard label="With completed courses" value={learners.filter((l) => l.completedCount > 0).length} icon={GraduationCap} tone="info" hint={`${learners.filter((l) => l.status !== 'active').length} inactive or suspended`} />
      </div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <SearchInput className="flex-1" value={table.query} onChange={table.setQuery} placeholder="Search name, email, location or interest" label="Search learners" />
        <select className="input md:w-44" aria-label="Filter by status" value={table.filters.status} onChange={(e) => table.setFilter('status', e.target.value)}>
          <option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option>
        </select>
        <select className="input md:w-48" aria-label="Filter by enrolment" value={table.filters.enrolled} onChange={(e) => table.setFilter('enrolled', e.target.value)}>
          <option value="">Any enrolment</option><option value="yes">Has enrolments</option><option value="no">No enrolments</option>
        </select>
      </div>
      <DataTable
        caption="Learners"
        rows={items}
        sort={table.sort}
        onSort={table.setSort}
        columns={[
          { key: 'name', header: 'Learner', sortable: true, render: (u) => (
            <div className="flex items-center gap-3"><Avatar name={u.name} src={u.avatar} size="sm" /><div className="min-w-0"><Link to={`/admin/learners/${u.id}`} className="font-medium text-ink hover:underline">{u.name}</Link><p className="truncate text-xs text-muted">{u.email}</p></div></div>
          ) },
          { key: 'status', header: 'Status', render: (u) => <StatusBadge status={u.status} /> },
          { key: 'enrolledCount', header: 'Courses', sortable: true, className: 'tabular-nums', render: (u) => `${u.enrolledCount} (${u.completedCount} done)` },
          { key: 'avgProgress', header: 'Avg. completion', sortable: true, render: (u) => <div className="flex w-36 items-center gap-2"><ProgressBar value={u.avgProgress} size="sm" className="flex-1" label={`${u.name} average completion`} /><span className="text-xs">{u.avgProgress}%</span></div> },
          { key: 'lastActivity', header: 'Last activity', sortable: true, render: (u) => <span className="text-sm text-muted">{u.lastActivity ? relativeTime(u.lastActivity) : '—'}</span> },
          { key: 'joinedAt', header: 'Joined', sortable: true, render: (u) => <span className="whitespace-nowrap text-sm text-muted">{formatDate(u.joinedAt)}</span> },
          { key: 'view', header: <span className="sr-only">View</span>, className: 'text-right', render: (u) => <Link to={`/admin/learners/${u.id}`} className="btn btn-ghost btn-sm">View <ChevronRight className="h-4 w-4" aria-hidden="true" /></Link> },
        ]}
        empty={<EmptyState icon={UserX} title="No learners match" action={<button type="button" className="btn btn-secondary" onClick={table.resetFilters}>Clear filters</button>} />}
      />
      <Pagination className="mt-4" {...pageInfo} total={filtered.length} pageSize={table.pageSize} onPageSizeChange={table.setPageSize} onChange={table.setPage} />
    </div>
  )
}
