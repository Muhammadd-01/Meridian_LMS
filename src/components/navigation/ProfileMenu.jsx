import { useNavigate } from 'react-router-dom'
import { ChevronDown, LayoutDashboard, Library, User, Settings, LogOut, Globe, Award, Shield } from 'lucide-react'
import Dropdown from '../common/Dropdown'
import { Avatar } from '../common/ui'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { cn } from '../../utils/cn'

export default function ProfileMenu({ tone = 'light', showName = true }) {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  if (!user) return null

  const signOut = () => {
    logout()
    toast.success('You have been signed out of the demo session. Your progress is still saved in this browser.')
    navigate('/')
  }

  const items = user.role === 'admin'
    ? [
        { label: 'Admin dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
        { label: 'Platform settings', icon: Settings, to: '/admin/settings' },
        { label: 'View public site', icon: Globe, to: '/' },
        { divider: true },
        { label: 'Sign out', icon: LogOut, onClick: signOut, danger: true },
      ]
    : [
        { label: 'Dashboard', icon: LayoutDashboard, to: '/learn/dashboard' },
        { label: 'My learning', icon: Library, to: '/learn/my-learning' },
        { label: 'Certificates', icon: Award, to: '/learn/certificates' },
        { label: 'Profile', icon: User, to: '/learn/profile' },
        { label: 'Settings', icon: Settings, to: '/learn/settings' },
        { divider: true },
        { label: 'Sign out', icon: LogOut, onClick: signOut, danger: true },
      ]

  return (
    <Dropdown
      label="Account menu"
      items={items}
      header={(
        <div className="flex items-center gap-3">
          <Avatar name={user.name} src={user.avatar} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-secondary">
              <Shield className="h-3 w-3" aria-hidden="true" /> {user.role === 'admin' ? 'Admin' : 'Learner'} · demo session
            </p>
          </div>
        </div>
      )}
      trigger={(
        <span className={cn('flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors', tone === 'dark' ? 'hover:bg-white/10' : 'hover:bg-slate-100')}>
          <Avatar name={user.name} src={user.avatar} size="sm" />
          {showName && (
            <span className={cn('hidden max-w-[120px] truncate text-sm font-medium lg:block', tone === 'dark' ? 'text-white' : 'text-ink')}>
              {user.name.split(' ')[0]}
            </span>
          )}
          <ChevronDown className={cn('h-4 w-4', tone === 'dark' ? 'text-white/70' : 'text-muted')} aria-hidden="true" />
        </span>
      )}
    />
  )
}
