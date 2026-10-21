import { Link } from 'react-router-dom'
import { MoreHorizontal, PlayCircle, Archive, ArchiveRestore, Info, Award } from 'lucide-react'
import SmartImage from '../common/SmartImage'
import Dropdown from '../common/Dropdown'
import { ProgressBar, StatusBadge } from '../common/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { computeProgress, enrollmentStatus, getAllLessons } from '../../utils/learning'
import { relativeTime } from '../../utils/format'

export default function EnrolledCourseCard({ course, enrollment, compact = false }) {
  const { instructors, actions } = useData()
  const toast = useToast()
  const instructor = instructors.find((i) => i.id === course.instructorId)
  const progress = computeProgress(course, enrollment)
  const status = enrollmentStatus(course, enrollment)
  const nextLesson = getAllLessons(course).find((l) => l.id === enrollment.lastLessonId)
  const cta = status === 'completed' ? 'Review course' : status === 'not-started' ? 'Start course' : 'Continue learning'

  const archive = (value) => {
    actions.setEnrollmentArchived(enrollment.id, value)
    toast.success(value ? 'Course moved to Archived.' : 'Course restored to My Learning.')
  }

  return (
    <article className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <Link to={`/learn/course/${course.id}`} className="shrink-0" tabIndex={-1} aria-hidden="true">
        <SmartImage src={course.thumbnail} alt="" seed={course.id} fallbackLabel={course.title} className={compact ? 'aspect-video w-full rounded-lg sm:w-36' : 'aspect-video w-full rounded-lg sm:w-48'} />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-secondary">{course.providerName}</p>
            <h3 className="mt-0.5 font-semibold text-ink">
              <Link to={`/learn/course/${course.id}`} className="hover:underline">{course.title}</Link>
            </h3>
            <p className="text-xs text-muted">{instructor?.name}</p>
          </div>
          <Dropdown
            label={`Actions for ${course.title}`}
            trigger={<span className="rounded-lg p-1.5 text-muted hover:bg-slate-100"><MoreHorizontal className="h-5 w-5" aria-hidden="true" /></span>}
            items={[
              { label: cta, icon: PlayCircle, to: `/learn/course/${course.id}` },
              { label: 'Course details', icon: Info, to: `/courses/${course.slug}` },
              ...(status === 'completed' ? [{ label: 'View certificate', icon: Award, to: '/learn/certificates' }] : []),
              { divider: true },
              enrollment.archived
                ? { label: 'Restore from archive', icon: ArchiveRestore, onClick: () => archive(false) }
                : { label: 'Archive course', icon: Archive, onClick: () => archive(true) },
            ]}
          />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <ProgressBar value={progress.percent} className="flex-1" label={`${course.title} progress`} />
          <span className="text-sm font-semibold text-ink">{progress.percent}%</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <StatusBadge status={status} />
          <span>{progress.completed}/{progress.total} required lessons</span>
          <span>Last accessed {relativeTime(enrollment.lastAccessedAt)}</span>
        </div>
        {!compact && nextLesson && status !== 'completed' && (
          <p className="mt-2 truncate text-xs text-slate-600">Next up: <span className="font-medium">{nextLesson.title}</span></p>
        )}
      </div>
      {!enrollment.archived && (
        <Link to={`/learn/course/${course.id}`} className={status === 'completed' ? 'btn btn-secondary shrink-0' : 'btn btn-primary shrink-0'}>
          {cta}
        </Link>
      )}
    </article>
  )
}
