import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { Clock, BookOpen, Signal, CircleCheck, Circle, Briefcase, PlayCircle } from 'lucide-react'
import CourseCard from '../../components/courses/CourseCard'
import { CareerPathCard } from '../../components/courses/Cards'
import MissingRecord from '../../components/common/MissingRecord'
import SmartImage from '../../components/common/SmartImage'
import { Breadcrumbs, ProgressBar, StatusBadge } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { pathProgress, enrollmentStatus } from '../../utils/learning'

export default function CareerPathDetail() {
  const { pathId } = useParams()
  const data = useData()
  const { careerPaths, actions } = data
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const path = careerPaths.find((p) => p.slug === pathId || p.id === pathId)
  useDocumentTitle(path ? `${path.title} career path` : 'Career path not found')

  if (!path) {
    return <MissingRecord title="Career path not found" description="That career path doesn’t exist. Explore the available paths instead." backTo="/career-paths" backLabel="View career paths" />
  }

  const isLearner = user?.role === 'learner'
  const progress = pathProgress(data, user?.id, path)
  const related = careerPaths.filter((p) => p.id !== path.id && p.skills.some((s) => path.skills.includes(s))).slice(0, 3)
  const fallbackRelated = related.length ? related : careerPaths.filter((p) => p.id !== path.id).slice(0, 3)

  const startLearning = () => {
    if (!user) {
      toast.info('Sign in as the demo learner to start this path.')
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    if (!isLearner) {
      toast.info('Career paths are part of the learner experience.')
      return
    }
    const next = progress.items.find((i) => i.percent < 100 && i.course.status === 'published')
    if (!next) {
      toast.success('You have completed every course in this path. Congratulations!')
      return
    }
    if (!next.enrollment) {
      const result = actions.enroll(user.id, next.course.id)
      if (result.ok) toast.success(`Enrolled in ${next.course.title}.`)
    }
    navigate(`/learn/course/${next.course.id}`)
  }

  return (
    <>
      <section className="bg-deep text-white">
        <div className="container-page grid gap-8 py-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:py-14">
          <div>
            <Breadcrumbs tone="light" items={[{ label: 'Home', to: '/' }, { label: 'Career paths', to: '/career-paths' }, { label: path.title }]} />
            <p className="eyebrow mt-5 text-[#9fd3e3]">Career path</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{path.title}</h1>
            <p className="mt-3 max-w-2xl text-lg text-white/80">{path.description}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
              <span className="inline-flex items-center gap-1.5"><BookOpen className="h-4 w-4" aria-hidden="true" />{path.courseIds.length} courses</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" aria-hidden="true" />~{path.estimatedMonths} months · {path.estimatedHours} hours</span>
              <span className="inline-flex items-center gap-1.5"><Signal className="h-4 w-4" aria-hidden="true" />{path.level}</span>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button type="button" className="btn btn-accent btn-lg" onClick={startLearning}>
                <PlayCircle className="h-5 w-5" aria-hidden="true" />{isLearner && progress.percent > 0 ? 'Continue path' : 'Start Learning'}
              </button>
              {isLearner && <span className="text-sm text-white/80">{progress.percent}% complete</span>}
            </div>
          </div>
          <SmartImage src={path.image} alt="" seed={path.id} fallbackLabel={path.title} className="hidden aspect-[4/3] rounded-2xl lg:block" />
        </div>
      </section>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="overview-title">
            <h2 id="overview-title" className="text-xl font-bold">Career overview</h2>
            <p className="mt-3 leading-7 text-slate-700">{path.overview}</p>
            <h3 className="mt-6 font-semibold">Roles this path prepares you for</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {path.roles.map((r) => <span key={r} className="badge badge-neutral px-3 py-1 text-sm"><Briefcase className="h-3.5 w-3.5" aria-hidden="true" />{r}</span>)}
            </div>
            <p className="mt-3 text-xs text-muted">Role titles are illustrative examples, not guaranteed outcomes.</p>
          </section>

          <section aria-labelledby="roadmap-title">
            <h2 id="roadmap-title" className="text-xl font-bold">Skills roadmap</h2>
            <ol className="relative mt-6 space-y-6 border-l-2 border-primary-soft pl-8">
              {path.roadmap.map((step, i) => (
                <li key={step.title} className="relative">
                  <span className="absolute -left-[45px] flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white ring-4 ring-page">{i + 1}</span>
                  <h3 className="font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted">{step.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">{step.skills.map((s) => <span key={s} className="badge badge-info">{s}</span>)}</div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="courses-title">
            <h2 id="courses-title" className="text-xl font-bold">Recommended courses</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {progress.items.filter((i) => i.course.status === 'published').map((i) => <CourseCard key={i.course.id} course={i.course} />)}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="card p-5 lg:sticky lg:top-24">
            <h2 className="font-semibold text-ink">Course completion checklist</h2>
            {isLearner ? (
              <ProgressBar value={progress.percent} showLabel className="mt-3" label="Path progress" />
            ) : (
              <p className="mt-1 text-xs text-muted">Sign in as a learner to track your progress.</p>
            )}
            <ol className="mt-4 space-y-3">
              {progress.items.map(({ course, enrollment, percent }, i) => {
                const status = enrollmentStatus(course, enrollment)
                return (
                  <li key={course.id} className="flex items-start gap-3">
                    {percent >= 100 ? <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-label="Completed" /> : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" aria-label="Not completed" />}
                    <div className="min-w-0 flex-1">
                      <Link to={`/courses/${course.slug}`} className="text-sm font-medium text-ink hover:underline">{i + 1}. {course.title}</Link>
                      <div className="mt-1 flex items-center gap-2">
                        {isLearner && <StatusBadge status={status} />}
                        <span className="text-xs text-muted">{course.durationHours} hrs</span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
            <p className="mt-4 border-t border-line pt-3 text-xs text-muted">Estimated study time: about {path.estimatedHours} hours over ~{path.estimatedMonths} months at 4–6 hours per week.</p>
          </div>
        </aside>
      </div>

      <section className="border-t border-line bg-white" aria-labelledby="related-paths">
        <div className="container-page py-12">
          <h2 id="related-paths" className="section-title">Related career paths</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fallbackRelated.map((p) => <CareerPathCard key={p.id} path={p} />)}
          </div>
        </div>
      </section>
    </>
  )
}
