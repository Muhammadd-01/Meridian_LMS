import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye, Presentation, ExternalLink } from 'lucide-react'
import DataTable from '../../components/common/DataTable'
import Pagination from '../../components/common/Pagination'
import SearchInput from '../../components/common/SearchInput'
import Modal from '../../components/common/Modal'
import ListEditor from '../../components/forms/ListEditor'
import { Avatar, EmptyState, Field, PageHeader, StatusBadge } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useTableState } from '../../hooks/useTableState'
import { formatCompact, formatDate } from '../../utils/format'
import { cn } from '../../utils/cn'

function InstructorForm({ instructor, onSave, onCancel }) {
  const [v, setV] = useState({
    name: instructor?.name || '', title: instructor?.title || '', organization: instructor?.organization || 'Meridian Academy', avatar: instructor?.avatar || '',
    bio: instructor?.bio || '', expertise: instructor?.expertise || [], status: instructor?.status || 'active', website: instructor?.website || '',
  })
  const [errors, setErrors] = useState({})
  const set = (k, val) => setV((s) => ({ ...s, [k]: val }))
  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!v.name.trim()) next.name = 'Name is required.'
    if (!v.title.trim()) next.title = 'Professional title is required.'
    if (v.bio.trim().length < 20) next.bio = 'Write a biography of at least 20 characters.'
    for (const [k, val] of [['avatar', v.avatar], ['website', v.website]]) {
      if (val) { try { new URL(val) } catch { next[k] = 'Enter a valid URL (https://…).' } }
    }
    setErrors(next)
    if (!Object.keys(next).length) onSave({ ...instructor, ...v })
  }
  const cls = (k) => cn('input', errors[k] && 'input-invalid')
  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name" htmlFor="ins-name" error={errors.name} required><input id="ins-name" className={cls('name')} value={v.name} onChange={(e) => set('name', e.target.value)} data-autofocus /></Field>
      <Field label="Professional title" htmlFor="ins-title" error={errors.title} required><input id="ins-title" className={cls('title')} value={v.title} onChange={(e) => set('title', e.target.value)} /></Field>
      <Field label="Organisation" htmlFor="ins-org"><input id="ins-org" className="input" value={v.organization} onChange={(e) => set('organization', e.target.value)} /></Field>
      <Field label="Status" htmlFor="ins-status">
        <select id="ins-status" className="input" value={v.status} onChange={(e) => set('status', e.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option></select>
      </Field>
      <Field label="Avatar image URL" htmlFor="ins-avatar" error={errors.avatar} className="sm:col-span-2">
        <div className="flex items-center gap-3"><Avatar name={v.name} src={v.avatar} /><input id="ins-avatar" type="url" className={cls('avatar')} value={v.avatar} onChange={(e) => set('avatar', e.target.value)} placeholder="https://…" /></div>
      </Field>
      <Field label="Biography" htmlFor="ins-bio" error={errors.bio} required className="sm:col-span-2"><textarea id="ins-bio" rows={4} className={cls('bio')} value={v.bio} onChange={(e) => set('bio', e.target.value)} /></Field>
      <Field label="Areas of expertise" htmlFor="ins-exp" className="sm:col-span-2"><ListEditor id="ins-exp" items={v.expertise} onChange={(x) => set('expertise', x)} placeholder="e.g. Data Visualisation" /></Field>
      <Field label="Website (optional)" htmlFor="ins-web" error={errors.website} hint="Only shown publicly when it is a valid URL." className="sm:col-span-2"><input id="ins-web" type="url" className={cls('website')} value={v.website} onChange={(e) => set('website', e.target.value)} /></Field>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save instructor</button>
      </div>
    </form>
  )
}

