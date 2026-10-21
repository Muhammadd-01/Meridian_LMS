import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Trash2, PlayCircle } from 'lucide-react'
import SmartImage from '../../components/common/SmartImage'
import { EmptyState, PageHeader, RatingStars } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { sortItems } from '../../utils/query'
import { relativeTime, formatCompact } from '../../utils/format'

const SORTS = {
  saved: { label: 'Recently saved', get: (x) => new Date(x.savedAt).getTime(), dir: 'desc' },
  rating: { label: 'Highest rated', get: (x) => x.course.rating, dir: 'desc' },
  duration: { label: 'Shortest first', get: (x) => x.course.durationHours, dir: 'asc' },
  title: { label: 'Title (A–Z)', get: (x) => x.course.title, dir: 'asc' },
}

export default function Saved() {
  useDocumentTitle('Saved courses')
  const { saved, courses, categories, enrollments, actions } = useData()
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('saved')

  const items = saved
    .filter((s) => s.userId === user.id)
    .map((s) => ({ ...s, course: courses.find((c) => c.id === s.courseId) }))
    .filter((s) => s.course && s.course.status === 'published')
  const filtered = sortItems(items.filter((i) => !category || i.course.categoryId === category), SORTS[sort].get, SORTS[sort].dir)
  const isEnrolled = (courseId) => enrollments.some((e) => e.userId === user.id && e.courseId === courseId && !e.archived)

  const remove = (courseId) => {
    actions.toggleSaved(user.id, courseId)
    toast.info('Removed from saved courses.')
  }

  const enroll = (course) => {
    const result = actions.enroll(user.id, course.id)
    if (result.ok || result.reason === 'exists') {
      actions.toggleSaved(user.id, course.id)
      toast.success('Course added to your learning list.', { title: 'Enrolled' })
      navigate(`/learn/course/${course.id}`)
    } else toast.error('This course is not available for enrolment.')
  }

  return (
    <div>
      <PageHeader title="Saved Courses" description="Courses you’ve bookmarked for later. Enrol directly when you’re ready." />
      {items.length > 0 && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="saved-cat">Filter by category</label>
          <select id="saved-cat" className="input sm:w-60" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.filter((c) => items.some((i) => i.course.categoryId === c.id)).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label className="sr-only" htmlFor="saved-sort">Sort</label>
          <select id="saved-sort" className="input sm:w-52" value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([id, s]) => <option key={id} value={id}>Sort: {s.label}</option>)}
          </select>
          <p className="self-center text-sm text-muted sm:ml-auto">{filtered.length} saved</p>
        </div>
      )}
      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map(({ course, savedAt }) => (
            <article key={course.id} className="card flex gap-4 p-4">
              <SmartImage src={course.thumbnail} alt="" seed={course.id} fallbackLabel={course.title} className="aspect-square w-24 shrink-0 rounded-lg sm:w-28" />
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-xs font-semibold text-secondary">{course.providerName}</p>
                <Link to={`/courses/${course.slug}`} className="mt-0.5 line-clamp-2 font-semibold text-ink hover:underline">{course.title}</Link>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <RatingStars rating={course.rating} count={formatCompact(course.reviewCount)} />
                  <span>{course.difficulty} · {course.durationHours} hrs</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Saved {relativeTime(savedAt)}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-3">
                  {isEnrolled(course.id) ? (
                    <Link to={`/learn/course/${course.id}`} className="btn btn-secondary btn-sm"><PlayCircle className="h-4 w-4" aria-hidden="true" />Go to course</Link>
                  ) : (
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => enroll(course)}>Enroll now</button>
                  )}
                  <button type="button" className="btn btn-danger-ghost btn-sm" onClick={() => remove(course.id)}><Trash2 className="h-4 w-4" aria-hidden="true" />Remove</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card">
          <EmptyState
            icon={Heart}
            title={items.length ? 'No saved courses in this category' : 'No saved courses yet'}
            description="Tap the heart on any course card to save it for later."
            action={items.length ? <button type="button" className="btn btn-secondary" onClick={() => setCategory('')}>Show all</button> : <Link to="/learn/browse" className="btn btn-primary">Browse courses</Link>}
          />
        </div>
      )}
    </div>
  )
}
