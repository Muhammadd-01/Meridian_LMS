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
      className={cn('card card-hover group flex items-center gap-4 p-4', className)}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        <Icon name={category.icon} className="h-6 w-6" />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold text-ink">{category.name}</span>
        <span className="block text-xs text-muted">{count} course{count === 1 ? '' : 's'}</span>
      </span>
      <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-ink" aria-hidden="true" />
    </Link>
  )
}

export function InstructorCard({ instructor, courseCount, className }) {
  return (
    <Link to={`/instructors/${instructor.id}`} className={cn('card card-hover group flex flex-col items-center p-6 text-center', className)}>
      <Avatar name={instructor.name} src={instructor.avatar} size="xl" className="ring-4 ring-primary-soft" />
      <h3 className="mt-4 font-semibold text-ink group-hover:underline">{instructor.name}</h3>
      <p className="text-sm text-muted">{instructor.title}</p>
      <p className="mt-1 text-xs font-medium text-secondary">{instructor.organization}</p>
      <div className="mt-4 flex items-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />{instructor.rating ? instructor.rating.toFixed(1) : '—'}</span>
        <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" aria-hidden="true" />{courseCount} courses</span>
        {instructor.learners > 0 && <span>{formatCompact(instructor.learners)} learners</span>}
      </div>
    </Link>
  )
}

export function CareerPathCard({ path, className, progress }) {
  return (
    <Link to={`/career-paths/${path.slug}`} className={cn('card card-hover group flex h-full flex-col overflow-hidden', className)}>
      <SmartImage src={path.image} alt="" seed={path.id} fallbackLabel={path.title} className="aspect-[2/1] w-full" imgClassName="transition-transform duration-500 group-hover:scale-105" />
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">Career path</p>
        <h3 className="mt-1 text-lg font-semibold text-ink group-hover:underline">{path.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{path.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {path.skills.slice(0, 4).map((skill) => <span key={skill} className="badge badge-neutral">{skill}</span>)}
        </div>
        <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" aria-hidden="true" />{path.courseIds.length} courses</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />~{path.estimatedMonths} months</span>
          {progress != null && <span className="ml-auto font-semibold text-primary">{progress}% complete</span>}
        </div>
      </div>
    </Link>
  )
}
