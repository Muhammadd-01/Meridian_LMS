import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, LineChart, BookOpen, Tags, Presentation, Users, ClipboardCheck, ListChecks, FileText, Star,
  MessagesSquare, Megaphone, PanelsTopLeft, Settings, History, PanelLeftClose, PanelLeftOpen, Menu, ExternalLink,
  ChevronRight, CalendarDays, Plus, LifeBuoy, ShieldCheck,
} from 'lucide-react'
import BrandLogo from '../components/common/BrandLogo'
import AppSidebar from '../components/layout/AppSidebar'
import Modal from '../components/common/Modal'
import NotificationBell from '../components/navigation/NotificationBell'
import ProfileMenu from '../components/navigation/ProfileMenu'
import SearchInput from '../components/common/SearchInput'
import { Avatar } from '../components/common/ui'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { readJSON, writeJSON, STORAGE_KEYS } from '../services/storage'
import { formatDate } from '../utils/format'
import { cn } from '../utils/cn'

/** Finds the sidebar group and item that match the current path (longest match wins). */
function locate(groups, pathname) {
  let best = null
  groups.forEach((group) => group.items.forEach((item) => {
    if (pathname.startsWith(item.to) && (!best || item.to.length > best.item.to.length)) best = { group, item }
  }))
  return best
}