export default function AdminInstructors() {
  useDocumentTitle('Instructors')
  const { instructors, courses, enrollments, settings, actions } = useData()
  const toast = useToast()
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [reassign, setReassign] = useState('')
  const table = useTableState({ initialSort: { key: 'name', direction: 'asc' }, pageSize: settings.adminPageSize || 10, initialFilters: { status: '' } })
  const coursesOf = (id) => courses.filter((c) => c.instructorId === id)

  const { items, filtered, ...pageInfo } = table.apply(instructors, {
    searchFields: ['name', 'title', 'organization', (i) => i.expertise],
    predicate: (i, f) => !f.status || i.status === f.status,
    getters: { name: (i) => i.name, courses: (i) => coursesOf(i.id).length, rating: (i) => i.rating },
  })

  const save = (ins) => {
    actions.saveInstructor(ins)
    toast.success(ins.id ? 'Instructor updated.' : 'Instructor added.')
    setEditing(null)
  }

  const doDelete = () => {
    const result = actions.deleteInstructor(deleting.id, reassign || null)
    if (!result.ok) return toast.error('Choose an instructor to reassign their courses to.')
    toast.success('Instructor removed.')
    setDeleting(null)
  }

  const viewCourses = viewing ? coursesOf(viewing.id) : []

  return (
    <div>
      <PageHeader title="Instructors" description="Manage instructor profiles shown across the catalogue." breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Instructors' }]} actions={<button type="button" className="btn btn-primary" onClick={() => setEditing({})}><Plus className="h-4 w-4" aria-hidden="true" />Add instructor</button>} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput className="flex-1" value={table.query} onChange={table.setQuery} placeholder="Search name, title or expertise" label="Search instructors" />
        <select className="input sm:w-44" aria-label="Filter by status" value={table.filters.status} onChange={(e) => table.setFilter('status', e.target.value)}>
          <option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option>
        </select>
      </div>
      <DataTable
        caption="Instructors"
        rows={items}
        sort={table.sort}
        onSort={table.setSort}
        columns={[
          { key: 'name', header: 'Instructor', sortable: true, render: (i) => (
            <div className="flex items-center gap-3"><Avatar name={i.name} src={i.avatar} /><div><button type="button" className="font-medium text-ink hover:underline" onClick={() => setViewing(i)}>{i.name}</button><p className="text-xs text-muted">{i.title}</p></div></div>
          ) },
          { key: 'organization', header: 'Organisation', render: (i) => <span className="text-sm">{i.organization}</span> },
          { key: 'expertise', header: 'Expertise', render: (i) => <div className="flex max-w-[240px] flex-wrap gap-1">{i.expertise.slice(0, 3).map((e) => <span key={e} className="badge badge-neutral">{e}</span>)}</div> },
          { key: 'courses', header: 'Courses', sortable: true, className: 'tabular-nums', render: (i) => coursesOf(i.id).length },
          { key: 'rating', header: 'Rating', sortable: true, render: (i) => (i.rating ? i.rating.toFixed(1) : '—') },
          { key: 'status', header: 'Status', render: (i) => <StatusBadge status={i.status} /> },
          { key: 'actions', header: <span className="sr-only">Actions</span>, className: 'text-right whitespace-nowrap', render: (i) => (
            <>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => setViewing(i)} aria-label={`View ${i.name}`}><Eye className="h-4 w-4" /></button>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => setEditing(i)} aria-label={`Edit ${i.name}`}><Pencil className="h-4 w-4" /></button>
              <button type="button" className="btn btn-danger-ghost btn-icon" onClick={() => { setReassign(''); setDeleting(i) }} aria-label={`Delete ${i.name}`}><Trash2 className="h-4 w-4" /></button>
            </>
          ) },
        ]}
        empty={<EmptyState icon={Presentation} title="No instructors found" action={<button type="button" className="btn btn-secondary" onClick={table.resetFilters}>Clear filters</button>} />}
      />
      <Pagination className="mt-4" {...pageInfo} total={filtered.length} pageSize={table.pageSize} onPageSizeChange={table.setPageSize} onChange={table.setPage} />

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? 'Edit instructor' : 'Add instructor'} size="lg">
        {editing && <InstructorForm instructor={editing.id ? editing : null} onSave={save} onCancel={() => setEditing(null)} />}
      </Modal>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} variant="drawer" title="Instructor details">
        {viewing && (
          <div className="space-y-5">
            <div className="flex items-center gap-4"><Avatar name={viewing.name} src={viewing.avatar} size="lg" /><div><p className="font-semibold">{viewing.name}</p><p className="text-sm text-muted">{viewing.title}</p><StatusBadge status={viewing.status} /></div></div>
            <p className="text-sm leading-6 text-slate-700">{viewing.bio}</p>
            <div className="flex flex-wrap gap-1.5">{viewing.expertise.map((e) => <span key={e} className="badge badge-primary">{e}</span>)}</div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3"><dt className="text-xs text-muted">Rating (illustrative)</dt><dd className="font-semibold">{viewing.rating || '—'}</dd></div>
              <div className="rounded-lg bg-slate-50 p-3"><dt className="text-xs text-muted">Learners (illustrative)</dt><dd className="font-semibold">{formatCompact(viewing.learners)}</dd></div>
              <div className="rounded-lg bg-slate-50 p-3"><dt className="text-xs text-muted">Recorded enrolments</dt><dd className="font-semibold">{enrollments.filter((e) => viewCourses.some((c) => c.id === e.courseId)).length}</dd></div>
              <div className="rounded-lg bg-slate-50 p-3"><dt className="text-xs text-muted">Joined</dt><dd className="font-semibold">{formatDate(viewing.joinedAt)}</dd></div>
            </dl>
            <div>
              <h3 className="text-sm font-semibold">Associated courses ({viewCourses.length})</h3>
              <ul className="mt-2 space-y-1.5">
                {viewCourses.map((c) => <li key={c.id} className="flex items-center justify-between gap-2 text-sm"><Link to={`/admin/courses/${c.id}/edit`} className="truncate hover:underline">{c.title}</Link><StatusBadge status={c.status} /></li>)}
                {!viewCourses.length && <li className="text-sm text-muted">No courses assigned.</li>}
              </ul>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => { setEditing(viewing); setViewing(null) }}><Pencil className="h-4 w-4" aria-hidden="true" />Edit</button>
              <Link to={`/instructors/${viewing.id}`} className="btn btn-secondary btn-sm">Public profile <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></Link>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={Boolean(deleting)} onClose={() => setDeleting(null)} size="sm" title="Remove instructor?" footer={<><button type="button" className="btn btn-secondary" onClick={() => setDeleting(null)}>Cancel</button><button type="button" className="btn btn-danger" onClick={doDelete} disabled={deleting && coursesOf(deleting.id).length > 0 && !reassign}>Remove</button></>}>
        {deleting && (coursesOf(deleting.id).length ? (
          <div className="space-y-3 text-sm">
            <p><strong>{deleting.name}</strong> teaches {coursesOf(deleting.id).length} course(s). Reassign them first.</p>
            <select className="input" aria-label="Reassign courses to" value={reassign} onChange={(e) => setReassign(e.target.value)}>
              <option value="">Select an instructor…</option>
              {instructors.filter((i) => i.id !== deleting.id).map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
        ) : <p className="text-sm"><strong>{deleting.name}</strong> has no courses and will be removed.</p>)}
      </Modal>
    </div>
  )
}
