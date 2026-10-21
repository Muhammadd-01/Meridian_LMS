import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Search, ChevronDown, Quote, PlayCircle, CircleCheck, Star, X,
  ShieldCheck, Users, Globe2, Award,
} from 'lucide-react'
import CourseCarousel from '../../components/courses/CourseCarousel'
import CourseCard from '../../components/courses/CourseCard'
import { CategoryCard, InstructorCard, CareerPathCard } from '../../components/courses/Cards'
import Icon from '../../components/common/Icon'
import SmartImage from '../../components/common/SmartImage'
import { Reveal, AnimatedCounter, Marquee } from '../../components/common/Motion'
import { GlobePattern } from '../../components/common/BrandDecor'
import { SectionHeading, Avatar } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { IMAGES } from '../../data/images'
import { SERVICES, PROCESS, INDUSTRIES, CHALLENGES } from '../../data/companyInfo'
import { cn } from '../../utils/cn'

const STANDARDS = ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO/IEC 27001', 'ISO 22000', 'ISO 50001', 'ISO 31000', 'ISO 41001', 'ISO 22301', 'OSHA 10 & 30', 'Lean Six Sigma', 'PMP®', 'PMI-RMP®', 'ARAMCO Schedule Q']


function Hero() {
  const { content, courses } = useData()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const popular = ['ISO 9001', 'Lead Auditor', 'ISO 45001', 'OSHA', 'Six Sigma', 'PMP']
  const published = courses.filter((c) => c.status === 'published')
  const spotlight = published.find((c) => c.id === 'crs-iso9001-la') || published[0]
  const [first, ...rest] = content.hero.headline.split('. ')
  const second = rest.join('. ')

  return (
    <section className="relative overflow-hidden bg-mesh">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-50" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 animate-blob rounded-full bg-info/25 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute top-20 right-0 h-[28rem] w-[28rem] animate-blob rounded-full bg-accent/15 blur-3xl [animation-delay:-6s]" aria-hidden="true" />

      <div className="relative container-page grid items-center gap-14 pt-12 pb-16 lg:grid-cols-[1.05fr_1fr] lg:pt-16 lg:pb-24">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-white/80 px-3 py-1.5 text-xs font-semibold text-accent-ink shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-accent" /></span>
              ISO 9001:2015 certified · First TVTC foreign registered training center in KSA
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 text-[40px] leading-[1.05] font-extrabold tracking-tight text-deep sm:text-6xl lg:text-[64px]">
              {first}{second ? '.' : ''}
              {second && <span className="text-gradient block pb-1">{second}</span>}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">{content.hero.subtext}</p>
          </Reveal>
          <Reveal delay={240}>
            <form
              role="search"
              className="group mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-white/80 bg-white/90 p-2 shadow-[0_20px_50px_-20px_rgb(9_63_80/0.45)] backdrop-blur transition-shadow focus-within:shadow-[0_20px_50px_-15px_rgb(66_155_183/0.55)] sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault()
                navigate(query.trim() ? `/courses?q=${encodeURIComponent(query.trim())}` : '/courses')
              }}
            >
              <label htmlFor="hero-search" className="sr-only">Search courses</label>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary" aria-hidden="true" />
                <input id="hero-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ISO auditor, safety, Six Sigma, PMP…" className="h-12 w-full rounded-xl border-0 bg-transparent pr-3 pl-11 text-base text-ink placeholder:text-slate-400 focus:outline-none" />
              </div>
              <button type="submit" className="btn btn-gradient btn-lg rounded-xl">Search <ArrowRight className="h-5 w-5" aria-hidden="true" /></button>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted">Popular:</span>
              {popular.map((p) => (
                <Link key={p} to={`/courses?q=${encodeURIComponent(p)}`} className="rounded-full border border-line bg-white/80 px-3 py-1 text-slate-700 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white">{p}</Link>
              ))}
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/courses" className="btn btn-accent btn-lg rounded-full px-6 shadow-[0_12px_28px_-12px_rgb(247_141_0/0.8)]">Explore Courses <ArrowRight className="h-5 w-5" aria-hidden="true" /></Link>
              <a href="#categories" className="btn btn-secondary btn-lg rounded-full px-6">Browse Categories</a>
            </div>
          </Reveal>
        </div>

        <Reveal variant="zoom" delay={150} className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <GlobePattern className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 animate-spin-slow opacity-70" />
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-full w-full rounded-[2rem] border-2 border-dashed border-primary/20" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-30px_rgb(9_63_80/0.6)]">
            <SmartImage src={IMAGES.hero} alt="Learners collaborating around a laptop" className="aspect-[4/3.4] w-full" seed="hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep/60 via-transparent to-transparent" aria-hidden="true" />
          </div>
          {spotlight && (
            <Link to={`/courses/${spotlight.slug}`} className="card absolute -bottom-7 left-4 flex max-w-[300px] animate-float items-center gap-3 p-3 shadow-[0_20px_40px_-20px_rgb(9_63_80/0.6)] transition hover:scale-[1.03] sm:-left-8">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-[#e07100] text-ink"><PlayCircle className="h-6 w-6" aria-hidden="true" /></span>
              <span className="min-w-0">
                <span className="block text-xs text-muted">Featured programme</span>
                <span className="block truncate text-sm font-semibold text-ink">{spotlight.title}</span>
              </span>
            </Link>
          )}
          <div className="card absolute -top-6 right-4 hidden animate-float-slow p-4 shadow-[0_20px_40px_-20px_rgb(9_63_80/0.6)] sm:block">
            <p className="text-xs font-medium text-muted">Learners this week</p>
            <div className="mt-2 flex -space-x-2">
              {['Mei Tanaka', 'Arjun Patel', 'Grace Mwangi', 'Tomás Ribeiro'].map((n) => <Avatar key={n} name={n} size="sm" />)}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-ink ring-2 ring-white">+2k</span>
            </div>
            <p className="mt-2 text-[10px] text-slate-400">Illustrative</p>
          </div>
          <div className="card absolute top-1/2 -right-4 hidden animate-float p-3 shadow-[0_20px_40px_-20px_rgb(9_63_80/0.6)] [animation-delay:-3s] lg:flex lg:items-center lg:gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-success-soft text-success"><CircleCheck className="h-5 w-5" aria-hidden="true" /></span>
            <span>
              <span className="block text-xs font-semibold text-ink">Course completed</span>
              <span className="flex items-center gap-0.5 text-[11px] text-muted"><Star className="h-3 w-3 fill-accent text-accent" aria-hidden="true" />Certificate ready</span>
            </span>
          </div>
        </Reveal>
      </div>

      <div className="relative container-page pb-12">
        <Reveal>
          <dl className="grid grid-cols-2 gap-4 rounded-3xl border border-white/80 bg-white/80 p-5 shadow-[0_20px_50px_-30px_rgb(9_63_80/0.4)] backdrop-blur sm:grid-cols-4 sm:p-7">
            {content.stats.map((s, i) => (
              <div key={s.id} className={cn('text-center sm:text-left', i > 0 && 'sm:border-l sm:border-line sm:pl-6')}>
                <dd className="text-3xl font-extrabold text-deep"><AnimatedCounter value={s.value} /></dd>
                <dt className="mt-1 text-sm text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-right text-xs text-slate-400">Company figures as published by MEQMP.</p>
        </Reveal>
      </div>

      <div className="relative border-y border-line bg-white/70 py-4 backdrop-blur">
        <Marquee items={STANDARDS} separator="◆" itemClassName="text-sm font-bold tracking-wider text-primary/80" />
      </div>
    </section>
  )
}

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false)
  const id = `faq-${faq.id}`
  return (
    <div className="border-b border-line last:border-b-0">
      <h3>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={id} className="group flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-semibold text-ink transition-colors hover:text-primary">
          {faq.question}
          <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300', open ? 'rotate-180 bg-primary text-white' : 'bg-slate-100 text-muted group-hover:bg-primary-soft group-hover:text-primary')}>
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </span>
        </button>
      </h3>
      <div id={id} className={cn('grid transition-all duration-300 ease-out', open ? 'grid-rows-[1fr] pb-4 opacity-100' : 'grid-rows-[0fr] opacity-0')}>
        <div className="overflow-hidden text-sm leading-6 text-muted">{faq.answer}</div>
      </div>
    </div>
  )
}

