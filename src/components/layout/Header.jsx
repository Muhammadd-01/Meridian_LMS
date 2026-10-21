import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronDown, Menu, Search, Building2, ArrowRight, LayoutDashboard, X, MapPin, BadgeCheck, LifeBuoy, Mail, Sparkles, Phone, ShieldCheck,
} from 'lucide-react'
import BrandLogo from '../common/BrandLogo'
import Icon from '../common/Icon'
import Modal from '../common/Modal'
import SmartImage from '../common/SmartImage'
import NotificationBell from '../navigation/NotificationBell'
import ProfileMenu from '../navigation/ProfileMenu'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useClickOutside } from '../../hooks/useUtils'
import { COMPANY } from '../../data/companyInfo'
import { cn } from '../../utils/cn'

const NAV_LINKS = [
  { to: '/courses', label: 'Courses' },
  { to: '/career-paths', label: 'Career paths' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
]

/** Tracks whether the page has scrolled past a threshold (for the condensed header). */
function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && window.scrollY > threshold)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

function TopBar() {
  return (
    <div className="hidden bg-gradient-to-r from-deep via-[#0d4b5e] to-primary text-white md:block">
      <div className="container-page flex h-9 items-center gap-6 text-xs">
        <p className="flex items-center gap-1.5 text-white/85">
          <BadgeCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          <span className="hidden lg:inline">ISO 9001:2015 certified · </span>Advisory, training, compliance & sustainability
        </p>
        <a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`} className="hidden items-center gap-1.5 text-white/80 transition-colors hover:text-accent lg:flex">
          <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {COMPANY.phone}
        </a>
        <p className="hidden items-center gap-1.5 text-white/70 2xl:flex">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Saudi Arabia · Bahrain · Pakistan · Canada
        </p>
        <nav aria-label="Utility" className="ml-auto flex items-center gap-4">
          <Link to="/help" className="flex items-center gap-1 text-white/80 transition-colors hover:text-accent"><LifeBuoy className="h-3.5 w-3.5" aria-hidden="true" />Help</Link>
          <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-1 text-white/80 transition-colors hover:text-accent"><Mail className="h-3.5 w-3.5" aria-hidden="true" />{COMPANY.email}</a>
          <Link to="/verify-certificate" className="hidden items-center gap-1 text-white/80 transition-colors hover:text-accent xl:flex"><ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />Verify certificate</Link>
          <Link to="/business" className="flex items-center gap-1 text-white/80 transition-colors hover:text-accent"><Building2 className="h-3.5 w-3.5" aria-hidden="true" />For Business</Link>
        </nav>
      </div>
    </div>
  )
}

function ExploreMenu() {
  const { categories, careerPaths, courses } = useData()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const location = useLocation()
  useClickOutside(ref, () => setOpen(false), open)

  // Close the menu after navigating.
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    if (open) setOpen(false)
  }

  const sorted = [...categories].sort((a, b) => a.order - b.order)
  const published = courses.filter((c) => c.status === 'published')
  const countFor = (id) => published.filter((c) => c.categoryId === id).length
  const spotlight = published.find((c) => c.id === 'crs-iso9001-la') || published.find((c) => c.featured)

  return (
    <div ref={ref} className="relative" onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="explore-menu"
        className={cn(
          'btn btn-sm gap-1.5 rounded-full px-4',
          open ? 'bg-primary text-white shadow-md' : 'bg-primary-soft text-primary hover:bg-primary hover:text-white',
        )}
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        Explore <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div id="explore-menu" className="absolute left-0 z-50 mt-3 w-[min(94vw,880px)] origin-top-left animate-pop-in overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_60px_-25px_rgb(9_63_80/0.45)]">
          <div className="grid md:grid-cols-[1.5fr_1fr]">
            <div className="p-5">
              <p className="eyebrow mb-3">Browse by category</p>
              <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {sorted.map((cat, i) => (
                  <li key={cat.id} className="animate-slide-up" style={{ animationDelay: `${i * 25}ms`, animationFillMode: 'both' }}>
                    <Link to={`/courses?category=${cat.slug}`} className="group flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition-colors hover:bg-primary-soft">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                        <Icon name={cat.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-ink">{cat.name}</span>
                        <span className="block text-xs text-muted">{countFor(cat.id)} courses</span>
                      </span>
                      <ArrowRight className="h-4 w-4 -translate-x-2 text-secondary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-line bg-gradient-to-b from-slate-50 to-primary-soft/60 p-5 md:border-t-0 md:border-l">
              {spotlight && (
                <Link to={`/courses/${spotlight.slug}`} className="group mb-5 block overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-lg">
                  <SmartImage src={spotlight.thumbnail} alt="" seed={spotlight.id} className="aspect-[2/1] w-full" imgClassName="transition-transform duration-500 group-hover:scale-110" />
                  <span className="block p-3">
                    <span className="badge badge-accent mb-1">Spotlight</span>
                    <span className="block text-sm font-semibold text-ink group-hover:text-primary">{spotlight.title}</span>
                  </span>
                </Link>
              )}
              <p className="eyebrow mb-2">Career paths</p>
              <ul className="space-y-0.5">
                {careerPaths.slice(0, 6).map((p) => (
                  <li key={p.id}>
                    <Link to={`/career-paths/${p.slug}`} className="group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-white hover:text-primary">
                      {p.title}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:opacity-100" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-3 border-t border-line pt-4">
                <Link to="/categories" className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:underline">All categories <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                <Link to="/courses" className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:underline">Full catalogue <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function HeaderSearch({ className, autoFocus }) {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const [query, setQuery] = useState(location.pathname === '/courses' ? params.get('q') || '' : '')
  return (
    <form
      role="search"
      className={cn('group relative', className)}
      onSubmit={(e) => {
        e.preventDefault()
        navigate(query.trim() ? `/courses?q=${encodeURIComponent(query.trim())}` : '/courses')
      }}
    >
      <label htmlFor={autoFocus ? 'mobile-search' : 'header-search'} className="sr-only">Search courses</label>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted transition-colors group-focus-within:text-primary" aria-hidden="true" />
      <input
        id={autoFocus ? 'mobile-search' : 'header-search'}
        type="search"
        value={query}
        autoFocus={autoFocus}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search ISO, safety, Six Sigma, PMP…"
        className="input rounded-full border-slate-200 bg-slate-50 py-2 pr-12 pl-10 transition-all focus:bg-white focus:shadow-[0_0_0_4px_rgb(66_155_183/0.15)]"
      />
      <button type="submit" className="absolute top-1/2 right-1 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-primary to-deep text-white transition-transform hover:scale-110" aria-label="Search">
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  )
}

export default function Header() {
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const scrolled = useScrolled()
  const dashboardLink = user?.role === 'admin' ? '/admin/dashboard' : '/learn/dashboard'

  return (
    <>
      <TopBar />
      <header
        className={cn(
          'sticky top-0 z-40 border-b transition-all duration-300',
          scrolled
            ? 'border-line/80 bg-white/90 shadow-[0_10px_30px_-18px_rgb(9_63_80/0.35)] backdrop-blur-xl'
            : 'border-transparent bg-white/70 backdrop-blur-md',
        )}
      >
        <div className={cn('container-page flex items-center gap-3 transition-[height] duration-300 lg:gap-5', scrolled ? 'h-16' : 'h-[72px]')}>
          <button type="button" className="btn btn-ghost btn-icon -ml-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation menu">
            <Menu className="h-5 w-5" />
          </button>
          <BrandLogo size={scrolled ? 'sm' : 'md'} />
          <div className="hidden lg:block"><ExploreMenu /></div>
          <nav aria-label="Primary" className="hidden items-center xl:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => cn('nav-underline rounded-lg px-3 py-2 text-sm font-semibold transition-colors', isActive ? 'text-primary' : 'text-slate-700 hover:text-primary')}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <HeaderSearch className="ml-auto hidden w-full max-w-xs md:block lg:ml-0 lg:flex-1 xl:max-w-sm" />
          <div className="ml-auto flex items-center gap-1.5 md:ml-0">
            <Link to="/courses" className="btn btn-ghost btn-icon md:hidden" aria-label="Search courses"><Search className="h-5 w-5" /></Link>
            {user ? (
              <>
                <Link to={dashboardLink} className="btn btn-outline btn-sm hidden rounded-full sm:inline-flex">
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                  {user.role === 'admin' ? 'Admin' : 'My learning'}
                </Link>
                <NotificationBell viewAllTo={user.role === 'learner' ? '/learn/notifications' : undefined} />
                <ProfileMenu />
              </>
            ) : (
              <>
                <Link to="/login" state={{ from: location.pathname + location.search }} className="btn btn-ghost btn-sm hidden rounded-full font-semibold sm:inline-flex">Sign in</Link>
                <Link to="/register" className="btn btn-gradient btn-sm rounded-full px-4 shadow-[0_8px_20px_-8px_rgb(9_63_80/0.6)] transition-transform hover:-translate-y-0.5">
                  Join for Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <Modal open={mobileOpen} onClose={() => setMobileOpen(false)} variant="drawer" side="left" title="Menu">
        <MobileNav user={user} onNavigate={() => setMobileOpen(false)} />
      </Modal>
    </>
  )
}

function MobileNav({ user, onNavigate }) {
  const { categories } = useData()
  const sorted = [...categories].sort((a, b) => a.order - b.order)
  const link = 'group flex items-center justify-between rounded-xl px-3 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:bg-primary-soft hover:text-primary'
  return (
    <nav aria-label="Mobile" className="flex flex-col gap-5" onClick={(e) => { if (e.target.closest('a')) onNavigate() }}>
      <BrandLogo to="/" />
      <HeaderSearch autoFocus />
      <div className="flex flex-col">
        {[...NAV_LINKS, { to: '/programs', label: 'Programs' }, { to: '/categories', label: 'Training tracks' }, { to: '/business', label: 'For Business' }, { to: '/verify-certificate', label: 'Verify certificate' }, { to: '/contact', label: 'Contact' }].map((l, i) => (
          <Link key={l.to} to={l.to} className={cn(link, 'animate-slide-up')} style={{ animationDelay: `${i * 35}ms`, animationFillMode: 'both' }}>
            {l.label}<ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        ))}
      </div>
      <div>
        <p className="eyebrow mb-2 px-3">Categories</p>
        <div className="grid grid-cols-1 gap-0.5">
          {sorted.map((c) => (
            <Link key={c.id} to={`/courses?category=${c.slug}`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink transition-colors hover:bg-slate-100">
              <Icon name={c.icon} className="h-4 w-4 text-secondary" /> {c.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto flex flex-col gap-2 border-t border-line pt-4">
        {user ? (
          <Link to={user.role === 'admin' ? '/admin/dashboard' : '/learn/dashboard'} className="btn btn-primary">Go to {user.role === 'admin' ? 'admin dashboard' : 'my dashboard'}</Link>
        ) : (
          <>
            <Link to="/register" className="btn btn-gradient">Join for Free</Link>
            <Link to="/login" className="btn btn-secondary">Sign in</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export function DemoBanner() {
  const { settings } = useData()
  const [hidden, setHidden] = useState(() => {
    try {
      return window.sessionStorage.getItem('meridian.v1.ui.bannerHidden') === '1'
    } catch {
      return false
    }
  })
  if (!settings.showDemoBanner || hidden) return null
  return (
    <div className="bg-accent-soft text-[#7a3f00]">
      <div className="container-page flex items-center gap-3 py-1.5 text-xs">
        <span className="badge bg-accent text-ink">Demo</span>
        <p className="min-w-0 flex-1">
          Frontend demonstration — learner data, metrics and ratings are illustrative, and everything you do is stored only in this browser.
        </p>
        <button
          type="button"
          className="rounded p-1 hover:bg-black/5"
          aria-label="Dismiss demo notice"
          onClick={() => {
            try { window.sessionStorage.setItem('meridian.v1.ui.bannerHidden', '1') } catch { /* ignore */ }
            setHidden(true)
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
