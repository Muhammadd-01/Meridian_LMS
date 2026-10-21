import { useMemo, useRef, useState, useTransition } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, List, SlidersHorizontal, X, SearchX } from 'lucide-react'
import CourseCard from '../../components/courses/CourseCard'
import FilterSidebar from '../../components/courses/FilterSidebar'
import Pagination from '../../components/common/Pagination'
import SearchInput from '../../components/common/SearchInput'
import Modal from '../../components/common/Modal'
import { Reveal } from '../../components/common/Motion'
import { Breadcrumbs, CourseCardSkeleton, EmptyState, PageHeader } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { COURSE_TYPES, DIFFICULTIES } from '../../data/courses'
import { DURATION_BUCKETS, RATING_OPTIONS, normalise, paginate, searchItems, toggleInList } from '../../utils/query'
import { cn } from '../../utils/cn'

const SORTS = [
  { id: 'relevance', label: 'Most relevant' },
  { id: 'popular', label: 'Most popular' },
  { id: 'rating', label: 'Highest rated' },
  { id: 'newest', label: 'Newest' },
  { id: 'shortest', label: 'Duration: shortest' },
  { id: 'longest', label: 'Duration: longest' },
]

const GROUP_KEYS = ['category', 'level', 'duration', 'rating', 'type', 'language', 'access']

function readList(params, key) {
  return (params.get(key) || '').split(',').map((s) => s.trim()).filter(Boolean)
}

function makePredicates(categories) {
  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]))
  return {
    category: (course, values) => values.some((slug) => bySlug[slug] === course.categoryId),
    level: (course, values) => values.includes(course.difficulty),
    duration: (course, values) => values.some((id) => DURATION_BUCKETS.find((b) => b.id === id)?.test(course.durationHours)),
    rating: (course, values) => course.rating >= Math.max(...values.map(Number)),
    type: (course, values) => values.includes(course.courseType),
    language: (course, values) => values.includes(course.language),
    access: (course, values) => values.includes(course.access),
  }
}

