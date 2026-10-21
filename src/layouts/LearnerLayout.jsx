import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Library, Compass, Heart, Route, Award, Trophy, Bell, User, Settings, Menu, Target,
} from 'lucide-react'
import BrandLogo from '../components/common/BrandLogo'
import AppSidebar from '../components/layout/AppSidebar'
import Modal from '../components/common/Modal'
import NotificationBell from '../components/navigation/NotificationBell'
import ProfileMenu from '../components/navigation/ProfileMenu'
import SearchInput from '../components/common/SearchInput'
import { ProgressBar } from '../components/common/ui'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { DemoBanner } from '../components/layout/Header'
import { getLearnerStats } from '../utils/learning'
import { useNow } from '../hooks/useUtils'

function WeeklyGoalCard() {
  const data = useData()
  const { user } = useAuth()
  const now = useNow()
  const stats = getLearnerStats(data, user.id, now)
  const goalMinutes = (user.weeklyGoalHours || 0) * 60
  const pct = goalMinutes ? (stats.weekMinutes / goalMinutes) * 100 : 0
  return (
    <div className="rounded-xl border border-line bg-gradient-to-br from-primary-soft to-white p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-ink"><Target className="h-4 w-4 text-secondary" aria-hidden="true" />Weekly goal</p>
      <p className="mt-1 text-xs text-muted">
        {Math.round(stats.weekMinutes / 6) / 10} of {user.weeklyGoalHours || 0} hours in the last 7 days
      </p>
      <ProgressBar value={pct} size="sm" className="mt-3" label="Weekly goal progress" />
      <Link to="/learn/settings" className="mt-3 inline-block text-xs font-semibold text-secondary hover:underline">Adjust goal</Link>
    </div>
  )
}

export default function LearnerLayout() {
  const { notifications, saved } = useData()
  const { user } = useAuth()
  const navigate = useNavigate()
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
      <header className="no-print sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
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
      <div className="flex">
        <aside className="no-print sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r border-line bg-white p-4 lg:flex">
          <AppSidebar groups={groups} tone="light" />
          <div className="mt-auto"><WeeklyGoalCard /></div>
        </aside>
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
      <Modal open={drawerOpen} onClose={() => setDrawerOpen(false)} variant="drawer" side="left" title="My learning">
        <div className="flex flex-col gap-6">
          <AppSidebar groups={groups} tone="light" onNavigate={() => setDrawerOpen(false)} />
          <WeeklyGoalCard />
        </div>
      </Modal>
    </div>
  )
}
