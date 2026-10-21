import { CircleCheck } from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import SmartImage from '../../components/common/SmartImage'
import DemoInquiryForm from '../../components/forms/DemoInquiryForm'
import Icon from '../../components/common/Icon'
import { Reveal } from '../../components/common/Motion'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { IMAGES } from '../../data/images'
import { SERVICES, CHALLENGES } from '../../data/companyInfo'

export default function Business() {
  useDocumentTitle('Meridian for Business')
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'For Business' }]} eyebrow="Meridian for Business" title="Training and advisory for your whole organisation" description="Customised corporate training, audit readiness programmes and expert advisory — designed around your industry, sites and standards." />
      <div className="container-page grid gap-12 py-14 lg:grid-cols-2">
        <div>
          <Reveal variant="zoom"><SmartImage src={IMAGES.business} alt="A team planning a training programme" className="aspect-[16/10] rounded-[2rem] shadow-[0_30px_60px_-30px_rgb(9_63_80/0.6)]" seed="business" /></Reveal>
          <Reveal className="mt-10">
            <h2 className="text-xl font-bold">Are these holding you back?</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {CHALLENGES.map((c) => (
                <li key={c} className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-slate-700 transition-all hover:-translate-y-0.5 hover:border-accent"><span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />{c}</li>
              ))}
            </ul>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {SERVICES.slice(0, 4).map((s, i) => (
              <Reveal key={s.id} delay={i * 80}>
                <div className="card card-hover group h-full p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary transition-all group-hover:bg-primary group-hover:text-white"><Icon name={s.icon} className="h-5 w-5" /></span>
                  <h3 className="mt-3 font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted line-clamp-3">{s.summary}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <ul className="mt-8 space-y-2 text-sm text-slate-700">
            {['On-site, virtual or blended delivery', 'Programmes mapped to ISO standards and your procedures', 'Progress analytics for managers'].map((t) => (
              <li key={t} className="flex items-center gap-2"><CircleCheck className="h-4 w-4 text-success" aria-hidden="true" />{t}</li>
            ))}
          </ul>
        </div>
        <Reveal variant="right" className="h-fit">
          <div className="card p-6 sm:p-8 lg:sticky lg:top-28">
            <h2 className="text-xl font-bold">Book a free strategy call</h2>
            <p className="mt-1 text-sm text-muted">Tell us about your team. In this demo the form is validated locally and nothing is sent.</p>
            <div className="mt-6">
              <DemoInquiryForm
                submitLabel="Request a call"
                successTitle="Request recorded (demo — not sent)"
                fields={[
                  { name: 'name', label: 'Full name', required: true, autoComplete: 'name' },
                  { name: 'email', label: 'Work email', type: 'email', required: true, autoComplete: 'email' },
                  { name: 'company', label: 'Organisation', required: true, autoComplete: 'organization' },
                  { name: 'size', label: 'Team size', type: 'select', required: true, options: ['1–10', '11–50', '51–200', '201–1,000', '1,000+'] },
                  { name: 'interest', label: 'Main interest', type: 'select', required: true, options: ['ISO auditor training', 'HSE training', 'Lean Six Sigma', 'Advisory', 'Compliance audits', 'Sustainability', 'Corporate wellbeing'], full: true },
                  { name: 'message', label: 'What would you like to achieve?', type: 'textarea', minLength: 10 },
                ]}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </>
  )
}
