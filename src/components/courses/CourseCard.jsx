import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Heart, Clock, Signal, Users, ArrowRight } from 'lucide-react'
import SmartImage from '../common/SmartImage'
import { RatingStars } from '../common/ui'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { formatCompact } from '../../utils/format'
import { cn } from '../../utils/cn'

export function SaveCourseButton({ courseId, className, withLabel = false }) {
  const { saved, actions } = useData()
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const isSaved = Boolean(user) && saved.some((s) => s.userId === user.id && s.courseId === courseId)

  const onClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!user) {
      toast.info('Sign in with the demo learner account to save courses.')
      navigate('/login', { state: { from: location.pathname + location.search } })
      return
    }
    if (user.role !== 'learner') {
      toast.info('Saving courses is a learner feature. Sign in as the demo learner to try it.')
      return
    }
    const nowSaved = actions.toggleSaved(user.id, courseId)
    if (nowSaved) toast.success('Course saved to your list.')
    else toast.info('Course removed from your saved list.')
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSaved}
      aria-label={isSaved ? 'Remove from saved courses' : 'Save course'}
      className={cn(
        withLabel ? 'btn btn-secondary' : 'flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white',
        className,
      )}
    >
      <Heart className={cn('h-4 w-4', isSaved ? 'fill-[#E11D48] text-[#E11D48]' : '')} aria-hidden="true" />
      {withLabel && (isSaved ? 'Saved' : 'Save to wishlist')}
    </button>
  )
}

export default function CourseCard({ course, variant = 'grid', showSave = true, className }) {
  const { instructors, categories } = useData()
  const instructor = instructors.find((i) => i.id === course.instructorId)
  const category = categories.find((c) => c.id === course.categoryId)
  const href = `/courses/${course.slug}`

  if (variant === 'list') {
    return (
      <article className={cn('card card-hover card-glow group relative flex flex-col gap-4 p-3 sm:flex-row', className)}>
        <SmartImage src={course.thumbnail} alt="" seed={course.id} fallbackLabel={course.title} className="aspect-[16/9] w-full shrink-0 rounded-lg sm:w-60" imgClassName="transition-transform duration-700 group-hover:scale-110" />
        <div className="flex min-w-0 flex-1 flex-col py-1 pr-2">
          <p className="text-xs font-semibold text-secondary">{course.providerName}</p>
          <h3 className="mt-1 text-base font-semibold text-ink">
            <Link to={href} className="after:absolute after:inset-0 hover:underline">{course.title}</Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{course.shortDescription}</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 text-xs text-muted">
            <RatingStars rating={course.rating} count={course.reviewCount ? formatCompact(course.reviewCount) : undefined} />
            <span className="inline-flex items-center gap-1"><Signal className="h-3.5 w-3.5" aria-hidden="true" />{course.difficulty}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{course.durationHours} hours</span>
            <span>{course.courseType}</span>
            {category && <span className="badge badge-neutral">{category.name}</span>}
            <span className={cn('badge', course.access === 'free' ? 'badge-success' : 'badge-accent')}>{course.priceLabel}</span>
          </div>
        </div>
        {showSave && <SaveCourseButton courseId={course.id} className="absolute top-5 right-5 z-10 sm:relative sm:top-auto sm:right-auto sm:self-start" />}
      </article>
    )
  }

  return (
    <article className={cn('card card-hover card-glow group relative flex h-full flex-col overflow-hidden', className)}>
      <div className="relative overflow-hidden">
        <SmartImage src={course.thumbnail} alt="" seed={course.id} fallbackLabel={course.title} className="aspect-[16/9] w-full" imgClassName="transition-transform duration-700 ease-out group-hover:scale-110" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/10 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {course.trending && <span className="badge bg-accent text-ink shadow-sm">Trending</span>}
          {course.access === 'free' && <span className="badge bg-white/95 text-success shadow-sm">Free</span>}
        </div>
        {category && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/30 backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1">
            {category.name}
          </span>
        )}
        <span className="pointer-events-none absolute right-3 bottom-3 inline-flex translate-y-3 items-center gap-1 rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-ink opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" aria-hidden="true">
          View course <ArrowRight className="h-3 w-3" />
        </span>
        {showSave && <SaveCourseButton courseId={course.id} className="absolute top-3 right-3 z-10" />}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          {instructor?.avatar && <img src={instructor.avatar} alt="" className="h-6 w-6 rounded-full object-cover ring-2 ring-white transition-transform duration-300 group-hover:scale-110" loading="lazy" />}
          <p className="truncate text-xs font-semibold text-secondary">{course.providerName}</p>
        </div>
        <h3 className="mt-2 line-clamp-2 text-[15px] leading-snug font-semibold text-ink transition-colors group-hover:text-primary">
          <Link to={href} className="after:absolute after:inset-0">{course.title}</Link>
        </h3>
        <p className="mt-1 truncate text-xs text-muted">{instructor?.name || 'Meridian faculty'}</p>
        <div className="mt-2">
          <RatingStars rating={course.rating} count={course.reviewCount ? formatCompact(course.reviewCount) : undefined} />
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3 text-[11px] font-medium text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5"><Signal className="h-3 w-3" aria-hidden="true" />{course.difficulty}</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5"><Clock className="h-3 w-3" aria-hidden="true" />{course.durationHours} hrs</span>
          <span className="rounded-md bg-primary-soft px-2 py-0.5 text-primary">{course.courseType}</span>
        </div>
        {course.enrollmentCount > 0 && (
          <p className="mt-2.5 inline-flex items-center gap-1 border-t border-line pt-2.5 text-xs text-muted">
            <Users className="h-3.5 w-3.5" aria-hidden="true" /> {formatCompact(course.enrollmentCount)} learners <span className="text-[10px] text-slate-400">(sample)</span>
          </p>
        )}
      </div>
    </article>
  )
}
