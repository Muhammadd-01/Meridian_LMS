import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, CheckCheck, Info } from 'lucide-react'
import { NOTIFICATION_ICONS } from './notificationIcons'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useClickOutside } from '../../hooks/useUtils'
import { relativeTime } from '../../utils/format'
import { cn } from '../../utils/cn'

export default function NotificationBell({ viewAllTo, tone = 'light' }) {
  const { notifications, actions } = useData()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false), open)

  if (!user) return null
  const mine = notifications.filter((n) => n.userId === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const unread = mine.filter((n) => !n.read).length

  const openNotification = (n) => {
    actions.markNotificationRead(n.id)
    setOpen(false)
    if (n.link) navigate(n.link)
  }

  return (
    <div ref={ref} className="relative" onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        className={cn('relative rounded-lg p-2 transition-colors', tone === 'dark' ? 'text-white/85 hover:bg-white/10 hover:text-white' : 'text-ink hover:bg-slate-100')}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div role="dialog" aria-label="Notifications" className="absolute right-0 z-50 mt-2 w-[min(92vw,380px)] animate-slide-up overflow-hidden rounded-xl border border-line bg-white shadow-[var(--shadow-raised)]">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-semibold text-ink">Notifications</p>
            <button type="button" className="btn btn-ghost btn-sm text-secondary" onClick={() => actions.markAllNotificationsRead(user.id)} disabled={!unread}>
              <CheckCheck className="h-4 w-4" aria-hidden="true" /> Mark all read
            </button>
          </div>
          <ul className="max-h-[360px] divide-y divide-line overflow-y-auto">
            {mine.slice(0, 6).map((n) => {
              const Icon = NOTIFICATION_ICONS[n.type] || Info
              return (
                <li key={n.id}>
                  <button type="button" onClick={() => openNotification(n)} className={cn('flex w-full gap-3 px-4 py-3 text-left hover:bg-slate-50', !n.read && 'bg-info-soft/50')}>
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className={cn('text-sm text-ink', !n.read && 'font-semibold')}>{n.title}</span>
                        {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="Unread" />}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-xs text-muted">{n.message}</span>
                      <span className="mt-1 block text-[11px] text-slate-400">{relativeTime(n.createdAt)}</span>
                    </span>
                  </button>
                </li>
              )
            })}
            {!mine.length && <li className="px-4 py-10 text-center text-sm text-muted">You’re all caught up.</li>}
          </ul>
          {viewAllTo && (
            <Link to={viewAllTo} onClick={() => setOpen(false)} className="block border-t border-line px-4 py-3 text-center text-sm font-semibold text-secondary hover:bg-slate-50">
              View all notifications
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
