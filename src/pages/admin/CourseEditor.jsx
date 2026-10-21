import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Save, Send, Eye, Upload, ImageOff, CircleAlert, BookOpen } from 'lucide-react'
import CurriculumEditor from '../../components/forms/CurriculumEditor'
import ListEditor from '../../components/forms/ListEditor'
import SmartImage from '../../components/common/SmartImage'
import { EmptyState, Field, PageHeader, StatusBadge, Toggle } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useConfirm } from '../../context/ConfirmContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useBeforeUnload } from '../../hooks/useUtils'
import { COURSE_TYPES, DIFFICULTIES } from '../../data/courses'
import { blankModule } from '../../utils/curriculum'
import { slugify } from '../../utils/ids'
import { cn } from '../../utils/cn'

const LANGUAGES = ['English', 'Spanish', 'French', 'Arabic', 'Portuguese', 'German', 'Hindi', 'Japanese']
const MAX_IMAGE = 500 * 1024

function toForm(course, settings) {
  if (!course) {
    return {
      title: '', slug: '', shortDescription: '', description: '', thumbnail: '', categoryId: '', instructorId: '', providerName: 'Meridian Academy',
      difficulty: 'Beginner', language: settings.defaultLanguage || 'English', subtitles: 'English', durationHours: 10, courseType: 'Course', access: 'free', priceLabel: 'Free',
      learningOutcomes: [], skills: '', prerequisites: [], tags: '', status: 'draft', featured: false, trending: false, modules: [blankModule(1)],
    }
  }
  return {
    ...course,
    subtitles: (course.subtitles || []).join(', '),
    skills: (course.skills || []).join(', '),
    tags: (course.tags || []).join(', '),
    modules: course.modules.map((m) => ({ ...m, lessons: m.lessons.map((l) => ({ ...l })) })),
  }
}

const splitList = (value) => value.split(',').map((s) => s.trim()).filter(Boolean)

function validate(form, { publishing }) {
  const errors = {}
  if (form.title.trim().length < 5) errors.title = 'Title must be at least 5 characters.'
  if (form.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug)) errors.slug = 'Use lowercase letters, numbers and hyphens only.'
  if (!form.shortDescription.trim()) errors.shortDescription = 'Short description is required.'
  else if (form.shortDescription.length > 200) errors.shortDescription = 'Keep it under 200 characters.'
  if (!form.categoryId) errors.categoryId = 'Choose a category.'
  if (!form.instructorId) errors.instructorId = 'Choose an instructor.'
  if (!form.providerName.trim()) errors.providerName = 'Provider is required.'
  if (!(Number(form.durationHours) > 0)) errors.durationHours = 'Enter a positive number of hours.'
  if (form.thumbnail && !form.thumbnail.startsWith('data:image/')) {
    try { new URL(form.thumbnail) } catch { errors.thumbnail = 'Enter a valid image URL.' }
  }
  if (publishing) {
    if (form.description.trim().length < 30) errors.description = 'Write at least 30 characters before publishing.'
    if (!form.learningOutcomes.length) errors.learningOutcomes = 'Add at least one learning outcome before publishing.'
    if (!form.modules.length || !form.modules.some((m) => m.lessons.length)) errors.curriculum = 'Add at least one module with a lesson before publishing.'
  }
  form.modules.forEach((m, mi) => {
    if (!m.title.trim()) errors[`m${mi}`] = 'Module title is required.'
    m.lessons.forEach((l, li) => {
      const le = {}
      if (!l.title.trim()) le.title = 'Lesson title is required.'
      if (l.type === 'quiz' && !l.quizId) le.quizId = 'Select a quiz.'
      if (l.type === 'assignment' && !l.assignmentId) le.assignmentId = 'Select an assignment.'
      if (Object.keys(le).length) errors[`m${mi}l${li}`] = le
    })
  })
  return errors
}