export default function AdminLayout() {
  const { reviews, submissions, courses } = useData()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(() => Boolean(readJSON(STORAGE_KEYS.ui, {})?.adminSidebarCollapsed))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [query, setQuery] = useState('')

  const pendingReviews = reviews.filter((r) => r.status === 'pending').length
  const pendingSubmissions = submissions.filter((s) => s.status === 'submitted').length
  const drafts = courses.filter((c) => c.status === 'draft').length

  const groups = [
    { title: 'Overview', items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/analytics', label: 'Analytics', icon: LineChart },
    ] },
    { title: 'Catalogue', items: [
      { to: '/admin/courses', label: 'Courses', icon: BookOpen, badge: drafts || null },
      { to: '/admin/categories', label: 'Training tracks', icon: Tags },
      { to: '/admin/instructors', label: 'Trainers', icon: Presentation },
      { to: '/admin/content', label: 'Homepage content', icon: PanelsTopLeft },
    ] },
    { title: 'People', items: [
      { to: '/admin/learners', label: 'Learners', icon: Users },
      { to: '/admin/enrollments', label: 'Enrollments', icon: ClipboardCheck },
    ] },
    { title: 'Assessment', items: [
      { to: '/admin/assessments', label: 'Quizzes', icon: ListChecks },
      { to: '/admin/assignments', label: 'Assignments', icon: FileText, badge: pendingSubmissions || null },
    ] },
    { title: 'Community', items: [
      { to: '/admin/reviews', label: 'Reviews', icon: Star, badge: pendingReviews || null },
      { to: '/admin/discussions', label: 'Discussions', icon: MessagesSquare },
      { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    ] },
    { title: 'System', items: [
      { to: '/admin/settings', label: 'Settings', icon: Settings },
      { to: '/admin/activity-logs', label: 'Activity logs', icon: History },
    ] },
  ]
  const current = locate(groups, pathname)

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c
      writeJSON(STORAGE_KEYS.ui, { ...readJSON(STORAGE_KEYS.ui, {}), adminSidebarCollapsed: next })
      return next
    })
  }

  return (
    <div className="min-h-screen bg-page">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden flex-col overflow-clip bg-[#062b37] shadow-[10px_0_40px_-24px_rgb(9_63_80/0.9)] transition-[width] duration-300 lg:flex',
          collapsed ? 'w-[84px]' : 'w-[272px]',
        )}
      >
        {/* Layered background: gradient, dot grid and soft glows. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-deep via-[#073847] to-[#04222c]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-dots-light opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-info/25 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />

        <div className={cn('relative flex h-[72px] shrink-0 items-center border-b border-white/[0.08]', collapsed ? 'justify-center px-2' : 'px-5')}>
          <div className="min-w-0">
            <BrandLogo tone="light" to="/admin/dashboard" compact={collapsed} size={collapsed ? 'sm' : 'md'} />
          </div>
        </div>

        {!collapsed && user && (
          <div className="relative mx-4 mt-4 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.05] p-3 backdrop-blur-sm">
            <span className="relative">
              <Avatar name={user.name} src={user.avatar} size="sm" className="ring-white/20" />
              <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-[#22c55e] ring-2 ring-[#073847]" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user.name}</p>
              <p className="flex items-center gap-1 text-[11px] text-white/55"><ShieldCheck className="h-3 w-3 text-accent" aria-hidden="true" />Platform administrator</p>
            </div>
          </div>
        )}

        <div className="relative flex-1 overflow-y-auto px-3 py-5 scrollbar-thin">
          <AppSidebar groups={groups} collapsed={collapsed} tone="dark" />
        </div>

        <div className="relative space-y-2 border-t border-white/[0.08] p-3">
          {!collapsed && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-primary p-4 text-white [@media(max-height:940px)]:hidden">
              <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-accent/30 blur-2xl" aria-hidden="true" />
              <p className="relative flex items-center gap-2 text-sm font-semibold"><LifeBuoy className="h-4 w-4 text-accent" aria-hidden="true" />Need a hand?</p>
              <p className="relative mt-1 text-xs leading-5 text-white/75">See the public site as learners do, or check the help centre.</p>
              <div className="relative mt-3 flex gap-2">
                <Link to="/" target="_blank" rel="noopener" className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-deep transition-transform hover:-translate-y-0.5">
                  View site <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </Link>
                <Link to="/help" target="_blank" rel="noopener" className="inline-flex items-center rounded-lg border border-white/25 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10">Help</Link>
              </div>
            </div>
          )}
          <button type="button" onClick={toggleCollapsed} className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white', collapsed && 'justify-center')} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <PanelLeftOpen className="h-[18px] w-[18px]" aria-hidden="true" /> : <><PanelLeftClose className="h-[18px] w-[18px]" aria-hidden="true" /> Collapse sidebar</>}
          </button>
        </div>
      </aside>

      <div className={cn('flex min-h-screen flex-col transition-[padding] duration-300', collapsed ? 'lg:pl-[84px]' : 'lg:pl-[272px]')}>
        <header className="sticky top-0 z-20 border-b border-line/80 bg-white/80 shadow-[0_8px_24px_-18px_rgb(9_63_80/0.35)] backdrop-blur-xl">
          <div className="flex h-[72px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button type="button" className="btn btn-ghost btn-icon -ml-2 lg:hidden" onClick={() => setDrawerOpen(true)} aria-label="Open admin navigation">
              <Menu className="h-5 w-5" />
            </button>
            <div className="lg:hidden"><BrandLogo to="/admin/dashboard" compact /></div>
            <div className="hidden min-w-0 lg:block">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted">
                <span>Admin</span>
                {current && <><ChevronRight className="h-3 w-3" aria-hidden="true" /><span>{current.group.title}</span></>}
              </nav>
              <p className="truncate text-[15px] font-bold text-ink">{current?.item.label || 'Admin console'}</p>
            </div>
            <SearchInput
              className="ml-auto hidden w-full max-w-sm md:block lg:ml-8"
              value={query}
              onChange={setQuery}
              placeholder="Search courses by title, trainer or skill"
              label="Search courses"
              onSubmit={(q) => navigate(`/admin/courses${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)}
            />
            <div className="ml-auto flex items-center gap-1.5">
              <span className="hidden items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-muted xl:inline-flex">
                <CalendarDays className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />{formatDate(new Date(), { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <Link to="/admin/courses/new" className="btn btn-gradient btn-sm hidden rounded-full px-4 sm:inline-flex">
                <Plus className="h-4 w-4" aria-hidden="true" />New course
              </Link>
              <Link to="/" className="btn btn-ghost btn-icon hidden md:inline-flex" target="_blank" rel="noopener" aria-label="View public site" title="View public site">
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Link>
              <NotificationBell />
              <ProfileMenu />
            </div>
          </div>
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-accent via-info to-primary opacity-70" aria-hidden="true" />
        </header>
        <main id="main-content" tabIndex={-1} className="flex-1 bg-mesh px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8">
          <div key={pathname} className="mx-auto max-w-7xl animate-page-in">
            <Outlet />
          </div>
        </main>
      </div>

      <Modal open={drawerOpen} onClose={() => setDrawerOpen(false)} variant="drawer" side="left" title="Admin navigation">
        <AppSidebar groups={groups} tone="light" onNavigate={() => setDrawerOpen(false)} />
      </Modal>
    </div>
  )
}
