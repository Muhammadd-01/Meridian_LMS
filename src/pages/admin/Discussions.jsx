import { useState } from 'react'
import { Pin, PinOff, Eye, EyeOff, Trash2, MessagesSquare, ChevronDown } from 'lucide-react'
import SearchInput from '../../components/common/SearchInput'
import { Avatar, EmptyState, PageHeader, StatusBadge } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useConfirm } from '../../context/ConfirmContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { resolveAuthor } from '../../utils/learning'
import { searchItems } from '../../utils/query'
import { relativeTime } from '../../utils/format'
import { cn } from '../../utils/cn'

export default function AdminDiscussions() {
  useDocumentTitle('Discussions')
  const { discussions, courses, users, instructors, actions } = useData()
  const toast = useToast()
  const confirm = useConfirm()
  const [query, setQuery] = useState('')
  const [course, setCourse] = useState('')
  const [status, setStatus] = useState('')
  const [open, setOpen] = useState(() => new Set())

  const list = searchItems(discussions, query, ['title', 'body', (d) => d.replies.map((r) => r.body)])
    .filter((d) => (!course || d.courseId === course) && (!status || d.status === status))
    .sort((a, b) => (b.pinned - a.pinned) || new Date(b.createdAt) - new Date(a.createdAt))

  const toggleOpen = (id) => setOpen((s) => {
    const next = new Set(s)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  const removeThread = async (t) => {
    if (await confirm({ title: 'Delete this discussion?', message: `“${t.title}” and its ${t.replies.length} replies will be removed.`, confirmLabel: 'Delete', tone: 'danger' })) {
      actions.deleteThread(t.id)
      toast.success('Discussion deleted.')
    }
  }

  return (
    <div>
      <PageHeader title="Discussions" description="Simulated course discussion boards. Pin helpful threads and moderate posts and replies." breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Discussions' }]} />
      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <SearchInput className="flex-1" value={query} onChange={setQuery} placeholder="Search topics, posts and replies" label="Search discussions" />
        <select className="input md:w-60" aria-label="Filter by course" value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="">All courses</option>
          {courses.filter((c) => discussions.some((d) => d.courseId === c.id)).map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        <select className="input md:w-40" aria-label="Filter by visibility" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option><option value="visible">Visible</option><option value="hidden">Hidden</option>
        </select>
      </div>
      <ul className="space-y-3">
        {list.map((t) => {
          const author = resolveAuthor(t.userId, users, instructors)
          const isOpen = open.has(t.id)
          return (
            <li key={t.id} className={cn('card overflow-hidden', t.status === 'hidden' && 'opacity-75')}>
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
                <Avatar name={author.name} src={author.avatar} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 font-medium text-ink">
                    {t.pinned && <span className="badge badge-accent"><Pin className="h-3 w-3" aria-hidden="true" />Pinned</span>}
                    {t.title}
                    <StatusBadge status={t.status} />
                  </p>
                  <p className="text-xs text-muted">{author.name} ({author.role}) · {courses.find((c) => c.id === t.courseId)?.title} · {relativeTime(t.createdAt)}</p>
                  <p className="mt-2 text-sm text-slate-700">{t.body}</p>
                  <button type="button" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline" onClick={() => toggleOpen(t.id)} aria-expanded={isOpen}>
                    {t.replies.length} replies <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')} aria-hidden="true" />
                  </button>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" className="btn btn-ghost btn-icon" onClick={() => { actions.updateThread(t.id, { pinned: !t.pinned }, t.pinned ? 'discussion.unpinned' : 'discussion.pinned'); toast.success(t.pinned ? 'Discussion unpinned.' : 'Discussion pinned.') }} aria-label={t.pinned ? 'Unpin' : 'Pin'} title={t.pinned ? 'Unpin' : 'Pin'}>
                    {t.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                  </button>
                  <button type="button" className="btn btn-ghost btn-icon" onClick={() => { const hide = t.status === 'visible'; actions.updateThread(t.id, { status: hide ? 'hidden' : 'visible' }, hide ? 'discussion.hidden' : 'discussion.restored'); toast.success(hide ? 'Discussion hidden from learners.' : 'Discussion visible again.') }} aria-label={t.status === 'visible' ? 'Hide' : 'Show'} title={t.status === 'visible' ? 'Hide' : 'Show'}>
                    {t.status === 'visible' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button type="button" className="btn btn-danger-ghost btn-icon" onClick={() => removeThread(t)} aria-label="Delete discussion" title="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              {isOpen && (
                <ul className="divide-y divide-line border-t border-line bg-slate-50/60">
                  {t.replies.map((r) => {
                    const a = resolveAuthor(r.userId, users, instructors)
                    return (
                      <li key={r.id} className={cn('flex items-start gap-3 px-4 py-3 pl-14', r.status === 'hidden' && 'opacity-60')}>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs"><span className="font-semibold text-ink">{a.name}</span> <span className="text-muted">· {a.role} · {relativeTime(r.createdAt)}</span> {r.status === 'hidden' && <StatusBadge status="hidden" />}</p>
                          <p className="text-sm text-slate-700">{r.body}</p>
                        </div>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => { actions.setReplyStatus(t.id, r.id, r.status === 'visible' ? 'hidden' : 'visible'); toast.success(r.status === 'visible' ? 'Reply hidden.' : 'Reply restored.') }}>{r.status === 'visible' ? 'Hide' : 'Show'}</button>
                        <button type="button" className="btn btn-danger-ghost btn-sm" onClick={() => { actions.deleteReply(t.id, r.id); toast.success('Reply removed.') }}>Remove</button>
                      </li>
                    )
                  })}
                  {!t.replies.length && <li className="px-4 py-3 pl-14 text-sm text-muted">No replies.</li>}
                </ul>
              )}
            </li>
          )
        })}
        {!list.length && <li className="card"><EmptyState icon={MessagesSquare} title="No discussions match" /></li>}
      </ul>
    </div>
  )
}