function AboutCompany() {
  const services = ['Advisory', 'Training', 'Compliance', 'Sustainability', 'Corporate Wellbeing']
  const figures = [
    { value: '2005', label: 'Operating since' },
    { value: '530+', label: 'Consultancy projects' },
    { value: '2500+', label: 'Trainings delivered' },
    { value: '4', label: 'Global offices' },
  ]
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-deep text-white" aria-labelledby="about-company">
      <div className="pointer-events-none absolute inset-0 bg-dots-light" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 animate-blob rounded-full bg-info/25 blur-3xl" aria-hidden="true" />
      <GlobePattern className="pointer-events-none absolute -top-12 right-10 hidden h-48 w-48 animate-spin-slow opacity-20 md:block" />
      <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
        <Reveal variant="left">
          <p className="eyebrow flex items-center gap-2 text-[#9fd3e3]"><span className="h-0.5 w-6 rounded-full bg-accent" aria-hidden="true" />About Meridian (MEQMP)</p>
          <h2 id="about-company" className="mt-3 text-3xl font-bold text-white sm:text-4xl">Partners in quality excellence and strategic growth</h2>
          <p className="mt-4 leading-7 text-white/80">
            Meridian Quality Management Professionals is an ISO 9001:2015 certified organisation providing advisory, training, compliance, sustainability and corporate wellbeing services across the Middle East, Asia and North America since 2005 — and the first TVTC foreign registered training center in Saudi Arabia.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {services.map((s) => <span key={s} className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white ring-1 ring-white/15 transition-colors hover:bg-accent hover:text-ink">{s}</span>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/courses?category=lead-auditor" className="btn btn-accent rounded-full">Explore ISO training <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <Link to="/about" className="btn btn-on-dark rounded-full">About us</Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 self-center">
          {figures.map((f, i) => (
            <Reveal key={f.label} delay={i * 90} variant="zoom" className="hover-lift rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-3xl font-extrabold text-accent"><AnimatedCounter value={f.value} /></p>
              <p className="mt-1 text-sm text-white/75">{f.label}</p>
            </Reveal>
          ))}
          <p className="col-span-2 text-xs text-white/50">Company figures as published by MEQMP on meqmp.com.</p>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  useDocumentTitle('')
  const { courses, categories, instructors, careerPaths, content } = useData()
  const published = courses.filter((c) => c.status === 'published')
  const featured = published.filter((c) => c.featured)
  const trending = published.filter((c) => c.trending).sort((a, b) => b.enrollmentCount - a.enrollmentCount)
  const recent = [...published].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8)
  const programs = published.filter((c) => c.courseType === 'Professional Certificate').sort((a, b) => b.rating - a.rating).slice(0, 3)
  const featuredCategories = [...categories].filter((c) => c.featured).sort((a, b) => a.order - b.order)
  const topInstructors = [...instructors].filter((i) => i.status === 'active').sort((a, b) => b.rating - a.rating).slice(0, 4)
  const sections = content.sections || {}

  return (
    <>
      <Hero />

      <div className="container-page space-y-24 py-20">
        <section id="categories" className="scroll-mt-24" aria-labelledby="categories-title">
          <SectionHeading
            eyebrow="Training tracks"
            title={<span id="categories-title">Choose your training track</span>}
            description="Five training tracks from Meridian’s catalogue — from internal auditor essentials to lead auditor, safety and exam preparation."
            action={<Link to="/categories" className="btn btn-ghost btn-sm text-secondary">All tracks <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {featuredCategories.map((cat, i) => (
              <Reveal key={cat.id} delay={i * 70}>
                <CategoryCard category={cat} count={published.filter((c) => c.categoryId === cat.id).length} className="h-full" />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center" aria-labelledby="challenges-title">
          <Reveal variant="left">
            <p className="eyebrow flex items-center gap-2"><span className="h-0.5 w-6 rounded-full bg-gradient-to-r from-accent to-info" aria-hidden="true" />Why choose MEQMP</p>
            <h2 id="challenges-title" className="section-title mt-2">Are these holding your organisation back?</h2>
            <p className="mt-3 text-muted">Rising costs, inefficiencies, missed deadlines and compliance pressure are common hurdles to growth and consistent quality.</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {CHALLENGES.map((c, i) => (
                <li key={c} className="flex animate-slide-up items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent" style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger"><X className="h-3.5 w-3.5" aria-hidden="true" /></span>{c}
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.benefits.map((b, i) => (
              <Reveal key={b.id} delay={i * 90} variant="zoom" className="h-full">
                <div className="card card-hover card-glow group relative h-full overflow-hidden p-6">
                  <span className="pointer-events-none absolute -top-6 -right-4 text-[80px] leading-none font-black text-slate-100 transition-colors group-hover:text-accent-soft" aria-hidden="true">0{i + 1}</span>
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-deep text-white shadow-lg transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"><Icon name={b.icon} className="h-6 w-6" /></span>
                  <h3 className="relative mt-4 font-semibold text-ink">{b.title}</h3>
                  <p className="relative mt-1 text-sm leading-6 text-muted">{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section aria-labelledby="services-title">
          <SectionHeading eyebrow="Our services" title={<span id="services-title">More than training</span>} description="MEQMP supports organisations end to end — from advisory and compliance to sustainability and corporate wellbeing." action={<Link to="/services" className="btn btn-ghost btn-sm text-secondary">All services <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SERVICES.map((sv, i) => (
              <Reveal key={sv.id} delay={i * 80} className="h-full">
                <Link to={sv.to || `/services#${sv.id}`} className="card card-hover card-glow group relative flex h-full flex-col overflow-hidden p-5">
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-accent via-info to-primary transition-transform duration-500 group-hover:scale-x-100" aria-hidden="true" />
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-soft to-info-soft text-primary transition-all duration-300 group-hover:scale-110 group-hover:from-primary group-hover:to-deep group-hover:text-white">
                    <Icon name={sv.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink transition-colors group-hover:text-primary">{sv.title}</h3>
                  <p className="mt-1 line-clamp-3 flex-1 text-sm text-muted">{sv.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary">Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        <section aria-labelledby="featured-title">
          <SectionHeading eyebrow="Featured" title={<span id="featured-title">Featured courses</span>} description="Meridian’s most popular ISO auditor, Lean Six Sigma and safety programmes." action={<Link to="/courses" className="btn btn-ghost btn-sm text-secondary">Browse all <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 8).map((course, i) => (
              <Reveal key={course.id} delay={(i % 4) * 80} className="h-full">
                <CourseCard course={course} />
              </Reveal>
            ))}
          </div>
        </section>

        <AboutCompany />

        <section aria-labelledby="process-title">
          <SectionHeading eyebrow="How we work" title={<span id="process-title">We get it right the first time</span>} />
          <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {PROCESS.map((p, i) => (
              <Reveal as="li" key={p.step} delay={i * 100} className="h-full">
                <div className="card card-hover group relative h-full overflow-hidden p-6">
                  <span className="text-5xl font-black text-primary-soft transition-colors duration-300 group-hover:text-accent">{p.step}</span>
                  <h3 className="mt-2 text-lg font-semibold text-ink">{p.title}</h3>
                  <p className="text-sm font-medium text-secondary">{p.tagline}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{p.text}</p>
                  {i < PROCESS.length - 1 && <ArrowRight className="absolute top-8 right-5 hidden h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-accent xl:block" aria-hidden="true" />}
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-8 rounded-2xl border border-line bg-white py-4">
            <Marquee items={INDUSTRIES} separator="◆" itemClassName="text-sm font-semibold text-primary" reverse />
          </Reveal>
        </section>

        {sections.paths !== false && (
          <section aria-labelledby="paths-title">
            <SectionHeading eyebrow="Learning paths" title={<span id="paths-title">Follow a path to a new role</span>} description="Curated sequences of courses with a skills roadmap and clear time estimates." action={<Link to="/career-paths" className="btn btn-ghost btn-sm text-secondary">All paths <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {careerPaths.slice(0, 6).map((path, i) => (
                <Reveal key={path.id} delay={(i % 3) * 90} className="h-full">
                  <CareerPathCard path={path} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {sections.trending !== false && (
          <Reveal>
            <CourseCarousel eyebrow="Trending now" title="Trending courses" description="What learners on Meridian are enrolling in this month (sample data)." courses={trending} viewAllTo="/courses?sort=popular" />
          </Reveal>
        )}

        {sections.programs !== false && programs.length > 0 && (
          <section aria-labelledby="programs-title">
            <SectionHeading eyebrow="Career-focused programs" title={<span id="programs-title">Professional certificates</span>} description="Multi-module programmes that prepare you for a specific role." action={<Link to="/programs" className="btn btn-ghost btn-sm text-secondary">All programs <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((course, i) => (
                <Reveal key={course.id} delay={i * 90} className="h-full"><CourseCard course={course} /></Reveal>
              ))}
            </div>
          </section>
        )}

        {sections.instructors !== false && (
          <section aria-labelledby="instructors-title">
            <SectionHeading eyebrow="Top-rated instructors" title={<span id="instructors-title">Learn from experienced practitioners</span>} action={<Link to="/instructors" className="btn btn-ghost btn-sm text-secondary">All instructors <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {topInstructors.map((ins, i) => (
                <Reveal key={ins.id} delay={i * 80} className="h-full">
                  <InstructorCard instructor={ins} courseCount={published.filter((c) => c.instructorId === ins.id).length} className="h-full" />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {sections.recent !== false && (
          <Reveal>
            <CourseCarousel eyebrow="Fresh content" title="Recently added" courses={recent} viewAllTo="/courses?sort=newest" />
          </Reveal>
        )}

        {sections.testimonials !== false && content.testimonials.length > 0 && (
          <section aria-labelledby="testimonials-title">
            <SectionHeading eyebrow="Learner stories" title={<span id="testimonials-title">What learners say</span>} description="Fictional sample personas used to illustrate the experience." />
            <div className="grid gap-6 md:grid-cols-3">
              {content.testimonials.map((t, i) => (
                <Reveal key={t.id} delay={i * 100} className="h-full">
                  <figure className="card card-hover card-glow group relative flex h-full flex-col overflow-hidden p-7">
                    <Quote className="absolute -top-2 -right-2 h-24 w-24 text-primary-soft transition-transform duration-500 group-hover:rotate-12" aria-hidden="true" />
                    <div className="relative flex gap-0.5">{[1, 2, 3, 4, 5].map((n) => <Star key={n} className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />)}</div>
                    <blockquote className="relative mt-4 flex-1 text-[15px] leading-7 text-slate-700">“{t.quote}”</blockquote>
                    <figcaption className="relative mt-6 flex items-center gap-3 border-t border-line pt-5">
                      <Avatar name={t.name} src={t.avatar} />
                      <span>
                        <span className="block text-sm font-semibold text-ink">{t.name}</span>
                        <span className="block text-xs text-muted">{t.role} · sample persona</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <Reveal>
          <section className="grid gap-6 rounded-[2rem] border border-line bg-white p-6 sm:grid-cols-3 sm:p-8" aria-label="Why learners choose Meridian">
            {[
              { icon: ShieldCheck, title: 'Globally certified trainers', text: 'Learn from practitioners and industry-recognised auditors.' },
              { icon: Globe2, title: 'Regional expertise', text: 'Serving the Middle East, Asia & North America since 2005.' },
              { icon: Award, title: 'Proven track record', text: 'Thousands of trainings and hundreds of consultancy projects.' },
            ].map((f) => (
              <div key={f.title} className="group flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white"><f.icon className="h-5 w-5" aria-hidden="true" /></span>
                <span>
                  <span className="block font-semibold text-ink">{f.title}</span>
                  <span className="block text-sm text-muted">{f.text}</span>
                </span>
              </div>
            ))}
          </section>
        </Reveal>

        {sections.faq !== false && content.faqs.length > 0 && (
          <section className="grid gap-10 lg:grid-cols-[1fr_1.6fr]" aria-labelledby="faq-title">
            <Reveal variant="left">
              <p className="eyebrow flex items-center gap-2"><span className="h-0.5 w-6 rounded-full bg-gradient-to-r from-accent to-info" aria-hidden="true" />FAQ</p>
              <h2 id="faq-title" className="section-title mt-2">Frequently asked questions</h2>
              <p className="mt-2 text-muted">Can’t find what you’re looking for? Visit the <Link to="/help" className="link">help centre</Link> or ask <strong className="text-ink">Meri</strong>, our assistant, in the bottom-right corner.</p>
              <div className="mt-6 hidden items-center gap-3 rounded-2xl bg-primary-soft p-4 lg:flex">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"><Users className="h-5 w-5" aria-hidden="true" /></span>
                <p className="text-sm text-primary">Training a team? <Link to="/business" className="font-semibold underline">Meridian for Business</Link></p>
              </div>
            </Reveal>
            <Reveal variant="right" className="card px-6">
              {content.faqs.map((faq) => <FaqItem key={faq.id} faq={faq} />)}
            </Reveal>
          </section>
        )}
      </div>
    </>
  )
}
