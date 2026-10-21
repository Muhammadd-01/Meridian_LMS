import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, LineChart, BookOpen, Tags, Presentation, Users, ClipboardCheck, ListChecks, FileText, Star,
  MessagesSquare, Megaphone, PanelsTopLeft, Settings, History, PanelLeftClose, PanelLeftOpen, Menu, ExternalLink,
} from 'lucide-react'
import BrandLogo from '../components/common/BrandLogo'
import AppSidebar from '../components/layout/AppSidebar'
import Modal from '../components/common/Modal'
import NotificationBell from '../components/navigation/NotificationBell'
import ProfileMenu from '../components/navigation/ProfileMenu'
import SearchInput from '../components/common/SearchInput'
import { useData } from '../context/DataContext'
import { readJSON, writeJSON, STORAGE_KEYS } from '../services/storage'
import { cn } from '../utils/cn'

export default function AdminLayout() {
  const { reviews, submissions, courses } = useData()
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
      { to: '/admin/categories', label: 'Categories', icon: Tags },
      { to: '/admin/instructors', label: 'Instructors', icon: Presentation },
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
          'fixed inset-y-0 left-0 z-30 hidden flex-col overflow-hidden bg-gradient-to-b from-deep via-[#0a4253] to-[#062f3c] shadow-[8px_0_30px_-20px_rgb(9_63_80/0.8)] transition-[width] duration-300 lg:flex',
          collapsed ? 'w-[76px]' : 'w-64',
        )}
      >
        <div className={cn('relative flex h-16 shrink-0 items-center border-b border-white/10', collapsed ? 'justify-center px-2' : 'px-5')}>
          <BrandLogo tone="light" to="/admin/dashboard" compact={collapsed} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-dots-light" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-info/20 blur-3xl" aria-hidden="true" />
        <div className="relative flex-1 overflow-y-auto px-3 py-5 scrollbar-thin">
          <AppSidebar groups={groups} collapsed={collapsed} tone="dark" />
        </div>
        <div className="relative border-t border-white/10 p-3">
          <button type="button" onClick={toggleCollapsed} className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white', collapsed && 'justify-center')} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <PanelLeftOpen className="h-[18px] w-[18px]" aria-hidden="true" /> : <><PanelLeftClose className="h-[18px] w-[18px]" aria-hidden="true" /> Collapse</>}
          </button>
        </div>
      </aside>

      <div className={cn('flex min-h-screen flex-col transition-[padding] duration-200', collapsed ? 'lg:pl-[76px]' : 'lg:pl-64')}>
        <header className="sticky top-0 z-20 border-b border-line/80 bg-white/85 shadow-[0_8px_24px_-18px_rgb(9_63_80/0.35)] backdrop-blur-xl">
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-accent via-info to-primary opacity-70" aria-hidden="true" />
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button type="button" className="btn btn-ghost btn-icon -ml-2 lg:hidden" onClick={() => setDrawerOpen(true)} aria-label="Open admin navigation">
              <Menu className="h-5 w-5" />
            </button>
            <div className="lg:hidden"><BrandLogo to="/admin/dashboard" compact /></div>
            <SearchInput
              className="hidden w-full max-w-md md:block"
              value={query}
              onChange={setQuery}
              placeholder="Search courses by title, instructor or skill"
              label="Search courses"
              onSubmit={(q) => navigate(`/admin/courses${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)}
            />
            <div className="ml-auto flex items-center gap-1">
              <span className="badge badge-accent mr-1 hidden sm:inline-flex">Admin demo</span>
              <Link to="/" className="btn btn-ghost btn-sm hidden sm:inline-flex" target="_blank" rel="noopener">
                View site <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <NotificationBell />
              <ProfileMenu />
            </div>
          </div>
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
