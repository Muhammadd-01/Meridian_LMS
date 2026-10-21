import { useRef, useState } from 'react'
import { CalendarClock, Paperclip, X, Send, Pencil, MessageSquareQuote } from 'lucide-react'
import Markdown from '../common/Markdown'
import { Field, StatusBadge } from '../common/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { formatDate, formatDateTime, daysBetween } from '../../utils/format'
import { cn } from '../../utils/cn'

const formatBytes = (n) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`)

/** Assignment brief, local submission form (simulated attachments) and grading feedback. */
export default function AssignmentPanel({ assignment, course, lesson, user, now }) {
  const { submissions, actions } = useData()
  const toast = useToast()
  const fileRef = useRef(null)
  const submission = submissions.find((s) => s.userId === user.id && s.assignmentId === assignment.id)
  const [editing, setEditing] = useState(!submission)
  const [text, setText] = useState(submission?.text || '')
  const [files, setFiles] = useState(submission?.attachments || [])
  const [error, setError] = useState('')

  const days = daysBetween(now, assignment.dueDate)
  const canResubmit = submission && (submission.status === 'resubmit' || (assignment.allowResubmission && submission.status !== 'resubmit'))
  const showForm = editing || submission?.status === 'resubmit'

  const onFiles = (e) => {
    const chosen = [...(e.target.files || [])].map((f) => ({ name: f.name, size: f.size }))
    e.target.value = ''
    setFiles((list) => [...list, ...chosen].slice(0, 5))
  }

  const submit = (e) => {
    e.preventDefault()
    if (text.trim().length < 30) {
      setError('Describe your work in at least 30 characters.')
      return
    }
    setError('')
    const result = actions.submitAssignment({ userId: user.id, assignmentId: assignment.id, courseId: course.id, lessonId: lesson.id, text, attachments: files })
    if (!result.ok) {
      toast.error(result.reason === 'locked' ? 'This assignment no longer accepts resubmissions.' : 'Could not submit this assignment.')
      return
    }
    setEditing(false)
    toast.success('Assignment submitted. It is saved locally and awaiting review by the demo admin.')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-white p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className={cn('badge', days < 0 && !submission ? 'badge-danger' : 'badge-info')}><CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />Due {formatDate(assignment.dueDate)}{days < 0 && !submission ? ' · overdue' : days >= 0 ? ` · ${days} day${days === 1 ? '' : 's'} left` : ''}</span>
          <span className="badge badge-neutral">{assignment.maxPoints} points</span>
          <span className="badge badge-neutral">{assignment.allowResubmission ? 'Resubmission allowed' : 'Single submission'}</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-ink">{assignment.title}</h3>
        <Markdown content={assignment.instructions} className="mt-2" />
        {assignment.rubric?.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-ink">Assessed on</p>
            <div className="mt-2 flex flex-wrap gap-2">{assignment.rubric.map((r) => <span key={r} className="badge badge-primary">{r}</span>)}</div>
          </div>
        )}
      </div>

      {submission && (
        <section className="rounded-2xl border border-line bg-white p-6" aria-labelledby="submission-status">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 id="submission-status" className="font-semibold text-ink">Your submission</h3>
              <p className="text-sm text-muted">Attempt {submission.attempt || 1} · submitted {formatDateTime(submission.submittedAt)}</p>
            </div>
            <StatusBadge status={submission.status}>{{ submitted: 'Awaiting review', graded: 'Graded', resubmit: 'Resubmission requested' }[submission.status]}</StatusBadge>
          </div>
          {(submission.status === 'graded' || submission.status === 'resubmit') && (
            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="text-2xl font-bold text-ink">{submission.grade ?? '—'}<span className="text-base font-medium text-muted">/{assignment.maxPoints}</span></p>
              {submission.feedback && <p className="mt-2 flex gap-2 text-sm text-slate-700"><MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />{submission.feedback}</p>}
              <p className="mt-2 text-xs text-muted">Graded {formatDateTime(submission.gradedAt)} · demo feedback</p>
            </div>
          )}
          {!showForm && (
            <>
              <p className="mt-4 text-sm whitespace-pre-line text-slate-700">{submission.text}</p>
              {submission.attachments?.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">{submission.attachments.map((f) => <li key={f.name} className="badge badge-neutral"><Paperclip className="h-3 w-3" aria-hidden="true" />{f.name}</li>)}</ul>
              )}
              {canResubmit && (
                <button type="button" className="btn btn-secondary btn-sm mt-4" onClick={() => { setEditing(true); setText(submission.text); setFiles(submission.attachments || []) }}>
                  <Pencil className="h-4 w-4" aria-hidden="true" />{submission.status === 'submitted' ? 'Edit submission' : 'Resubmit'}
                </button>
              )}
            </>
          )}
          {submission.history?.length > 0 && (
            <details className="mt-4 text-sm">
              <summary className="cursor-pointer font-medium text-secondary">Previous attempts ({submission.history.length})</summary>
              <ul className="mt-2 space-y-2">
                {submission.history.map((h, i) => (
                  <li key={i} className="rounded-lg border border-line p-3 text-muted">
                    <p className="text-xs">Attempt {i + 1} · {formatDateTime(h.submittedAt)} · {h.grade != null ? `${h.grade}/${assignment.maxPoints}` : 'not graded'}</p>
                    <p className="mt-1 line-clamp-2">{h.text}</p>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>
      )}

      {showForm && (
        <form onSubmit={submit} noValidate className="rounded-2xl border border-line bg-white p-6">
          <h3 className="font-semibold text-ink">{submission ? 'Update your submission' : 'Submit your work'}</h3>
          <Field label="Submission" htmlFor={`asg-text-${assignment.id}`} error={error} hint="Describe your work or paste a link to it." className="mt-4">
            <textarea id={`asg-text-${assignment.id}`} rows={6} className={cn('input', error && 'input-invalid')} value={text} onChange={(e) => setText(e.target.value)} aria-invalid={Boolean(error)} />
          </Field>
          <div className="mt-4">
            <p className="label">Attachments</p>
            <input ref={fileRef} type="file" multiple className="sr-only" id={`asg-files-${assignment.id}`} onChange={onFiles} />
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()}><Paperclip className="h-4 w-4" aria-hidden="true" />Attach files</button>
            <p className="hint">Simulated: only file names and sizes are recorded. Files are not uploaded anywhere.</p>
            {files.length > 0 && (
              <ul className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-1.5 text-sm">
                    <span className="flex min-w-0 items-center gap-2 truncate"><Paperclip className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />{f.name} <span className="text-xs text-muted">({formatBytes(f.size)})</span></span>
                    <button type="button" className="rounded p-1 text-muted hover:text-danger" onClick={() => setFiles((l) => l.filter((_, j) => j !== i))} aria-label={`Remove ${f.name}`}><X className="h-4 w-4" /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="submit" className="btn btn-primary"><Send className="h-4 w-4" aria-hidden="true" />{submission ? 'Submit update' : 'Submit assignment'}</button>
            {submission && <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>}
          </div>
        </form>
      )}
    </div>
  )
}
