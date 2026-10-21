import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Library, SearchX } from 'lucide-react'
import EnrolledCourseCard from '../../components/learning/EnrolledCourseCard'
import Tabs from '../../components/common/Tabs'
import SearchInput from '../../components/common/SearchInput'
import { EmptyState, PageHeader } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { computeProgress, enrollmentStatus } from '../../utils/learning'
import { searchItems, sortItems } from '../../utils/query'

const TABS = [
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'not-started', label: 'Not Started' },
  { id: 'archived', label: 'Archived' },
]

const SORTS = {
  recent: { label: 'Last accessed', get: (x) => new Date(x.enrollment.lastAccessedAt).getTime(), dir: 'desc' },
  enrolled: { label: 'Date enrolled', get: (x) => new Date(x.enrollment.enrolledAt).getTime(), dir: 'desc' },
  progress: { label: 'Progress', get: (x) => x.percent, dir: 'desc' },
  title: { label: 'Title (A–Z)', get: (x) => x.course.title, dir: 'asc' },
}

export default function MyLearning() {
  useDocumentTitle('My learning')
  const { courses, enrollments, categories } = useData()
  const { user } = useAuth()
  const [tab, setTab] = useState('in-progress')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('recent')

  const items = enrollments
    .filter((e) => e.userId === user.id)
    .map((enrollment) => {
      const course = courses.find((c) => c.id === enrollment.courseId)
      return course ? { enrollment, course, status: enrollmentStatus(course, enrollment), percent: computeProgress(course, enrollment).percent } : null
    })
    .filter(Boolean)

  const counts = Object.fromEntries(TABS.map((t) => [t.id, items.filter((i) => i.status === t.id).length]))
  const searched = searchItems(items.filter((i) => i.status === tab && (!category || i.course.categoryId === category)), query, [
    (x) => x.course.title, (x) => x.course.providerName, (x) => x.course.skills,
  ])
  const sorted = sortItems(searched, SORTS[sort].get, SORTS[sort].dir)
  const usedCategories = categories.filter((c) => items.some((i) => i.course.categoryId === c.id))

  return (
    <div>
      <PageHeader title="My Learning" description="Everything you’re enrolled in, organised by status." actions={<Link to="/learn/browse" className="btn btn-primary">Find a new course</Link>} />
      <Tabs tabs={TABS.map((t) => ({ ...t, count: counts[t.id] }))} value={tab} onChange={setTab} ariaLabel="Course status" />
      <div className="mt-5 flex flex-col gap-3 md:flex-row">
        <SearchInput className="flex-1" value={query} onChange={setQuery} placeholder="Search your courses" label="Search your courses" />
        <label className="sr-only" htmlFor="ml-category">Filter by category</label>
        <select id="ml-category" className="input md:w-56" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {usedCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label className="sr-only" htmlFor="ml-sort">Sort courses</label>
        <select id="ml-sort" className="input md:w-48" value={sort} onChange={(e) => setSort(e.target.value)}>
          {Object.entries(SORTS).map(([id, s]) => <option key={id} value={id}>Sort: {s.label}</option>)}
        </select>
      </div>
      <div className="mt-5 space-y-3" role="tabpanel">
        {sorted.map(({ course, enrollment }) => <EnrolledCourseCard key={enrollment.id} course={course} enrollment={enrollment} />)}
        {!sorted.length && (
          <div className="card">
            {query || category ? (
              <EmptyState icon={SearchX} title="No matching courses" description="Try a different search or category." action={<button type="button" className="btn btn-secondary" onClick={() => { setQuery(''); setCategory('') }}>Clear filters</button>} />
            ) : (
              <EmptyState
                icon={Library}
                title={{ 'in-progress': 'Nothing in progress', completed: 'No completed courses yet', 'not-started': 'No unstarted courses', archived: 'Nothing archived' }[tab]}
                description={tab === 'archived' ? 'Archive courses you want to set aside — you can restore them any time.' : 'Enrol in a course from the catalogue to see it here.'}
                action={tab !== 'archived' && <Link to="/learn/browse" className="btn btn-primary">Browse courses</Link>}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
