import { useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Menu, Search, Building2, ArrowRight, LayoutDashboard, X } from 'lucide-react'
import BrandLogo from '../common/BrandLogo'
import Icon from '../common/Icon'
import Modal from '../common/Modal'
import NotificationBell from '../navigation/NotificationBell'
import ProfileMenu from '../navigation/ProfileMenu'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useClickOutside } from '../../hooks/useUtils'
import { cn } from '../../utils/cn'

const NAV_LINKS = [
  { to: '/courses', label: 'Courses' },
  { to: '/career-paths', label: 'Career paths' },
  { to: '/programs', label: 'Learning programs' },
]

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
  const countFor = (id) => courses.filter((c) => c.categoryId === id && c.status === 'published').length

  return (
    <div ref={ref} className="relative" onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="explore-menu"
        className={cn('btn btn-sm gap-1', open ? 'bg-primary text-white hover:bg-primary-hover' : 'bg-primary-soft text-primary hover:bg-[#d9eaee]')}
      >
        Explore <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div id="explore-menu" className="absolute left-0 z-50 mt-3 w-[min(92vw,760px)] animate-slide-up overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-raised)]">
          <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
            <div className="p-5">
              <p className="eyebrow mb-3">Browse by category</p>
              <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {sorted.map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/courses?category=${cat.slug}`} className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm hover:bg-slate-50">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <Icon name={cat.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium text-ink">{cat.name}</span>
                        <span className="block text-xs text-muted">{countFor(cat.id)} courses</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-line bg-slate-50 p-5 md:border-t-0 md:border-l">
              <p className="eyebrow mb-3">Career paths</p>
              <ul className="space-y-1">
                {careerPaths.map((p) => (
                  <li key={p.id}>
                    <Link to={`/career-paths/${p.slug}`} className="block rounded-lg px-2.5 py-2 text-sm font-medium text-ink hover:bg-white">{p.title}</Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
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
      className={cn('relative', className)}
      onSubmit={(e) => {
        e.preventDefault()
        navigate(query.trim() ? `/courses?q=${encodeURIComponent(query.trim())}` : '/courses')
      }}
    >
      <label htmlFor={autoFocus ? 'mobile-search' : 'header-search'} className="sr-only">Search courses</label>
      <input
        id={autoFocus ? 'mobile-search' : 'header-search'}
        type="search"
        value={query}
        autoFocus={autoFocus}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What do you want to learn?"
        className="input rounded-full py-2 pr-11 pl-4"
      />
      <button type="submit" className="absolute top-1/2 right-1 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-hover" aria-label="Search">
        <Search className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  )
}

export default function Header() {
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const dashboardLink = user?.role === 'admin' ? '/admin/dashboard' : '/learn/dashboard'

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container-page flex h-16 items-center gap-3 lg:gap-5">
        <button type="button" className="btn btn-ghost btn-icon -ml-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation menu">
          <Menu className="h-5 w-5" />
        </button>
        <BrandLogo />
        <div className="hidden lg:block"><ExploreMenu /></div>
        <nav aria-label="Primary" className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => cn('rounded-lg px-3 py-2 text-sm font-medium transition-colors', isActive ? 'text-primary' : 'text-slate-700 hover:bg-slate-100 hover:text-ink')}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <HeaderSearch className="ml-auto hidden w-full max-w-sm md:block lg:ml-0 lg:flex-1" />
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link to="/courses" className="btn btn-ghost btn-icon md:hidden" aria-label="Search courses"><Search className="h-5 w-5" /></Link>
          <NavLink to="/business" className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 lg:inline-flex">
            <Building2 className="h-4 w-4" aria-hidden="true" /> For Business
          </NavLink>
          {user ? (
            <>
              <Link to={dashboardLink} className="btn btn-outline btn-sm hidden sm:inline-flex">
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                {user.role === 'admin' ? 'Admin' : 'My learning'}
              </Link>
              <NotificationBell viewAllTo={user.role === 'learner' ? '/learn/notifications' : undefined} />
              <ProfileMenu />
            </>
          ) : (
            <>
              <Link to="/login" state={{ from: location.pathname + location.search }} className="btn btn-ghost btn-sm hidden sm:inline-flex">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join for Free</Link>
            </>
          )}
        </div>
      </div>

      <Modal open={mobileOpen} onClose={() => setMobileOpen(false)} variant="drawer" side="left" title="Menu">
        <MobileNav user={user} onNavigate={() => setMobileOpen(false)} />
      </Modal>
    </header>
  )
}

function MobileNav({ user, onNavigate }) {
  const { categories } = useData()
  const sorted = [...categories].sort((a, b) => a.order - b.order)
  const link = 'flex items-center justify-between rounded-lg px-3 py-2.5 text-[15px] font-medium text-ink hover:bg-slate-100'
  return (
    <nav aria-label="Mobile" className="flex flex-col gap-5" onClick={(e) => { if (e.target.closest('a')) onNavigate() }}>
      <HeaderSearch autoFocus />
      <div className="flex flex-col">
        {NAV_LINKS.map((l) => <Link key={l.to} to={l.to} className={link}>{l.label}<ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" /></Link>)}
        <Link to="/categories" className={link}>All categories<ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" /></Link>
        <Link to="/business" className={link}>For Business<ArrowRight className="h-4 w-4 text-muted" aria-hidden="true" /></Link>
      </div>
      <div>
        <p className="eyebrow mb-2 px-3">Categories</p>
        <div className="grid grid-cols-1 gap-0.5">
          {sorted.map((c) => (
            <Link key={c.id} to={`/courses?category=${c.slug}`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink hover:bg-slate-100">
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
            <Link to="/register" className="btn btn-primary">Join for Free</Link>
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
    <div className="bg-deep text-white">
      <div className="container-page flex items-center gap-3 py-2 text-xs sm:text-[13px]">
        <span className="badge bg-accent text-ink">Demo</span>
        <p className="min-w-0 flex-1 text-white/90">
          Frontend demonstration — courses, people and metrics are fictional, and everything you do is stored only in this browser.
        </p>
        <button
          type="button"
          className="rounded p-1 text-white/80 hover:bg-white/10 hover:text-white"
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
