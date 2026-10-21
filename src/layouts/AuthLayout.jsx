import { Outlet, Link } from 'react-router-dom'
import { CircleCheck, ArrowLeft } from 'lucide-react'
import BrandLogo from '../components/common/BrandLogo'
import { IMAGES } from '../data/images'

const POINTS = [
  'Expert-led courses across 10 subject areas',
  'Career paths that tell you what to learn next',
  'Quizzes, assignments and demo certificates',
]

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      <aside className="relative hidden overflow-hidden bg-deep text-white lg:block" aria-hidden="false">
        <img src={IMAGES.studying} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-br from-deep via-deep/90 to-primary/80" />
        <div className="absolute inset-0 bg-dots-light" aria-hidden="true" />
        <div className="absolute -right-20 -bottom-20 h-80 w-80 animate-blob rounded-full bg-info/25 blur-3xl" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <BrandLogo tone="light" />
          <div className="max-w-md">
            <p className="eyebrow text-[#9fd3e3]">Meridian LMS</p>
            <h2 className="mt-3 text-4xl leading-tight font-bold text-white">Learning that moves your career forward.</h2>
            <ul className="mt-8 space-y-3">
              {POINTS.map((p) => (
                <li key={p} className="flex items-center gap-3 text-white/85">
                  <CircleCheck className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-white/60">Demonstration environment. Authentication is simulated in your browser and is not secure.</p>
        </div>
      </aside>
      <main id="main-content" tabIndex={-1} className="flex flex-col bg-white outline-none">
        <div className="flex items-center justify-between px-6 pt-6 sm:px-10">
          <div className="lg:hidden"><BrandLogo /></div>
          <Link to="/" className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to site
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md animate-page-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
