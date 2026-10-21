import { useState } from 'react'
import { Pin, MessageSquare, Send, ChevronDown } from 'lucide-react'
import { Avatar } from '../common/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { resolveAuthor } from '../../utils/learning'
import { relativeTime } from '../../utils/format'
import { cn } from '../../utils/cn'

function Thread({ thread, user }) {
  const { users, instructors, actions } = useData()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [reply, setReply] = useState('')
  const author = resolveAuthor(thread.userId, users, instructors)
  const replies = thread.replies.filter((r) => r.status === 'visible')

  const send = (e) => {
    e.preventDefault()
    if (!reply.trim()) return
    actions.addReply(thread.id, user.id, reply)
    setReply('')
    toast.success('Reply posted to the simulated discussion.')
  }

  return (
    <li className={cn('rounded-xl border bg-white', thread.pinned ? 'border-accent/40' : 'border-line')}>
      <button type="button" className="flex w-full items-start gap-3 p-4 text-left" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Avatar name={author.name} src={author.avatar} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 font-medium text-ink">
            {thread.pinned && <span className="badge badge-accent"><Pin className="h-3 w-3" aria-hidden="true" />Pinned</span>}
            {thread.title}
          </p>
          <p className="text-xs text-muted">{author.name} · {author.role} · {relativeTime(thread.createdAt)}</p>
          {!open && <p className="mt-1 line-clamp-1 text-sm text-slate-600">{thread.body}</p>}
        </div>
        <span className="flex shrink-0 items-center gap-1 text-xs text-muted"><MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />{replies.length}<ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden="true" /></span>
      </button>
      {open && (
        <div className="border-t border-line px-4 pt-3 pb-4">
          <p className="text-sm whitespace-pre-line text-slate-700">{thread.body}</p>
          <ul className="mt-4 space-y-3 border-l-2 border-line pl-4">
            {replies.map((r) => {
              const a = resolveAuthor(r.userId, users, instructors)
              return (
                <li key={r.id} className="flex gap-3">
                  <Avatar name={a.name} src={a.avatar} size="xs" />
                  <div>
                    <p className="text-xs"><span className="font-semibold text-ink">{a.name}</span> <span className="text-muted">· {a.role} · {relativeTime(r.createdAt)}</span></p>
                    <p className="mt-0.5 text-sm text-slate-700">{r.body}</p>
                  </div>
                </li>
              )
            })}
            {!replies.length && <li className="text-sm text-muted">No replies yet.</li>}
          </ul>
          <form onSubmit={send} className="mt-4 flex gap-2">
            <label htmlFor={`reply-${thread.id}`} className="sr-only">Write a reply</label>
            <input id={`reply-${thread.id}`} className="input" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply…" />
            <button type="submit" className="btn btn-primary" disabled={!reply.trim()} aria-label="Post reply"><Send className="h-4 w-4" /></button>
          </form>
        </div>
      )}
    </li>
  )
}

/** Simulated course discussion board (stored locally; no real-time messaging). */
export default function DiscussionPanel({ course, user }) {
  const { discussions, actions } = useData()
  const toast = useToast()
  const [composing, setComposing] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const threads = discussions
    .filter((d) => d.courseId === course.id && d.status === 'visible')
    .sort((a, b) => (b.pinned - a.pinned) || new Date(b.createdAt) - new Date(a.createdAt))

  const create = (e) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) {
      toast.error('Add a title and a message to start a discussion.')
      return
    }
    actions.createThread({ userId: user.id, courseId: course.id, title, body })
    setTitle('')
    setBody('')
    setComposing(false)
    toast.success('Discussion posted.')
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">Ask questions and share ideas with other learners. This board is simulated and stored in your browser.</p>
        {!composing && <button type="button" className="btn btn-primary btn-sm" onClick={() => setComposing(true)}>Start a discussion</button>}
      </div>
      {composing && (
        <form onSubmit={create} className="mt-4 space-y-3 rounded-xl border border-line bg-white p-4">
          <label htmlFor="thread-title" className="label">Title</label>
          <input id="thread-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
          <label htmlFor="thread-body" className="label">Message</label>
          <textarea id="thread-body" rows={4} className="input" value={body} onChange={(e) => setBody(e.target.value)} />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary btn-sm">Post</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setComposing(false)}>Cancel</button>
          </div>
        </form>
      )}
      <ul className="mt-4 space-y-3">
        {threads.map((t) => <Thread key={t.id} thread={t} user={user} />)}
        {!threads.length && <li className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">No discussions yet — be the first to start one.</li>}
      </ul>
    </div>
  )
}
