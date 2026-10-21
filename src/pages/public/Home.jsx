import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Search, ChevronDown, Quote, Sparkles, Building2, PlayCircle } from 'lucide-react'
import CourseCarousel from '../../components/courses/CourseCarousel'
import CourseCard from '../../components/courses/CourseCard'
import { CategoryCard, InstructorCard, CareerPathCard } from '../../components/courses/Cards'
import Icon from '../../components/common/Icon'
import SmartImage from '../../components/common/SmartImage'
import { SectionHeading, Avatar } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { IMAGES } from '../../data/images'
import { COURSE_TYPES } from '../../data/courses'
import { cn } from '../../utils/cn'

function Hero() {
  const { content, courses } = useData()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const popular = ['React', 'Python', 'Machine Learning', 'Project Management', 'Cybersecurity']
  const published = courses.filter((c) => c.status === 'published')
  const spotlight = published.find((c) => c.id === 'crs-react') || published[0]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF3F5] to-page">
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-info/10 blur-3xl" aria-hidden="true" />
      <div className="container-page grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
        <div>
          <span className="badge badge-accent mb-5"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" />New: Generative AI for Professionals</span>
          <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight text-deep sm:text-5xl lg:text-[56px]">
            {content.hero.headline}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">{content.hero.subtext}</p>
          <form
            role="search"
            className="mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-line bg-white p-2 shadow-[var(--shadow-raised)] sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
              navigate(query.trim() ? `/courses?q=${encodeURIComponent(query.trim())}` : '/courses')
            }}
          >
            <label htmlFor="hero-search" className="sr-only">Search courses</label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
              <input id="hero-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses, skills or instructors" className="h-12 w-full rounded-xl border-0 bg-transparent pr-3 pl-11 text-base text-ink placeholder:text-slate-400 focus:ring-2 focus:ring-info/30 focus:outline-none" />
            </div>
            <button type="submit" className="btn btn-primary btn-lg rounded-xl">Search</button>
          </form>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">Popular:</span>
            {popular.map((p) => (
              <Link key={p} to={`/courses?q=${encodeURIComponent(p)}`} className="rounded-full border border-line bg-white px-3 py-1 text-slate-700 transition-colors hover:border-primary hover:text-primary">{p}</Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/courses" className="btn btn-accent btn-lg">Explore Courses <ArrowRight className="h-5 w-5" aria-hidden="true" /></Link>
            <a href="#categories" className="btn btn-secondary btn-lg">Browse Categories</a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative overflow-hidden rounded-3xl shadow-[var(--shadow-raised)]">
            <SmartImage src={IMAGES.hero} alt="Learners collaborating around a laptop" className="aspect-[4/3.4] w-full" seed="hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep/50 via-transparent to-transparent" aria-hidden="true" />
          </div>
          {spotlight && (
            <Link to={`/courses/${spotlight.slug}`} className="card absolute -bottom-6 left-4 flex max-w-[290px] items-center gap-3 p-3 transition hover:shadow-[var(--shadow-raised)] sm:-left-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-ink"><PlayCircle className="h-6 w-6" aria-hidden="true" /></span>
              <span className="min-w-0">
                <span className="block text-xs text-muted">Featured programme</span>
                <span className="block truncate text-sm font-semibold text-ink">{spotlight.title}</span>
              </span>
            </Link>
          )}
          <div className="card absolute -top-5 right-3 hidden p-4 sm:block">
            <p className="text-xs text-muted">Learners this week</p>
            <div className="mt-2 flex -space-x-2">
              {['Mei Tanaka', 'Arjun Patel', 'Grace Mwangi', 'Tomás Ribeiro'].map((n) => <Avatar key={n} name={n} size="sm" />)}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">Illustrative</p>
          </div>
        </div>
      </div>

      <div className="container-page pb-12">
        <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-4 sm:p-6">
          {content.stats.map((s) => (
            <div key={s.id} className="text-center sm:text-left">
              <dt className="text-sm text-muted">{s.label}</dt>
              <dd className="mt-1 text-2xl font-bold text-deep">{s.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-right text-xs text-slate-400">Platform figures reflect this demo’s sample catalogue.</p>
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
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={id} className="flex w-full items-center justify-between gap-4 py-4 text-left text-[15px] font-semibold text-ink hover:text-primary">
          {faq.question}
          <ChevronDown className={cn('h-5 w-5 shrink-0 text-muted transition-transform', open && 'rotate-180')} aria-hidden="true" />
        </button>
      </h3>
      <div id={id} hidden={!open} className="pb-4 text-sm leading-6 text-muted">{faq.answer}</div>
    </div>
  )
}

export default function Home() {
  useDocumentTitle('')
  const { courses, categories, instructors, careerPaths, content } = useData()
  const { user } = useAuth()
  const published = courses.filter((c) => c.status === 'published')
  const featured = published.filter((c) => c.featured)
  const trending = published.filter((c) => c.trending).sort((a, b) => b.enrollmentCount - a.enrollmentCount)
  const recent = [...published].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8)
  const programs = published.filter((c) => c.courseType === 'Professional Certificate').slice(0, 3)
  const featuredCategories = [...categories].filter((c) => c.featured).sort((a, b) => a.order - b.order)
  const topInstructors = [...instructors].filter((i) => i.status === 'active').sort((a, b) => b.rating - a.rating).slice(0, 4)
  const sections = content.sections || {}

  return (
    <>
      <Hero />

      <div className="container-page space-y-20 py-16">
        <section id="categories" className="scroll-mt-24" aria-labelledby="categories-title">
          <SectionHeading
            eyebrow="Popular categories"
            title={<span id="categories-title">Explore what you can learn</span>}
            description="Ten subject areas, each with courses for beginners through to advanced practitioners."
            action={<Link to="/categories" className="btn btn-ghost btn-sm text-secondary">All categories <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {featuredCategories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} count={published.filter((c) => c.categoryId === cat.id).length} />
            ))}
          </div>
        </section>

        <section aria-labelledby="featured-title">
          <SectionHeading eyebrow="Featured" title={<span id="featured-title">Featured courses</span>} description="Hand-picked programmes from our fictional partner institutions." action={<Link to="/courses" className="btn btn-ghost btn-sm text-secondary">Browse all <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.slice(0, 8).map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        </section>

        {sections.paths !== false && (
          <section aria-labelledby="paths-title">
            <SectionHeading eyebrow="Learning paths" title={<span id="paths-title">Follow a path to a new role</span>} description="Curated sequences of courses with a skills roadmap and clear time estimates." action={<Link to="/career-paths" className="btn btn-ghost btn-sm text-secondary">All paths <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {careerPaths.map((path) => <CareerPathCard key={path.id} path={path} />)}
            </div>
          </section>
        )}

        {sections.trending !== false && (
          <CourseCarousel eyebrow="Trending now" title="Trending courses" description="What learners on Meridian are enrolling in this month (sample data)." courses={trending} viewAllTo="/courses?sort=popular" />
        )}

        <section className="overflow-hidden rounded-3xl bg-deep text-white" aria-labelledby="benefits-title">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <p className="eyebrow text-[#9fd3e3]">Why Meridian</p>
              <h2 id="benefits-title" className="mt-2 text-3xl font-bold text-white">Learning designed around real careers</h2>
              <p className="mt-3 text-white/75">Practical courses, guided paths and honest progress tracking — built for busy professionals.</p>
              <Link to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/learn/dashboard') : '/register'} className="btn btn-accent mt-6">
                {user ? 'Go to your dashboard' : 'Join for Free'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {content.benefits.map((b) => (
                <div key={b.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-ink"><Icon name={b.icon} className="h-5 w-5" /></span>
                  <h3 className="mt-4 font-semibold text-white">{b.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/70">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {sections.programs !== false && programs.length > 0 && (
          <section aria-labelledby="programs-title">
            <SectionHeading eyebrow="Career-focused programs" title={<span id="programs-title">Professional certificates</span>} description="Multi-course programmes that prepare you for a specific role." action={<Link to="/programs" className="btn btn-ghost btn-sm text-secondary">All programs <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((course) => <CourseCard key={course.id} course={course} />)}
            </div>
            <p className="mt-4 text-sm text-muted">Also available: {COURSE_TYPES.filter((t) => t !== 'Professional Certificate').join(', ')}.</p>
          </section>
        )}

        {sections.instructors !== false && (
          <section aria-labelledby="instructors-title">
            <SectionHeading eyebrow="Top-rated instructors" title={<span id="instructors-title">Learn from experienced practitioners</span>} action={<Link to="/instructors" className="btn btn-ghost btn-sm text-secondary">All instructors <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {topInstructors.map((ins) => (
                <InstructorCard key={ins.id} instructor={ins} courseCount={published.filter((c) => c.instructorId === ins.id).length} />
              ))}
            </div>
          </section>
        )}

        {sections.recent !== false && (
          <CourseCarousel eyebrow="Fresh content" title="Recently added" courses={recent} viewAllTo="/courses?sort=newest" />
        )}

        {sections.testimonials !== false && content.testimonials.length > 0 && (
          <section aria-labelledby="testimonials-title">
            <SectionHeading eyebrow="Learner stories" title={<span id="testimonials-title">What learners say</span>} description="Fictional sample personas used to illustrate the experience." />
            <div className="grid gap-5 md:grid-cols-3">
              {content.testimonials.map((t) => (
                <figure key={t.id} className="card flex flex-col p-6">
                  <Quote className="h-7 w-7 text-accent" aria-hidden="true" />
                  <blockquote className="mt-3 flex-1 text-[15px] leading-7 text-slate-700">“{t.quote}”</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <Avatar name={t.name} src={t.avatar} />
                    <span>
                      <span className="block text-sm font-semibold text-ink">{t.name}</span>
                      <span className="block text-xs text-muted">{t.role} · sample persona</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="grid items-center gap-8 rounded-3xl border border-line bg-white p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="section-title">Ready to start learning?</h2>
            <p className="mt-2 max-w-lg text-muted">Create a free demo learner profile in seconds, or explore the platform with the ready-made demo accounts.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={user ? '/courses' : '/register'} className="btn btn-primary btn-lg">{user ? 'Browse the catalogue' : 'Join Meridian for free'}</Link>
              <Link to="/business" className="btn btn-secondary btn-lg"><Building2 className="h-5 w-5" aria-hidden="true" />Meridian for Business</Link>
            </div>
          </div>
          <SmartImage src={IMAGES.business} alt="A team discussing a learning plan" className="aspect-[16/10] rounded-2xl" seed="cta" />
        </section>

        {sections.faq !== false && content.faqs.length > 0 && (
          <section className="grid gap-10 lg:grid-cols-[1fr_1.6fr]" aria-labelledby="faq-title">
            <div>
              <p className="eyebrow">FAQ</p>
              <h2 id="faq-title" className="section-title mt-1.5">Frequently asked questions</h2>
              <p className="mt-2 text-muted">Can’t find what you’re looking for? Visit the <Link to="/help" className="link">help centre</Link>.</p>
            </div>
            <div className="card px-6">
              {content.faqs.map((faq) => <FaqItem key={faq.id} faq={faq} />)}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
