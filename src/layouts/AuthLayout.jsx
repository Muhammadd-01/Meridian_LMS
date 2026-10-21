import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, HardHat, GraduationCap, Star, ShieldCheck } from 'lucide-react'
import BrandLogo from '../components/common/BrandLogo'
import { GlobePattern } from '../components/common/BrandDecor'
import { COMPANY } from '../data/companyInfo'

const HIGHLIGHTS = [
  { icon: BadgeCheck, title: 'ISO Lead Auditor programmes', text: 'ISO 9001, 14001, 45001, 27001, 50001, 41001 and 31000 — taught by industry-recognised auditors.' },
  { icon: HardHat, title: 'Safety & Environment training', text: 'OSHA 10 & 30 Hour, fire safety, first aid, CPR & AED and defensive driving.' },
  { icon: GraduationCap, title: 'Exam preparation', text: 'Structured preparation for PMP® and PMI-RMP® with practice reviews.' },
]

function RotatingHighlight() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % HIGHLIGHTS.length), 4200)
    return () => clearInterval(id)
  }, [])
  const h = HIGHLIGHTS[index]
  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
      <div key={index} className="fade-swap flex gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-ink shadow-lg"><h.icon className="h-6 w-6" aria-hidden="true" /></span>
        <div>
          <p className="font-semibold text-white">{h.title}</p>
          <p className="mt-1 text-sm leading-6 text-white/75">{h.text}</p>
        </div>
      </div>
      <div className="mt-5 flex gap-1.5" aria-hidden="true">
        {HIGHLIGHTS.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-8 bg-accent' : 'w-3 bg-white/30'}`} />)}
      </div>
    </div>
  )
}

export default function AuthLayout() {
  const { pathname } = useLocation()
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-deep via-[#0c4a5d] to-primary text-white lg:block">
        <div className="pointer-events-none absolute inset-0 bg-dots-light" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 animate-blob rounded-full bg-info/30 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 animate-blob rounded-full bg-accent/20 blur-3xl [animation-delay:-6s]" aria-hidden="true" />
        <GlobePattern className="pointer-events-none absolute top-24 -right-16 h-80 w-80 animate-spin-slow opacity-20" />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <BrandLogo tone="light" size="lg" />
          <div className="max-w-lg">
            <p className="inline-flex animate-slide-up items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-accent ring-1 ring-white/15">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> ISO 9001:2015 certified training provider
            </p>
            <h2 className="mt-5 animate-slide-up text-4xl leading-tight font-extrabold text-white xl:text-5xl">
              Empowering quality.<br /><span className="bg-gradient-to-r from-accent to-[#ffd08a] bg-clip-text text-transparent">Building careers.</span>
            </h2>
            <p className="mt-4 max-w-md text-white/75">Learn ISO auditing, safety and leadership skills online with {COMPANY.name}.</p>
            <div className="mt-8"><RotatingHighlight /></div>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/80">
            <span><strong className="text-2xl text-white">26</strong> programmes</span>
            <span><strong className="text-2xl text-white">2500+</strong> trainings by MEQMP</span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" /><strong className="text-white">4.8</strong> avg. rating</span>
          </div>
        </div>
      </aside>

      <main id="main-content" tabIndex={-1} className="relative flex flex-col overflow-hidden bg-mesh outline-none">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-40" aria-hidden="true" />
        <div className="relative flex items-center justify-between px-5 pt-5 sm:px-10 sm:pt-7">
          <div className="lg:hidden"><BrandLogo /></div>
          <Link to="/" className="group ml-auto inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-sm font-medium text-muted shadow-sm ring-1 ring-line backdrop-blur transition hover:text-ink">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" /> Back to site
          </Link>
        </div>
        <div className="relative flex flex-1 items-center justify-center px-4 py-8 sm:px-10">
          <div key={pathname} className="w-full max-w-md animate-page-in rounded-[1.75rem] border border-white/80 bg-white/90 p-6 shadow-[0_30px_70px_-30px_rgb(9_63_80/0.45)] backdrop-blur-xl sm:p-9">
            <Outlet />
          </div>
        </div>
        <p className="relative pb-5 text-center text-xs text-muted">Demo environment — authentication is simulated in your browser.</p>
      </main>
    </div>
  )
}
