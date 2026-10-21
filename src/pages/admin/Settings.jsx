import { useState } from 'react'
import { Save, RotateCcw, Palette, ShieldAlert } from 'lucide-react'
import BrandLogo from '../../components/common/BrandLogo'
import { Field, PageHeader, Toggle } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useConfirm } from '../../context/ConfirmContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useBeforeUnload } from '../../hooks/useUtils'
import { DEFAULT_SETTINGS } from '../../data/seed'
import { cn } from '../../utils/cn'

const HEX = /^#[0-9a-f]{6}$/i
const LANGUAGES = ['English', 'Spanish', 'French', 'Arabic', 'Portuguese', 'German']
const NOTIFY = [
  ['courseUpdates', 'Course updates'], ['announcements', 'Announcements'], ['deadlineReminders', 'Deadline reminders'], ['weeklySummary', 'Weekly summary'], ['marketing', 'Product news'],
]

function ColorField({ id, label, value, error, onChange }) {
  return (
    <Field label={label} htmlFor={id} error={error}>
      <div className="flex items-center gap-2">
        <input type="color" aria-label={`${label} picker`} className="h-10 w-12 cursor-pointer rounded border border-line" value={HEX.test(value) ? value : '#000000'} onChange={(e) => onChange(e.target.value.toUpperCase())} />
        <input id={id} className={cn('input font-mono', error && 'input-invalid')} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Field>
  )
}

