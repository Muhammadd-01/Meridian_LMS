import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  Clock, Signal, Globe, Users, Award, PlayCircle, CircleCheck, ChevronDown, Pencil, Eye, BookOpen, Calendar,
  Infinity as InfinityIcon, Smartphone, Lock, Star, Layers, MessageSquare,
} from 'lucide-react'
import SmartImage from '../../components/common/SmartImage'
import Modal from '../../components/common/Modal'
import Markdown from '../../components/common/Markdown'
import MissingRecord from '../../components/common/MissingRecord'
import VideoPlayer from '../../components/learning/VideoPlayer'
import CourseCard, { SaveCourseButton } from '../../components/courses/CourseCard'
import { Avatar, Breadcrumbs, ProgressBar, RatingStars, StatusBadge } from '../../components/common/ui'
import { lessonTypeMeta, demoCaptions } from '../../components/learning/lessonMeta'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { findCourse, getAllLessons, computeProgress, totalContentMinutes, resolveAuthor } from '../../utils/learning'
import { formatCompact, formatDate, formatMinutes, formatNumber, relativeTime } from '../../utils/format'
import { cn } from '../../utils/cn'

function CurriculumModule({ module, index, onPreview, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const minutes = module.lessons.reduce((s, l) => s + (Number(l.durationMinutes) || 0), 0)
  return (
    <div className="border-b border-line last:border-b-0">
      <h3>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-slate-50">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-sm font-bold text-primary">{index + 1}</span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold text-ink">{module.title}</span>
            <span className="block text-xs text-muted">{module.lessons.length} lesson{module.lessons.length === 1 ? '' : 's'} · {formatMinutes(minutes)}</span>
          </span>
          <ChevronDown className={cn('h-5 w-5 text-muted transition-transform', open && 'rotate-180')} aria-hidden="true" />
        </button>
      </h3>
      {open && (
        <div className="pb-3">
          {module.description && <p className="px-5 pb-2 pl-[68px] text-sm text-muted">{module.description}</p>}
          <ul>
            {module.lessons.map((lesson) => {
              const meta = lessonTypeMeta(lesson.type)
              const Icon = meta.icon
              return (
                <li key={lesson.id} className="flex items-center gap-3 px-5 py-2 pl-[68px] text-sm">
                  <Icon className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                  <span className="min-w-0 flex-1 text-slate-700">{lesson.title}</span>
                  {lesson.isPreview ? (
                    <button type="button" onClick={() => onPreview(lesson)} className="text-xs font-semibold text-secondary hover:underline">Preview</button>
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-slate-300" aria-label="Available after enrolment" />
                  )}
                  <span className="w-14 shrink-0 text-right text-xs text-muted">{meta.label === 'Quiz' || meta.label === 'Assignment' ? meta.label : formatMinutes(lesson.durationMinutes)}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

function ReviewForm({ course, user, existing }) {
  const { actions } = useData()
  const toast = useToast()
  const [rating, setRating] = useState(existing?.rating || 0)
  const [hover, setHover] = useState(0)
  const [text, setText] = useState(existing?.text || '')
  const [error, setError] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (!rating) return setError('Choose a star rating.')
    if (text.trim().length < 10) return setError('Write at least 10 characters so other learners find it useful.')
    setError('')
    actions.submitReview({ userId: user.id, courseId: course.id, rating, text })
    toast.success('Thanks! Your review was submitted and is awaiting moderation.')
  }
  return (
    <form onSubmit={submit} className="card p-5" noValidate>
      <h3 className="font-semibold text-ink">{existing ? 'Update your review' : 'Write a review'}</h3>
      <fieldset className="mt-3">
        <legend className="label">Your rating</legend>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} onMouseEnter={() => setHover(n)} aria-label={`${n} star${n > 1 ? 's' : ''}`} aria-pressed={rating === n} className="rounded p-0.5">
              <Star className={cn('h-7 w-7', (hover || rating) >= n ? 'fill-accent text-accent' : 'text-slate-300')} aria-hidden="true" />
            </button>
          ))}
        </div>
      </fieldset>
      <label htmlFor="review-text" className="label mt-4">Your review</label>
      <textarea id="review-text" rows={3} className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="What did you like? What could be better?" />
      {error && <p className="field-error" role="alert">{error}</p>}
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted">Reviews are moderated by the demo admin before they appear.</p>
        <button type="submit" className="btn btn-primary btn-sm">Submit review</button>
      </div>
    </form>
  )
}

export default function CourseDetail() {
  const { courseId } = useParams()
  const data = useData()
  const { courses, instructors, categories, enrollments, reviews, users, actions } = data
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [preview, setPreview] = useState(null)
  const course = findCourse(courses, courseId)
  const isAdmin = user?.role === 'admin'
  useDocumentTitle(course?.title || 'Course not found')

  if (!course || (course.status !== 'published' && !isAdmin)) {
    return (
      <MissingRecord
        title="Course not found"
        description="This course doesn’t exist or isn’t currently available. It may have been unpublished or archived."
        backTo="/courses"
        backLabel="Browse the catalogue"
      />
    )
  }

  const instructor = instructors.find((i) => i.id === course.instructorId)
  const category = categories.find((c) => c.id === course.categoryId)
  const lessons = getAllLessons(course)
  const enrollment = user ? enrollments.find((e) => e.userId === user.id && e.courseId === course.id) : null
  const progress = computeProgress(course, enrollment)
  const approved = reviews.filter((r) => r.courseId === course.id && r.status === 'approved').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const ownReview = user ? reviews.find((r) => r.courseId === course.id && r.userId === user.id) : null
  const related = courses.filter((c) => c.status === 'published' && c.id !== course.id && (c.categoryId === course.categoryId || c.skills.some((s) => course.skills.includes(s)))).slice(0, 4)
  const firstPreview = lessons.find((l) => l.isPreview)
  const contentMinutes = totalContentMinutes(course)
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({ star, count: approved.filter((r) => r.rating === star).length }))

  const handleEnroll = () => {
    if (!user) {
      toast.info('Sign in with the demo learner account to enrol.')
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    if (enrollment && !enrollment.archived) {
      navigate(`/learn/course/${course.id}`)
      return
    }
    const result = actions.enroll(user.id, course.id)
    if (result.ok) toast.success('Course added to your learning list.', { title: 'Enrolled' })
    else if (result.reason === 'exists') toast.info('This course was restored from your archive.')
    else toast.error('This course is not open for enrolment right now.')
  }

  const enrolCta = isAdmin ? (
    <Link to={`/admin/courses/${course.id}/edit`} className="btn btn-primary btn-lg w-full"><Pencil className="h-4 w-4" aria-hidden="true" />Edit course</Link>
  ) : enrollment && !enrollment.archived ? (
    <Link to={`/learn/course/${course.id}`} className="btn btn-primary btn-lg w-full">
      <PlayCircle className="h-5 w-5" aria-hidden="true" />
      {progress.percent >= 100 ? 'Review course' : progress.completed > 0 ? 'Continue learning' : 'Start learning'}
    </Link>
  ) : (
    <button type="button" className="btn btn-accent btn-lg w-full" onClick={handleEnroll}>
      {user ? 'Enroll for free (demo)' : 'Sign in to enroll'}
    </button>
  )

  const sectionLinks = [
    { id: 'about', label: 'About' },
    { id: 'outcomes', label: 'Outcomes' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'instructor', label: 'Instructor' },
    { id: 'reviews', label: 'Reviews' },
  ]

  return (
    <div>
      {course.status !== 'published' && (
        <div className="border-b border-warning/30 bg-warning-soft">
          <div className="container-page flex flex-wrap items-center gap-3 py-2.5 text-sm text-[#92400E]">
            <Eye className="h-4 w-4" aria-hidden="true" />
            <span><strong>Admin preview.</strong> This course is <StatusBadge status={course.status} /> and is not visible to learners.</span>
            <Link to={`/admin/courses/${course.id}/edit`} className="ml-auto font-semibold underline">Back to editor</Link>
          </div>
        </div>
      )}

      <section className="bg-deep text-white">
        <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_360px] lg:py-14">
          <div className="min-w-0">
            <Breadcrumbs tone="light" items={[{ label: 'Home', to: '/' }, { label: 'Courses', to: '/courses' }, ...(category ? [{ label: category.name, to: `/courses?category=${category.slug}` }] : []), { label: course.title }]} />
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="badge bg-white/10 text-white">{course.courseType}</span>
              {course.trending && <span className="badge bg-accent text-ink">Trending</span>}
              <span className={cn('badge', course.access === 'free' ? 'bg-success text-white' : 'bg-white text-ink')}>{course.priceLabel}</span>
            </div>
            <h1 className="mt-4 text-3xl leading-tight font-bold text-white sm:text-4xl">{course.title}</h1>
            <p className="mt-3 max-w-2xl text-lg text-white/80">{course.shortDescription}</p>
            {instructor && (
              <div className="mt-5 flex items-center gap-3">
                <Avatar name={instructor.name} src={instructor.avatar} size="md" className="ring-white/20" />
                <p className="text-sm text-white/80">
                  Taught by <Link to={`/instructors/${instructor.id}`} className="font-semibold text-white underline-offset-4 hover:underline">{instructor.name}</Link>
                  <span className="block text-xs text-white/60">{course.providerName}</span>
                </p>
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/85">
              <span className="flex items-center gap-2 [&_.text-ink]:text-white [&_.text-muted]:text-white/60"><RatingStars rating={course.rating} count={course.reviewCount ? `${formatNumber(course.reviewCount)} ratings` : undefined} size="md" /></span>
              {course.enrollmentCount > 0 && <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" aria-hidden="true" />{formatCompact(course.enrollmentCount)} learners</span>}
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" aria-hidden="true" />Updated {formatDate(course.updatedAt, { month: 'short', year: 'numeric' })}</span>
            </div>
            <p className="mt-2 text-xs text-white/50">Ratings and learner counts are illustrative demo figures.</p>
          </div>

          <aside className="lg:row-span-2" aria-label="Enrolment">
            <div className="card overflow-hidden text-ink lg:sticky lg:top-24">
              <button type="button" className="group relative block w-full" onClick={() => firstPreview && setPreview(firstPreview)} disabled={!firstPreview} aria-label="Preview this course">
                <SmartImage src={course.thumbnail} alt="" seed={course.id} fallbackLabel={course.title} className="aspect-video w-full" />
                {firstPreview && (
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-deep/40 text-white transition group-hover:bg-deep/55">
                    <PlayCircle className="h-14 w-14" aria-hidden="true" />
                    <span className="text-sm font-semibold">Preview this course</span>
                  </span>
                )}
              </button>
              <div className="space-y-4 p-5">
                {enrollment && !enrollment.archived && !isAdmin && (
                  <div>
                    <div className="mb-1 flex justify-between text-sm"><span className="font-medium text-ink">Your progress</span><span className="font-semibold">{progress.percent}%</span></div>
                    <ProgressBar value={progress.percent} label="Course progress" />
                  </div>
                )}
                {enrolCta}
                {!isAdmin && <SaveCourseButton courseId={course.id} withLabel className="w-full" />}
                <p className="text-center text-xs text-muted">{course.access === 'paid' ? 'Demo price shown for illustration — no payment is requested or processed.' : 'Free to enrol in this demo.'}</p>
                <ul className="space-y-2.5 border-t border-line pt-4 text-sm text-slate-700">
                  <li className="flex items-center gap-3"><Clock className="h-4 w-4 text-secondary" aria-hidden="true" />Approx. {course.durationHours} hours to complete</li>
                  <li className="flex items-center gap-3"><Layers className="h-4 w-4 text-secondary" aria-hidden="true" />{course.modules.length} modules · {lessons.length} lessons</li>
                  <li className="flex items-center gap-3"><Signal className="h-4 w-4 text-secondary" aria-hidden="true" />{course.difficulty} level</li>
                  <li className="flex items-center gap-3"><Globe className="h-4 w-4 text-secondary" aria-hidden="true" />{course.language} · subtitles: {(course.subtitles || []).join(', ') || '—'}</li>
                  <li className="flex items-center gap-3"><InfinityIcon className="h-4 w-4 text-secondary" aria-hidden="true" />Self-paced, learn on your schedule</li>
                  <li className="flex items-center gap-3"><Smartphone className="h-4 w-4 text-secondary" aria-hidden="true" />Works on desktop, tablet and mobile</li>
                  <li className="flex items-center gap-3"><Award className="h-4 w-4 text-secondary" aria-hidden="true" />Demo certificate of completion</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <nav aria-label="Course sections" className="sticky top-16 z-20 border-b border-line bg-white/95 backdrop-blur">
        <div className="container-page no-scrollbar flex gap-1 overflow-x-auto lg:pr-[392px]">
          {sectionLinks.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="shrink-0 border-b-2 border-transparent px-3 py-3 text-sm font-semibold text-muted hover:border-accent hover:text-ink">{s.label}</a>
          ))}
        </div>
      </nav>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-12">
          <section id="about" className="scroll-mt-32" aria-labelledby="about-title">
            <h2 id="about-title" className="text-xl font-bold">About this course</h2>
            <p className="mt-3 leading-7 text-slate-700">{course.description}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: BookOpen, label: 'Learning format', value: `${course.courseType} · self-paced` },
                { icon: Clock, label: 'Video & reading content', value: formatMinutes(contentMinutes) },
                { icon: Award, label: 'Access', value: course.access === 'free' ? 'Free' : 'Paid (demo label)' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-line bg-white p-4">
                  <item.icon className="h-5 w-5 text-secondary" aria-hidden="true" />
                  <p className="mt-2 text-xs text-muted">{item.label}</p>
                  <p className="text-sm font-semibold text-ink">{item.value}</p>
                </div>
              ))}
            </div>
            <h3 className="mt-8 font-semibold text-ink">Skills you’ll gain</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {course.skills.map((s) => <Link key={s} to={`/courses?q=${encodeURIComponent(s)}`} className="rounded-full border border-line bg-white px-3 py-1 text-sm text-slate-700 hover:border-primary hover:text-primary">{s}</Link>)}
            </div>
          </section>

          <section id="outcomes" className="scroll-mt-32" aria-labelledby="outcomes-title">
            <div className="card p-6">
              <h2 id="outcomes-title" className="text-xl font-bold">What you’ll learn</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {course.learningOutcomes.map((o) => (
                  <li key={o} className="flex gap-3 text-sm text-slate-700"><CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />{o}</li>
                ))}
              </ul>
              <h3 className="mt-6 font-semibold text-ink">Prerequisites</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {course.prerequisites.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          </section>

          <section id="curriculum" className="scroll-mt-32" aria-labelledby="curriculum-title">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 id="curriculum-title" className="text-xl font-bold">Curriculum</h2>
              <p className="text-sm text-muted">{course.modules.length} modules · {lessons.length} lessons · {formatMinutes(contentMinutes)}</p>
            </div>
            <div className="card mt-4 overflow-hidden">
              {course.modules.map((m, i) => <CurriculumModule key={m.id} module={m} index={i} onPreview={setPreview} defaultOpen={i === 0} />)}
              {!course.modules.length && <p className="p-6 text-sm text-muted">The curriculum for this course is being prepared.</p>}
            </div>
          </section>

          {instructor && (
            <section id="instructor" className="scroll-mt-32" aria-labelledby="instructor-title">
              <h2 id="instructor-title" className="text-xl font-bold">Instructor</h2>
              <div className="card mt-4 flex flex-col gap-5 p-6 sm:flex-row">
                <Avatar name={instructor.name} src={instructor.avatar} size="xl" />
                <div>
                  <Link to={`/instructors/${instructor.id}`} className="text-lg font-semibold text-ink hover:underline">{instructor.name}</Link>
                  <p className="text-sm text-muted">{instructor.title} · {instructor.organization}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{instructor.bio}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">{instructor.expertise.map((e) => <span key={e} className="badge badge-primary">{e}</span>)}</div>
                </div>
              </div>
            </section>
          )}

          <section id="reviews" className="scroll-mt-32" aria-labelledby="reviews-title">
            <h2 id="reviews-title" className="text-xl font-bold">Learner reviews</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-[220px_1fr]">
              <div className="card p-5">
                <p className="text-4xl font-bold text-ink">{course.rating ? course.rating.toFixed(1) : '—'}</p>
                <RatingStars rating={course.rating} showValue={false} size="md" />
                <p className="mt-1 text-xs text-muted">{formatNumber(course.reviewCount)} illustrative ratings</p>
                <div className="mt-4 space-y-1.5">
                  {breakdown.map((b) => (
                    <div key={b.star} className="flex items-center gap-2 text-xs text-muted">
                      <span className="w-3">{b.star}</span>
                      <ProgressBar value={approved.length ? (b.count / approved.length) * 100 : 0} size="sm" tone="accent" className="flex-1" label={`${b.star} star reviews`} />
                      <span className="w-4 text-right">{b.count}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-slate-400">Breakdown of published written reviews.</p>
              </div>
              <div className="space-y-4">
                {user?.role === 'learner' && enrollment && (
                  ownReview?.status === 'pending' ? (
                    <div className="rounded-xl border border-warning/30 bg-warning-soft p-4 text-sm text-[#92400E]">Your {ownReview.rating}-star review is awaiting moderation.</div>
                  ) : (
                    <ReviewForm course={course} user={user} existing={ownReview} key={ownReview?.id || 'new'} />
                  )
                )}
                {approved.map((r) => {
                  const author = resolveAuthor(r.userId, users, instructors)
                  return (
                    <article key={r.id} className="card p-5">
                      <div className="flex items-center gap-3">
                        <Avatar name={author.name} src={author.avatar} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-ink">{author.name}</p>
                          <p className="text-xs text-muted">{relativeTime(r.createdAt)}</p>
                        </div>
                        <RatingStars rating={r.rating} showValue={false} />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-700">{r.text}</p>
                    </article>
                  )
                })}
                {!approved.length && (
                  <div className="card flex items-center gap-3 p-5 text-sm text-muted"><MessageSquare className="h-5 w-5" aria-hidden="true" />No written reviews yet. Enrolled learners can share theirs.</div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-white" aria-labelledby="related-title">
          <div className="container-page py-12">
            <h2 id="related-title" className="section-title">Related courses</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          </div>
        </section>
      )}

      <Modal open={Boolean(preview)} onClose={() => setPreview(null)} size="xl" title={preview ? `Preview: ${preview.title}` : ''} description={course.title}>
        {preview && (
          <div className="space-y-5">
            {preview.type === 'video' ? (
              <VideoPlayer key={preview.id} src={preview.videoUrl} poster={course.thumbnail} title={preview.title} captions={demoCaptions(preview)} />
            ) : null}
            <Markdown content={preview.content} />
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-primary-soft p-4">
              <p className="text-sm text-primary">Enjoying the preview? Enrol to unlock all {lessons.length} lessons.</p>
              {!isAdmin && !(enrollment && !enrollment.archived) && (
                <button type="button" className="btn btn-primary btn-sm" onClick={() => { setPreview(null); handleEnroll() }}>{user ? 'Enroll now' : 'Sign in to enroll'}</button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
