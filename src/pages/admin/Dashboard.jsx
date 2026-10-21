import { Link } from 'react-router-dom'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Users, BookOpen, FilePen, ClipboardCheck, CircleCheck, Star, UserPlus, Plus, Megaphone, FileText, MessageSquareWarning, TriangleAlert, ArrowRight,
} from 'lucide-react'
import ChartCard from '../../components/charts/ChartCard'
import SmartImage from '../../components/common/SmartImage'
import { StatCard, StatusBadge, Avatar, DemoPill } from '../../components/common/ui'
import DashboardHero from '../../components/common/DashboardHero'
import { Reveal, AnimatedCounter } from '../../components/common/Motion'
import { axisProps, tooltipProps, CHART_PRIMARY, CHART_GRID } from '../../components/charts/chartTheme'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useNow } from '../../hooks/useUtils'
import { monthlySeries, platformSummary, enrollmentRows } from '../../utils/analytics'
import { countLessons } from '../../utils/learning'
import { relativeTime, formatDate } from '../../utils/format'

export default function AdminDashboard() {
  useDocumentTitle('Admin dashboard')
  const data = useData()
  const { courses, categories, reviews, submissions } = data
  const { user } = useAuth()
  const now = useNow()
  const summary = platformSummary(data, now)
  const rows = enrollmentRows(data)

  const trend = monthlySeries(rows, 'enrolledAt', now, 12).map((b) => ({ month: b.label, full: b.full, enrollments: b.value }))
  const popularity = courses
    .map((c) => ({ name: c.title.length > 28 ? `${c.title.slice(0, 26)}…` : c.title, full: c.title, enrollments: rows.filter((r) => r.courseId === c.id).length }))
    .filter((c) => c.enrollments > 0)
    .sort((a, b) => b.enrollments - a.enrollments)
    .slice(0, 6)
  const distribution = [...categories]
    .sort((a, b) => a.order - b.order)
    .map((cat) => ({ name: cat.name, courses: courses.filter((c) => c.categoryId === cat.id && c.status !== 'archived').length }))

  const recentActivity = [...rows].sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt)).slice(0, 6)
  const recentCourses = [...courses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4)
  const pendingReviews = reviews.filter((r) => r.status === 'pending').length
  const pendingSubs = submissions.filter((s) => s.status === 'submitted').length
  const attention = [
    ...courses.filter((c) => c.status === 'draft').map((c) => ({ id: c.id, title: c.title, reason: 'Draft — not yet published', to: `/admin/courses/${c.id}/edit` })),
    ...courses.filter((c) => c.status !== 'archived' && countLessons(c) === 0).map((c) => ({ id: `${c.id}-empty`, title: c.title, reason: 'No lessons in curriculum', to: `/admin/courses/${c.id}/edit` })),
    ...courses.filter((c) => c.status === 'published' && c.rating > 0 && c.rating < 4.6).map((c) => ({ id: `${c.id}-rating`, title: c.title, reason: `Lower rating (${c.rating.toFixed(1)})`, to: `/admin/courses/${c.id}/edit` })),
  ].slice(0, 6)

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow={`Admin console · ${formatDate(now, { weekday: 'long', month: 'long', day: 'numeric' })}`}
        title={`Welcome back, ${user.name.split(' ')[0]}`}
        subtitle={`${summary.published} published programmes, ${summary.enrollments} enrolments and ${pendingReviews + pendingSubs} items waiting for your review.`}
        aside={(
          <div className="grid grid-cols-2 gap-3">
            {[{ label: 'Completion', value: `${summary.completionRate}%` }, { label: 'Learners', value: String(summary.learners) }].map((k) => (
              <div key={k.label} className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-center backdrop-blur-md transition-transform hover:-translate-y-1">
                <p className="text-3xl font-extrabold text-white"><AnimatedCounter value={k.value} /></p>
                <p className="text-xs text-white/70">{k.label}</p>
              </div>
            ))}
          </div>
        )}
      >
        <Link to="/admin/courses/new" className="btn btn-accent rounded-full"><Plus className="h-4 w-4" aria-hidden="true" />New course</Link>
        <Link to="/admin/announcements" className="btn btn-on-dark rounded-full"><Megaphone className="h-4 w-4" aria-hidden="true" />Announce</Link>
        <Link to="/admin/analytics" className="btn btn-on-dark rounded-full">View analytics</Link>
      </DashboardHero>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Learners', value: summary.learners, icon: Users, hint: `${summary.activeLearners} active` },
          { label: 'Published courses', value: summary.published, icon: BookOpen, tone: 'success', hint: `${summary.archived} archived` },
          { label: 'Draft courses', value: summary.drafts, icon: FilePen, tone: 'warning', hint: 'Not visible to learners' },
          { label: 'Total enrollments', value: summary.enrollments, icon: ClipboardCheck, tone: 'info', hint: 'Recorded enrolment records' },
          { label: 'Course completion rate', value: `${summary.completionRate}%`, icon: CircleCheck, tone: 'success', hint: `${summary.completed} completed enrolments` },
          { label: 'Average course rating', value: summary.avgRating || '—', icon: Star, tone: 'accent', hint: 'Illustrative catalogue ratings' },
          { label: 'New learner registrations', value: summary.newLearners, icon: UserPlus, hint: 'Joined in the last 30 days' },
          { label: 'Awaiting moderation', value: pendingReviews + pendingSubs, icon: MessageSquareWarning, tone: 'warning', hint: `${pendingReviews} reviews · ${pendingSubs} submissions` },
        ].map((stat, i) => (
          <Reveal key={stat.label} delay={(i % 4) * 70}><StatCard {...stat} className="h-full" /></Reveal>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <ChartCard
          title="Enrollment trends"
          description="New enrolment records per month (last 12 months)"
          sample
          table={{ columns: [{ key: 'full', label: 'Month' }, { key: 'enrollments', label: 'Enrollments' }], rows: trend }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="enrFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_PRIMARY} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={CHART_PRIMARY} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} axisLine={false} allowDecimals={false} />
              <Tooltip {...tooltipProps} cursor={{ stroke: CHART_PRIMARY, strokeDasharray: '3 3' }} labelFormatter={(_, p) => p?.[0]?.payload?.full} />
              <Area type="monotone" dataKey="enrollments" name="Enrollments" stroke={CHART_PRIMARY} strokeWidth={2} fill="url(#enrFill)" activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Course popularity" description="Recorded enrolments per course (top 6)" table={{ columns: [{ key: 'full', label: 'Course' }, { key: 'enrollments', label: 'Enrollments' }], rows: popularity }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={popularity} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis type="number" {...axisProps} allowDecimals={false} />
              <YAxis type="category" dataKey="name" {...axisProps} width={150} tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip {...tooltipProps} labelFormatter={(_, p) => p?.[0]?.payload?.full} />
              <Bar dataKey="enrollments" name="Enrollments" fill={CHART_PRIMARY} radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.5fr]">
        <ChartCard title="Category distribution" description="Active courses (published or draft) per category" height={300} table={{ columns: [{ key: 'name', label: 'Category' }, { key: 'courses', label: 'Courses' }], rows: distribution }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis type="number" {...axisProps} allowDecimals={false} />
              <YAxis type="category" dataKey="name" {...axisProps} width={140} tick={{ fill: '#475569', fontSize: 11 }} />
              <Tooltip {...tooltipProps} />
              <Bar dataKey="courses" name="Courses" fill="#00829E" radius={[0, 4, 4, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <section className="card p-5" aria-labelledby="activity-title">
          <div className="flex items-center justify-between">
            <h2 id="activity-title" className="text-base font-semibold">Recent learner activity</h2>
            <Link to="/admin/enrollments" className="text-sm font-semibold text-secondary hover:underline">All enrollments</Link>
          </div>
          <ul className="mt-3 divide-y divide-line">
            {recentActivity.map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-3">
                <Avatar name={r.user.name} src={r.user.avatar} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm"><Link to={`/admin/learners/${r.user.id}`} className="font-medium text-ink hover:underline">{r.user.name}</Link> <span className="text-muted">studied</span> {r.course.title}</p>
                  <p className="text-xs text-muted">{relativeTime(r.lastAccessedAt, new Date(now))} · {r.progress}% complete</p>
                </div>
                <StatusBadge status={r.completed ? 'completed' : r.progress > 0 ? 'in-progress' : 'not-started'} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-1" aria-labelledby="quick-title">
          <h2 id="quick-title" className="text-base font-semibold">Quick actions</h2>
          <div className="mt-3 grid gap-2">
            {[
              { to: '/admin/courses/new', icon: Plus, label: 'Create a course' },
              { to: '/admin/announcements', icon: Megaphone, label: 'Publish an announcement' },
              { to: '/admin/assignments', icon: FileText, label: `Review submissions (${pendingSubs})` },
              { to: '/admin/reviews', icon: Star, label: `Moderate reviews (${pendingReviews})` },
            ].map((a) => (
              <Link key={a.to} to={a.to} className="flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-sm font-medium text-ink hover:border-primary hover:bg-primary-soft">
                <a.icon className="h-4 w-4 text-secondary" aria-hidden="true" />{a.label}<ArrowRight className="ml-auto h-4 w-4 text-muted" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>

        <section className="card p-5" aria-labelledby="recent-courses">
          <h2 id="recent-courses" className="text-base font-semibold">Recently added courses</h2>
          <ul className="mt-3 space-y-3">
            {recentCourses.map((c) => (
              <li key={c.id} className="flex items-center gap-3">
                <SmartImage src={c.thumbnail} alt="" seed={c.id} className="h-11 w-16 shrink-0 rounded-md" />
                <div className="min-w-0 flex-1">
                  <Link to={`/admin/courses/${c.id}/edit`} className="line-clamp-1 text-sm font-medium text-ink hover:underline">{c.title}</Link>
                  <p className="text-xs text-muted">Added {formatDate(c.createdAt)}</p>
                </div>
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5" aria-labelledby="attention-title">
          <h2 id="attention-title" className="flex items-center gap-2 text-base font-semibold"><TriangleAlert className="h-4 w-4 text-warning" aria-hidden="true" />Courses requiring attention</h2>
          <ul className="mt-3 divide-y divide-line">
            {attention.map((a) => (
              <li key={a.id} className="py-2.5">
                <Link to={a.to} className="text-sm font-medium text-ink hover:underline">{a.title}</Link>
                <p className="text-xs text-muted">{a.reason}</p>
              </li>
            ))}
            {!attention.length && <li className="py-6 text-center text-sm text-muted">Everything looks good.</li>}
          </ul>
        </section>
      </div>
      <p className="flex items-center gap-2 text-xs text-muted"><DemoPill />Metrics are calculated from local demo records and are not real business data.</p>
    </div>
  )
}
