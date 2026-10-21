import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Library, Compass, Heart, Route, Award, Trophy, Bell, User, Settings, Menu, Target, Flame,
} from 'lucide-react'
import BrandLogo from '../components/common/BrandLogo'
import AppSidebar from '../components/layout/AppSidebar'
import Modal from '../components/common/Modal'
import NotificationBell from '../components/navigation/NotificationBell'
import ProfileMenu from '../components/navigation/ProfileMenu'
import SearchInput from '../components/common/SearchInput'
import { ProgressBar, Avatar } from '../components/common/ui'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { DemoBanner } from '../components/layout/Header'
import { getLearnerStats } from '../utils/learning'
import { useNow } from '../hooks/useUtils'

function SidebarProfile() {
  const data = useData()
  const { user } = useAuth()
  const now = useNow()
  const stats = getLearnerStats(data, user.id, now)
  return (
    <Link to="/learn/profile" className="group flex items-center gap-3 rounded-2xl border border-line bg-gradient-to-br from-white to-primary-soft/60 p-3 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <span className="relative">
        <Avatar name={user.name} src={user.avatar} size="md" className="ring-2 ring-accent/60 transition-transform group-hover:scale-105" />
        <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-success" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-ink">{user.name}</span>
        <span className="flex items-center gap-1 text-xs text-muted"><Flame className="h-3.5 w-3.5 text-accent" aria-hidden="true" />{stats.streak}-day streak · {stats.completed} completed</span>
      </span>
    </Link>
  )
}

function WeeklyGoalCard() {
  const data = useData()
  const { user } = useAuth()
  const now = useNow()
  const stats = getLearnerStats(data, user.id, now)
  const goalMinutes = (user.weeklyGoalHours || 0) * 60
  const pct = goalMinutes ? (stats.weekMinutes / goalMinutes) * 100 : 0
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-deep via-primary to-secondary p-4 text-white shadow-[0_16px_30px_-18px_rgb(9_63_80/0.9)]">
      <div className="pointer-events-none absolute inset-0 bg-dots-light" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-accent/30 blur-2xl transition-transform duration-500 group-hover:scale-150" aria-hidden="true" />
      <p className="relative flex items-center gap-2 text-sm font-semibold"><Target className="h-4 w-4 text-accent" aria-hidden="true" />Weekly goal</p>
      <p className="relative mt-1 text-xs text-white/75">
        {Math.round(stats.weekMinutes / 6) / 10} of {user.weeklyGoalHours || 0} hours in the last 7 days
      </p>
      <ProgressBar value={pct} size="sm" tone="accent" className="relative mt-3 [&>div]:bg-white/20" label="Weekly goal progress" />
      <Link to="/learn/settings" className="relative mt-3 inline-flex items-center text-xs font-semibold text-accent hover:underline">Adjust goal →</Link>
    </div>
  )
}

export default function LearnerLayout() {
  const { notifications, saved } = useData()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [query, setQuery] = useState('')
  const unread = notifications.filter((n) => n.userId === user.id && !n.read).length
  const savedCount = saved.filter((s) => s.userId === user.id).length

  const groups = [
    {
      title: 'Learn',
      items: [
        { to: '/learn/dashboard', label: 'Overview', icon: LayoutDashboard },
        { to: '/learn/my-learning', label: 'My Learning', icon: Library },
        { to: '/learn/browse', label: 'Browse Courses', icon: Compass },
        { to: '/learn/saved', label: 'Saved Courses', icon: Heart, badge: savedCount || null },
        { to: '/learn/paths', label: 'Learning Paths', icon: Route },
      ],
    },
    {
      title: 'Progress',
      items: [
        { to: '/learn/certificates', label: 'Certificates', icon: Award },
        { to: '/learn/achievements', label: 'Achievements', icon: Trophy },
        { to: '/learn/notifications', label: 'Notifications', icon: Bell, badge: unread || null },
      ],
    },
    {
      title: 'Account',
      items: [
        { to: '/learn/profile', label: 'Profile', icon: User },
        { to: '/learn/settings', label: 'Settings', icon: Settings },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-page">
      <div className="no-print"><DemoBanner /></div>
      <header className="no-print sticky top-0 z-40 border-b border-line/80 bg-white/85 shadow-[0_8px_24px_-18px_rgb(9_63_80/0.35)] backdrop-blur-xl">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <button type="button" className="btn btn-ghost btn-icon -ml-2 lg:hidden" onClick={() => setDrawerOpen(true)} aria-label="Open learner navigation">
            <Menu className="h-5 w-5" />
          </button>
          <BrandLogo to="/learn/dashboard" />
          <SearchInput
            className="ml-4 hidden w-full max-w-md md:block"
            value={query}
            onChange={setQuery}
            placeholder="Search the catalogue"
            label="Search the catalogue"
            onSubmit={(q) => navigate(q.trim() ? `/learn/browse?q=${encodeURIComponent(q.trim())}` : '/learn/browse')}
          />
          <div className="ml-auto flex items-center gap-1">
            <Link to="/" className="btn btn-ghost btn-sm hidden sm:inline-flex">Public site</Link>
            <NotificationBell viewAllTo="/learn/notifications" />
            <ProfileMenu />
          </div>
        </div>
      </header>
      <div className="flex bg-mesh">
        <aside className="no-print sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 flex-col gap-5 overflow-y-auto border-r border-line bg-white/80 p-4 backdrop-blur scrollbar-thin lg:flex">
          <SidebarProfile />
          <AppSidebar groups={groups} tone="light" />
          <div className="mt-auto"><WeeklyGoalCard /></div>
        </aside>
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8">
          <div key={pathname} className="mx-auto max-w-6xl animate-page-in">
            <Outlet />
          </div>
        </main>
      </div>
      <Modal open={drawerOpen} onClose={() => setDrawerOpen(false)} variant="drawer" side="left" title="My learning">
        <div className="flex flex-col gap-6">
          <SidebarProfile />
          <AppSidebar groups={groups} tone="light" onNavigate={() => setDrawerOpen(false)} />
          <WeeklyGoalCard />
        </div>
      </Modal>
    </div>
  )
}
