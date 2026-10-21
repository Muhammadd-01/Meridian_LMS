import { Link } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  Users, BookOpen, FilePen, ClipboardCheck, CircleCheck, Star, UserPlus, Plus, Megaphone, FileText, MessageSquareWarning,
  TriangleAlert, ArrowRight, Activity, Trophy, PieChart as PieIcon, LineChart as LineIcon, Zap, Layers, Archive, Sparkles,
} from 'lucide-react'
import ChartCard from '../../components/charts/ChartCard'
import SmartImage from '../../components/common/SmartImage'
import Icon from '../../components/common/Icon'
import { StatusBadge, Avatar, DemoPill } from '../../components/common/ui'
import DashboardHero from '../../components/common/DashboardHero'
import { Reveal, AnimatedCounter } from '../../components/common/Motion'
import { KpiCard, Panel, RingProgress } from '../../components/admin/AdminWidgets'
import { axisProps, tooltipProps, CHART_PRIMARY, CHART_ACCENT, CHART_GRID, CHART_SERIES } from '../../components/charts/chartTheme'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useNow } from '../../hooks/useUtils'
import { monthlySeries, platformSummary, enrollmentRows } from '../../utils/analytics'
import { countLessons } from '../../utils/learning'
import { relativeTime, formatDate } from '../../utils/format'
import { cn } from '../../utils/cn'

const DAY = 24 * 60 * 60 * 1000

/** Percentage change between the last 30 days and the 30 days before (null when there is no baseline). */
function periodDelta(records, key, now) {
  const inWindow = (from, to) => records.filter((r) => {
    const t = r[key] ? new Date(r[key]).getTime() : NaN
    return t >= now - to * DAY && t < now - from * DAY
  }).length
  const current = inWindow(0, 30)
  const previous = inWindow(30, 60)
  if (!previous) return current ? null : 0
  return Math.round(((current - previous) / previous) * 100)
}

const STATUS_COLORS = { Completed: '#15803d', 'In progress': CHART_SERIES[0], 'Not started': '#CBD5E1' }

