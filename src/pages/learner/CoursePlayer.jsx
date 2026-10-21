import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Bookmark, CircleCheck, Menu, PanelRightClose, PanelRightOpen, Award, Undo2, Lock, PartyPopper,
} from 'lucide-react'
import BrandLogo from '../../components/common/BrandLogo'
import Modal from '../../components/common/Modal'
import Markdown from '../../components/common/Markdown'
import Tabs from '../../components/common/Tabs'
import MissingRecord from '../../components/common/MissingRecord'
import ProfileMenu from '../../components/navigation/ProfileMenu'
import VideoPlayer from '../../components/learning/VideoPlayer'
import LessonSidebar from '../../components/learning/LessonSidebar'
import QuizRunner from '../../components/learning/QuizRunner'
import AssignmentPanel from '../../components/learning/AssignmentPanel'
import ResourceList from '../../components/learning/ResourceList'
import NotesPanel from '../../components/learning/NotesPanel'
import DiscussionPanel from '../../components/learning/DiscussionPanel'
import { lessonTypeMeta, demoCaptions } from '../../components/learning/lessonMeta'
import { ProgressBar } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useNow } from '../../hooks/useUtils'
import { findCourse, getAllLessons, computeProgress, getCertificates } from '../../utils/learning'
import { formatMinutes } from '../../utils/format'
import { cn } from '../../utils/cn'

function NotEnrolled({ course }) {
  const { actions } = useData()
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const enroll = () => {
    const result = actions.enroll(user.id, course.id)
    if (result.ok || result.reason === 'exists') {
      toast.success('Course added to your learning list.', { title: 'Enrolled' })
      navigate(`/learn/course/${course.id}`, { replace: true })
    } else toast.error('This course is not open for enrolment.')
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-6">
      <div className="card max-w-md p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary"><Lock className="h-7 w-7" aria-hidden="true" /></span>
        <h1 className="mt-4 text-xl font-bold">Enrol to start learning</h1>
        <p className="mt-2 text-sm text-muted">You’re not enrolled in <strong className="text-ink">{course.title}</strong> yet.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {course.status === 'published' && <button type="button" className="btn btn-primary" onClick={enroll}>Enroll now</button>}
          <Link to={`/courses/${course.slug}`} className="btn btn-secondary">View course details</Link>
          <Link to="/learn/my-learning" className="btn btn-ghost">My learning</Link>
        </div>
      </div>
    </div>
  )
}

