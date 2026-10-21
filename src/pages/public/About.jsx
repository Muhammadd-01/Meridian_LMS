import { Link } from 'react-router-dom'
import { Target, HeartHandshake, ShieldCheck, Lightbulb } from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import SmartImage from '../../components/common/SmartImage'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { IMAGES } from '../../data/images'

const VALUES = [
  { icon: Target, title: 'Practical outcomes', text: 'Every course is built around skills people use at work, with projects that prove it.' },
  { icon: ShieldCheck, title: 'Quality first', text: 'Inspired by quality management principles: clear objectives, review and continuous improvement.' },
  { icon: HeartHandshake, title: 'Learner respect', text: 'Honest progress tracking, accessible design and no dark patterns.' },
  { icon: Lightbulb, title: 'Curiosity', text: 'We celebrate questions and make it easy to keep learning a little every day.' },
]

export default function About() {
  useDocumentTitle('About')
  const { courses, instructors, categories, settings } = useData()
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]} eyebrow="About us" title={`About ${settings.platformName}`} description="Meridian LMS is a demonstration learning platform inspired by the Meridian Quality Management Professionals brand." />
      <div className="container-page space-y-16 py-12">
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Our mission</h2>
            <p className="mt-4 leading-7 text-slate-700">We believe professional learning should be practical, well-structured and measurable. Meridian brings together expert-led courses, guided career paths and honest progress tracking so learners can build skills that matter — and organisations can see real development.</p>
            <p className="mt-4 leading-7 text-slate-700">This application is a <strong>frontend-only demonstration</strong>. All instructors, partner institutions, learners, reviews and figures are fictional, and every action you take is stored in your own browser.</p>
            <div className="mt-6 flex gap-3">
              <Link to="/courses" className="btn btn-primary">Explore courses</Link>
              <Link to="/contact" className="btn btn-secondary">Contact us</Link>
            </div>
          </div>
          <SmartImage src={IMAGES.about} alt="A presenter leading a workshop" className="aspect-[4/3] rounded-2xl" seed="about" />
        </section>
        <section>
          <h2 className="section-title">What we value</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="card p-6">
                <v.icon className="h-6 w-6 text-secondary" aria-hidden="true" />
                <h3 className="mt-3 font-semibold text-ink">{v.title}</h3>
                <p className="mt-1 text-sm text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="grid gap-4 rounded-2xl bg-deep p-8 text-white sm:grid-cols-3">
          {[
            { label: 'Courses in the demo catalogue', value: courses.length },
            { label: 'Fictional instructors', value: instructors.length },
            { label: 'Subject categories', value: categories.length },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-white/70">{s.label}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}
