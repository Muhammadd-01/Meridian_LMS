import { Link } from 'react-router-dom'
import { CircleCheck, MapPin, ArrowRight } from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import SmartImage from '../../components/common/SmartImage'
import Icon from '../../components/common/Icon'
import { Reveal, AnimatedCounter, Marquee } from '../../components/common/Motion'
import { GlobePattern } from '../../components/common/BrandDecor'
import { SectionHeading } from '../../components/common/ui'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { IMAGES } from '../../data/images'
import { COMPANY, SERVICES, INDUSTRIES, EXPERTISE } from '../../data/companyInfo'

export default function About() {
  useDocumentTitle('About')
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
        eyebrow="About MEQMP"
        title="Partners in quality excellence and strategic growth"
        description={`Advisory, training, compliance, sustainability and corporate wellbeing across the ${COMPANY.regions.join(', ')} since ${COMPANY.since}.`}
      />
      <div className="container-page space-y-24 py-16">
        <section className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal variant="left">
            <h2 className="section-title">Who we are</h2>
            <p className="mt-4 leading-7 text-slate-700">
              {COMPANY.name} is an ISO 9001:2015 certified organisation that helps businesses design quality management systems, close compliance gaps, prepare for audits and build capable, safety-conscious teams.
              We work with clients across the {COMPANY.regions.join(', ')} from offices in {COMPANY.offices.map((o) => (o.city ? `${o.city}, ${o.country}` : o.country)).join('; ')}.
            </p>
            <p className="mt-4 leading-7 text-slate-700">
              As the first TVTC foreign registered training center in Saudi Arabia, MEQMP combines globally certified trainers with industry-recognised auditors — and the Meridian learning platform brings that training online.
            </p>
            <ul className="mt-6 space-y-2.5">
              {COMPANY.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-slate-700"><CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />{h}</li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/courses" className="btn btn-gradient rounded-full">Explore training <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              <Link to="/services" className="btn btn-secondary rounded-full">Our services</Link>
            </div>
          </Reveal>
          <Reveal variant="zoom" className="relative">
            <GlobePattern className="pointer-events-none absolute -top-8 -right-8 h-36 w-36 animate-spin-slow opacity-70" />
            <SmartImage src={IMAGES.about} alt="A trainer leading a professional workshop" className="relative aspect-[4/3] rounded-[2rem] shadow-[0_40px_80px_-30px_rgb(9_63_80/0.6)]" seed="about" />
          </Reveal>
        </section>

        <section className="relative overflow-hidden rounded-[2rem] bg-deep p-8 text-white sm:p-12">
          <div className="pointer-events-none absolute inset-0 bg-dots-light" aria-hidden="true" />
          <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {COMPANY.figures.map((f, i) => (
              <Reveal key={f.label} delay={i * 90} variant="zoom" className="rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
                <p className="text-4xl font-extrabold text-accent"><AnimatedCounter value={f.value} /></p>
                <p className="mt-1 text-sm text-white/75">{f.label}</p>
              </Reveal>
            ))}
          </div>
          <p className="relative mt-4 text-xs text-white/50">Figures as published by MEQMP.</p>
        </section>

        <section aria-labelledby="services-overview">
          <SectionHeading eyebrow="Services" title={<span id="services-overview">What we do</span>} action={<Link to="/services" className="btn btn-ghost btn-sm text-secondary">All services <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} delay={i * 80} className="h-full">
                <Link to={`/services#${s.id}`} className="card card-hover card-glow group flex h-full flex-col p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white"><Icon name={s.icon} className="h-5 w-5" /></span>
                  <h3 className="mt-4 font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1 line-clamp-3 text-sm text-muted">{s.summary}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section aria-labelledby="expertise">
          <SectionHeading eyebrow="Expertise" title={<span id="expertise">Standards and disciplines we know inside out</span>} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {EXPERTISE.map((e, i) => (
              <Reveal key={e.code} delay={(i % 4) * 60}>
                <div className="card hover-lift p-4"><p className="font-bold text-primary">{e.code}</p><p className="text-sm text-muted">{e.area}</p></div>
              </Reveal>
            ))}
          </div>
        </section>

        <section aria-labelledby="industries">
          <SectionHeading eyebrow="Industries" title={<span id="industries">Trusted across industries</span>} />
          <div className="rounded-2xl border border-line bg-white py-5"><Marquee items={INDUSTRIES} separator="◆" itemClassName="text-base font-semibold text-primary" /></div>
        </section>

        <section aria-labelledby="locations">
          <SectionHeading eyebrow="Global presence" title={<span id="locations">Our global locations</span>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COMPANY.offices.map((o, i) => (
              <Reveal key={o.country} delay={i * 80}>
                <div className="card card-hover group flex items-center gap-4 p-5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-ink transition-transform duration-300 group-hover:scale-110"><MapPin className="h-6 w-6" aria-hidden="true" /></span>
                  <div><p className="font-semibold text-ink">{o.city || o.country}</p><p className="text-sm text-muted">{o.city ? o.country : 'North America'}</p></div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
