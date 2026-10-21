import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Tags } from 'lucide-react'
import Modal from '../../components/common/Modal'
import Icon from '../../components/common/Icon'
import { CATEGORY_ICON_CHOICES } from '../../components/common/iconRegistry'
import { EmptyState, Field, PageHeader, Toggle } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { cn } from '../../utils/cn'

function CategoryForm({ category, onSave, onCancel, existingNames }) {
  const [values, setValues] = useState({ name: category?.name || '', description: category?.description || '', icon: category?.icon || 'Code2', featured: category?.featured ?? true })
  const [errors, setErrors] = useState({})
  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!values.name.trim()) next.name = 'Name is required.'
    else if (existingNames.includes(values.name.trim().toLowerCase())) next.name = 'A category with this name already exists.'
    if (!values.description.trim()) next.description = 'Description is required.'
    setErrors(next)
    if (!Object.keys(next).length) onSave({ ...category, ...values, name: values.name.trim(), description: values.description.trim() })
  }
  return (
    <form id="category-form" onSubmit={submit} noValidate className="space-y-4">
      <Field label="Name" htmlFor="cat-name" error={errors.name} required>
        <input id="cat-name" className={cn('input', errors.name && 'input-invalid')} value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} data-autofocus />
      </Field>
      <Field label="Description" htmlFor="cat-desc" error={errors.description} required>
        <textarea id="cat-desc" rows={3} className={cn('input', errors.description && 'input-invalid')} value={values.description} onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))} />
      </Field>
      <fieldset>
        <legend className="label">Icon</legend>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {CATEGORY_ICON_CHOICES.map((name) => (
            <button key={name} type="button" onClick={() => setValues((v) => ({ ...v, icon: name }))} aria-pressed={values.icon === name} aria-label={name} className={cn('flex h-10 items-center justify-center rounded-lg border', values.icon === name ? 'border-primary bg-primary text-white' : 'border-line text-secondary hover:bg-slate-50')}>
              <Icon name={name} className="h-5 w-5" />
            </button>
          ))}
        </div>
      </fieldset>
      <Toggle id="cat-featured" label="Feature on homepage" description="Show in the Popular categories section." checked={values.featured} onChange={(v) => setValues((s) => ({ ...s, featured: v }))} />
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save category</button>
      </div>
    </form>
  )
}

export default function AdminCategories() {
  useDocumentTitle('Categories')
  const { categories, courses, actions } = useData()
  const toast = useToast()
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [reassignTo, setReassignTo] = useState('')
  const sorted = [...categories].sort((a, b) => a.order - b.order)
  const count = (id) => courses.filter((c) => c.categoryId === id).length

  const save = (category) => {
    actions.saveCategory(category)
    toast.success(category.id ? 'Category updated. Changes appear in the catalogue.' : 'Category added.')
    setEditing(null)
  }

  const askDelete = (cat) => {
    setReassignTo('')
    setDeleting(cat)
  }

  const confirmDelete = () => {
    const result = actions.deleteCategory(deleting.id, reassignTo || null)
    if (!result.ok) {
      toast.error(`Choose a category to move ${result.dependents} course(s) to before deleting.`)
      return
    }
    toast.success(result.dependents ? `Category deleted and ${result.dependents} course(s) reassigned.` : 'Category deleted.')
    setDeleting(null)
  }

  const deps = deleting ? count(deleting.id) : 0

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organise the catalogue. Display order controls the homepage and filter order."
        breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Categories' }]}
        actions={<button type="button" className="btn btn-primary" onClick={() => setEditing({})}><Plus className="h-4 w-4" aria-hidden="true" />Add category</button>}
      />
      <ul className="card divide-y divide-line overflow-hidden">
        {sorted.map((cat, i) => (
          <li key={cat.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <span className="w-6 text-center text-sm font-semibold text-muted">{i + 1}</span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon name={cat.icon} className="h-5 w-5" /></span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                  {cat.name}
                  {cat.featured && <span className="badge badge-accent">Featured</span>}
                </p>
                <p className="line-clamp-1 text-sm text-muted">{cat.description}</p>
                <Link to={`/admin/courses`} className="text-xs font-medium text-secondary hover:underline">{count(cat.id)} course(s)</Link>
              </div>
            </div>
            <div className="flex items-center gap-1 self-end sm:self-auto">
              <label className="mr-2 flex items-center gap-2 text-xs text-muted">
                <input type="checkbox" className="checkbox" checked={cat.featured} onChange={(e) => { actions.saveCategory({ ...cat, featured: e.target.checked }); toast.success(e.target.checked ? 'Category featured on homepage.' : 'Category removed from homepage.') }} />
                Homepage
              </label>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => actions.moveCategory(cat.id, -1)} disabled={i === 0} aria-label={`Move ${cat.name} up`}><ArrowUp className="h-4 w-4" /></button>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => actions.moveCategory(cat.id, 1)} disabled={i === sorted.length - 1} aria-label={`Move ${cat.name} down`}><ArrowDown className="h-4 w-4" /></button>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => setEditing(cat)} aria-label={`Edit ${cat.name}`}><Pencil className="h-4 w-4" /></button>
              <button type="button" className="btn btn-danger-ghost btn-icon" onClick={() => askDelete(cat)} aria-label={`Delete ${cat.name}`}><Trash2 className="h-4 w-4" /></button>
            </div>
          </li>
        ))}
        {!sorted.length && <li><EmptyState icon={Tags} title="No categories" description="Add a category to organise courses." /></li>}
      </ul>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? 'Edit category' : 'Add category'} size="lg">
        {editing && (
          <CategoryForm
            category={editing.id ? editing : null}
            existingNames={categories.filter((c) => c.id !== editing.id).map((c) => c.name.toLowerCase())}
            onSave={save}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        size="sm"
        title="Delete category?"
        footer={(
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setDeleting(null)}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={deps > 0 && !reassignTo}>Delete category</button>
          </>
        )}
      >
        {deleting && (
          <div className="space-y-3 text-sm">
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-danger-soft p-3"><span className="flex h-10 w-10 shrink-0 animate-pop-in items-center justify-center rounded-full bg-gradient-to-br from-danger to-[#f87171] text-white"><Trash2 className="h-5 w-5" aria-hidden="true" /></span><p className="text-sm font-medium text-danger">This permanently removes the record from this browser.</p></div>
            {deps > 0 ? (
              <>
                <p className="text-slate-700"><strong>{deleting.name}</strong> is used by {deps} course(s). Move them to another category first.</p>
                <Field label="Reassign courses to" htmlFor="cat-reassign">
                  <select id="cat-reassign" className="input" value={reassignTo} onChange={(e) => setReassignTo(e.target.value)}>
                    <option value="">Select a category…</option>
                    {sorted.filter((c) => c.id !== deleting.id).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </Field>
              </>
            ) : (
              <p className="text-slate-700"><strong>{deleting.name}</strong> has no courses and will be removed.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
