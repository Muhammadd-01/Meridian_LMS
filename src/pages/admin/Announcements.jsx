import { useState } from 'react'
import { Plus, Pencil, Trash2, Megaphone, Eye, Send } from 'lucide-react'
import Modal from '../../components/common/Modal'
import Tabs from '../../components/common/Tabs'
import { EmptyState, Field, PageHeader, StatusBadge } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useConfirm } from '../../context/ConfirmContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatDateTime } from '../../utils/format'
import { cn } from '../../utils/cn'

const AUDIENCES = { learners: 'All learners', all: 'Everyone', course: 'Learners in a course', admins: 'Admins only' }

function AnnouncementPreview({ a, courseTitle }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"><Megaphone className="h-4 w-4" aria-hidden="true" /></span>
        <div>
          <p className="font-semibold text-ink">{a.title || 'Announcement title'}</p>
          <p className="mt-1 text-sm whitespace-pre-line text-slate-700">{a.message || 'Your message will appear here.'}</p>
          <p className="mt-2 text-xs text-muted">To: {a.audience === 'course' ? courseTitle || 'selected course' : AUDIENCES[a.audience]}</p>
        </div>
      </div>
    </div>
  )
}

function AnnouncementForm({ announcement, courses, onSave, onCancel }) {
  const [v, setV] = useState(() => ({
    title: announcement?.title || '', message: announcement?.message || '', audience: announcement?.audience || 'learners', courseId: announcement?.courseId || '',
    status: announcement?.status || 'draft', scheduledFor: announcement?.scheduledFor ? announcement.scheduledFor.slice(0, 16) : '',
  }))
  const [errors, setErrors] = useState({})
  const set = (k, val) => setV((s) => ({ ...s, [k]: val }))
  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!v.title.trim()) next.title = 'Title is required.'
    if (v.message.trim().length < 10) next.message = 'Message should be at least 10 characters.'
    if (v.audience === 'course' && !v.courseId) next.courseId = 'Choose a course.'
    if (v.status === 'scheduled' && !v.scheduledFor) next.scheduledFor = 'Choose a scheduled date.'
    setErrors(next)
    if (!Object.keys(next).length) {
      onSave({ ...announcement, ...v, title: v.title.trim(), message: v.message.trim(), courseId: v.audience === 'course' ? v.courseId : null, scheduledFor: v.status === 'scheduled' ? new Date(v.scheduledFor).toISOString() : null })
    }
  }
  const cls = (k) => cn('input', errors[k] && 'input-invalid')
  return (
    <form onSubmit={submit} noValidate className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <Field label="Title" htmlFor="an-title" error={errors.title} required><input id="an-title" className={cls('title')} value={v.title} onChange={(e) => set('title', e.target.value)} data-autofocus /></Field>
        <Field label="Message" htmlFor="an-msg" error={errors.message} required><textarea id="an-msg" rows={5} className={cls('message')} value={v.message} onChange={(e) => set('message', e.target.value)} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Target audience" htmlFor="an-aud">
            <select id="an-aud" className="input" value={v.audience} onChange={(e) => set('audience', e.target.value)}>{Object.entries(AUDIENCES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          </Field>
          {v.audience === 'course' && (
            <Field label="Course" htmlFor="an-course" error={errors.courseId}>
              <select id="an-course" className={cls('courseId')} value={v.courseId} onChange={(e) => set('courseId', e.target.value)}>
                <option value="">Select…</option>{courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </Field>
          )}
          <Field label="Publication status" htmlFor="an-status" hint={v.status === 'published' ? 'Publishing sends an in-app notification to the audience.' : undefined}>
            <select id="an-status" className="input" value={v.status} onChange={(e) => set('status', e.target.value)}>
              <option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option><option value="archived">Archived</option>
            </select>
          </Field>
          {v.status === 'scheduled' && (
            <Field label="Scheduled for" htmlFor="an-sched" error={errors.scheduledFor} hint="Mock metadata only — nothing is sent automatically.">
              <input id="an-sched" type="datetime-local" className={cls('scheduledFor')} value={v.scheduledFor} onChange={(e) => set('scheduledFor', e.target.value)} />
            </Field>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn-primary">{v.status === 'published' && announcement?.status !== 'published' ? <><Send className="h-4 w-4" aria-hidden="true" />Publish</> : 'Save'}</button>
        </div>
      </div>
      <div>
        <p className="label">Preview</p>
        <AnnouncementPreview a={v} courseTitle={courses.find((c) => c.id === v.courseId)?.title} />
      </div>
    </form>
  )
}

export default function AdminAnnouncements() {
  useDocumentTitle('Announcements')
  const { announcements, courses, actions } = useData()
  const toast = useToast()
  const confirm = useConfirm()
  const [tab, setTab] = useState('all')
  const [editing, setEditing] = useState(null)
  const [previewing, setPreviewing] = useState(null)
  const list = [...announcements].filter((a) => tab === 'all' || a.status === tab).sort((a, b) => new Date(b.publishedAt || b.scheduledFor || b.createdAt) - new Date(a.publishedAt || a.scheduledFor || a.createdAt))
  const count = (s) => announcements.filter((a) => a.status === s).length

  const save = (a) => {
    const { published } = actions.saveAnnouncement(a)
    toast.success(published ? 'Announcement published. Targeted learners received an in-app notification.' : a.id ? 'Announcement updated.' : 'Announcement saved.')
    setEditing(null)
  }
  const remove = async (a) => {
    if (await confirm({ title: 'Delete announcement?', message: `“${a.title}” will be removed. Notifications already delivered stay in learners’ inboxes.`, confirmLabel: 'Delete', tone: 'danger' })) {
      actions.deleteAnnouncement(a.id)
      toast.success('Announcement deleted.')
    }
  }

  return (
    <div>
      <PageHeader title="Announcements" description="Publish updates to learners. Published announcements appear in their notification centre." breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Announcements' }]} actions={<button type="button" className="btn btn-primary" onClick={() => setEditing({})}><Plus className="h-4 w-4" aria-hidden="true" />New announcement</button>} />
      <Tabs tabs={[{ id: 'all', label: 'All', count: announcements.length }, { id: 'published', label: 'Published', count: count('published') }, { id: 'scheduled', label: 'Scheduled', count: count('scheduled') }, { id: 'draft', label: 'Drafts', count: count('draft') }, { id: 'archived', label: 'Archived', count: count('archived') }]} value={tab} onChange={setTab} ariaLabel="Announcement status" />
      <ul className="mt-5 space-y-3">
        {list.map((a) => (
          <li key={a.id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-start">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"><Megaphone className="h-5 w-5" aria-hidden="true" /></span>
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">{a.title}<StatusBadge status={a.status} /></p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-700">{a.message}</p>
              <p className="mt-1 text-xs text-muted">
                {a.audience === 'course' ? courses.find((c) => c.id === a.courseId)?.title || 'Course' : AUDIENCES[a.audience]} ·{' '}
                {a.status === 'published' ? `Published ${formatDateTime(a.publishedAt)}` : a.status === 'scheduled' ? `Scheduled for ${formatDateTime(a.scheduledFor)} (mock)` : `Created ${formatDateTime(a.createdAt)}`}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => setPreviewing(a)} aria-label={`Preview ${a.title}`}><Eye className="h-4 w-4" /></button>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => setEditing(a)} aria-label={`Edit ${a.title}`}><Pencil className="h-4 w-4" /></button>
              {a.status !== 'published' && <button type="button" className="btn btn-secondary btn-sm" onClick={() => save({ ...a, status: 'published' })}><Send className="h-4 w-4" aria-hidden="true" />Publish</button>}
              <button type="button" className="btn btn-danger-ghost btn-icon" onClick={() => remove(a)} aria-label={`Delete ${a.title}`}><Trash2 className="h-4 w-4" /></button>
            </div>
          </li>
        ))}
        {!list.length && <li className="card"><EmptyState icon={Megaphone} title="No announcements here" action={<button type="button" className="btn btn-primary" onClick={() => setEditing({})}>Create announcement</button>} /></li>}
      </ul>
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? 'Edit announcement' : 'New announcement'} size="xl">
        {editing && <AnnouncementForm announcement={editing.id ? editing : null} courses={courses.filter((c) => c.status === 'published')} onSave={save} onCancel={() => setEditing(null)} />}
      </Modal>
      <Modal open={Boolean(previewing)} onClose={() => setPreviewing(null)} title="Announcement preview" description="How learners see it in their notification centre." size="md">
        {previewing && <AnnouncementPreview a={previewing} courseTitle={courses.find((c) => c.id === previewing.courseId)?.title} />}
      </Modal>
    </div>
  )
}
