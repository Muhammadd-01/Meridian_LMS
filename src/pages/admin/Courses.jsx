import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, MoreHorizontal, Eye, Pencil, Copy, Send, EyeOff, Archive, ArchiveRestore, Trash2, BookOpen } from 'lucide-react'
import DataTable from '../../components/common/DataTable'
import Dropdown from '../../components/common/Dropdown'
import Pagination from '../../components/common/Pagination'
import SearchInput from '../../components/common/SearchInput'
import SmartImage from '../../components/common/SmartImage'
import { EmptyState, PageHeader, StatusBadge } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useConfirm } from '../../context/ConfirmContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useTableState } from '../../hooks/useTableState'
import { DIFFICULTIES } from '../../data/courses'
import { formatDate } from '../../utils/format'

export default function AdminCourses() {
  useDocumentTitle('Course management')
  const { courses, categories, instructors, enrollments, settings, actions } = useData()
  const toast = useToast()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const table = useTableState({ initialSort: { key: 'updatedAt', direction: 'desc' }, pageSize: settings.adminPageSize || 10, initialFilters: { category: '', status: '', difficulty: '' }, initialQuery: params.get('q') || '' })

  const instructorName = (id) => instructors.find((i) => i.id === id)?.name || '—'
  const categoryName = (id) => categories.find((c) => c.id === id)?.name || 'Uncategorised'
  const enrolCount = (id) => enrollments.filter((e) => e.courseId === id).length

  const { items, filtered, ...pageInfo } = table.apply(courses, {
    searchFields: ['title', 'providerName', (c) => instructorName(c.instructorId), (c) => c.skills, (c) => c.tags],
    predicate: (c, f) => (!f.category || c.categoryId === f.category) && (!f.status || c.status === f.status) && (!f.difficulty || c.difficulty === f.difficulty),
    getters: {
      title: (c) => c.title,
      instructor: (c) => instructorName(c.instructorId),
      category: (c) => categoryName(c.categoryId),
      enrollments: (c) => enrolCount(c.id),
      rating: (c) => c.rating,
      updatedAt: (c) => new Date(c.updatedAt).getTime(),
    },
  })

  const setStatus = (course, status) => {
    actions.setCourseStatus(course.id, status)
    toast.success({ published: 'Course published successfully.', draft: 'Course unpublished and moved to drafts.', archived: 'Course archived.' }[status])
  }

  const duplicate = (course) => {
    const copy = actions.duplicateCourse(course.id)
    if (copy) toast.success(`Created “${copy.title}” as a draft.`)
  }

  const remove = async (course) => {
    const count = enrolCount(course.id)
    const ok = await confirm({
      title: 'Are you sure you want to delete this course?',
      message: `“${course.title}” will be permanently removed from this browser${count ? `, along with ${count} enrolment record(s), saved-course entries, reviews, notes and discussions linked to it` : ''}. This cannot be undone.`,
      confirmLabel: 'Delete course',
      tone: 'danger',
    })
    if (!ok) return
    const result = actions.deleteCourse(course.id)
    toast.success(`Course deleted${result.removedEnrollments ? ` (${result.removedEnrollments} enrolments removed)` : ''}.`)
  }

  const columns = [
    {
      key: 'title', header: 'Course', sortable: true, className: 'min-w-[280px]',
      render: (c) => (
        <div className="flex items-center gap-3">
          <SmartImage src={c.thumbnail} alt="" seed={c.id} className="h-11 w-16 shrink-0 rounded-md" />
          <div className="min-w-0">
            <Link to={`/admin/courses/${c.id}/edit`} className="line-clamp-2 font-medium text-ink hover:underline">{c.title}</Link>
            <p className="text-xs text-muted">{c.courseType}{c.featured ? ' · Featured' : ''}</p>
          </div>
        </div>
      ),
    },
    { key: 'instructor', header: 'Instructor', sortable: true, render: (c) => <span className="whitespace-nowrap">{instructorName(c.instructorId)}</span> },
    { key: 'category', header: 'Category', sortable: true, render: (c) => <span className="whitespace-nowrap">{categoryName(c.categoryId)}</span> },
    { key: 'difficulty', header: 'Difficulty', render: (c) => c.difficulty },
    { key: 'enrollments', header: 'Enrollments', sortable: true, className: 'text-right tabular-nums', headerClassName: 'text-right', render: (c) => enrolCount(c.id) },
    { key: 'rating', header: 'Rating', sortable: true, className: 'tabular-nums', render: (c) => (c.rating ? c.rating.toFixed(1) : '—') },
    { key: 'status', header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
    { key: 'updatedAt', header: 'Last updated', sortable: true, render: (c) => <span className="whitespace-nowrap text-muted">{formatDate(c.updatedAt)}</span> },
    {
      key: 'actions', header: <span className="sr-only">Actions</span>, className: 'text-right',
      render: (c) => (
        <Dropdown
          label={`Actions for ${c.title}`}
          trigger={<span className="rounded-lg p-1.5 text-muted hover:bg-slate-100"><MoreHorizontal className="h-5 w-5" aria-hidden="true" /></span>}
          items={[
            { label: c.status === 'published' ? 'View course' : 'Preview course', icon: Eye, to: `/courses/${c.slug}` },
            { label: 'Edit', icon: Pencil, to: `/admin/courses/${c.id}/edit` },
            { label: 'Duplicate', icon: Copy, onClick: () => duplicate(c) },
            { divider: true },
            c.status === 'published'
              ? { label: 'Unpublish', icon: EyeOff, onClick: () => setStatus(c, 'draft') }
              : { label: 'Publish', icon: Send, onClick: () => setStatus(c, 'published') },
            c.status === 'archived'
              ? { label: 'Restore as draft', icon: ArchiveRestore, onClick: () => setStatus(c, 'draft') }
              : { label: 'Archive', icon: Archive, onClick: () => setStatus(c, 'archived') },
            { divider: true },
            { label: 'Delete', icon: Trash2, danger: true, onClick: () => remove(c) },
          ]}
        />
      ),
    },
  ]

  const statusCounts = ['published', 'draft', 'archived'].map((s) => ({ s, n: courses.filter((c) => c.status === s).length }))

  return (
    <div>
      <PageHeader
        title="Courses"
        description={`${courses.length} courses · ${statusCounts.map((x) => `${x.n} ${x.s}`).join(' · ')}`}
        breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Courses' }]}
        actions={<Link to="/admin/courses/new" className="btn btn-primary"><Plus className="h-4 w-4" aria-hidden="true" />Create course</Link>}
      />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row">
        <SearchInput className="flex-1" value={table.query} onChange={table.setQuery} placeholder="Search title, instructor, provider or skill" label="Search courses" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex">
          <select className="input lg:w-48" aria-label="Filter by category" value={table.filters.category} onChange={(e) => table.setFilter('category', e.target.value)}>
            <option value="">All categories</option>
            {[...categories].sort((a, b) => a.order - b.order).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="input lg:w-40" aria-label="Filter by status" value={table.filters.status} onChange={(e) => table.setFilter('status', e.target.value)}>
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <select className="input lg:w-40" aria-label="Filter by difficulty" value={table.filters.difficulty} onChange={(e) => table.setFilter('difficulty', e.target.value)}>
            <option value="">All levels</option>
            {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <DataTable
        caption="Courses"
        columns={columns}
        rows={items}
        sort={table.sort}
        onSort={table.setSort}
        empty={<EmptyState icon={BookOpen} title="No courses match" description="Adjust your search or filters, or create a new course." action={<><button type="button" className="btn btn-secondary" onClick={table.resetFilters}>Clear filters</button><button type="button" className="btn btn-primary" onClick={() => navigate('/admin/courses/new')}>Create course</button></>} />}
      />
      <Pagination className="mt-4" {...pageInfo} total={filtered.length} pageSize={table.pageSize} onPageSizeChange={table.setPageSize} onChange={table.setPage} />
    </div>
  )
}
