import { Link } from 'react-router-dom'
import { Award, BookOpen, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import CourseCard from '../../components/courses/CourseCard'
import { Reveal } from '../../components/common/Motion'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const PROGRAM_TYPES = [
  { type: 'Professional Certificate', icon: Award, description: 'In-depth programmes such as ISO Lead Auditor, Lean Six Sigma and OSHA that end with a case study or project.' },
  { type: 'Course', icon: BookOpen, description: 'Focused courses such as ISO Internal Auditor that build practical skills in about two days of study.' },
  { type: 'Exam Preparation', icon: GraduationCap, description: 'Structured preparation for PMI’s PMP® and PMI-RMP® certification exams.' },
  { type: 'Awareness Training', icon: ShieldCheck, description: 'Short essentials such as first aid, fire safety, defensive driving, 5S and Schedule Q.' },
]

export default function Programs() {
  useDocumentTitle('Learning programs')
  const { courses } = useData()
  const published = courses.filter((c) => c.status === 'published')
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Learning programs' }]} eyebrow="Programs" title="Learning programs for every goal" description="From short awareness sessions to in-depth lead auditor certificates and exam preparation." />
      <div className="container-page space-y-14 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAM_TYPES.map((p, i) => (
            <Reveal key={p.type} delay={i * 80} className="h-full">
            <a href={`#${p.type.replace(/\s+/g, '-').toLowerCase()}`} className="card card-hover card-glow group block h-full p-5">
              <p.icon className="h-6 w-6 text-secondary transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6" aria-hidden="true" />
              <h2 className="mt-3 font-semibold text-ink">{p.type}</h2>
              <p className="mt-1 text-sm text-muted">{p.description}</p>
              <p className="mt-3 text-sm font-semibold text-secondary">{published.filter((c) => c.courseType === p.type).length} available</p>
            </a>
            </Reveal>
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
                {list.slice(0, 8).map((c, i) => <Reveal key={c.id} delay={(i % 4) * 70} className="h-full"><CourseCard course={c} /></Reveal>)}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
