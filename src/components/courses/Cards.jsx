import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Clock, Star } from 'lucide-react'
import Icon from '../common/Icon'
import SmartImage from '../common/SmartImage'
import { Avatar } from '../common/ui'
import { formatCompact } from '../../utils/format'
import { cn } from '../../utils/cn'

export function CategoryCard({ category, count, className }) {
  return (
    <Link
      to={`/courses?category=${category.slug}`}
      className={cn('card card-hover card-glow group relative flex items-center gap-4 overflow-hidden p-4', className)}
    >
      <span className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-gradient-to-br from-info/0 to-info/0 transition-all duration-500 group-hover:from-info/15 group-hover:to-accent/15 group-hover:scale-150" aria-hidden="true" />
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-deep group-hover:text-white group-hover:shadow-lg">
        <Icon name={category.icon} className="h-6 w-6" />
      </span>
      <span className="relative min-w-0">
        <span className="block font-semibold text-ink transition-colors group-hover:text-primary">{category.name}</span>
        <span className="block text-xs text-muted">{count} course{count === 1 ? '' : 's'}</span>
      </span>
      <ArrowRight className="relative ml-auto h-4 w-4 shrink-0 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" aria-hidden="true" />
    </Link>
  )
}

export function InstructorCard({ instructor, courseCount, className }) {
  return (
    <Link to={`/instructors/${instructor.id}`} className={cn('card card-hover card-glow group relative flex flex-col items-center overflow-hidden p-6 text-center', className)}>
      <span className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-br from-primary-soft via-info-soft to-accent-soft opacity-70 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
      <span className="relative rounded-full p-1 transition-transform duration-500 group-hover:scale-105">
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-accent via-info to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
        <Avatar name={instructor.name} src={instructor.avatar} size="xl" className="relative ring-4 ring-white" />
      </span>
      <h3 className="relative mt-4 font-semibold text-ink transition-colors group-hover:text-primary">{instructor.name}</h3>
      <p className="relative text-sm text-muted">{instructor.title}</p>
      <p className="relative mt-1 text-xs font-medium text-secondary">{instructor.organization}</p>
      <div className="relative mt-4 flex items-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />{instructor.rating ? instructor.rating.toFixed(1) : '—'}</span>
        <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" aria-hidden="true" />{courseCount} courses</span>
        {instructor.learners > 0 && <span>{formatCompact(instructor.learners)} learners</span>}
      </div>
    </Link>
  )
}

export function CareerPathCard({ path, className, progress }) {
  return (
    <Link to={`/career-paths/${path.slug}`} className={cn('card card-hover card-glow group flex h-full flex-col overflow-hidden', className)}>
      <div className="relative overflow-hidden">
        <SmartImage src={path.image} alt="" seed={path.id} fallbackLabel={path.title} className="aspect-[2/1] w-full" imgClassName="transition-transform duration-700 group-hover:scale-110" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-deep/80 to-transparent" aria-hidden="true" />
        <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold text-ink shadow">
          <Clock className="h-3 w-3" aria-hidden="true" />~{path.estimatedMonths} months
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">Career path</p>
        <h3 className="mt-1 text-lg font-semibold text-ink transition-colors group-hover:text-primary">{path.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{path.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {path.skills.slice(0, 4).map((skill) => <span key={skill} className="badge badge-neutral transition-colors group-hover:bg-primary-soft group-hover:text-primary">{skill}</span>)}
        </div>
        <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" aria-hidden="true" />{path.courseIds.length} courses</span>
          {progress != null ? (
            <span className="ml-auto font-semibold text-primary">{progress}% complete</span>
          ) : (
            <span className="ml-auto inline-flex items-center gap-1 font-semibold text-secondary">
              View path <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
