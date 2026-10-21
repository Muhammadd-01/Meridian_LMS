import { useState } from 'react'
import { Plus, Pencil, FileText, Paperclip, ClipboardCheck } from 'lucide-react'
import DataTable from '../../components/common/DataTable'
import Modal from '../../components/common/Modal'
import Tabs from '../../components/common/Tabs'
import Markdown from '../../components/common/Markdown'
import ListEditor from '../../components/forms/ListEditor'
import Pagination from '../../components/common/Pagination'
import SearchInput from '../../components/common/SearchInput'
import { Avatar, EmptyState, Field, PageHeader, StatusBadge, Toggle } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useTableState } from '../../hooks/useTableState'
import { formatDate, formatDateTime } from '../../utils/format'
import { cn } from '../../utils/cn'

const toDateInput = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : '')

function AssignmentForm({ assignment, courses, onSave, onCancel }) {
  const [v, setV] = useState(() => ({
    title: assignment?.title || '', courseId: assignment?.courseId || '', instructions: assignment?.instructions || '## Brief\n\n## Requirements\n- ',
    dueDate: toDateInput(assignment?.dueDate) || toDateInput(new Date(Date.now() + 7 * 864e5).toISOString()), maxPoints: assignment?.maxPoints ?? 100,
    allowResubmission: assignment?.allowResubmission ?? true, rubric: assignment?.rubric || [],
  }))
  const [errors, setErrors] = useState({})
  const set = (k, val) => setV((s) => ({ ...s, [k]: val }))
  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!v.title.trim()) next.title = 'Title is required.'
    if (!v.courseId) next.courseId = 'Choose a course.'
    if (v.instructions.trim().length < 20) next.instructions = 'Instructions should be at least 20 characters.'
    if (!v.dueDate) next.dueDate = 'Choose a due date.'
    if (!(Number(v.maxPoints) > 0)) next.maxPoints = 'Must be greater than 0.'
    setErrors(next)
    if (!Object.keys(next).length) onSave({ ...assignment, ...v, title: v.title.trim(), maxPoints: Number(v.maxPoints), dueDate: new Date(`${v.dueDate}T17:00:00`).toISOString() })
  }
  const cls = (k) => cn('input', errors[k] && 'input-invalid')
  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field label="Title" htmlFor="as-title" error={errors.title} required className="sm:col-span-2"><input id="as-title" className={cls('title')} value={v.title} onChange={(e) => set('title', e.target.value)} data-autofocus /></Field>
      <Field label="Course" htmlFor="as-course" error={errors.courseId} required className="sm:col-span-2">
        <select id="as-course" className={cls('courseId')} value={v.courseId} onChange={(e) => set('courseId', e.target.value)}>
          <option value="">Select a course…</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </Field>
      <Field label="Instructions" htmlFor="as-ins" error={errors.instructions} hint="Markdown subset: ## headings, - lists, **bold**." required className="sm:col-span-2"><textarea id="as-ins" rows={7} className={cn(cls('instructions'), 'font-mono text-[13px]')} value={v.instructions} onChange={(e) => set('instructions', e.target.value)} /></Field>
      <Field label="Due date" htmlFor="as-due" error={errors.dueDate} required><input id="as-due" type="date" className={cls('dueDate')} value={v.dueDate} onChange={(e) => set('dueDate', e.target.value)} /></Field>
      <Field label="Max points" htmlFor="as-pts" error={errors.maxPoints}><input id="as-pts" type="number" min={1} className={cls('maxPoints')} value={v.maxPoints} onChange={(e) => set('maxPoints', e.target.value)} /></Field>
      <div className="sm:col-span-2"><Toggle id="as-resub" label="Allow resubmission" description="Learners can update their work after it has been graded." checked={v.allowResubmission} onChange={(x) => set('allowResubmission', x)} /></div>
      <Field label="Rubric criteria" htmlFor="as-rubric" className="sm:col-span-2"><ListEditor id="as-rubric" items={v.rubric} onChange={(x) => set('rubric', x)} placeholder="e.g. Code readability" /></Field>
      <p className="text-xs text-muted sm:col-span-2">To show this assignment to learners, add an Assignment lesson that references it in the course editor.</p>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save assignment</button>
      </div>
    </form>
  )
}

