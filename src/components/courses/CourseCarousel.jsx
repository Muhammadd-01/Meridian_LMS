import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import CourseCard from './CourseCard'
import { SectionHeading } from '../common/ui'

/** Horizontally scrollable course row with snap points and arrow controls. */
export default function CourseCarousel({ eyebrow, title, description, courses, viewAllTo }) {
  const trackRef = useRef(null)
  const scroll = (dir) => {
    const el = trackRef.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
  }
  if (!courses.length) return null
  return (
    <section aria-label={title}>
      <SectionHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={(
          <div className="flex items-center gap-2">
            {viewAllTo && (
              <Link to={viewAllTo} className="btn btn-ghost btn-sm text-secondary">
                View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
            <button type="button" onClick={() => scroll(-1)} className="btn btn-secondary btn-icon hidden rounded-full sm:inline-flex" aria-label={`Scroll ${title} left`}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => scroll(1)} className="btn btn-secondary btn-icon hidden rounded-full sm:inline-flex" aria-label={`Scroll ${title} right`}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      />
      <div ref={trackRef} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pt-1 pb-4 sm:mx-0 sm:px-0">
        {courses.map((course) => (
          <div key={course.id} className="w-[78%] shrink-0 snap-start sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] xl:w-[calc(25%-12px)]">
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </section>
  )
}
