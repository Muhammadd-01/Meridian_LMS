import { Link } from 'react-router-dom'
import { Mail, MapPin } from 'lucide-react'
import BrandLogo from '../common/BrandLogo'
import { useData } from '../../context/DataContext'

export default function Footer() {
  const { categories, careerPaths, settings } = useData()
  const sorted = [...categories].sort((a, b) => a.order - b.order).slice(0, 6)
  const columns = [
    { title: 'Explore', links: sorted.map((c) => ({ to: `/courses?category=${c.slug}`, label: c.name })) },
    { title: 'Career paths', links: careerPaths.slice(0, 6).map((p) => ({ to: `/career-paths/${p.slug}`, label: p.title })) },
    {
      title: 'Meridian',
      links: [
        { to: '/about', label: 'About us' },
        { to: '/instructors', label: 'Instructors' },
        { to: '/programs', label: 'Learning programs' },
        { to: '/business', label: 'For Business' },
        { to: '/contact', label: 'Contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { to: '/help', label: 'Help centre' },
        { to: '/terms', label: 'Terms of use' },
        { to: '/privacy', label: 'Privacy notice' },
        { to: '/login', label: 'Demo sign in' },
      ],
    },
  ]
  return (
    <footer className="mt-auto bg-deep text-white">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div className="max-w-sm">
          <BrandLogo tone="light" />
          <p className="mt-4 text-sm leading-6 text-white/75">
            {settings.tagline}. Expert-led courses, career paths and learning programs — presented as a frontend demonstration.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-white/75">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#9fd3e3]" aria-hidden="true" />{settings.supportEmail} <span className="text-white/50">(demo)</span></li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#9fd3e3]" aria-hidden="true" />Remote-first · fictional organisation</li>
          </ul>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-semibold tracking-wide text-white">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.to + l.label}>
                  <Link to={l.to} className="text-sm text-white/70 transition-colors hover:text-white hover:underline">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {settings.platformName}. Demonstration project — all courses, providers, instructors and learners are fictional.</p>
          <p>No real payments, accounts or credentials are processed.</p>
        </div>
      </div>
    </footer>
  )
}