export default function Catalog({ embedded = false }) {
  const { courses, categories, instructors, settings } = useData()
  const [params, setParams] = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [mobileFilters, setMobileFilters] = useState(false)
  const [searchDraft, setSearchDraft] = useState(params.get('q') || '')
  const [lastQ, setLastQ] = useState(params.get('q') || '')

  const q = params.get('q') || ''
  // Keep the input in sync when the query changes from elsewhere (header search, links).
  if (q !== lastQ) {
    setLastQ(q)
    setSearchDraft(q)
  }

  const sort = params.get('sort') || 'relevance'
  const view = params.get('view') === 'list' ? 'list' : 'grid'
  const page = Number(params.get('page')) || 1
  const pageSize = settings.catalogPageSize || 12
  const selected = Object.fromEntries(GROUP_KEYS.map((k) => [k, readList(params, k)]))
  const activeCount = GROUP_KEYS.reduce((n, k) => n + selected[k].length, 0)

  const category = categories.find((c) => selected.category.length === 1 && c.slug === selected.category[0])
  useDocumentTitle(category ? `${category.name} courses` : q ? `Search: ${q}` : 'Course catalogue')

  const searchTimer = useRef(null)
  const update = (changes, { resetPage = true, replace = false } = {}) => {
    startTransition(() => {
      setParams((prev) => {
        const next = new URLSearchParams(prev)
        Object.entries(changes).forEach(([key, value]) => {
          const v = Array.isArray(value) ? value.join(',') : value
          if (v === '' || v == null || (key === 'sort' && v === 'relevance') || (key === 'view' && v === 'grid')) next.delete(key)
          else next.set(key, v)
        })
        if (resetPage) next.delete('page')
        return next
      }, { replace })
    })
  }

  const published = useMemo(() => courses.filter((c) => c.status === 'published'), [courses])
  const predicates = useMemo(() => makePredicates(categories), [categories])

  const searched = useMemo(() => searchItems(published, q, [
    'title', 'shortDescription', 'providerName', 'courseType', 'difficulty',
    (c) => instructors.find((i) => i.id === c.instructorId)?.name,
    (c) => categories.find((cat) => cat.id === c.categoryId)?.name,
    (c) => c.skills, (c) => c.tags,
  ]), [published, q, instructors, categories])

  const filterBy = (items, except) => items.filter((course) => GROUP_KEYS.every((key) => key === except || !selected[key].length || predicates[key](course, selected[key])))
  const filtered = filterBy(searched)

  const sorted = (() => {
    const list = [...filtered]
    const term = normalise(q)
    switch (sort) {
      case 'popular': return list.sort((a, b) => b.enrollmentCount - a.enrollmentCount)
      case 'rating': return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
      case 'newest': return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      case 'shortest': return list.sort((a, b) => a.durationHours - b.durationHours)
      case 'longest': return list.sort((a, b) => b.durationHours - a.durationHours)
      default:
        return list.sort((a, b) => {
          const score = (c) => (term && normalise(c.title).includes(term) ? 100 : 0) + (c.featured ? 10 : 0) + c.rating
          return score(b) - score(a)
        })
    }
  })()

  const pageData = paginate(sorted, page, pageSize)

  const countFor = (key, test) => filterBy(searched, key).filter(test).length
  const languages = [...new Set(published.map((c) => c.language))].sort()
  const groups = [
    { id: 'category', label: 'Category', type: 'checkbox', options: [...categories].sort((a, b) => a.order - b.order).map((c) => ({ value: c.slug, label: c.name, count: countFor('category', (x) => x.categoryId === c.id) })) },
    { id: 'level', label: 'Difficulty', type: 'checkbox', options: DIFFICULTIES.map((d) => ({ value: d, label: d, count: countFor('level', (x) => x.difficulty === d) })) },
    { id: 'duration', label: 'Duration', type: 'checkbox', options: DURATION_BUCKETS.map((b) => ({ value: b.id, label: b.label, count: countFor('duration', (x) => b.test(x.durationHours)) })) },
    { id: 'rating', label: 'Rating', type: 'radio', options: RATING_OPTIONS.map((r) => ({ value: r.id, label: r.label, count: countFor('rating', (x) => x.rating >= r.min) })) },
    { id: 'type', label: 'Course type', type: 'checkbox', options: COURSE_TYPES.map((t) => ({ value: t, label: t, count: countFor('type', (x) => x.courseType === t) })) },
    { id: 'language', label: 'Language', type: 'checkbox', options: languages.map((l) => ({ value: l, label: l, count: countFor('language', (x) => x.language === l) })) },
    { id: 'access', label: 'Price & access', type: 'checkbox', options: [{ value: 'free', label: 'Free' }, { value: 'paid', label: 'Paid (demo price — nothing is charged)' }].map((o) => ({ ...o, count: countFor('access', (x) => x.access === o.value) })) },
  ]

  const onToggle = (groupId, value) => {
    const group = groups.find((g) => g.id === groupId)
    const current = selected[groupId]
    const next = group.type === 'radio' ? (current.includes(value) ? [] : [value]) : toggleInList(current, value)
    update({ [groupId]: next })
  }

  const clearAll = () => update(Object.fromEntries(GROUP_KEYS.map((k) => [k, ''])))
  const chips = groups.flatMap((g) => selected[g.id].map((value) => ({ groupId: g.id, value, label: g.options.find((o) => o.value === value)?.label || value })))

  const submitSearch = (value, options) => {
    clearTimeout(searchTimer.current)
    update({ q: value.trim() ? value : '' }, options)
  }

  const header = embedded ? (
    <PageHeader title="Browse courses" description="Search the full catalogue and enrol in new courses without leaving your dashboard." />
  ) : (
    <div className="border-b border-line bg-white">
      <div className="container-page py-8">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Courses', to: category ? '/courses' : undefined }, ...(category ? [{ label: category.name }] : [])]} />
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">{category ? `${category.name} courses` : q ? `Results for “${q}”` : 'Explore the course catalogue'}</h1>
        <p className="mt-1 max-w-2xl text-muted">{category ? category.description : 'Search by title, instructor, provider or skill — then refine with filters.'}</p>
      </div>
    </div>
  )

  return (
    <div>
      {header}
      <div className={cn(!embedded && 'container-page py-8')}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            className="flex-1"
            value={searchDraft}
            onChange={(value) => {
              setSearchDraft(value)
              clearTimeout(searchTimer.current)
              searchTimer.current = setTimeout(() => submitSearch(value, { replace: true }), 300)
            }}
            onSubmit={submitSearch}
            placeholder="Search by title, instructor, provider or skill"
            label="Search courses"
          />
          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-secondary lg:hidden" onClick={() => setMobileFilters(true)}>
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Filters {activeCount > 0 && <span className="rounded-full bg-primary px-1.5 text-xs text-white">{activeCount}</span>}
            </button>
            <label className="sr-only" htmlFor="catalog-sort">Sort courses</label>
            <select id="catalog-sort" className="input w-auto" value={sort} onChange={(e) => update({ sort: e.target.value })}>
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <div className="hidden rounded-lg border border-line bg-white p-0.5 sm:flex" role="group" aria-label="View mode">
              <button type="button" onClick={() => update({ view: 'grid' }, { resetPage: false })} aria-pressed={view === 'grid'} className={cn('rounded-md p-2', view === 'grid' ? 'bg-primary text-white' : 'text-muted hover:text-ink')} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></button>
              <button type="button" onClick={() => update({ view: 'list' }, { resetPage: false })} aria-pressed={view === 'list'} className={cn('rounded-md p-2', view === 'list' ? 'bg-primary text-white' : 'text-muted hover:text-ink')} aria-label="List view"><List className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block" aria-label="Course filters">
            <div className="card sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto p-5 scrollbar-thin">
              <FilterSidebar groups={groups} selected={selected} onToggle={onToggle} onClear={clearAll} activeCount={activeCount} />
            </div>
          </aside>

          <section aria-labelledby="results-heading" aria-busy={isPending}>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h2 id="results-heading" className="text-sm text-muted" aria-live="polite">
                <span className="font-semibold text-ink">{sorted.length}</span> {sorted.length === 1 ? 'course' : 'courses'} found
              </h2>
              {chips.map((chip) => (
                <button key={`${chip.groupId}-${chip.value}`} type="button" onClick={() => onToggle(chip.groupId, chip.value)} className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary hover:bg-[#d9eaee]" aria-label={`Remove filter ${chip.label}`}>
                  {chip.label} <X className="h-3 w-3" aria-hidden="true" />
                </button>
              ))}
              {q && (
                <button type="button" onClick={() => submitSearch('')} className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink hover:bg-slate-50" aria-label="Clear search">
                  “{q}” <X className="h-3 w-3" aria-hidden="true" />
                </button>
              )}
              {(activeCount > 0 || q) && (
                <button type="button" onClick={() => { setSearchDraft(''); update({ q: '', ...Object.fromEntries(GROUP_KEYS.map((k) => [k, ''])) }) }} className="text-xs font-semibold text-secondary hover:underline">Clear all</button>
              )}
            </div>

            {isPending ? (
              <div className={cn('grid gap-5', view === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : '')}>
                {Array.from({ length: 6 }, (_, i) => <CourseCardSkeleton key={i} />)}
              </div>
            ) : pageData.items.length ? (
              <div className={cn('grid gap-5', view === 'grid' ? 'sm:grid-cols-2 xl:grid-cols-3' : '')}>
                {pageData.items.map((course, i) => (
                  <Reveal key={`${course.id}-${view}`} delay={(i % 6) * 60} className="h-full">
                    <CourseCard course={course} variant={view} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="card">
                <EmptyState
                  icon={SearchX}
                  title="No courses match your search"
                  description={q ? `We couldn’t find courses for “${q}” with the selected filters. Try a broader term or remove a filter.` : 'Try removing a filter to see more courses.'}
                  action={<button type="button" className="btn btn-primary" onClick={() => { setSearchDraft(''); update({ q: '', ...Object.fromEntries(GROUP_KEYS.map((k) => [k, ''])) }) }}>Clear search and filters</button>}
                />
              </div>
            )}

            <Pagination
              className="mt-8"
              page={pageData.page}
              totalPages={pageData.totalPages}
              total={pageData.total}
              start={pageData.start}
              end={pageData.end}
              onChange={(p) => {
                update({ page: p > 1 ? String(p) : '' }, { resetPage: false })
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          </section>
        </div>
      </div>

      <Modal
        open={mobileFilters}
        onClose={() => setMobileFilters(false)}
        variant="drawer"
        title="Filter courses"
        footer={<button type="button" className="btn btn-primary w-full" onClick={() => setMobileFilters(false)}>Show {sorted.length} results</button>}
      >
        <FilterSidebar groups={groups} selected={selected} onToggle={onToggle} onClear={clearAll} activeCount={activeCount} />
      </Modal>
    </div>
  )
}
