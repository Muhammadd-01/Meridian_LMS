import { Star, Check, EyeOff, Trash2, MessageSquare } from 'lucide-react'
import DataTable from '../../components/common/DataTable'
import Pagination from '../../components/common/Pagination'
import SearchInput from '../../components/common/SearchInput'
import { Avatar, EmptyState, PageHeader, RatingStars, StatusBadge, StatCard } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useConfirm } from '../../context/ConfirmContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useTableState } from '../../hooks/useTableState'
import { formatDate } from '../../utils/format'
import { Clock } from 'lucide-react'

export default function AdminReviews() {
  useDocumentTitle('Review moderation')
  const { reviews, courses, users, settings, actions } = useData()
  const toast = useToast()
  const confirm = useConfirm()
  const table = useTableState({ initialSort: { key: 'createdAt', direction: 'desc' }, pageSize: settings.adminPageSize || 10, initialFilters: { status: '', rating: '' } })

  const rows = reviews.map((r) => ({ ...r, course: courses.find((c) => c.id === r.courseId), learner: users.find((u) => u.id === r.userId) }))
  const { items, filtered, ...pageInfo } = table.apply(rows, {
    searchFields: ['text', (r) => r.course?.title, (r) => r.learner?.name],
    predicate: (r, f) => (!f.status || r.status === f.status) && (!f.rating || r.rating === Number(f.rating)),
    getters: { createdAt: (r) => new Date(r.createdAt).getTime(), rating: (r) => r.rating, course: (r) => r.course?.title },
  })

  const setStatus = (r, status) => {
    actions.setReviewStatus(r.id, status)
    toast.success(status === 'approved' ? 'Review approved and now visible on the course page.' : 'Review hidden from learners.')
  }
  const remove = async (r) => {
    if (await confirm({ title: 'Remove this review?', message: 'The review will be permanently deleted from this browser.', confirmLabel: 'Remove review', tone: 'danger' })) {
      actions.deleteReview(r.id)
      toast.success('Review removed.')
    }
  }

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—'

  return (
    <div>
      <PageHeader title="Reviews" description="Moderate learner reviews before they appear on course pages." breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Reviews' }]} />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Awaiting moderation" value={reviews.filter((r) => r.status === 'pending').length} icon={Clock} tone="warning" />
        <StatCard label="Published reviews" value={reviews.filter((r) => r.status === 'approved').length} icon={MessageSquare} tone="success" />
        <StatCard label="Average written rating" value={avg} icon={Star} tone="accent" hint="Across all written reviews" />
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput className="flex-1" value={table.query} onChange={table.setQuery} placeholder="Search review text, course or learner" label="Search reviews" />
        <select className="input sm:w-44" aria-label="Filter by status" value={table.filters.status} onChange={(e) => table.setFilter('status', e.target.value)}>
          <option value="">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="hidden">Hidden</option>
        </select>
        <select className="input sm:w-36" aria-label="Filter by rating" value={table.filters.rating} onChange={(e) => table.setFilter('rating', e.target.value)}>
          <option value="">All ratings</option>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
        </select>
      </div>
      <DataTable
        caption="Course reviews"
        rows={items}
        sort={table.sort}
        onSort={table.setSort}
        columns={[
          { key: 'course', header: 'Course', sortable: true, render: (r) => <span className="line-clamp-2 max-w-[200px] font-medium">{r.course?.title || 'Deleted course'}</span> },
          { key: 'learner', header: 'Learner', render: (r) => <div className="flex items-center gap-2"><Avatar name={r.learner?.name} src={r.learner?.avatar} size="xs" /><span className="whitespace-nowrap">{r.learner?.name || 'Former learner'}</span></div> },
          { key: 'rating', header: 'Rating', sortable: true, render: (r) => <RatingStars rating={r.rating} showValue={false} /> },
          { key: 'text', header: 'Review', className: 'min-w-[260px]', render: (r) => <p className="line-clamp-3 text-sm text-slate-700">{r.text}</p> },
          { key: 'createdAt', header: 'Date', sortable: true, render: (r) => <span className="whitespace-nowrap text-muted">{formatDate(r.createdAt)}</span> },
          { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          { key: 'actions', header: <span className="sr-only">Actions</span>, className: 'whitespace-nowrap text-right', render: (r) => (
            <>
              {r.status !== 'approved' && <button type="button" className="btn btn-ghost btn-icon text-success" onClick={() => setStatus(r, 'approved')} aria-label="Approve review" title="Approve"><Check className="h-4 w-4" /></button>}
              {r.status !== 'hidden' && <button type="button" className="btn btn-ghost btn-icon" onClick={() => setStatus(r, 'hidden')} aria-label="Hide review" title="Hide"><EyeOff className="h-4 w-4" /></button>}
              <button type="button" className="btn btn-danger-ghost btn-icon" onClick={() => remove(r)} aria-label="Remove review" title="Remove"><Trash2 className="h-4 w-4" /></button>
            </>
          ) },
        ]}
        empty={<EmptyState icon={Star} title="No reviews match" action={<button type="button" className="btn btn-secondary" onClick={table.resetFilters}>Clear filters</button>} />}
      />
      <Pagination className="mt-4" {...pageInfo} total={filtered.length} pageSize={table.pageSize} onPageSizeChange={table.setPageSize} onChange={table.setPage} />
    </div>
  )
}