export default function AdminSettings() {
  useDocumentTitle('Platform settings')
  const { settings, actions } = useData()
  const toast = useToast()
  const confirm = useConfirm()
  const [form, setForm] = useState(() => ({ ...settings }))
  const [errors, setErrors] = useState({})
  const dirty = JSON.stringify(form) !== JSON.stringify(settings)
  useBeforeUnload(dirty)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const save = () => {
    const next = {}
    if (!form.platformName.trim()) next.platformName = 'Platform name is required.'
    if (!HEX.test(form.primaryColor)) next.primaryColor = 'Use a 6-digit hex colour, e.g. #2C5F6F.'
    if (!HEX.test(form.accentColor)) next.accentColor = 'Use a 6-digit hex colour, e.g. #F78D00.'
    if (!(form.catalogPageSize >= 6 && form.catalogPageSize <= 48)) next.catalogPageSize = 'Between 6 and 48.'
    setErrors(next)
    if (Object.keys(next).length) return toast.error('Please fix the highlighted fields.')
    actions.updateSettings({ ...form, platformName: form.platformName.trim() })
    toast.success('Platform settings saved locally.')
  }

  const reset = async () => {
    if (!(await confirm({ title: 'Reset all demo data?', message: 'Every course, learner, enrolment, announcement and setting returns to the original sample data. All changes made in this browser are lost.', confirmLabel: 'Reset demo data', tone: 'danger' }))) return
    actions.resetDemoData()
    setForm({ ...DEFAULT_SETTINGS })
    toast.success('Demo data reset to the original sample data.')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform settings"
        description="Demo configuration stored in this browser. No real server configuration or credentials are involved."
        breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Settings' }]}
        actions={<button type="button" className="btn btn-primary" onClick={save} disabled={!dirty}><Save className="h-4 w-4" aria-hidden="true" />Save settings</button>}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card space-y-4 p-6" aria-labelledby="brand-title">
          <h2 id="brand-title" className="flex items-center gap-2 text-base font-semibold"><Palette className="h-4 w-4 text-secondary" aria-hidden="true" />Branding</h2>
          <Field label="Platform name" htmlFor="st-name" error={errors.platformName}><input id="st-name" className={cn('input', errors.platformName && 'input-invalid')} value={form.platformName} onChange={(e) => set('platformName', e.target.value)} /></Field>
          <Field label="Tagline" htmlFor="st-tag"><input id="st-tag" className="input" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} /></Field>
          <div>
            <p className="label">Logo preview</p>
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-line p-4"><BrandLogo to={null} /><span className="rounded-lg bg-deep p-3"><BrandLogo tone="light" to={null} /></span></div>
            <p className="hint">The official Meridian logo is loaded from <code>src/assets/logos/</code> (full colour, white-text and globe-mark variants).</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField id="st-primary" label="Primary colour" value={form.primaryColor} error={errors.primaryColor} onChange={(v) => set('primaryColor', v)} />
            <ColorField id="st-accent" label="Accent colour" value={form.accentColor} error={errors.accentColor} onChange={(v) => set('accentColor', v)} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg px-4 py-2 text-sm font-semibold text-white" style={{ background: HEX.test(form.primaryColor) ? form.primaryColor : undefined }}>Primary button</span>
            <span className="rounded-lg px-4 py-2 text-sm font-semibold text-ink" style={{ background: HEX.test(form.accentColor) ? form.accentColor : undefined }}>Accent button</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setForm((f) => ({ ...f, primaryColor: DEFAULT_SETTINGS.primaryColor, accentColor: DEFAULT_SETTINGS.accentColor }))}>Restore brand colours</button>
          </div>
          <p className="hint">Check contrast when changing colours — white text is used on the primary colour and dark text on the accent.</p>
        </section>

        <div className="space-y-6">
          <section className="card grid gap-4 p-6 sm:grid-cols-2" aria-labelledby="cat-title">
            <h2 id="cat-title" className="text-base font-semibold sm:col-span-2">Catalogue defaults</h2>
            <Field label="Default course language" htmlFor="st-lang"><select id="st-lang" className="input" value={form.defaultLanguage} onChange={(e) => set('defaultLanguage', e.target.value)}>{LANGUAGES.map((l) => <option key={l}>{l}</option>)}</select></Field>
            <Field label="Catalogue page size" htmlFor="st-page" error={errors.catalogPageSize}><input id="st-page" type="number" min={6} max={48} className="input" value={form.catalogPageSize} onChange={(e) => set('catalogPageSize', Number(e.target.value))} /></Field>
            <Field label="Admin table page size" htmlFor="st-apage"><select id="st-apage" className="input" value={form.adminPageSize} onChange={(e) => set('adminPageSize', Number(e.target.value))}>{[10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}</select></Field>
            <Field label="Support email (display only)" htmlFor="st-mail"><input id="st-mail" className="input" value={form.supportEmail} onChange={(e) => set('supportEmail', e.target.value)} /></Field>
          </section>
          <section className="card space-y-4 p-6" aria-labelledby="pref-title">
            <h2 id="pref-title" className="text-base font-semibold">Demo platform preferences</h2>
            <Toggle id="st-reg" label="Allow self-registration" description="Show the “Join for Free” demo registration form." checked={form.allowSelfRegistration} onChange={(v) => set('allowSelfRegistration', v)} />
            <Toggle id="st-banner" label="Show demo banner" description="Display the “frontend demonstration” notice at the top of pages." checked={form.showDemoBanner} onChange={(v) => set('showDemoBanner', v)} />
          </section>
          <section className="card p-6" aria-labelledby="notify-title">
            <h2 id="notify-title" className="text-base font-semibold">Learner notification defaults</h2>
            <p className="mt-1 text-sm text-muted">Applied to newly registered demo learners.</p>
            <div className="mt-4 space-y-3">
              {NOTIFY.map(([k, label]) => (
                <Toggle key={k} id={`st-n-${k}`} label={label} checked={Boolean(form.learnerNotificationDefaults?.[k])} onChange={(v) => set('learnerNotificationDefaults', { ...form.learnerNotificationDefaults, [k]: v })} />
              ))}
            </div>
          </section>
        </div>
      </div>
      <section className="card flex flex-col gap-4 border-danger/30 p-6 sm:flex-row sm:items-center" aria-labelledby="danger-title">
        <ShieldAlert className="h-8 w-8 shrink-0 text-danger" aria-hidden="true" />
        <div className="flex-1">
          <h2 id="danger-title" className="font-semibold">Reset demo data</h2>
          <p className="text-sm text-muted">Restore the original seed data for every collection. The current demo session is kept.</p>
        </div>
        <button type="button" className="btn btn-danger" onClick={reset}><RotateCcw className="h-4 w-4" aria-hidden="true" />Reset demo data</button>
      </section>
    </div>
  )
}
