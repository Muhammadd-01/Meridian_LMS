import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  BookOpen, CircleCheck, Clock, Flame, PlayCircle, Compass, Heart, Award, CalendarClock, ArrowRight, Target, Sparkles, Rocket,
} from 'lucide-react'
import CourseCard from '../../components/courses/CourseCard'
import EnrolledCourseCard from '../../components/learning/EnrolledCourseCard'
import ChartCard from '../../components/charts/ChartCard'
import DashboardHero from '../../components/common/DashboardHero'
import { Reveal } from '../../components/common/Motion'
import SmartImage from '../../components/common/SmartImage'
import Icon from '../../components/common/Icon'
import { EmptyState, ProgressBar, StatCard, StatusBadge } from '../../components/common/ui'
import { NOTIFICATION_ICONS } from '../../components/navigation/notificationIcons'
import { axisProps, tooltipProps, CHART_PRIMARY, CHART_GRID } from '../../components/charts/chartTheme'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useNow } from '../../hooks/useUtils'
import {
  getLearnerStats, weeklyActivity, computeProgress, enrollmentStatus, getAllLessons, getAchievements, getDeadlines,
} from '../../utils/learning'
import { formatDate, relativeTime, daysBetween } from '../../utils/format'

function greeting(now) {
  const h = new Date(now).getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

export default function LearnerDashboard() {
  useDocumentTitle('Dashboard')
  const data = useData()
  const { courses, enrollments, categories, notifications, learningActivity } = data
  const { user } = useAuth()
  const now = useNow()

  const stats = getLearnerStats(data, user.id, now)
  const mine = enrollments
    .filter((e) => e.userId === user.id && !e.archived)
    .map((e) => ({ enrollment: e, course: courses.find((c) => c.id === e.courseId) }))
    .filter((x) => x.course)
    .sort((a, b) => new Date(b.enrollment.lastAccessedAt) - new Date(a.enrollment.lastAccessedAt))
  const active = mine.filter(({ course, enrollment }) => enrollmentStatus(course, enrollment) !== 'completed')
  const resume = active[0]
  const week = weeklyActivity(learningActivity, user.id, now)
  const goalMinutes = (user.weeklyGoalHours || 0) * 60
  const goalPct = goalMinutes ? Math.min(100, Math.round((stats.weekMinutes / goalMinutes) * 100)) : 0
  const deadlines = getDeadlines(data, user.id).filter((d) => !d.submission || d.submission.status === 'resubmit').slice(0, 4)
  const achievements = getAchievements(data, user.id, now).filter((a) => a.unlocked).slice(-3).reverse()
  const recentNotes = notifications.filter((n) => n.userId === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4)

  const enrolledIds = new Set(enrollments.filter((e) => e.userId === user.id).map((e) => e.courseId))
  const interestCats = new Set([
    ...categories.filter((c) => (user.interests || []).includes(c.name)).map((c) => c.id),
    ...mine.map((m) => m.course.categoryId),
  ])
  const recommended = courses
    .filter((c) => c.status === 'published' && !enrolledIds.has(c.id))
    .sort((a, b) => (interestCats.has(b.categoryId) - interestCats.has(a.categoryId)) || b.rating - a.rating)
    .slice(0, 4)

  const firstName = user.name.split(' ')[0]

  if (!mine.length) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-sm text-muted">{greeting(now)},</p>
          <h1 className="text-2xl font-bold sm:text-3xl">Welcome to Meridian, {firstName}!</h1>
        </div>
        <div className="card overflow-hidden">
          <EmptyState
            icon={Rocket}
            title="Start your learning journey"
            description="You haven’t enrolled in any courses yet. Explore the catalogue or follow a career path — your progress, streaks and certificates will appear here."
            action={(
              <>
                <Link to="/learn/browse" className="btn btn-primary"><Compass className="h-4 w-4" aria-hidden="true" />Browse courses</Link>
                <Link to="/learn/paths" className="btn btn-secondary">Explore career paths</Link>
              </>
            )}
          />
        </div>
        <section>
          <h2 className="mb-4 text-lg font-semibold">Recommended to get you started</h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{recommended.map((c) => <CourseCard key={c.id} course={c} />)}</div>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <DashboardHero
        eyebrow={`${greeting(now)} · ${formatDate(now, { weekday: 'long', month: 'long', day: 'numeric' })}`}
        title={`Welcome back, ${firstName} 👋`}
        subtitle={resume ? `You’re ${computeProgress(resume.course, resume.enrollment).percent}% through ${resume.course.title}. Keep the momentum going!` : 'Pick up a new course and keep building your skills.'}
        aside={(
          <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
            <span className="flex h-14 w-14 animate-float items-center justify-center rounded-2xl bg-accent text-ink shadow-lg"><Flame className="h-7 w-7" aria-hidden="true" /></span>
            <div>
              <p className="text-3xl font-extrabold leading-none text-white">{stats.streak}<span className="ml-1 text-base font-semibold text-white/75">day streak</span></p>
              <p className="mt-1 text-xs text-white/70">{stats.weekMinutes} min studied this week</p>
            </div>
          </div>
        )}
      >
        {resume && <Link to={`/learn/course/${resume.course.id}`} className="btn btn-accent rounded-full"><PlayCircle className="h-4 w-4" aria-hidden="true" />Resume learning</Link>}
        <Link to="/learn/browse" className="btn btn-on-dark rounded-full"><Compass className="h-4 w-4" aria-hidden="true" />Browse</Link>
        <Link to="/learn/saved" className="btn btn-on-dark rounded-full"><Heart className="h-4 w-4" aria-hidden="true" />Saved</Link>
        <Link to="/learn/certificates" className="btn btn-on-dark rounded-full"><Award className="h-4 w-4" aria-hidden="true" />Certificates</Link>
      </DashboardHero>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Enrolled courses', value: stats.enrolled, icon: BookOpen, hint: `${stats.inProgress} in progress · ${stats.notStarted} not started` },
          { label: 'Courses completed', value: stats.completed, icon: CircleCheck, tone: 'success', hint: `${stats.lessonsCompleted} lessons completed in total` },
          { label: 'Learning hours', value: stats.hours, icon: Clock, tone: 'info', hint: 'From recorded study sessions' },
          { label: 'Current streak', value: `${stats.streak} day${stats.streak === 1 ? '' : 's'}`, icon: Flame, tone: 'accent', hint: stats.streak ? 'Complete a lesson today to keep it going' : 'Complete a lesson to start a streak' },
        ].map((s, i) => (
          <Reveal key={s.label} delay={i * 80}><StatCard {...s} className="h-full" /></Reveal>
        ))}
      </div>

      {resume && (
        <section aria-labelledby="continue-title" className="card card-hover card-glow group overflow-hidden">
          <div className="grid md:grid-cols-[320px_1fr]">
            <SmartImage src={resume.course.thumbnail} alt="" seed={resume.course.id} fallbackLabel={resume.course.title} className="aspect-video md:aspect-auto md:h-full" imgClassName="transition-transform duration-700 group-hover:scale-110" />
            <div className="flex flex-col p-6">
              <p className="eyebrow">Continue learning</p>
              <h2 id="continue-title" className="mt-1 text-xl font-bold">{resume.course.title}</h2>
              {(() => {
                const lesson = getAllLessons(resume.course).find((l) => l.id === resume.enrollment.lastLessonId)
                const p = computeProgress(resume.course, resume.enrollment)
                return (
                  <>
                    {lesson && <p className="mt-1 text-sm text-muted">Next: <span className="font-medium text-ink">{lesson.title}</span> · {lesson.moduleTitle}</p>}
                    <div className="mt-4 flex items-center gap-3">
                      <ProgressBar value={p.percent} className="flex-1" label="Course progress" />
                      <span className="text-sm font-semibold">{p.percent}%</span>
                    </div>
                    <p className="mt-1 text-xs text-muted">{p.completed} of {p.total} required lessons · last accessed {relativeTime(resume.enrollment.lastAccessedAt)}</p>
                  </>
                )
              })()}
              <div className="mt-auto flex flex-wrap gap-3 pt-5">
                <Link to={`/learn/course/${resume.course.id}`} className="btn btn-primary"><PlayCircle className="h-4 w-4" aria-hidden="true" />Resume lesson</Link>
                <Link to="/learn/my-learning" className="btn btn-ghost">All my courses</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <ChartCard
          title="Weekly study activity"
          description="Minutes studied per day over the last 7 days"
          table={{ columns: [{ key: 'day', label: 'Day' }, { key: 'date', label: 'Date' }, { key: 'minutes', label: 'Minutes' }], rows: week }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={week} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={CHART_GRID} strokeDasharray="3 3" />
              <XAxis dataKey="day" {...axisProps} />
              <YAxis {...axisProps} axisLine={false} allowDecimals={false} />
              <Tooltip {...tooltipProps} formatter={(v) => [`${v} min`, 'Studied']} />
              <Bar dataKey="minutes" fill={CHART_PRIMARY} radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <section className="card flex flex-col p-5" aria-labelledby="goal-title">
          <h2 id="goal-title" className="flex items-center gap-2 text-base font-semibold"><Target className="h-4 w-4 text-secondary" aria-hidden="true" />Learning goal</h2>
          <div className="mt-4 flex flex-1 flex-col items-center justify-center">
            <div className="relative h-36 w-36">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#E2E8F0" strokeWidth="12" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={goalPct >= 100 ? '#15803D' : CHART_PRIMARY} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(goalPct / 100) * 314} 314`} className="transition-[stroke-dasharray] duration-700" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{goalPct}%</span>
                <span className="text-xs text-muted">of weekly goal</span>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted">
              {Math.round(stats.weekMinutes / 6) / 10} of {user.weeklyGoalHours} hours studied in the last 7 days.
            </p>
            <Link to="/learn/settings" className="mt-2 text-sm font-semibold text-secondary hover:underline">Change goal</Link>
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section aria-labelledby="progress-title">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="progress-title" className="text-lg font-semibold">Course progress</h2>
            <Link to="/learn/my-learning" className="text-sm font-semibold text-secondary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {mine.slice(0, 4).map(({ course, enrollment }) => <EnrolledCourseCard key={enrollment.id} course={course} enrollment={enrollment} compact />)}
          </div>
        </section>

        <div className="space-y-6">
          <section className="card p-5" aria-labelledby="deadlines-title">
            <h2 id="deadlines-title" className="flex items-center gap-2 text-base font-semibold"><CalendarClock className="h-4 w-4 text-secondary" aria-hidden="true" />Upcoming deadlines</h2>
            <ul className="mt-3 divide-y divide-line">
              {deadlines.map(({ assignment, course, submission, lessonId }) => {
                const days = daysBetween(now, assignment.dueDate)
                return (
                  <li key={assignment.id} className="py-3">
                    <Link to={`/learn/course/${course.id}${lessonId ? `/${lessonId}` : ''}`} className="text-sm font-medium text-ink hover:underline">{assignment.title}</Link>
                    <p className="text-xs text-muted">{course.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      {submission?.status === 'resubmit' ? <StatusBadge status="resubmit" /> : days < 0 ? <StatusBadge status="overdue">Overdue</StatusBadge> : <span className="badge badge-info">Due {days === 0 ? 'today' : `in ${days} day${days === 1 ? '' : 's'}`}</span>}
                      <span className="text-xs text-muted">{formatDate(assignment.dueDate)}</span>
                    </div>
                  </li>
                )
              })}
              {!deadlines.length && <li className="py-6 text-center text-sm text-muted">No upcoming assignment deadlines.</li>}
            </ul>
          </section>

          <section className="card p-5" aria-labelledby="ach-title">
            <div className="flex items-center justify-between">
              <h2 id="ach-title" className="flex items-center gap-2 text-base font-semibold"><Sparkles className="h-4 w-4 text-secondary" aria-hidden="true" />Recent achievements</h2>
              <Link to="/learn/achievements" className="text-xs font-semibold text-secondary hover:underline">All</Link>
            </div>
            <ul className="mt-3 space-y-3">
              {achievements.map((a) => (
                <li key={a.id} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent-ink"><Icon name={a.icon} className="h-4 w-4" /></span>
                  <span><span className="block text-sm font-medium">{a.title}</span><span className="block text-xs text-muted">{a.description}</span></span>
                </li>
              ))}
              {!achievements.length && <li className="text-sm text-muted">Complete lessons to unlock achievements.</li>}
            </ul>
          </section>
        </div>
      </div>

      <section className="card p-5" aria-labelledby="notif-title">
        <div className="flex items-center justify-between">
          <h2 id="notif-title" className="text-base font-semibold">Recent notifications</h2>
          <Link to="/learn/notifications" className="text-sm font-semibold text-secondary hover:underline">View all</Link>
        </div>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {recentNotes.map((n) => {
            const NIcon = NOTIFICATION_ICONS[n.type] || BookOpen
            return (
              <li key={n.id} className="flex gap-3 rounded-lg border border-line p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"><NIcon className="h-4 w-4" aria-hidden="true" /></span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{n.title}{!n.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-accent align-middle" aria-label="Unread" />}</span>
                  <span className="line-clamp-1 block text-xs text-muted">{n.message}</span>
                  <span className="text-[11px] text-slate-400">{relativeTime(n.createdAt)}</span>
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="rec-title">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="rec-title" className="text-lg font-semibold">Recommended for you</h2>
          <Link to="/learn/browse" className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:underline">Browse more <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{recommended.map((c) => <CourseCard key={c.id} course={c} />)}</div>
      </section>
    </div>
  )
}