function CourseEditor({ courseId }) {
  const { courses, categories, instructors, quizzes, assignments, settings, actions } = useData()
  const toast = useToast()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const existing = courseId ? courses.find((c) => c.id === courseId) : null
  const [initial, setInitial] = useState(() => JSON.stringify(toForm(existing, settings)))
  const [form, setForm] = useState(() => toForm(existing, settings))
  const [errors, setErrors] = useState({})
  const [slugTouched, setSlugTouched] = useState(Boolean(existing))
  const dirty = JSON.stringify(form) !== initial
  useBeforeUnload(dirty)
  useDocumentTitle(existing ? `Edit: ${existing.title}` : 'Create course')

  if (courseId && !existing) {
    return (
      <div className="card">
        <EmptyState icon={BookOpen} title="Course not found" description="It may have been deleted." action={<Link to="/admin/courses" className="btn btn-primary">Back to courses</Link>} />
      </div>
    )
  }

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }))
  const onTitle = (value) => setForm((f) => ({ ...f, title: value, slug: slugTouched ? f.slug : slugify(value) }))

  const onImage = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image file.')
    if (file.size > MAX_IMAGE) return toast.error('Image must be under 500 KB to fit in browser storage. Use an image URL for larger files.')
    const reader = new FileReader()
    reader.onload = () => set('thumbnail', reader.result)
    reader.readAsDataURL(file)
  }

  const save = (status) => {
    const publishing = status === 'published'
    const next = validate(form, { publishing })
    setErrors(next)
    if (Object.keys(next).length) {
      toast.error('Please fix the highlighted fields.')
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"], .input-invalid')?.focus())
      return null
    }
    const payload = {
      ...form,
      status,
      title: form.title.trim(),
      slug: form.slug || slugify(form.title),
      durationHours: Number(form.durationHours),
      subtitles: splitList(form.subtitles),
      skills: splitList(form.skills),
      tags: splitList(form.tags),
      priceLabel: form.access === 'free' ? 'Free' : form.priceLabel || 'Paid (demo price)',
    }
    const saved = existing ? actions.updateCourse(existing.id, payload, publishing ? 'Saved and published' : 'Updated course details and curriculum') : actions.createCourse(payload)
    if (existing && publishing && existing.status !== 'published') actions.logActivity('course.published', 'course', saved.id, saved.title, 'Published from editor')
    const savedForm = toForm(saved, settings)
    setForm(savedForm)
    setInitial(JSON.stringify(savedForm))
    toast.success(publishing ? 'Course published successfully.' : status === 'draft' ? 'Course saved as draft. Changes saved locally.' : 'Changes saved locally.')
    if (!existing) navigate(`/admin/courses/${saved.id}/edit`, { replace: true })
    return saved
  }

  const preview = () => {
    const saved = dirty || !existing ? save(form.status === 'published' ? 'published' : form.status) : existing
    if (saved) navigate(`/courses/${saved.slug}`)
  }

  const cancel = async () => {
    if (dirty && !(await confirm({ title: 'Discard unsaved changes?', message: 'You have changes that haven’t been saved. Leaving now will lose them.', confirmLabel: 'Discard changes', tone: 'danger' }))) return
    navigate('/admin/courses')
  }

  const err = (k) => errors[k]
  const inputCls = (k) => cn('input', err(k) && 'input-invalid')
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)

  return (
    <div>
      <PageHeader
        title={existing ? 'Edit course' : 'Create course'}
        description={existing ? <>Editing <strong className="text-ink">{existing.title}</strong> · <StatusBadge status={existing.status} /></> : 'Build the course details and curriculum. Save as a draft at any time.'}
        breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Courses', to: '/admin/courses' }, { label: existing ? 'Edit' : 'New course' }]}
      />

      {Object.keys(errors).length > 0 && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger-soft p-4 text-sm text-danger" role="alert">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Some fields need attention.{errors.curriculum ? ` ${errors.curriculum}` : ''}</span>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <section className="card grid gap-4 p-6 sm:grid-cols-2" aria-labelledby="sec-basics">
            <h2 id="sec-basics" className="text-base font-semibold sm:col-span-2">1. Basic information</h2>
            <Field label="Course title" htmlFor="ce-title" error={err('title')} required className="sm:col-span-2">
              <input id="ce-title" className={inputCls('title')} value={form.title} onChange={(e) => onTitle(e.target.value)} aria-invalid={Boolean(err('title'))} />
            </Field>
            <Field label="Slug" htmlFor="ce-slug" error={err('slug')} hint={`URL: /courses/${form.slug || 'your-course'}`} className="sm:col-span-2">
              <input id="ce-slug" className={inputCls('slug')} value={form.slug} onChange={(e) => { setSlugTouched(true); set('slug', e.target.value.toLowerCase()) }} aria-invalid={Boolean(err('slug'))} />
            </Field>
            <Field label="Short description" htmlFor="ce-short" error={err('shortDescription')} hint={`${form.shortDescription.length}/200`} required className="sm:col-span-2">
              <input id="ce-short" className={inputCls('shortDescription')} value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} aria-invalid={Boolean(err('shortDescription'))} />
            </Field>
            <Field label="Full description" htmlFor="ce-desc" error={err('description')} className="sm:col-span-2">
              <textarea id="ce-desc" rows={5} className={inputCls('description')} value={form.description} onChange={(e) => set('description', e.target.value)} aria-invalid={Boolean(err('description'))} />
            </Field>
          </section>

          <section className="card grid gap-4 p-6 sm:grid-cols-2" aria-labelledby="sec-class">
            <h2 id="sec-class" className="text-base font-semibold sm:col-span-2">2. Classification & format</h2>
            <Field label="Category" htmlFor="ce-cat" error={err('categoryId')} required>
              <select id="ce-cat" className={inputCls('categoryId')} value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} aria-invalid={Boolean(err('categoryId'))}>
                <option value="">Select…</option>
                {sortedCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Instructor" htmlFor="ce-ins" error={err('instructorId')} required>
              <select id="ce-ins" className={inputCls('instructorId')} value={form.instructorId} onChange={(e) => set('instructorId', e.target.value)} aria-invalid={Boolean(err('instructorId'))}>
                <option value="">Select…</option>
                {instructors.map((i) => <option key={i.id} value={i.id}>{i.name}{i.status !== 'active' ? ' (inactive)' : ''}</option>)}
              </select>
            </Field>
            <Field label="Provider" htmlFor="ce-prov" error={err('providerName')} required>
              <input id="ce-prov" className={inputCls('providerName')} value={form.providerName} onChange={(e) => set('providerName', e.target.value)} aria-invalid={Boolean(err('providerName'))} />
            </Field>
            <Field label="Difficulty" htmlFor="ce-diff">
              <select id="ce-diff" className="input" value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)}>{DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}</select>
            </Field>
            <Field label="Language" htmlFor="ce-lang">
              <select id="ce-lang" className="input" value={form.language} onChange={(e) => set('language', e.target.value)}>{LANGUAGES.map((l) => <option key={l}>{l}</option>)}</select>
            </Field>
            <Field label="Subtitles" htmlFor="ce-subs" hint="Comma-separated languages">
              <input id="ce-subs" className="input" value={form.subtitles} onChange={(e) => set('subtitles', e.target.value)} />
            </Field>
            <Field label="Estimated duration (hours)" htmlFor="ce-hours" error={err('durationHours')} required>
              <input id="ce-hours" type="number" min={1} className={inputCls('durationHours')} value={form.durationHours} onChange={(e) => set('durationHours', e.target.value)} aria-invalid={Boolean(err('durationHours'))} />
            </Field>
            <Field label="Course type" htmlFor="ce-type">
              <select id="ce-type" className="input" value={form.courseType} onChange={(e) => set('courseType', e.target.value)}>{COURSE_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
            </Field>
            <Field label="Access" htmlFor="ce-access">
              <select id="ce-access" className="input" value={form.access} onChange={(e) => set('access', e.target.value)}>
                <option value="free">Free access</option>
                <option value="paid">Paid (demo price label)</option>
              </select>
            </Field>
            <Field label="Demo price label" htmlFor="ce-price" hint="Display only — no payments exist in the demo.">
              <input id="ce-price" className="input" value={form.access === 'free' ? 'Free' : form.priceLabel} disabled={form.access === 'free'} onChange={(e) => set('priceLabel', e.target.value)} />
            </Field>
          </section>

          <section className="card grid gap-4 p-6 sm:grid-cols-2" aria-labelledby="sec-outcomes">
            <h2 id="sec-outcomes" className="text-base font-semibold sm:col-span-2">3. Outcomes, skills & prerequisites</h2>
            <Field label="Learning outcomes" htmlFor="ce-outcomes" error={err('learningOutcomes')} className="sm:col-span-2">
              <ListEditor id="ce-outcomes" items={form.learningOutcomes} onChange={(v) => set('learningOutcomes', v)} placeholder="e.g. Build reusable components" />
            </Field>
            <Field label="Skills taught" htmlFor="ce-skills" hint="Comma-separated">
              <input id="ce-skills" className="input" value={form.skills} onChange={(e) => set('skills', e.target.value)} />
            </Field>
            <Field label="Tags" htmlFor="ce-tags" hint="Comma-separated, used in search">
              <input id="ce-tags" className="input" value={form.tags} onChange={(e) => set('tags', e.target.value)} />
            </Field>
            <Field label="Prerequisites" htmlFor="ce-prereq" className="sm:col-span-2">
              <ListEditor id="ce-prereq" items={form.prerequisites} onChange={(v) => set('prerequisites', v)} placeholder="e.g. Basic HTML and CSS" />
            </Field>
          </section>

          <section className="card p-6" aria-labelledby="sec-curriculum">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <h2 id="sec-curriculum" className="text-base font-semibold">4. Curriculum</h2>
                <p className="text-sm text-muted">{form.modules.length} modules · {form.modules.reduce((s, m) => s + m.lessons.length, 0)} lessons. Use the arrows to reorder.</p>
              </div>
            </div>
            <CurriculumEditor modules={form.modules} onChange={(m) => set('modules', m)} quizzes={quizzes} assignments={assignments} errors={errors} />
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <section className="card p-5" aria-labelledby="sec-publish">
            <h2 id="sec-publish" className="text-base font-semibold">Publishing</h2>
            <Field label="Publication status" htmlFor="ce-status" className="mt-3">
              <select id="ce-status" className="input" value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <div className="mt-4 space-y-4">
              <Toggle id="ce-featured" label="Featured course" description="Show on the homepage featured grid." checked={form.featured} onChange={(v) => set('featured', v)} />
              <Toggle id="ce-trending" label="Trending badge" description="Highlight in trending carousels." checked={form.trending} onChange={(v) => set('trending', v)} />
            </div>
            <div className="mt-5 grid gap-2">
              <button type="button" className="btn btn-accent" onClick={() => save('published')}><Send className="h-4 w-4" aria-hidden="true" />{existing?.status === 'published' ? 'Save & keep published' : 'Publish course'}</button>
              <button type="button" className="btn btn-primary" onClick={() => save(form.status === 'published' ? 'draft' : form.status)}><Save className="h-4 w-4" aria-hidden="true" />{form.status === 'published' ? 'Save as draft (unpublish)' : form.status === 'archived' ? 'Save (archived)' : 'Save draft'}</button>
              <button type="button" className="btn btn-secondary" onClick={preview}><Eye className="h-4 w-4" aria-hidden="true" />Preview course</button>
              <button type="button" className="btn btn-ghost" onClick={cancel}>Cancel</button>
            </div>
            <p className="mt-3 text-xs text-muted">{dirty ? 'You have unsaved changes.' : 'All changes saved locally.'}</p>
          </section>

          <section className="card p-5" aria-labelledby="sec-media">
            <h2 id="sec-media" className="text-base font-semibold">Thumbnail</h2>
            {form.thumbnail ? (
              <SmartImage src={form.thumbnail} alt="Course thumbnail preview" seed={form.title} fallbackLabel={form.title} className="mt-3 aspect-video rounded-lg" />
            ) : (
              <div className="mt-3 flex aspect-video flex-col items-center justify-center rounded-lg border border-dashed border-line text-sm text-muted"><ImageOff className="mb-1 h-6 w-6" aria-hidden="true" />No image — branded artwork will be used</div>
            )}
            <Field label="Image URL" htmlFor="ce-thumb" error={err('thumbnail')} className="mt-3">
              <input id="ce-thumb" type="url" className={inputCls('thumbnail')} value={form.thumbnail.startsWith('data:') ? '' : form.thumbnail} placeholder={form.thumbnail.startsWith('data:') ? 'Using a local image' : 'https://…'} onChange={(e) => set('thumbnail', e.target.value)} />
            </Field>
            <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={onImage} />
            <div className="mt-2 flex gap-2">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" aria-hidden="true" />Choose local image</button>
              {form.thumbnail && <button type="button" className="btn btn-ghost btn-sm" onClick={() => set('thumbnail', '')}>Remove</button>}
            </div>
            <p className="hint">Local images are stored as a preview in this browser (max 500 KB). Nothing is uploaded.</p>
          </section>
        </aside>
      </div>
    </div>
  )
}

/** Remount the editor per course so form state never leaks between courses. */
export default function CourseEditorPage() {
  const { courseId } = useParams()
  return <CourseEditor key={courseId || 'new'} courseId={courseId} />
}
