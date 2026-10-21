import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardCheck, Eye } from 'lucide-react'
import DataTable from '../../components/common/DataTable'
import Pagination from '../../components/common/Pagination'
import SearchInput from '../../components/common/SearchInput'
import Modal from '../../components/common/Modal'
import { Avatar, EmptyState, PageHeader, ProgressBar, StatusBadge } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useTableState } from '../../hooks/useTableState'
import { useNow } from '../../hooks/useUtils'
import { enrollmentRows, withinRange } from '../../utils/analytics'
import { enrollmentStatus, getAllLessons, certificateRef } from '../../utils/learning'
import { formatDate, formatDateTime, relativeTime } from '../../utils/format'

export default function AdminEnrollments() {
  useDocumentTitle('Enrollments')
  const data = useData()
  const { courses, settings } = data
  const now = useNow()
  const [inspect, setInspect] = useState(null)
  const table = useTableState({ initialSort: { key: 'enrolledAt', direction: 'desc' }, pageSize: settings.adminPageSize || 10, initialFilters: { course: '', status: '', certificate: '', range: 'all' } })

  const rows = enrollmentRows(data).map((r) => ({ ...r, status: enrollmentStatus(r.course, r) }))
  const { items, filtered, ...pageInfo } = table.apply(rows, {
    searchFields: [(r) => r.user.name, (r) => r.user.email, (r) => r.course.title],
    predicate: (r, f) => (!f.course || r.courseId === f.course) && (!f.status || r.status === f.status) && (!f.certificate || (f.certificate === 'issued' ? r.completed : !r.completed)) && withinRange(r.enrolledAt, f.range, now),
    getters: { learner: (r) => r.user.name, course: (r) => r.course.title, enrolledAt: (r) => new Date(r.enrolledAt).getTime(), progress: (r) => r.progress, lastAccessedAt: (r) => new Date(r.lastAccessedAt).getTime() },
  })

  const inspectLessons = inspect ? getAllLessons(inspect.course) : []

  return (
    <div>
      <PageHeader title="Enrollments" description={`${rows.length} enrolment records across ${new Set(rows.map((r) => r.userId)).size} learners.`} breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Enrollments' }]} />
      <div className="mb-4 flex flex-col gap-3 xl:flex-row">
        <SearchInput className="flex-1" value={table.query} onChange={table.setQuery} placeholder="Search learner or course" label="Search enrollments" />
        <div className="grid gap-3 sm:grid-cols-2 xl:flex">
          <select className="input xl:w-56" aria-label="Filter by course" value={table.filters.course} onChange={(e) => table.setFilter('course', e.target.value)}>
            <option value="">All courses</option>
            {courses.filter((c) => rows.some((r) => r.courseId === c.id)).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <select className="input xl:w-40" aria-label="Filter by completion status" value={table.filters.status} onChange={(e) => table.setFilter('status', e.target.value)}>
            <option value="">All statuses</option><option value="in-progress">In progress</option><option value="completed">Completed</option><option value="not-started">Not started</option><option value="archived">Archived</option>
          </select>
          <select className="input xl:w-44" aria-label="Filter by certificate status" value={table.filters.certificate} onChange={(e) => table.setFilter('certificate', e.target.value)}>
            <option value="">Any certificate</option><option value="issued">Certificate issued</option><option value="none">No certificate</option>
          </select>
          <select className="input xl:w-40" aria-label="Enrolled within" value={table.filters.range} onChange={(e) => table.setFilter('range', e.target.value)}>
            <option value="all">All time</option><option value="30d">Last 30 days</option><option value="90d">Last 90 days</option><option value="12m">Last 12 months</option>
          </select>
        </div>
      </div>
      <DataTable
        caption="Enrollments"
        rows={items}
        sort={table.sort}
        onSort={table.setSort}
        columns={[
          { key: 'learner', header: 'Learner', sortable: true, render: (r) => <div className="flex items-center gap-2"><Avatar name={r.user.name} src={r.user.avatar} size="xs" /><Link to={`/admin/learners/${r.user.id}`} className="whitespace-nowrap font-medium hover:underline">{r.user.name}</Link></div> },
          { key: 'course', header: 'Course', sortable: true, render: (r) => <span className="line-clamp-1 max-w-[260px]">{r.course.title}</span> },
          { key: 'enrolledAt', header: 'Enrolled', sortable: true, render: (r) => <span className="whitespace-nowrap text-muted">{formatDate(r.enrolledAt)}</span> },
          { key: 'progress', header: 'Progress', sortable: true, render: (r) => <div className="flex w-32 items-center gap-2"><ProgressBar value={r.progress} size="sm" className="flex-1" label="Progress" /><span className="text-xs">{r.progress}%</span></div> },
          { key: 'lastAccessedAt', header: 'Last activity', sortable: true, render: (r) => <span className="whitespace-nowrap text-muted">{relativeTime(r.lastAccessedAt)}</span> },
          { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          { key: 'cert', header: 'Certificate', render: (r) => (r.completed ? <StatusBadge status="issued">Issued (demo)</StatusBadge> : <span className="text-xs text-muted">—</span>) },
          { key: 'inspect', header: <span className="sr-only">Inspect</span>, className: 'text-right', render: (r) => <button type="button" className="btn btn-ghost btn-icon" onClick={() => setInspect(r)} aria-label={`Inspect enrolment of ${r.user.name} in ${r.course.title}`}><Eye className="h-4 w-4" /></button> },
        ]}
        empty={<EmptyState icon={ClipboardCheck} title="No enrollments match" action={<button type="button" className="btn btn-secondary" onClick={table.resetFilters}>Clear filters</button>} />}
      />
      <Pagination className="mt-4" {...pageInfo} total={filtered.length} pageSize={table.pageSize} onPageSizeChange={table.setPageSize} onChange={table.setPage} />

      <Modal open={Boolean(inspect)} onClose={() => setInspect(null)} variant="drawer" title="Enrolment record">
        {inspect && (
          <div className="space-y-4 text-sm">
            <dl className="grid grid-cols-2 gap-3">
              <div><dt className="text-xs text-muted">Learner</dt><dd className="font-medium">{inspect.user.name}</dd></div>
              <div><dt className="text-xs text-muted">Record ID</dt><dd className="font-mono text-xs">{inspect.id}</dd></div>
              <div className="col-span-2"><dt className="text-xs text-muted">Course</dt><dd className="font-medium">{inspect.course.title}</dd></div>
              <div><dt className="text-xs text-muted">Enrolled</dt><dd>{formatDateTime(inspect.enrolledAt)}</dd></div>
              <div><dt className="text-xs text-muted">Last activity</dt><dd>{formatDateTime(inspect.lastAccessedAt)}</dd></div>
              <div><dt className="text-xs text-muted">Completed</dt><dd>{inspect.completedAt ? formatDateTime(inspect.completedAt) : '—'}</dd></div>
              <div><dt className="text-xs text-muted">Certificate</dt><dd>{inspect.completed ? certificateRef(inspect) : 'Not issued'}</dd></div>
            </dl>
            <ProgressBar value={inspect.progress} showLabel label="Progress" />
            <div>
              <p className="font-semibold">Lesson completion</p>
              <ul className="mt-2 max-h-72 space-y-1 overflow-y-auto">
                {inspectLessons.map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-2 rounded px-2 py-1 odd:bg-slate-50">
                    <span className="truncate">{l.title}</span>
                    {inspect.completedLessonIds.includes(l.id) ? <StatusBadge status="completed">Done</StatusBadge> : <span className="text-xs text-muted">{l.required === false ? 'Optional' : 'Pending'}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
