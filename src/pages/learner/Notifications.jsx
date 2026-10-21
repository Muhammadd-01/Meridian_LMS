import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck, Trash2, X, Mail, MailOpen, Info } from 'lucide-react'
import Tabs from '../../components/common/Tabs'
import { EmptyState, PageHeader } from '../../components/common/ui'
import { NOTIFICATION_ICONS } from '../../components/navigation/notificationIcons'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useConfirm } from '../../context/ConfirmContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatDateTime, relativeTime } from '../../utils/format'
import { cn } from '../../utils/cn'

const TYPE_LABELS = { announcement: 'Announcement', course: 'Course', deadline: 'Deadline', achievement: 'Achievement', system: 'System' }

export default function Notifications() {
  useDocumentTitle('Notifications')
  const { notifications, actions } = useData()
  const { user } = useAuth()
  const toast = useToast()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [type, setType] = useState('')

  const mine = notifications.filter((n) => n.userId === user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const unread = mine.filter((n) => !n.read).length
  const list = mine.filter((n) => (tab === 'unread' ? !n.read : true) && (!type || n.type === type))

  const open = (n) => {
    actions.markNotificationRead(n.id)
    if (n.link && n.link !== '/learn/notifications') navigate(n.link)
  }

  const clearAll = async () => {
    if (await confirm({ title: 'Clear all notifications?', message: 'This removes every notification from this browser. It cannot be undone.', confirmLabel: 'Clear all', tone: 'danger' })) {
      actions.clearNotifications(user.id)
      toast.success('All notifications cleared.')
    }
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Announcements, course updates, deadlines and achievements."
        actions={(
          <>
            <button type="button" className="btn btn-secondary btn-sm" disabled={!unread} onClick={() => { actions.markAllNotificationsRead(user.id); toast.success('All notifications marked as read.') }}>
              <CheckCheck className="h-4 w-4" aria-hidden="true" />Mark all read
            </button>
            <button type="button" className="btn btn-danger-ghost btn-sm" disabled={!mine.length} onClick={clearAll}><Trash2 className="h-4 w-4" aria-hidden="true" />Clear all</button>
          </>
        )}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Tabs className="flex-1" tabs={[{ id: 'all', label: 'All', count: mine.length }, { id: 'unread', label: 'Unread', count: unread }]} value={tab} onChange={setTab} ariaLabel="Notification filter" />
        <label className="sr-only" htmlFor="ntf-type">Filter by type</label>
        <select id="ntf-type" className="input sm:w-48" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          {Object.entries(TYPE_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
        </select>
      </div>
      <ul className="card mt-5 divide-y divide-line overflow-hidden">
        {list.map((n) => {
          const NIcon = NOTIFICATION_ICONS[n.type] || Info
          return (
            <li key={n.id} className={cn('flex gap-4 p-4 sm:p-5', !n.read && 'bg-info-soft/40')}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"><NIcon className="h-5 w-5" aria-hidden="true" /></span>
              <div className="min-w-0 flex-1">
                <button type="button" onClick={() => open(n)} className="text-left">
                  <span className={cn('block text-ink hover:underline', !n.read && 'font-semibold')}>{n.title}</span>
                </button>
                <p className="mt-0.5 text-sm text-muted">{n.message}</p>
                <p className="mt-1 text-xs text-slate-400"><span className="font-medium text-slate-500">{TYPE_LABELS[n.type] || 'Update'}</span> · <time dateTime={n.createdAt} title={formatDateTime(n.createdAt)}>{relativeTime(n.createdAt)}</time></p>
              </div>
              <div className="flex shrink-0 items-start gap-1">
                <button type="button" className="rounded-lg p-2 text-muted hover:bg-slate-100 hover:text-ink" onClick={() => actions.markNotificationRead(n.id, !n.read)} aria-label={n.read ? 'Mark as unread' : 'Mark as read'} title={n.read ? 'Mark as unread' : 'Mark as read'}>
                  {n.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                </button>
                <button type="button" className="rounded-lg p-2 text-muted hover:bg-slate-100 hover:text-danger" onClick={() => { actions.dismissNotification(n.id); toast.info('Notification dismissed.') }} aria-label="Dismiss notification" title="Dismiss">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </li>
          )
        })}
        {!list.length && (
          <li><EmptyState icon={Bell} title={tab === 'unread' ? 'No unread notifications' : 'No notifications'} description="You’re all caught up. New announcements and course updates will appear here." /></li>
        )}
      </ul>
    </div>
  )
}