export default function AdminDashboard() {
  useDocumentTitle('Admin dashboard')
  const data = useData()
  const { courses, categories, reviews, submissions, users } = data
  const { user } = useAuth()
  const now = useNow()
  const summary = platformSummary(data, now)
  const rows = enrollmentRows(data)
  const learners = users.filter((u) => u.role === 'learner')

  const enrolSeries = monthlySeries(rows, 'enrolledAt', now, 12)
  const completeSeries = monthlySeries(rows, 'completedAt', now, 12)
  const trend = enrolSeries.map((b, i) => ({ month: b.label, full: b.full, enrollments: b.value, completions: completeSeries[i].value }))
  const joinSeries = monthlySeries(learners, 'joinedAt', now, 8).map((b) => b.value)
  const pendingReviews = reviews.filter((r) => r.status === 'pending').length
  const pendingSubs = submissions.filter((s) => s.status === 'submitted').length

  const status = [
    { name: 'Completed', value: rows.filter((r) => r.completed).length },
    { name: 'In progress', value: rows.filter((r) => !r.completed && r.progress > 0).length },
    { name: 'Not started', value: rows.filter((r) => r.progress === 0).length },
  ]
  const avgProgress = rows.length ? Math.round(rows.reduce((s, r) => s + r.progress, 0) / rows.length) : 0

  const topCourses = courses
    .map((c) => {
      const mine = rows.filter((r) => r.courseId === c.id)
      return { course: c, enrollments: mine.length, progress: mine.length ? Math.round(mine.reduce((s, r) => s + r.progress, 0) / mine.length) : 0 }
    })
    .filter((c) => c.enrollments > 0)
    .sort((a, b) => b.enrollments - a.enrollments || b.progress - a.progress)
    .slice(0, 6)
  const maxEnrol = Math.max(1, ...topCourses.map((c) => c.enrollments))

  const tracks = [...categories]
    .sort((a, b) => a.order - b.order)
    .map((cat) => ({ ...cat, count: courses.filter((c) => c.categoryId === cat.id && c.status !== 'archived').length }))
  const maxTrack = Math.max(1, ...tracks.map((t) => t.count))

  const recentActivity = [...rows].sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt)).slice(0, 6)
  const attention = [
    ...courses.filter((c) => c.status === 'draft').map((c) => ({ id: c.id, title: c.title, reason: 'Draft — not yet published', to: `/admin/courses/${c.id}/edit`, tone: 'warning' })),
    ...courses.filter((c) => c.status !== 'archived' && countLessons(c) === 0).map((c) => ({ id: `${c.id}-empty`, title: c.title, reason: 'No lessons in curriculum', to: `/admin/courses/${c.id}/edit`, tone: 'danger' })),
    ...courses.filter((c) => c.status === 'published' && c.rating > 0 && c.rating < 4.6).map((c) => ({ id: `${c.id}-rating`, title: c.title, reason: `Lower rating (${c.rating.toFixed(1)})`, to: `/admin/courses/${c.id}/edit`, tone: 'info' })),
  ].slice(0, 5)

  const kpis = [
    { label: 'Total learners', value: summary.learners, icon: Users, tone: 'primary', delta: periodDelta(learners, 'joinedAt', now), caption: `${summary.activeLearners} active · ${summary.newLearners} new this month`, series: joinSeries },
    { label: 'Enrolments', value: summary.enrollments, icon: ClipboardCheck, tone: 'info', delta: periodDelta(rows, 'enrolledAt', now), caption: 'vs. previous 30 days', series: enrolSeries.slice(-8).map((b) => b.value) },
    { label: 'Completions', value: summary.completed, icon: CircleCheck, tone: 'success', delta: periodDelta(rows, 'completedAt', now), caption: `${summary.completionRate}% completion rate`, series: completeSeries.slice(-8).map((b) => b.value) },
    { label: 'Awaiting review', value: pendingReviews + pendingSubs, icon: MessageSquareWarning, tone: 'accent', caption: `${pendingSubs} submissions · ${pendingReviews} reviews` },
  ]
  const strip = [
    { label: 'Published', value: summary.published, icon: BookOpen, color: 'text-success bg-success-soft' },
    { label: 'Drafts', value: summary.drafts, icon: FilePen, color: 'text-[#B45309] bg-warning-soft' },
    { label: 'Archived', value: summary.archived, icon: Archive, color: 'text-muted bg-slate-100' },
    { label: 'Avg. rating', value: summary.avgRating || '—', icon: Star, color: 'text-accent-ink bg-accent-soft' },
    { label: 'New learners (30d)', value: summary.newLearners, icon: UserPlus, color: 'text-primary bg-primary-soft' },
    { label: 'Training tracks', value: categories.length, icon: Layers, color: 'text-[#1F6F88] bg-info-soft' },
  ]
  const actions = [
    { to: '/admin/courses/new', icon: Plus, label: 'Create course', hint: 'Build a new programme', chip: 'from-primary to-deep' },
    { to: '/admin/announcements', icon: Megaphone, label: 'Announce', hint: 'Notify learners', chip: 'from-info to-secondary' },
    { to: '/admin/assignments', icon: FileText, label: 'Grade work', hint: `${pendingSubs} submissions waiting`, chip: 'from-accent to-[#d96f00]' },
    { to: '/admin/reviews', icon: Star, label: 'Moderate', hint: `${pendingReviews} reviews pending`, chip: 'from-[#7A5CC8] to-[#4c3a8a]' },
  ]

  return (
    <div className="space-y-6">
      <DashboardHero
        eyebrow={`Admin console · ${formatDate(now, { weekday: 'long', month: 'long', day: 'numeric' })}`}
        title={`Welcome back, ${user.name.split(' ')[0]}`}
        subtitle={`${summary.published} published programmes, ${summary.enrollments} enrolments and ${pendingReviews + pendingSubs} items waiting for your review.`}
        aside={(
          <div className="flex items-center gap-4 rounded-3xl border border-white/15 bg-white/10 p-4 pr-6 backdrop-blur-md">
            <RingProgress value={summary.completionRate} size={104}>
              <span className="text-2xl font-extrabold text-white"><AnimatedCounter value={`${summary.completionRate}%`} /></span>
              <span className="text-[10px] font-semibold tracking-wider text-white/60 uppercase">Complete</span>
            </RingProgress>
            <dl className="space-y-2 text-sm">
              <div><dt className="text-[11px] text-white/60">Learners</dt><dd className="text-lg font-bold text-white"><AnimatedCounter value={String(summary.learners)} /></dd></div>
              <div><dt className="text-[11px] text-white/60">Avg. progress</dt><dd className="text-lg font-bold text-white"><AnimatedCounter value={`${avgProgress}%`} /></dd></div>
            </dl>
          </div>
        )}
      >
        <Link to="/admin/courses/new" className="btn btn-accent rounded-full"><Plus className="h-4 w-4" aria-hidden="true" />New course</Link>
        <Link to="/admin/announcements" className="btn btn-on-dark rounded-full"><Megaphone className="h-4 w-4" aria-hidden="true" />Announce</Link>
        <Link to="/admin/analytics" className="btn btn-on-dark rounded-full">View analytics <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </DashboardHero>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <Reveal key={k.label} delay={i * 80} className="h-full"><KpiCard {...k} /></Reveal>
        ))}
      </div>

      <Reveal>
        <div className="card grid grid-cols-2 divide-line overflow-hidden sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
          {strip.map((s) => (
            <div key={s.label} className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50">
              <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110', s.color)}>
                <s.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-lg leading-tight font-bold text-ink tabular-nums">{/\d/.test(String(s.value)) ? <AnimatedCounter value={String(s.value)} /> : s.value}</p>
                <p className="truncate text-[11px] font-medium text-muted">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <ChartCard
          title="Enrolments and completions"
          description="Monthly records over the last 12 months"
          sample
          height={290}
          table={{ columns: [{ key: 'full', label: 'Month' }, { key: 'enrollments', label: 'Enrolments' }, { key: 'completions', label: 'Completions' }], rows: trend }}
          actions={<span className="hidden items-center gap-1 rounded-lg bg-primary-soft px-2 py-1 text-xs font-semibold text-primary sm:inline-flex"><LineIcon className="h-3.5 w-3.5" aria-hidden="true" />12 months</span>}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="enrFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_PRIMARY} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART_PRIMARY} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cmpFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_ACCENT} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={CHART_ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} axisLine={false} allowDecimals={false} />
              <Tooltip {...tooltipProps} cursor={{ stroke: CHART_PRIMARY, strokeDasharray: '3 3' }} labelFormatter={(_, p) => p?.[0]?.payload?.full} />
              <Legend verticalAlign="top" align="right" height={28} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="enrollments" name="Enrolments" stroke={CHART_PRIMARY} strokeWidth={2.5} fill="url(#enrFill)" activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
              <Area type="monotone" dataKey="completions" name="Completions" stroke={CHART_ACCENT} strokeWidth={2.5} fill="url(#cmpFill)" activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <Panel title="Enrolment status" description="Where learners are across all enrolments" icon={PieIcon}>
          <div className="relative mx-auto h-[190px] max-w-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={status} dataKey="value" nameKey="name" innerRadius="68%" outerRadius="95%" paddingAngle={3} stroke="none" startAngle={90} endAngle={-270}>
                  {status.map((s) => <Cell key={s.name} fill={STATUS_COLORS[s.name]} />)}
                </Pie>
                <Tooltip {...tooltipProps} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-ink"><AnimatedCounter value={String(rows.length)} /></span>
              <span className="text-xs text-muted">enrolments</span>
            </div>
          </div>
          <ul className="mt-4 space-y-2">
            {status.map((s) => (
              <li key={s.name} className="flex items-center gap-3 text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[s.name] }} aria-hidden="true" />
                <span className="flex-1 text-slate-600">{s.name}</span>
                <span className="font-semibold text-ink tabular-nums">{s.value}</span>
                <span className="w-10 text-right text-xs text-muted tabular-nums">{rows.length ? Math.round((s.value / rows.length) * 100) : 0}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Top programmes"
          description="Ranked by recorded enrolments, with average learner progress"
          icon={Trophy}
          action={<Link to="/admin/courses" className="text-sm font-semibold whitespace-nowrap text-secondary hover:underline">All courses</Link>}
          bodyClassName="p-2"
        >
          <ol>
            {topCourses.map((t, i) => (
              <li key={t.course.id}>
                <Link to={`/admin/courses/${t.course.id}/edit`} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50">
                  <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold', i === 0 ? 'bg-gradient-to-br from-accent to-[#ffb347] text-deep' : i < 3 ? 'bg-primary-soft text-primary' : 'bg-slate-100 text-muted')}>{i + 1}</span>
                  <SmartImage src={t.course.thumbnail} alt="" seed={t.course.id} className="h-10 w-14 shrink-0 rounded-lg" imgClassName="transition-transform duration-500 group-hover:scale-110" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink group-hover:text-primary">{t.course.title}</p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <span className="block h-full rounded-full bg-gradient-to-r from-primary to-info transition-[width] duration-700" style={{ width: `${(t.enrollments / maxEnrol) * 100}%` }} />
                    </div>
                  </div>
                  <div className="w-20 shrink-0 text-right">
                    <p className="text-sm font-bold text-ink tabular-nums">{t.enrollments}</p>
                    <p className="text-[11px] text-muted">{t.progress}% avg.</p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel
          title="Recent learner activity"
          description="Latest course activity across the platform"
          icon={Activity}
          action={<Link to="/admin/enrollments" className="text-sm font-semibold whitespace-nowrap text-secondary hover:underline">All enrolments</Link>}
        >
          <ol className="relative space-y-4 before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-px before:bg-line">
            {recentActivity.map((r) => (
              <li key={r.id} className="relative flex items-start gap-3">
                <Avatar name={r.user.name} src={r.user.avatar} size="sm" className="relative z-10" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-5">
                    <Link to={`/admin/learners/${r.user.id}`} className="font-semibold text-ink hover:underline">{r.user.name}</Link>{' '}
                    <span className="text-muted">studied</span> <span className="text-ink">{r.course.title}</span>
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1 w-24 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-success" style={{ width: `${r.progress}%` }} /></div>
                    <span className="text-xs text-muted">{r.progress}% · {relativeTime(r.lastAccessedAt, new Date(now))}</span>
                  </div>
                </div>
                <StatusBadge status={r.completed ? 'completed' : r.progress > 0 ? 'in-progress' : 'not-started'} />
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Quick actions" description="Common admin tasks" icon={Zap}>
          <div className="grid grid-cols-2 gap-3">
            {actions.map((a) => (
              <Link key={a.to} to={a.to} className="group relative overflow-hidden rounded-2xl border border-line bg-white p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_18px_30px_-18px_rgb(9_63_80/0.5)]">
                <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6', a.chip)}>
                  <a.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-semibold text-ink">{a.label}</p>
                <p className="text-[11px] text-muted">{a.hint}</p>
                <ArrowRight className="absolute top-4 right-3 h-4 w-4 -translate-x-1 text-secondary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="Training tracks" description="Active courses per track" icon={Layers} action={<Link to="/admin/categories" className="text-sm font-semibold text-secondary hover:underline">Manage</Link>}>
          <ul className="space-y-3.5">
            {tracks.map((t, i) => (
              <li key={t.id}>
                <div className="flex items-center gap-2.5 text-sm">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg text-white" style={{ background: CHART_SERIES[i % CHART_SERIES.length] }}>
                    <Icon name={t.icon} className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 truncate font-medium text-ink">{t.name}</span>
                  <span className="font-semibold text-ink tabular-nums">{t.count}</span>
                </div>
                <div className="mt-1.5 ml-[38px] h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <span className="block h-full rounded-full transition-[width] duration-700" style={{ width: `${(t.count / maxTrack) * 100}%`, background: CHART_SERIES[i % CHART_SERIES.length] }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Needs attention" description="Courses to review before they reach learners" icon={TriangleAlert}>
          <ul className="space-y-2">
            {attention.map((a) => (
              <li key={a.id}>
                <Link to={a.to} className="group flex items-start gap-3 rounded-xl border border-line px-3 py-2.5 transition-all hover:border-primary/30 hover:bg-primary-soft/40">
                  <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', { warning: 'bg-warning', danger: 'bg-danger', info: 'bg-info' }[a.tone])} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink group-hover:text-primary">{a.title}</span>
                    <span className="block text-xs text-muted">{a.reason}</span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
            {!attention.length && (
              <li className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success-soft text-success"><Sparkles className="h-5 w-5" aria-hidden="true" /></span>
                Everything looks good.
              </li>
            )}
          </ul>
        </Panel>
      </div>
      <p className="flex items-center gap-2 text-xs text-muted"><DemoPill />Metrics are calculated from local demo records and are not real business data.</p>
    </div>
  )
}
