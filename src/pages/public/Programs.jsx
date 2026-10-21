import { Link } from 'react-router-dom'
import { Award, Layers, BookOpen, Rocket, ArrowRight } from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import CourseCard from '../../components/courses/CourseCard'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const PROGRAM_TYPES = [
  { type: 'Professional Certificate', icon: Award, description: 'Job-focused, multi-module programmes that prepare you for a specific role, ending with a capstone and demo certificate.' },
  { type: 'Specialization', icon: Layers, description: 'In-depth series that build deep expertise in one topic over several modules.' },
  { type: 'Course', icon: BookOpen, description: 'Focused courses that teach a single skill set in a few weeks.' },
  { type: 'Guided Project', icon: Rocket, description: 'Short, hands-on projects completed in a few hours.' },
]

export default function Programs() {
  useDocumentTitle('Learning programs')
  const { courses } = useData()
  const published = courses.filter((c) => c.status === 'published')
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Learning programs' }]} eyebrow="Programs" title="Learning programs for every goal" description="From short guided projects to career-ready professional certificates." />
      <div className="container-page space-y-14 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAM_TYPES.map((p) => (
            <a key={p.type} href={`#${p.type.replace(/\s+/g, '-').toLowerCase()}`} className="card card-hover p-5">
              <p.icon className="h-6 w-6 text-secondary" aria-hidden="true" />
              <h2 className="mt-3 font-semibold text-ink">{p.type}</h2>
              <p className="mt-1 text-sm text-muted">{p.description}</p>
              <p className="mt-3 text-sm font-semibold text-secondary">{published.filter((c) => c.courseType === p.type).length} available</p>
            </a>
          ))}
        </div>
        {PROGRAM_TYPES.map((p) => {
          const list = published.filter((c) => c.courseType === p.type)
          if (!list.length) return null
          return (
            <section key={p.type} id={p.type.replace(/\s+/g, '-').toLowerCase()} className="scroll-mt-24" aria-labelledby={`${p.type}-title`}>
              <div className="mb-5 flex items-end justify-between gap-3">
                <h2 id={`${p.type}-title`} className="section-title">{p.type}s</h2>
                <Link to={`/courses?type=${encodeURIComponent(p.type)}`} className="btn btn-ghost btn-sm text-secondary">View in catalogue <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {list.slice(0, 8).map((c) => <CourseCard key={c.id} course={c} />)}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
