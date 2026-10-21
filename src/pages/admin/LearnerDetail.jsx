import { Link, useParams } from 'react-router-dom'
import { Mail, MapPin, CalendarDays, Award, ListChecks, FileText, Clock, UserX, Info } from 'lucide-react'
import { Avatar, EmptyState, PageHeader, ProgressBar, StatusBadge, StatCard } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useNow } from '../../hooks/useUtils'
import { computeProgress, enrollmentStatus, getCertificates, getLearnerStats } from '../../utils/learning'
import { formatDate, formatDateTime, relativeTime } from '../../utils/format'

export default function AdminLearnerDetail() {
  const { userId } = useParams()
  const data = useData()
  const { users, courses, enrollments, quizAttempts, submissions, assignments, quizzes, actions } = data
  const toast = useToast()
  const now = useNow()
  const learner = users.find((u) => u.id === userId && u.role === 'learner')
  useDocumentTitle(learner ? learner.name : 'Learner not found')

  if (!learner) {
    return <div className="card"><EmptyState icon={UserX} title="Learner not found" description="This learner record doesn’t exist." action={<Link to="/admin/learners" className="btn btn-primary">Back to learners</Link>} /></div>
  }

  const stats = getLearnerStats(data, learner.id, now)
  const mine = enrollments.filter((e) => e.userId === learner.id).map((e) => ({ e, course: courses.find((c) => c.id === e.courseId) })).filter((x) => x.course)
  const certificates = getCertificates(data, learner.id)
  const activity = [
    ...quizAttempts.filter((a) => a.userId === learner.id).map((a) => ({ id: a.id, at: a.submittedAt, icon: ListChecks, text: `Scored ${a.score}% on ${quizzes.find((q) => q.id === a.quizId)?.title || 'a quiz'} (${a.passed ? 'passed' : 'not passed'})` })),
    ...submissions.filter((s) => s.userId === learner.id).map((s) => ({ id: s.id, at: s.submittedAt, icon: FileText, text: `Submitted “${assignments.find((a) => a.id === s.assignmentId)?.title || 'assignment'}” — ${s.status}` })),
    ...mine.map(({ e, course }) => ({ id: `${e.id}-acc`, at: e.lastAccessedAt, icon: Clock, text: `Studied ${course.title}` })),
    ...mine.map(({ e, course }) => ({ id: `${e.id}-enr`, at: e.enrolledAt, icon: CalendarDays, text: `Enrolled in ${course.title}` })),
  ].sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 10)

  const changeStatus = (status) => {
    actions.setUserStatus(learner.id, status)
    toast.success(`Mock account status set to ${status}.`)
  }

  return (
    <div className="space-y-6">
      <PageHeader title={learner.name} description={learner.title} breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Learners', to: '/admin/learners' }, { label: learner.name }]} />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <section className="card p-5">
            <div className="flex items-center gap-4"><Avatar name={learner.name} src={learner.avatar} size="lg" /><div><p className="font-semibold">{learner.name}</p><StatusBadge status={learner.status} /></div></div>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted" aria-hidden="true" />{learner.email}</li>
              {learner.location && <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted" aria-hidden="true" />{learner.location}</li>}
              <li className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-muted" aria-hidden="true" />Joined {formatDate(learner.joinedAt)}</li>
            </ul>
            {learner.bio && <p className="mt-4 text-sm text-muted">{learner.bio}</p>}
            {learner.interests?.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{learner.interests.map((i) => <span key={i} className="badge badge-neutral">{i}</span>)}</div>}
          </section>
          <section className="card p-5">
            <label htmlFor="learner-status" className="label">Mock account status</label>
            <select id="learner-status" className="input" value={learner.status} onChange={(e) => changeStatus(e.target.value)}>
              <option value="active">Active</option><option value="inactive">Inactive</option><option value="suspended">Suspended</option>
            </select>
            <p className="mt-2 flex gap-1.5 text-xs text-muted"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />Demo metadata only. A frontend app cannot securely disable real accounts; suspended demo accounts simply can’t use the simulated sign-in.</p>
          </section>
        </aside>
        <div className="min-w-0 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Enrolled" value={stats.enrolled} icon={ListChecks} />
            <StatCard label="Completed" value={stats.completed} icon={Award} tone="success" />
            <StatCard label="Study hours" value={stats.hours} icon={Clock} tone="info" />
            <StatCard label="Streak" value={`${stats.streak} d`} icon={CalendarDays} tone="accent" />
          </div>
          <section className="card overflow-hidden" aria-labelledby="enr-title">
            <h2 id="enr-title" className="border-b border-line px-5 py-4 text-base font-semibold">Enrolled courses</h2>
            <ul className="divide-y divide-line">
              {mine.map(({ e, course }) => {
                const p = computeProgress(course, e)
                return (
                  <li key={e.id} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <Link to={`/admin/courses/${course.id}/edit`} className="text-sm font-medium hover:underline">{course.title}</Link>
                      <p className="text-xs text-muted">Enrolled {formatDate(e.enrolledAt)} · last activity {relativeTime(e.lastAccessedAt)}</p>
                    </div>
                    <div className="flex items-center gap-3 sm:w-64">
                      <ProgressBar value={p.percent} size="sm" className="flex-1" label={`${course.title} progress`} />
                      <span className="w-10 text-right text-xs font-semibold">{p.percent}%</span>
                      <StatusBadge status={enrollmentStatus(course, e)} />
                    </div>
                  </li>
                )
              })}
              {!mine.length && <li className="px-5 py-8 text-center text-sm text-muted">Not enrolled in any courses.</li>}
            </ul>
          </section>
          <div className="grid gap-6 xl:grid-cols-2">
            <section className="card p-5" aria-labelledby="act-title">
              <h2 id="act-title" className="text-base font-semibold">Recent activity</h2>
              <ul className="mt-3 space-y-3">
                {activity.map((a) => (
                  <li key={a.id} className="flex gap-3 text-sm"><a.icon className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" /><div><p className="text-slate-700">{a.text}</p><p className="text-xs text-muted">{formatDateTime(a.at)}</p></div></li>
                ))}
                {!activity.length && <li className="text-sm text-muted">No activity recorded.</li>}
              </ul>
            </section>
            <section className="card p-5" aria-labelledby="cert-title">
              <h2 id="cert-title" className="text-base font-semibold">Certificates (demo)</h2>
              <ul className="mt-3 space-y-2">
                {certificates.map((c) => (
                  <li key={c.id} className="flex items-center gap-3 rounded-lg border border-line p-3 text-sm"><Award className="h-5 w-5 text-accent" aria-hidden="true" /><div className="min-w-0"><p className="truncate font-medium">{c.courseTitle}</p><p className="text-xs text-muted">{c.reference} · {formatDate(c.completedAt)}</p></div></li>
                ))}
                {!certificates.length && <li className="text-sm text-muted">No completed courses yet.</li>}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
