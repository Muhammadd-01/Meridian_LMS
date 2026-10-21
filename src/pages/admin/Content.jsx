import { useState } from 'react'
import { Plus, Trash2, Save, ExternalLink } from 'lucide-react'
import { Field, PageHeader, Toggle } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useBeforeUnload } from '../../hooks/useUtils'
import { uid } from '../../utils/ids'
import { Link } from 'react-router-dom'

const SECTION_LABELS = { paths: 'Learning paths', trending: 'Trending courses', programs: 'Career-focused programs', instructors: 'Top instructors', recent: 'Recently added', testimonials: 'Testimonials', faq: 'FAQ' }

export default function AdminContent() {
  useDocumentTitle('Homepage content')
  const { content, courses, actions } = useData()
  const toast = useToast()
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(content)))
  const [errors, setErrors] = useState({})
  const dirty = JSON.stringify(form) !== JSON.stringify(content)
  useBeforeUnload(dirty)
  const published = courses.filter((c) => c.status === 'published')

  const set = (path, value) => setForm((f) => ({ ...f, [path]: value }))
  const updateItem = (key, id, patch) => set(key, form[key].map((x) => (x.id === id ? { ...x, ...patch } : x)))

  const save = () => {
    const next = {}
    if (!form.hero.headline.trim()) next.headline = 'Headline is required.'
    if (!form.hero.subtext.trim()) next.subtext = 'Supporting text is required.'
    setErrors(next)
    if (Object.keys(next).length) return toast.error('Please fix the highlighted fields.')
    actions.updateContent({ ...form, testimonials: form.testimonials.filter((t) => t.quote.trim() && t.name.trim()), faqs: form.faqs.filter((f) => f.question.trim() && f.answer.trim()) })
    toast.success('Homepage content saved locally.')
  }

  const toggleFeatured = (course) => {
    actions.updateCourse(course.id, { featured: !course.featured }, course.featured ? 'Removed from homepage featured courses' : 'Added to homepage featured courses')
    toast.success(course.featured ? 'Removed from featured courses.' : 'Added to featured courses.')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homepage content"
        description="Edit the hero, section visibility, featured courses, testimonials and FAQs."
        breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Homepage content' }]}
        actions={(
          <>
            <Link to="/" target="_blank" rel="noopener" className="btn btn-secondary">View homepage <ExternalLink className="h-4 w-4" aria-hidden="true" /></Link>
            <button type="button" className="btn btn-primary" onClick={save} disabled={!dirty}><Save className="h-4 w-4" aria-hidden="true" />Save changes</button>
          </>
        )}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card space-y-4 p-6" aria-labelledby="hero-title">
          <h2 id="hero-title" className="text-base font-semibold">Hero</h2>
          <Field label="Headline" htmlFor="hc-head" error={errors.headline}><input id="hc-head" className="input" value={form.hero.headline} onChange={(e) => set('hero', { ...form.hero, headline: e.target.value })} /></Field>
          <Field label="Supporting text" htmlFor="hc-sub" error={errors.subtext}><textarea id="hc-sub" rows={3} className="input" value={form.hero.subtext} onChange={(e) => set('hero', { ...form.hero, subtext: e.target.value })} /></Field>
          <div>
            <p className="label">Sample statistics (shown as illustrative)</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {form.stats.map((s) => (
                <div key={s.id} className="flex gap-2">
                  <input className="input w-24" aria-label="Statistic value" value={s.value} onChange={(e) => updateItem('stats', s.id, { value: e.target.value })} />
                  <input className="input" aria-label="Statistic label" value={s.label} onChange={(e) => updateItem('stats', s.id, { label: e.target.value })} />
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="card p-6" aria-labelledby="sections-title">
          <h2 id="sections-title" className="text-base font-semibold">Section visibility</h2>
          <div className="mt-4 space-y-4">
            {Object.entries(SECTION_LABELS).map(([key, label]) => (
              <Toggle key={key} id={`sec-${key}`} label={label} checked={form.sections[key] !== false} onChange={(v) => set('sections', { ...form.sections, [key]: v })} />
            ))}
          </div>
        </section>
      </div>

      <section className="card p-6" aria-labelledby="featured-title">
        <h2 id="featured-title" className="text-base font-semibold">Homepage featured courses</h2>
        <p className="mt-1 text-sm text-muted">Applied immediately. {published.filter((c) => c.featured).length} featured.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {published.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-line px-3 py-2 text-sm hover:bg-slate-50">
              <input type="checkbox" className="checkbox" checked={Boolean(c.featured)} onChange={() => toggleFeatured(c)} />
              <span className="line-clamp-1">{c.title}</span>
            </label>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card p-6" aria-labelledby="test-title">
          <div className="flex items-center justify-between"><h2 id="test-title" className="text-base font-semibold">Testimonials (fictional personas)</h2><button type="button" className="btn btn-secondary btn-sm" onClick={() => set('testimonials', [...form.testimonials, { id: uid('t'), name: '', role: '', avatar: '', quote: '' }])}><Plus className="h-4 w-4" aria-hidden="true" />Add</button></div>
          <ul className="mt-4 space-y-4">
            {form.testimonials.map((t) => (
              <li key={t.id} className="space-y-2 rounded-lg border border-line p-3">
                <div className="flex gap-2">
                  <input className="input" aria-label="Persona name" placeholder="Name" value={t.name} onChange={(e) => updateItem('testimonials', t.id, { name: e.target.value })} />
                  <input className="input" aria-label="Persona role" placeholder="Role" value={t.role} onChange={(e) => updateItem('testimonials', t.id, { role: e.target.value })} />
                  <button type="button" className="btn btn-danger-ghost btn-icon" onClick={() => set('testimonials', form.testimonials.filter((x) => x.id !== t.id))} aria-label="Remove testimonial"><Trash2 className="h-4 w-4" /></button>
                </div>
                <textarea className="input" rows={2} aria-label="Quote" placeholder="Quote" value={t.quote} onChange={(e) => updateItem('testimonials', t.id, { quote: e.target.value })} />
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-6" aria-labelledby="faq-title">
          <div className="flex items-center justify-between"><h2 id="faq-title" className="text-base font-semibold">FAQs</h2><button type="button" className="btn btn-secondary btn-sm" onClick={() => set('faqs', [...form.faqs, { id: uid('f'), question: '', answer: '' }])}><Plus className="h-4 w-4" aria-hidden="true" />Add</button></div>
          <ul className="mt-4 space-y-4">
            {form.faqs.map((f) => (
              <li key={f.id} className="space-y-2 rounded-lg border border-line p-3">
                <div className="flex gap-2">
                  <input className="input" aria-label="Question" placeholder="Question" value={f.question} onChange={(e) => updateItem('faqs', f.id, { question: e.target.value })} />
                  <button type="button" className="btn btn-danger-ghost btn-icon" onClick={() => set('faqs', form.faqs.filter((x) => x.id !== f.id))} aria-label="Remove FAQ"><Trash2 className="h-4 w-4" /></button>
                </div>
                <textarea className="input" rows={2} aria-label="Answer" placeholder="Answer" value={f.answer} onChange={(e) => updateItem('faqs', f.id, { answer: e.target.value })} />
              </li>
            ))}
          </ul>
        </section>
      </div>
      <p className="text-xs text-muted">Empty testimonials and FAQs are discarded when you save.</p>
    </div>
  )
}
