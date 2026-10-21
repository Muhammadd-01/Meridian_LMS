import { useParams } from 'react-router-dom'
import { Star, BookOpen, Users, Building2, ExternalLink } from 'lucide-react'
import CourseCard from '../../components/courses/CourseCard'
import MissingRecord from '../../components/common/MissingRecord'
import { Avatar, Breadcrumbs } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatCompact, formatNumber } from '../../utils/format'

function isValidUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export default function InstructorProfile() {
  const { instructorId } = useParams()
  const { instructors, courses } = useData()
  const instructor = instructors.find((i) => i.id === instructorId)
  useDocumentTitle(instructor?.name || 'Instructor not found')

  if (!instructor) {
    return <MissingRecord title="Instructor not found" description="We couldn’t find an instructor with that profile link." backTo="/instructors" backLabel="View all instructors" />
  }

  const taught = courses.filter((c) => c.instructorId === instructor.id && c.status === 'published')
  const totalReviews = taught.reduce((s, c) => s + c.reviewCount, 0)

  return (
    <>
      <section className="bg-deep text-white">
        <div className="container-page py-10 sm:py-14">
          <Breadcrumbs tone="light" items={[{ label: 'Home', to: '/' }, { label: 'Instructors', to: '/instructors' }, { label: instructor.name }]} />
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar name={instructor.name} src={instructor.avatar} size="xl" className="h-28 w-28 ring-4 ring-white/15" />
            <div>
              <p className="eyebrow text-[#9fd3e3]">Instructor</p>
              <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">{instructor.name}</h1>
              <p className="mt-1 text-lg text-white/80">{instructor.title}</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-white/70"><Building2 className="h-4 w-4" aria-hidden="true" />{instructor.organization}</p>
            </div>
          </div>
        </div>
      </section>
      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-10">
          <section aria-labelledby="bio-title">
            <h2 id="bio-title" className="text-xl font-bold">About {instructor.name.replace(/^Dr\.\s*/, '').split(' ')[0]}</h2>
            <p className="mt-3 leading-7 text-slate-700">{instructor.bio}</p>
            <h3 className="mt-6 font-semibold text-ink">Areas of expertise</h3>
            <div className="mt-3 flex flex-wrap gap-2">{instructor.expertise.map((e) => <span key={e} className="badge badge-primary px-3 py-1 text-sm">{e}</span>)}</div>
          </section>
          <section aria-labelledby="courses-title">
            <h2 id="courses-title" className="text-xl font-bold">Courses taught ({taught.length})</h2>
            {taught.length ? (
              <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{taught.map((c) => <CourseCard key={c.id} course={c} />)}</div>
            ) : (
              <p className="mt-3 text-sm text-muted">No published courses at the moment.</p>
            )}
          </section>
        </div>
        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-ink">Instructor statistics</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-muted"><Star className="h-4 w-4 text-accent" aria-hidden="true" />Instructor rating</dt><dd className="font-semibold">{instructor.rating ? instructor.rating.toFixed(1) : '—'}</dd></div>
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-muted"><BookOpen className="h-4 w-4 text-secondary" aria-hidden="true" />Courses</dt><dd className="font-semibold">{taught.length}</dd></div>
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-muted"><Users className="h-4 w-4 text-secondary" aria-hidden="true" />Learners</dt><dd className="font-semibold">{formatCompact(instructor.learners)}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-muted">Course ratings</dt><dd className="font-semibold">{formatNumber(totalReviews)}</dd></div>
            </dl>
            <p className="mt-4 text-xs text-slate-400">Illustrative demo figures.</p>
          </div>
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-ink">Links</h2>
            {isValidUrl(instructor.website) ? (
              <a href={instructor.website} target="_blank" rel="noopener noreferrer" className="link mt-3 inline-flex items-center gap-1 text-sm">Personal website <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>
            ) : (
              <p className="mt-2 text-sm text-muted">This fictional instructor has no public links.</p>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}
