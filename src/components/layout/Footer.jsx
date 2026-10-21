import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, ArrowRight, Send, BadgeCheck, CircleCheck, GraduationCap, Phone } from 'lucide-react'
import BrandLogo from '../common/BrandLogo'
import { Marquee } from '../common/Motion'
import { GlobePattern } from '../common/BrandDecor'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { isValidEmail } from '../../services/mockAuthService'
import { COMPANY } from '../../data/companyInfo'

const LOCATIONS = ['Saudi Arabia', 'Bahrain', 'Pakistan', 'Canada']
const TICKER = ['Consulting', 'Auditing', 'Training', 'Certifications', 'Sustainability', 'QHSE', 'ISO Standards', 'Compliance', 'Resilience']

function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle')
  const submit = (e) => {
    e.preventDefault()
    if (!isValidEmail(email)) return setState('error')
    setState('done')
    setEmail('')
  }
  return (
    <form onSubmit={submit} noValidate className="mt-5" aria-label="Newsletter sign-up (demo)">
      <label htmlFor="footer-email" className="text-sm font-semibold text-white">Get new course alerts</label>
      <div className="mt-2 flex overflow-hidden rounded-full bg-white/10 ring-1 ring-white/15 transition focus-within:bg-white/15 focus-within:ring-accent">
        <input
          id="footer-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setState('idle') }}
          placeholder="you@company.com"
          className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none"
        />
        <button type="submit" className="m-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-ink transition-transform hover:scale-110" aria-label="Subscribe">
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-2 min-h-[1rem] text-xs" role="status">
        {state === 'done' && <span className="inline-flex items-center gap-1 text-[#9fe0b4]"><CircleCheck className="h-3.5 w-3.5" aria-hidden="true" />Subscribed in demo mode — no emails will be sent.</span>}
        {state === 'error' && <span className="text-[#ffb4a8]">Enter a valid email address.</span>}
      </p>
    </form>
  )
}

export default function Footer() {
  const { categories, courses, settings } = useData()
  const { user } = useAuth()
  const sorted = [...categories].sort((a, b) => a.order - b.order).slice(0, 6)
  const columns = [
    { title: 'Explore', links: sorted.map((c) => ({ to: `/courses?category=${c.slug}`, label: c.name })) },
    {
      title: 'Popular programmes',
      links: courses
        .filter((c) => c.status === 'published' && c.featured)
        .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
        .slice(0, 6)
        .map((c) => ({ to: `/courses/${c.slug}`, label: c.title })),
    },
    {
      title: 'Company',
      links: [
        { to: '/about', label: 'About MEQMP' },
        { to: '/services', label: 'Services' },
        { to: '/programs', label: 'Learning programs' },
        { to: '/instructors', label: 'Trainers' },
        { to: '/business', label: 'For Business' },
        { to: '/verify-certificate', label: 'Verify certificate' },
        { to: '/contact', label: 'Contact' },
      ],
    },
  ]

  return (
    <footer className="relative mt-auto overflow-hidden bg-deep text-white">
      {/* Call-to-action band */}
      <div className="relative z-10 container-page -mb-px pt-14">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-[#1d7f9c] p-8 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)] sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-dots-light" aria-hidden="true" />
          <GlobePattern className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 animate-spin-slow opacity-25" />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-accent"><GraduationCap className="h-4 w-4" aria-hidden="true" />Start today</p>
              <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Ready to advance your career?</h2>
              <p className="mt-2 max-w-xl text-white/80">ISO auditor programmes, safety training, Lean Six Sigma and exam preparation — learn at your own pace with Meridian.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/courses" className="btn btn-accent btn-lg rounded-full">Browse courses <ArrowRight className="h-5 w-5" aria-hidden="true" /></Link>
              {!user && <Link to="/register" className="btn btn-on-dark btn-lg rounded-full">Join for free</Link>}
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-dots-light" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-info/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute top-40 -right-32 h-80 w-80 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />

      <div className="relative container-page grid gap-10 py-14 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-sm">
          <BrandLogo tone="light" size="lg" />
          <p className="mt-5 text-sm leading-6 text-white/75">
            {settings.tagline}. Meridian Quality Management Professionals is an ISO 9001:2015 certified provider of advisory, training, compliance, sustainability and corporate wellbeing services since {COMPANY.since}.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-white/75">
            <li><a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 transition-colors hover:text-accent"><Phone className="h-4 w-4 text-accent" aria-hidden="true" />{COMPANY.phone}</a></li>
            <li><a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 transition-colors hover:text-accent"><Mail className="h-4 w-4 text-accent" aria-hidden="true" />{COMPANY.email}</a></li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" /><span>{LOCATIONS.join(' · ')}</span></li>
            <li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-accent" aria-hidden="true" />First TVTC foreign registered training center in KSA</li>
          </ul>
          <Newsletter />
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="relative pb-3 text-sm font-semibold tracking-wide text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-8 after:rounded-full after:bg-accent">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.to + l.label}>
                  <Link to={l.to} className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition-all duration-200 hover:translate-x-1 hover:text-white">
                    <ArrowRight className="h-3 w-3 -ml-4 text-accent opacity-0 transition-all duration-200 group-hover:ml-0 group-hover:opacity-100" aria-hidden="true" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="relative border-y border-white/10 bg-white/[0.03] py-3">
        <Marquee items={TICKER} separator="◆" itemClassName="text-sm font-bold tracking-[0.25em] text-white/70 uppercase" />
      </div>

      <div className="relative">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Meridians. All rights reserved · {settings.platformName} demo — learner data shown is illustrative.</p>
          <nav aria-label="Legal" className="flex gap-4">
            <Link to="/terms" className="transition-colors hover:text-accent">Terms</Link>
            <Link to="/privacy" className="transition-colors hover:text-accent">Privacy</Link>
            <Link to="/help" className="transition-colors hover:text-accent">Help</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
