import { computeProgress } from './learning'

const DAY = 24 * 60 * 60 * 1000

/** Buckets records into the last `months` calendar months by a date field. */
export function monthlySeries(records, dateKey, now, months = 12, valueFn = () => 1) {
  const end = new Date(now)
  const buckets = []
  for (let i = months - 1; i >= 0; i -= 1) {
    const d = new Date(end.getFullYear(), end.getMonth() - i, 1)
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString('en-US', { month: 'short' }), full: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), value: 0 })
  }
  records.forEach((r) => {
    const v = r[dateKey]
    if (!v) return
    const d = new Date(v)
    const bucket = buckets.find((b) => b.key === `${d.getFullYear()}-${d.getMonth()}`)
    if (bucket) bucket.value += valueFn(r)
  })
  return buckets
}

export function withinRange(value, range, now) {
  if (!range || range === 'all') return true
  const days = { '30d': 30, '90d': 90, '12m': 365 }[range]
  return new Date(value).getTime() >= now - days * DAY
}

export function enrollmentRows({ enrollments, courses, users }) {
  return enrollments
    .map((e) => {
      const course = courses.find((c) => c.id === e.courseId)
      const user = users.find((u) => u.id === e.userId)
      if (!course || !user) return null
      const progress = computeProgress(course, e).percent
      return { ...e, course, user, progress, completed: progress >= 100 }
    })
    .filter(Boolean)
}

export function platformSummary(data, now) {
  const learners = data.users.filter((u) => u.role === 'learner')
  const rows = enrollmentRows(data)
  const published = data.courses.filter((c) => c.status === 'published')
  const rated = published.filter((c) => c.rating > 0)
  return {
    learners: learners.length,
    activeLearners: learners.filter((u) => u.status === 'active').length,
    newLearners: learners.filter((u) => new Date(u.joinedAt).getTime() >= now - 30 * DAY).length,
    published: published.length,
    drafts: data.courses.filter((c) => c.status === 'draft').length,
    archived: data.courses.filter((c) => c.status === 'archived').length,
    enrollments: rows.length,
    completed: rows.filter((r) => r.completed).length,
    completionRate: rows.length ? Math.round((rows.filter((r) => r.completed).length / rows.length) * 100) : 0,
    avgRating: rated.length ? Math.round((rated.reduce((s, c) => s + c.rating, 0) / rated.length) * 10) / 10 : 0,
  }
}