function ReviewPanel({ submission, assignment, learner, onDone }) {
  const { actions } = useData()
  const toast = useToast()
  const [grade, setGrade] = useState(submission.grade ?? '')
  const [feedback, setFeedback] = useState(submission.feedback || '')
  const [error, setError] = useState('')
  const max = assignment?.maxPoints || 100

  const apply = (status) => {
    const g = Number(grade)
    if (grade === '' || !Number.isFinite(g) || g < 0 || g > max) return setError(`Enter a grade between 0 and ${max}.`)
    if (status === 'resubmit' && !feedback.trim()) return setError('Add feedback explaining what to change.')
    actions.gradeSubmission(submission.id, { grade: g, feedback: feedback.trim(), status })
    toast.success(status === 'resubmit' ? 'Resubmission requested. The learner has been notified (in-app).' : 'Submission graded. The learner has been notified (in-app).')
    onDone()
  }

  return (
    <div className="space-y-5 text-sm">
      <div className="flex items-center gap-3"><Avatar name={learner?.name} src={learner?.avatar} /><div><p className="font-semibold">{learner?.name || 'Unknown learner'}</p><p className="text-xs text-muted">Attempt {submission.attempt || 1} · {formatDateTime(submission.submittedAt)}</p></div><StatusBadge status={submission.status} className="ml-auto" /></div>
      <div>
        <p className="font-semibold">{assignment?.title}</p>
        <details className="mt-1"><summary className="cursor-pointer text-xs font-medium text-secondary">View instructions</summary><Markdown content={assignment?.instructions} className="mt-2 text-sm" /></details>
      </div>
      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-semibold text-muted uppercase">Submission</p>
        <p className="mt-1 whitespace-pre-line text-slate-700">{submission.text}</p>
        {submission.attachments?.length > 0 && <ul className="mt-3 flex flex-wrap gap-2">{submission.attachments.map((f) => <li key={f.name} className="badge badge-neutral"><Paperclip className="h-3 w-3" aria-hidden="true" />{f.name}</li>)}</ul>}
        <p className="mt-2 text-[11px] text-muted">Attachments are simulated — only file names were recorded.</p>
      </div>
      {assignment?.rubric?.length > 0 && <div className="flex flex-wrap gap-1.5">{assignment.rubric.map((r) => <span key={r} className="badge badge-primary">{r}</span>)}</div>}
      <Field label={`Grade (out of ${max})`} htmlFor="rv-grade"><input id="rv-grade" type="number" min={0} max={max} className="input max-w-[160px]" value={grade} onChange={(e) => setGrade(e.target.value)} /></Field>
      <Field label="Feedback" htmlFor="rv-feedback"><textarea id="rv-feedback" rows={4} className="input" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="What went well, and what could improve?" /></Field>
      {error && <p className="field-error" role="alert">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={() => apply('graded')}>Save grade</button>
        <button type="button" className="btn btn-secondary" onClick={() => apply('resubmit')}>Request resubmission</button>
      </div>
    </div>
  )
}

export default function AdminAssignments() {
  useDocumentTitle('Assignments')
  const { assignments, submissions, courses, users, settings, actions } = useData()
  const toast = useToast()
  const [tab, setTab] = useState('submissions')
  const [editing, setEditing] = useState(null)
  const [reviewing, setReviewing] = useState(null)
  const table = useTableState({ initialSort: { key: 'submittedAt', direction: 'desc' }, pageSize: settings.adminPageSize || 10, initialFilters: { status: '' } })

  const rows = submissions.map((s) => ({ ...s, learner: users.find((u) => u.id === s.userId), assignment: assignments.find((a) => a.id === s.assignmentId), course: courses.find((c) => c.id === s.courseId) }))
  const { items, filtered, ...pageInfo } = table.apply(rows, {
    searchFields: [(r) => r.learner?.name, (r) => r.assignment?.title, (r) => r.course?.title],
    predicate: (r, f) => !f.status || r.status === f.status,
    getters: { submittedAt: (r) => new Date(r.submittedAt).getTime(), learner: (r) => r.learner?.name, grade: (r) => r.grade ?? -1 },
  })
  const pending = submissions.filter((s) => s.status === 'submitted').length
  const graded = submissions.filter((s) => s.grade != null)
  const avgGrade = graded.length ? Math.round(graded.reduce((s, x) => s + x.grade, 0) / graded.length) : 0

  const save = (a) => {
    actions.saveAssignment(a)
    toast.success(a.id ? 'Assignment updated.' : 'Assignment created.')
    setEditing(null)
  }

  return (
    <div>
      <PageHeader
        title="Assignments"
        description={`${assignments.length} assignments · ${pending} submissions awaiting review · average grade ${avgGrade || '—'}`}
        breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Assignments' }]}
        actions={<button type="button" className="btn btn-primary" onClick={() => setEditing({})}><Plus className="h-4 w-4" aria-hidden="true" />New assignment</button>}
      />
      <Tabs tabs={[{ id: 'submissions', label: 'Submissions', count: submissions.length }, { id: 'assignments', label: 'Assignments', count: assignments.length }]} value={tab} onChange={setTab} ariaLabel="Assignment views" />

      {tab === 'submissions' ? (
        <div className="mt-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <SearchInput className="flex-1" value={table.query} onChange={table.setQuery} placeholder="Search learner, assignment or course" label="Search submissions" />
            <select className="input sm:w-52" aria-label="Filter by status" value={table.filters.status} onChange={(e) => table.setFilter('status', e.target.value)}>
              <option value="">All statuses</option><option value="submitted">Awaiting review</option><option value="graded">Graded</option><option value="resubmit">Resubmission requested</option>
            </select>
          </div>
          <DataTable
            caption="Assignment submissions"
            rows={items}
            sort={table.sort}
            onSort={table.setSort}
            columns={[
              { key: 'learner', header: 'Learner', sortable: true, render: (r) => <div className="flex items-center gap-2"><Avatar name={r.learner?.name} src={r.learner?.avatar} size="xs" /><span className="whitespace-nowrap font-medium">{r.learner?.name || 'Unknown'}</span></div> },
              { key: 'assignment', header: 'Assignment', render: (r) => <div><p className="line-clamp-1 font-medium">{r.assignment?.title || 'Deleted assignment'}</p><p className="line-clamp-1 text-xs text-muted">{r.course?.title}</p></div> },
              { key: 'submittedAt', header: 'Submitted', sortable: true, render: (r) => <span className="whitespace-nowrap text-muted">{formatDate(r.submittedAt)}</span> },
              { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status}>{{ submitted: 'Awaiting review', graded: 'Graded', resubmit: 'Resubmit requested' }[r.status]}</StatusBadge> },
              { key: 'grade', header: 'Grade', sortable: true, className: 'tabular-nums', render: (r) => (r.grade != null ? `${r.grade}/${r.assignment?.maxPoints || 100}` : '—') },
              { key: 'action', header: <span className="sr-only">Review</span>, className: 'text-right', render: (r) => <button type="button" className={r.status === 'submitted' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'} onClick={() => setReviewing(r)}>{r.status === 'submitted' ? 'Review' : 'View'}</button> },
            ]}
            empty={<EmptyState icon={ClipboardCheck} title="No submissions match" />}
          />
          <Pagination className="mt-4" {...pageInfo} total={filtered.length} pageSize={table.pageSize} onPageSizeChange={table.setPageSize} onChange={table.setPage} />
        </div>
      ) : (
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {assignments.map((a) => {
            const subs = submissions.filter((s) => s.assignmentId === a.id)
            return (
              <li key={a.id} className="card flex flex-col p-5">
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">{a.title}</h2>
                    <p className="text-xs text-muted">{courses.find((c) => c.id === a.courseId)?.title || 'No course'} · due {formatDate(a.dueDate)} · {a.maxPoints} pts</p>
                  </div>
                  <button type="button" className="btn btn-ghost btn-icon" onClick={() => setEditing(a)} aria-label={`Edit ${a.title}`}><Pencil className="h-4 w-4" /></button>
                </div>
                <p className="mt-3 text-sm text-muted">{subs.length} submission(s) · {subs.filter((s) => s.status === 'submitted').length} awaiting review · {a.allowResubmission ? 'resubmission allowed' : 'single submission'}</p>
              </li>
            )
          })}
        </ul>
      )}

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? 'Edit assignment' : 'New assignment'} size="lg">
        {editing && <AssignmentForm assignment={editing.id ? editing : null} courses={courses} onSave={save} onCancel={() => setEditing(null)} />}
      </Modal>
      <Modal open={Boolean(reviewing)} onClose={() => setReviewing(null)} variant="drawer" title="Review submission">
        {reviewing && <ReviewPanel key={reviewing.id} submission={reviewing} assignment={reviewing.assignment} learner={reviewing.learner} onDone={() => setReviewing(null)} />}
      </Modal>
    </div>
  )
}
