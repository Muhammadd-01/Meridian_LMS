import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck, Phone, Mail } from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import Icon from '../../components/common/Icon'
import { Reveal, Marquee } from '../../components/common/Motion'
import { SectionHeading } from '../../components/common/ui'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { COMPANY, SERVICES, PROCESS, INDUSTRIES, CERTIFICATIONS, EXPERTISE } from '../../data/companyInfo'

export default function Services() {
  useDocumentTitle('Services')
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
        eyebrow="What we do"
        title="Advisory, training, compliance & sustainability"
        description={`${COMPANY.name} partners with organisations across the ${COMPANY.regions.join(', ')} to build quality, safe and sustainable operations.`}
      />
      <div className="container-page space-y-24 py-16">
        <section aria-labelledby="services-title">
          <SectionHeading eyebrow="Our services" title={<span id="services-title">Five ways we help organisations grow</span>} />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 90} className="h-full">
                <article id={s.id} className="card card-hover card-glow group relative flex h-full scroll-mt-28 flex-col overflow-hidden p-7">
                  <span className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-gradient-to-br from-info/10 to-accent/10 transition-transform duration-500 group-hover:scale-150" aria-hidden="true" />
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-deep text-white shadow-lg transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon name={s.icon} className="h-7 w-7" />
                  </span>
                  <h3 className="relative mt-5 text-xl font-bold text-ink">{s.title}</h3>
                  <p className="relative mt-2 text-sm leading-6 text-muted">{s.summary}</p>
                  <ul className="relative mt-5 flex-1 space-y-2">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                        <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />{item}
                      </li>
                    ))}
                  </ul>
                  {s.to ? (
                    <Link to={s.to} className="relative mt-6 inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:underline">Browse courses <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link>
                  ) : (
                    <Link to="/contact" className="relative mt-6 inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:underline">Talk to our team <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2rem] bg-deep p-8 text-white sm:p-12" aria-labelledby="process-title">
          <div className="pointer-events-none absolute inset-0 bg-dots-light" aria-hidden="true" />
          <Reveal className="relative">
            <p className="eyebrow flex items-center gap-2 text-[#9fd3e3]"><span className="h-0.5 w-6 rounded-full bg-accent" aria-hidden="true" />How we work</p>
            <h2 id="process-title" className="mt-2 text-3xl font-bold text-white">We get it right the first time</h2>
          </Reveal>
          <ol className="relative mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {PROCESS.map((p, i) => (
              <Reveal as="li" key={p.step} delay={i * 110} className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-accent/60 hover:bg-white/10">
                <span className="text-4xl font-black text-accent/90 transition-transform duration-300 group-hover:scale-110 inline-block">{p.step}</span>
                <h3 className="mt-3 text-lg font-semibold text-white">{p.title}</h3>
                <p className="text-sm font-medium text-[#9fd3e3]">{p.tagline}</p>
                <p className="mt-2 text-sm leading-6 text-white/75">{p.text}</p>
              </Reveal>
            ))}
          </ol>
        </section>

        <section aria-labelledby="cert-title">
          <SectionHeading eyebrow="Certifications" title={<span id="cert-title">Standards we help you achieve</span>} description="Consultancy and audit readiness support for internationally recognised management system standards." />
          <div className="flex flex-wrap gap-3">
            {CERTIFICATIONS.map((c, i) => (
              <Reveal key={c} delay={(i % 6) * 50}>
                <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary">
                  <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />{c}
                </span>
              </Reveal>
            ))}
          </div>
        </section>

        <section aria-labelledby="expertise-title">
          <SectionHeading eyebrow="Expertise" title={<span id="expertise-title">Areas of expertise</span>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EXPERTISE.map((e, i) => (
              <Reveal key={e.code} delay={(i % 4) * 60}>
                <div className="card hover-lift group h-full p-5">
                  <p className="font-bold text-primary transition-colors group-hover:text-accent-ink">{e.code}</p>
                  <p className="mt-1 text-sm text-muted">{e.area}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section aria-labelledby="industries-title">
          <SectionHeading eyebrow="Industries" title={<span id="industries-title">Industries we serve</span>} />
          <div className="rounded-2xl border border-line bg-white py-5">
            <Marquee items={INDUSTRIES} separator="◆" itemClassName="text-base font-semibold text-primary" />
          </div>
        </section>

        <Reveal>
          <section className="flex flex-col items-start gap-6 rounded-[2rem] bg-gradient-to-br from-primary-soft via-white to-accent-soft p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">Book a free strategy call</h2>
              <p className="mt-1 text-muted">Tell us about your goals and we’ll recommend the right mix of training, advisory and compliance support.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`} className="btn btn-primary rounded-full"><Phone className="h-4 w-4" aria-hidden="true" />{COMPANY.phone}</a>
              <a href={`mailto:${COMPANY.email}`} className="btn btn-secondary rounded-full"><Mail className="h-4 w-4" aria-hidden="true" />{COMPANY.email}</a>
            </div>
          </section>
        </Reveal>
      </div>
    </>
  )
}
