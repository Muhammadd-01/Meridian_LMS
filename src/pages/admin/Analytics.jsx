import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useState } from 'react'
import ChartCard from '../../components/charts/ChartCard'
import { Avatar, DemoPill, PageHeader, ProgressBar } from '../../components/common/ui'
import { axisProps, tooltipProps, CHART_PRIMARY, CHART_GRID, CHART_SERIES } from '../../components/charts/chartTheme'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useNow } from '../../hooks/useUtils'
import { enrollmentRows, monthlySeries, withinRange } from '../../utils/analytics'
import { formatMinutes, relativeTime } from '../../utils/format'

const RANGES = { '30d': 'Last 30 days', '90d': 'Last 90 days', '12m': 'Last 12 months', all: 'All time' }
const WEEK = 7 * 24 * 60 * 60 * 1000

export default function AdminAnalytics() {
  useDocumentTitle('Analytics')
  const data = useData()
  const { courses, categories, instructors, quizzes, quizAttempts, learningActivity, users } = data
  const now = useNow()
  const [range, setRange] = useState('12m')
  const [category, setCategory] = useState('')
  const [courseId, setCourseId] = useState('')

  const inScope = (cId) => {
    const course = courses.find((c) => c.id === cId)
    return course && (!category || course.categoryId === category) && (!courseId || course.id === courseId)
  }
  const rows = enrollmentRows(data).filter((r) => inScope(r.courseId) && withinRange(r.enrolledAt, range, now))
  const activity = learningActivity.filter((a) => inScope(a.courseId) && withinRange(a.date, range, now))
  const attempts = quizAttempts.filter((a) => inScope(a.courseId) && withinRange(a.submittedAt, range, now))
  const months = range === '30d' ? 2 : range === '90d' ? 4 : 12

  const enrolSeries = monthlySeries(rows, 'enrolledAt', now, months)
  const completionSeries = monthlySeries(rows.filter((r) => r.completedAt), 'completedAt', now, months)
  const trend = enrolSeries.map((b, i) => ({ month: b.label, full: b.full, Enrollments: b.value, Completions: completionSeries[i].value }))

  const engagement = Array.from({ length: 12 }, (_, i) => {
    const start = now - (12 - i) * WEEK
    const end = start + WEEK
    const inWeek = activity.filter((a) => {
      const t = new Date(`${a.date}T12:00:00`).getTime()
      return t >= start && t < end
    })
    return { week: new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), learners: new Set(inWeek.map((a) => a.userId)).size, minutes: inWeek.reduce((s, a) => s + a.minutes, 0) }
  })

  const popularity = courses.filter((c) => inScope(c.id)).map((c) => ({ name: c.title.length > 26 ? `${c.title.slice(0, 24)}…` : c.title, full: c.title, enrollments: rows.filter((r) => r.courseId === c.id).length })).filter((c) => c.enrollments).sort((a, b) => b.enrollments - a.enrollments).slice(0, 8)

  const categoryPerf = [...categories].sort((a, b) => a.order - b.order).map((cat) => {
    const r = rows.filter((x) => x.course.categoryId === cat.id)
    return { name: cat.name, enrollments: r.length, completionRate: r.length ? Math.round((r.filter((x) => x.completed).length / r.length) * 100) : 0 }
  }).filter((c) => !category || c.enrollments || categories.find((x) => x.name === c.name)?.id === category)

  const instructorPerf = instructors.map((ins) => {
    const ids = courses.filter((c) => c.instructorId === ins.id).map((c) => c.id)
    const r = rows.filter((x) => ids.includes(x.courseId))
    return { ins, courses: ids.length, enrollments: r.length, avgProgress: r.length ? Math.round(r.reduce((s, x) => s + x.progress, 0) / r.length) : 0 }
  }).sort((a, b) => b.enrollments - a.enrollments)

  const scores = quizzes.map((q) => {
    const a = attempts.filter((x) => x.quizId === q.id)
    return { name: q.title.split(' ').slice(0, 2).join(' '), full: q.title, avg: a.length ? Math.round(a.reduce((s, x) => s + x.score, 0) / a.length) : 0, attempts: a.length }
  }).filter((s) => s.attempts)

  const ratingBuckets = ['< 4.5', '4.5–4.6', '4.7', '4.8', '4.9+'].map((label) => ({ label, courses: 0 }))
  courses.filter((c) => c.status === 'published' && c.rating && inScope(c.id)).forEach((c) => {
    const idx = c.rating < 4.5 ? 0 : c.rating < 4.7 ? 1 : c.rating < 4.8 ? 2 : c.rating < 4.9 ? 3 : 4
    ratingBuckets[idx].courses += 1
  })

  const learnerTable = users.filter((u) => u.role === 'learner').map((u) => {
    const mine = activity.filter((a) => a.userId === u.id)
    const last = mine.reduce((m, a) => (a.date > m ? a.date : m), '')
    return { u, minutes: mine.reduce((s, a) => s + a.minutes, 0), sessions: mine.length, enrollments: rows.filter((r) => r.userId === u.id).length, last }
  }).filter((x) => x.minutes || x.enrollments).sort((a, b) => b.minutes - a.minutes).slice(0, 10)

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Calculated from local demo records. Time series reflect generated sample activity." breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Analytics' }]} actions={<DemoPill>Sample data</DemoPill>} />

      <div className="card flex flex-col gap-3 p-4 md:flex-row md:flex-wrap md:items-center">
        <p className="text-sm font-semibold text-ink">Filters</p>
        <select className="input md:w-44" aria-label="Date range" value={range} onChange={(e) => setRange(e.target.value)}>{Object.entries(RANGES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <select className="input md:w-52" aria-label="Category" value={category} onChange={(e) => { setCategory(e.target.value); setCourseId('') }}>
          <option value="">All categories</option>{[...categories].sort((a, b) => a.order - b.order).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input md:w-64" aria-label="Course" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          <option value="">All courses</option>{courses.filter((c) => !category || c.categoryId === category).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <p className="text-xs text-muted md:ml-auto">{rows.length} enrolments · {attempts.length} quiz attempts in scope</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Enrollment & completion trends" description="Per month, by enrolment and completion date" sample table={{ columns: [{ key: 'full', label: 'Month' }, { key: 'Enrollments', label: 'Enrollments' }, { key: 'Completions', label: 'Completions' }], rows: trend }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} axisLine={false} allowDecimals={false} />
              <Tooltip {...tooltipProps} cursor={{ stroke: '#94A3B8', strokeDasharray: '3 3' }} labelFormatter={(_, p) => p?.[0]?.payload?.full} />
              <Legend iconType="plainline" wrapperStyle={{ fontSize: 12, color: '#475569' }} />
              <Line type="monotone" dataKey="Enrollments" stroke={CHART_SERIES[0]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="Completions" stroke={CHART_SERIES[1]} strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Learner engagement" description="Distinct active learners per week (last 12 weeks)" sample table={{ columns: [{ key: 'week', label: 'Week ending' }, { key: 'learners', label: 'Active learners' }, { key: 'minutes', label: 'Study minutes' }], rows: engagement }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagement} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis dataKey="week" {...axisProps} interval={1} />
              <YAxis {...axisProps} axisLine={false} allowDecimals={false} />
              <Tooltip {...tooltipProps} formatter={(v, n, p) => (n === 'learners' ? [`${v} learners · ${formatMinutes(p.payload.minutes)}`, 'Active'] : [v, n])} />
              <Bar dataKey="learners" fill={CHART_PRIMARY} radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Course popularity" description="Recorded enrolments in the selected range" table={{ columns: [{ key: 'full', label: 'Course' }, { key: 'enrollments', label: 'Enrollments' }], rows: popularity }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={popularity} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis type="number" {...axisProps} allowDecimals={false} />
              <YAxis type="category" dataKey="name" {...axisProps} width={150} tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip {...tooltipProps} labelFormatter={(_, p) => p?.[0]?.payload?.full} />
              <Bar dataKey="enrollments" fill={CHART_SERIES[0]} radius={[0, 4, 4, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Assessment scores" description="Average quiz score (%) in the selected range" table={{ columns: [{ key: 'full', label: 'Quiz' }, { key: 'avg', label: 'Average %' }, { key: 'attempts', label: 'Attempts' }], rows: scores }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scores} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis dataKey="name" {...axisProps} interval={0} tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis {...axisProps} axisLine={false} domain={[0, 100]} unit="%" />
              <Tooltip {...tooltipProps} labelFormatter={(_, p) => p?.[0]?.payload?.full} formatter={(v) => [`${v}%`, 'Average score']} />
              <Bar dataKey="avg" fill={CHART_PRIMARY} radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Category performance" description="Enrolments per category; completion rate in the table view" table={{ columns: [{ key: 'name', label: 'Category' }, { key: 'enrollments', label: 'Enrollments' }, { key: 'completionRate', label: 'Completion %' }], rows: categoryPerf }} height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryPerf} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis type="number" {...axisProps} allowDecimals={false} />
              <YAxis type="category" dataKey="name" {...axisProps} width={140} tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip {...tooltipProps} formatter={(v, n, p) => [`${v} enrolments · ${p.payload.completionRate}% completed`, 'Category']} />
              <Bar dataKey="enrollments" fill={CHART_SERIES[2]} radius={[0, 4, 4, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Course ratings" description="Published courses by illustrative catalogue rating" table={{ columns: [{ key: 'label', label: 'Rating band' }, { key: 'courses', label: 'Courses' }], rows: ratingBuckets }} height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingBuckets} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis dataKey="label" {...axisProps} />
              <YAxis {...axisProps} axisLine={false} allowDecimals={false} />
              <Tooltip {...tooltipProps} formatter={(v) => [v, 'Courses']} />
              <Bar dataKey="courses" fill={CHART_SERIES[1]} radius={[4, 4, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card overflow-hidden" aria-labelledby="ins-perf">
          <h2 id="ins-perf" className="border-b border-line px-5 py-4 text-base font-semibold">Instructor performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-600 uppercase"><tr><th scope="col" className="px-5 py-2">Instructor</th><th scope="col" className="px-3 py-2">Courses</th><th scope="col" className="px-3 py-2">Enrolments</th><th scope="col" className="px-3 py-2">Avg. progress</th><th scope="col" className="px-3 py-2">Rating*</th></tr></thead>
              <tbody className="divide-y divide-line">
                {instructorPerf.map(({ ins, courses: n, enrollments, avgProgress }) => (
                  <tr key={ins.id}>
                    <td className="px-5 py-2.5"><div className="flex items-center gap-2"><Avatar name={ins.name} src={ins.avatar} size="xs" /><span className="whitespace-nowrap">{ins.name}</span></div></td>
                    <td className="px-3 py-2.5 tabular-nums">{n}</td>
                    <td className="px-3 py-2.5 tabular-nums">{enrollments}</td>
                    <td className="px-3 py-2.5"><div className="flex w-28 items-center gap-2"><ProgressBar value={avgProgress} size="sm" className="flex-1" label="Average progress" /><span className="text-xs">{avgProgress}%</span></div></td>
                    <td className="px-3 py-2.5 tabular-nums">{ins.rating || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="px-5 py-2 text-[11px] text-muted">*Illustrative instructor ratings.</p>
        </section>

        <section className="card overflow-hidden" aria-labelledby="learner-act">
          <h2 id="learner-act" className="border-b border-line px-5 py-4 text-base font-semibold">Learner activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-600 uppercase"><tr><th scope="col" className="px-5 py-2">Learner</th><th scope="col" className="px-3 py-2">Study time</th><th scope="col" className="px-3 py-2">Sessions</th><th scope="col" className="px-3 py-2">Enrolments</th><th scope="col" className="px-3 py-2">Last active</th></tr></thead>
              <tbody className="divide-y divide-line">
                {learnerTable.map(({ u, minutes, sessions, enrollments, last }) => (
                  <tr key={u.id}>
                    <td className="px-5 py-2.5"><div className="flex items-center gap-2"><Avatar name={u.name} src={u.avatar} size="xs" /><span className="whitespace-nowrap">{u.name}</span></div></td>
                    <td className="px-3 py-2.5 whitespace-nowrap">{formatMinutes(minutes)}</td>
                    <td className="px-3 py-2.5 tabular-nums">{sessions}</td>
                    <td className="px-3 py-2.5 tabular-nums">{enrollments}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap text-muted">{last ? relativeTime(`${last}T12:00:00`, new Date(now)) : '—'}</td>
                  </tr>
                ))}
                {!learnerTable.length && <tr><td colSpan={5} className="px-5 py-8 text-center text-muted">No activity in this range.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
