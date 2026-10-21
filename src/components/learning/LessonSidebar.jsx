import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, CircleCheck, Circle, Bookmark } from 'lucide-react'
import { lessonTypeMeta } from './lessonMeta'
import { moduleProgress } from '../../utils/learning'
import { formatMinutes } from '../../utils/format'
import { cn } from '../../utils/cn'

/** Curriculum navigator for the course player with module completion and current-lesson state. */
export default function LessonSidebar({ course, currentLessonId, completedIds, bookmarkedIds, onNavigate }) {
  const currentModule = course.modules.find((m) => m.lessons.some((l) => l.id === currentLessonId))
  const [openModules, setOpenModules] = useState(() => new Set(currentModule ? [currentModule.id] : [course.modules[0]?.id]))
  const [lastCurrent, setLastCurrent] = useState(currentModule?.id)

  // Expand the module of the lesson being viewed when the learner navigates.
  if (currentModule && currentModule.id !== lastCurrent) {
    setLastCurrent(currentModule.id)
    setOpenModules((s) => new Set([...s, currentModule.id]))
  }

  const toggle = (id) => setOpenModules((s) => {
    const next = new Set(s)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  const allOpen = course.modules.every((m) => openModules.has(m.id))

  return (
    <nav aria-label="Course curriculum">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">Course content</h2>
        <button type="button" className="text-xs font-semibold text-secondary hover:underline" onClick={() => setOpenModules(allOpen ? new Set() : new Set(course.modules.map((m) => m.id)))}>
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>
      <ol className="border-t border-line">
        {course.modules.map((module, mi) => {
          const p = moduleProgress(module, completedIds)
          const open = openModules.has(module.id)
          return (
            <li key={module.id} className="border-b border-line">
              <button type="button" onClick={() => toggle(module.id)} aria-expanded={open} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50">
                <span className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold', p.complete ? 'bg-success text-white' : 'bg-primary-soft text-primary')}>
                  {p.complete ? <CircleCheck className="h-4 w-4" aria-hidden="true" /> : mi + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink">{module.title}</span>
                  <span className="block text-xs text-muted">{p.done}/{p.total} complete{p.complete ? ' · Module complete' : ''}</span>
                </span>
                <ChevronDown className={cn('mt-0.5 h-4 w-4 shrink-0 text-muted transition-transform', open && 'rotate-180')} aria-hidden="true" />
              </button>
              {open && (
                <ol className="pb-2">
                  {module.lessons.map((lesson) => {
                    const meta = lessonTypeMeta(lesson.type)
                    const TypeIcon = meta.icon
                    const done = completedIds.has(lesson.id)
                    const current = lesson.id === currentLessonId
                    return (
                      <li key={lesson.id}>
                        <Link
                          to={`/learn/course/${course.id}/${lesson.id}`}
                          onClick={onNavigate}
                          aria-current={current ? 'page' : undefined}
                          className={cn('relative flex items-start gap-3 py-2 pr-4 pl-6 text-sm transition-colors', current ? 'bg-primary-soft' : 'hover:bg-slate-50')}
                        >
                          {current && <span className="absolute inset-y-0 left-0 w-1 bg-accent" aria-hidden="true" />}
                          {done ? (
                            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-label="Completed" />
                          ) : (
                            <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" aria-label="Not completed" />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className={cn('block', current ? 'font-semibold text-ink' : 'text-slate-700')}>{lesson.title}</span>
                            <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                              <TypeIcon className="h-3.5 w-3.5" aria-hidden="true" />{meta.label}
                              {lesson.durationMinutes ? ` · ${formatMinutes(lesson.durationMinutes)}` : ''}
                              {lesson.required === false && ' · Optional'}
                            </span>
                          </span>
                          {bookmarkedIds.has(lesson.id) && <Bookmark className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-accent text-accent" aria-label="Bookmarked" />}
                        </Link>
                      </li>
                    )
                  })}
                </ol>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