export default function CoursePlayer() {
  const { courseId, lessonId } = useParams()
  const data = useData()
  const { courses, enrollments, bookmarks, quizzes, assignments, notes, actions } = data
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const now = useNow()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [tab, setTab] = useState('overview')
  const [lastLessonId, setLastLessonId] = useState(lessonId)

  const course = findCourse(courses, courseId)
  const enrollment = course ? enrollments.find((e) => e.userId === user.id && e.courseId === course.id) : null
  const lessons = course ? getAllLessons(course) : []
  const lesson = lessons.find((l) => l.id === lessonId)
  useDocumentTitle(lesson ? `${lesson.title} · ${course.title}` : course?.title || 'Course')

  // Reset the lower tab when moving between lessons.
  if (lessonId !== lastLessonId) {
    setLastLessonId(lessonId)
    setTab('overview')
  }

  useEffect(() => {
    if (course && lesson && enrollment) actions.visitLesson(user.id, course.id, lesson.id)
  }, [actions, user.id, course, lesson, enrollment])

  if (!course || (course.status !== 'published' && !enrollment)) {
    return <MissingRecord title="Course not found" description="This course doesn’t exist or is no longer available." backTo="/learn/my-learning" backLabel="Back to My Learning" />
  }
  if (!enrollment) return <NotEnrolled course={course} />
  if (!lessons.length) {
    return <MissingRecord title="No lessons yet" description="This course doesn’t have any lessons published yet." backTo="/learn/my-learning" backLabel="Back to My Learning" />
  }
  if (!lessonId) {
    const resume = lessons.find((l) => l.id === enrollment.lastLessonId) || lessons[0]
    return <Navigate to={`/learn/course/${course.id}/${resume.id}`} replace />
  }
  if (!lesson) {
    return <MissingRecord title="Lesson not found" description="That lesson isn’t part of this course. It may have been removed." backTo={`/learn/course/${course.id}`} backLabel="Resume the course" />
  }

  const index = lessons.findIndex((l) => l.id === lesson.id)
  const prev = lessons[index - 1]
  const next = lessons[index + 1]
  const completedIds = new Set(enrollment.completedLessonIds || [])
  const bookmarkedIds = new Set(bookmarks.filter((b) => b.userId === user.id && b.courseId === course.id).map((b) => b.lessonId))
  const progress = computeProgress(course, enrollment)
  const isDone = completedIds.has(lesson.id)
  const isBookmarked = bookmarkedIds.has(lesson.id)
  const meta = lessonTypeMeta(lesson.type)
  const quiz = lesson.type === 'quiz' ? quizzes.find((q) => q.id === lesson.quizId) : null
  const assignment = lesson.type === 'assignment' ? assignments.find((a) => a.id === lesson.assignmentId) : null
  const certificate = progress.percent >= 100 ? getCertificates(data, user.id).find((c) => c.courseId === course.id) : null
  const manualCompletion = !['quiz', 'assignment'].includes(lesson.type)

  const goTo = (target) => target && navigate(`/learn/course/${course.id}/${target.id}`)

  const setComplete = (value) => {
    const result = actions.setLessonComplete(user.id, course.id, lesson.id, value)
    if (!result.changed) return
    if (result.courseCompleted) toast.success('Course completed! Your demo certificate is ready.', { title: 'Congratulations' })
    else toast.success(value ? 'Lesson marked as complete.' : 'Lesson marked as not complete.')
  }

  const completeAndNext = () => {
    if (!isDone) setComplete(true)
    if (next) goTo(next)
  }

  const toggleBookmark = () => {
    const on = actions.toggleBookmark(user.id, course.id, lesson.id)
    toast.info(on ? 'Lesson bookmarked.' : 'Bookmark removed.')
  }

  const sidebar = (
    <LessonSidebar course={course} currentLessonId={lesson.id} completedIds={completedIds} bookmarkedIds={bookmarkedIds} onNavigate={() => setDrawerOpen(false)} />
  )

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <header className="sticky top-0 z-30 bg-deep text-white">
        <div className="flex h-16 items-center gap-3 px-3 sm:px-5">
          <Link to="/learn/my-learning" className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white" aria-label="Back to My Learning"><ArrowLeft className="h-5 w-5" /></Link>
          <div className="hidden sm:block"><BrandLogo tone="light" compact to="/learn/dashboard" /></div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{course.title}</p>
            <div className="mt-1 flex max-w-sm items-center gap-2">
              <ProgressBar value={progress.percent} size="sm" className="flex-1 [&>div]:bg-white/20" tone="accent" label="Course progress" />
              <span className="text-xs whitespace-nowrap text-white/80">{progress.percent}% · {progress.completed}/{progress.total}</span>
            </div>
          </div>
          <button type="button" className="hidden rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white lg:inline-flex" onClick={() => setSidebarOpen((o) => !o)} aria-label={sidebarOpen ? 'Hide course content' : 'Show course content'} aria-pressed={sidebarOpen}>
            {sidebarOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
          </button>
          <button type="button" className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-white/90 hover:bg-white/10 lg:hidden" onClick={() => setDrawerOpen(true)}>
            <Menu className="h-5 w-5" aria-hidden="true" /><span className="hidden sm:inline">Contents</span>
          </button>
          <ProfileMenu tone="dark" showName={false} />
        </div>
      </header>

      <div className="flex flex-1">
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 outline-none">
          <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
            {progress.percent >= 100 && (
              <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-success/30 bg-success-soft p-5 sm:flex-row sm:items-center">
                <PartyPopper className="h-8 w-8 shrink-0 text-success" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-semibold text-ink">You’ve completed this course!</p>
                  <p className="text-sm text-slate-700">Every required lesson is done. Revisit any lesson, or view your demo certificate.</p>
                </div>
                {certificate && <Link to={`/learn/certificates/${certificate.id}`} className="btn btn-primary"><Award className="h-4 w-4" aria-hidden="true" />View certificate</Link>}
              </div>
            )}

            <p className="text-xs font-semibold tracking-wide text-secondary uppercase">{lesson.moduleTitle}</p>
            <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
              <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">{lesson.title}</h1>
              <button type="button" onClick={toggleBookmark} aria-pressed={isBookmarked} className={cn('btn btn-sm', isBookmarked ? 'btn-outline' : 'btn-secondary')}>
                <Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-current')} aria-hidden="true" />{isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
              <span className="badge badge-primary"><meta.icon className="h-3.5 w-3.5" aria-hidden="true" />{meta.label}</span>
              {lesson.durationMinutes > 0 && <span>{formatMinutes(lesson.durationMinutes)}</span>}
              {lesson.required === false && <span className="badge badge-neutral">Optional</span>}
              {isDone && <span className="badge badge-success"><CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />Completed</span>}
              <span className="ml-auto text-xs">Lesson {index + 1} of {lessons.length}</span>
            </div>

            <div className="mt-6">
              {lesson.type === 'video' && (
                <div className="space-y-6">
                  <VideoPlayer
                    key={lesson.id}
                    src={lesson.videoUrl}
                    poster={course.thumbnail}
                    title={lesson.title}
                    captions={demoCaptions(lesson)}
                    onEnded={() => { if (!isDone) setComplete(true) }}
                  />
                  <div className="card p-6"><Markdown content={lesson.content} /></div>
                </div>
              )}
              {(lesson.type === 'article' || lesson.type === 'reading') && (
                <article className="card p-6 sm:p-8">
                  {lesson.type === 'reading' && <p className="mb-4 rounded-lg bg-info-soft px-3 py-2 text-xs font-medium text-[#1F4E5F]">Guided reading · approx. {formatMinutes(lesson.durationMinutes)}</p>}
                  <Markdown content={lesson.content} />
                </article>
              )}
              {lesson.type === 'quiz' && (quiz ? (
                <QuizRunner key={lesson.id} quiz={quiz} course={course} lesson={lesson} user={user} onContinue={next ? () => goTo(next) : undefined} />
              ) : (
                <p className="card p-6 text-sm text-muted">The quiz for this lesson is not available.</p>
              ))}
              {lesson.type === 'assignment' && (assignment ? (
                <AssignmentPanel key={lesson.id} assignment={assignment} course={course} lesson={lesson} user={user} now={now} />
              ) : (
                <p className="card p-6 text-sm text-muted">The assignment for this lesson is not available.</p>
              ))}
              {lesson.type === 'resource' && (
                <div className="space-y-4">
                  {lesson.content && <p className="text-sm text-slate-700">{lesson.content}</p>}
                  <ResourceList course={course} notes={notes.filter((n) => n.userId === user.id && n.courseId === course.id)} onDownloaded={(m) => toast.success(m)} />
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" className="btn btn-secondary" onClick={() => goTo(prev)} disabled={!prev}><ArrowLeft className="h-4 w-4" aria-hidden="true" />Previous</button>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {manualCompletion && (isDone ? (
                  <button type="button" className="btn btn-ghost" onClick={() => setComplete(false)}><Undo2 className="h-4 w-4" aria-hidden="true" />Mark as not complete</button>
                ) : (
                  <button type="button" className="btn btn-outline" onClick={() => setComplete(true)}><CircleCheck className="h-4 w-4" aria-hidden="true" />Mark as complete</button>
                ))}
                {!manualCompletion && !isDone && (
                  <p className="text-xs text-muted">{lesson.type === 'quiz' ? 'Pass the quiz to complete this lesson.' : 'Submit the assignment to complete this lesson.'}</p>
                )}
              </div>
              {next ? (
                <button type="button" className="btn btn-primary" onClick={manualCompletion ? completeAndNext : () => goTo(next)}>
                  {manualCompletion && !isDone ? 'Complete & continue' : 'Next lesson'}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <Link to="/learn/my-learning" className="btn btn-primary">Finish<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              )}
            </div>

            <div className="mt-10">
              <Tabs
                tabs={[{ id: 'overview', label: 'Overview' }, { id: 'notes', label: 'Notes & bookmarks' }, { id: 'discussion', label: 'Discussion' }, { id: 'resources', label: 'Resources' }]}
                value={tab}
                onChange={setTab}
                ariaLabel="Lesson tools"
              />
              <div className="py-6" role="tabpanel">
                {tab === 'overview' && (
                  <div className="space-y-3 text-sm text-slate-700">
                    <p>{lesson.description}</p>
                    <p className="text-muted">Part of <strong className="text-ink">{lesson.moduleTitle}</strong> in {course.title}. Progress is saved automatically in this browser.</p>
                    <p className="text-xs text-muted">Keyboard tip: when the video player is focused, press Space to play/pause, ←/→ to seek, M to mute, F for full screen and C for captions.</p>
                  </div>
                )}
                {tab === 'notes' && <NotesPanel key={lesson.id} course={course} lesson={lesson} user={user} />}
                {tab === 'discussion' && <DiscussionPanel course={course} user={user} />}
                {tab === 'resources' && <ResourceList course={course} notes={notes.filter((n) => n.userId === user.id && n.courseId === course.id)} onDownloaded={(m) => toast.success(m)} />}
              </div>
            </div>
          </div>
        </main>

        {sidebarOpen && (
          <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[340px] shrink-0 overflow-y-auto border-l border-line bg-white lg:block" aria-label="Course content">
            {sidebar}
          </aside>
        )}
      </div>

      <Modal open={drawerOpen} onClose={() => setDrawerOpen(false)} variant="drawer" title="Course content" description={`${progress.percent}% complete`}>
        <div className="-mx-5 -my-5 sm:-mx-6">{sidebar}</div>
      </Modal>
    </div>
  )
}
