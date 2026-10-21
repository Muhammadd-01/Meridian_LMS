import { BarChart3, Users, ShieldCheck, Route, CircleCheck } from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import SmartImage from '../../components/common/SmartImage'
import DemoInquiryForm from '../../components/forms/DemoInquiryForm'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { IMAGES } from '../../data/images'

const FEATURES = [
  { icon: Route, title: 'Curated learning paths', text: 'Assign role-based paths and track completion across teams.' },
  { icon: BarChart3, title: 'Progress analytics', text: 'See enrolments, completions and assessment results in one dashboard.' },
  { icon: Users, title: 'Team management', text: 'Organise learners by team and manage enrolments in bulk.' },
  { icon: ShieldCheck, title: 'Quality-first content', text: 'Courses aligned with quality management and professional practice.' },
]

export default function Business() {
  useDocumentTitle('Meridian for Business')
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'For Business' }]} eyebrow="Meridian for Business" title="Upskill your teams with Meridian" description="Give your organisation curated learning paths, progress analytics and quality-focused content. This page demonstrates a typical B2B offering." />
      <div className="container-page grid gap-12 py-12 lg:grid-cols-2">
        <div>
          <SmartImage src={IMAGES.business} alt="Colleagues planning together" className="aspect-[16/10] rounded-2xl" seed="business" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-5">
                <f.icon className="h-6 w-6 text-secondary" aria-hidden="true" />
                <h2 className="mt-3 font-semibold text-ink">{f.title}</h2>
                <p className="mt-1 text-sm text-muted">{f.text}</p>
              </div>
            ))}
          </div>
          <ul className="mt-8 space-y-2 text-sm text-slate-700">
            {['Admin dashboard with sample analytics', 'Announcements to targeted learner groups', 'Assessment and assignment management'].map((t) => (
              <li key={t} className="flex items-center gap-2"><CircleCheck className="h-4 w-4 text-success" aria-hidden="true" />{t}</li>
            ))}
          </ul>
        </div>
        <div className="card h-fit p-6 sm:p-8">
          <h2 className="text-xl font-bold">Request a demo</h2>
          <p className="mt-1 text-sm text-muted">Tell us about your team. In this frontend demo the form is validated locally and nothing is sent.</p>
          <div className="mt-6">
            <DemoInquiryForm
              submitLabel="Request demo"
              successTitle="Demo request recorded (not sent)"
              fields={[
                { name: 'name', label: 'Full name', required: true, autoComplete: 'name' },
                { name: 'email', label: 'Work email', type: 'email', required: true, autoComplete: 'email' },
                { name: 'company', label: 'Organisation', required: true, autoComplete: 'organization' },
                { name: 'size', label: 'Team size', type: 'select', required: true, options: ['1–10', '11–50', '51–200', '201–1,000', '1,000+'] },
                { name: 'message', label: 'What would you like your team to learn?', type: 'textarea', minLength: 10 },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  )
}
