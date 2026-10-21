import { useRef, useState } from 'react'
import { Upload, Trash2, Save } from 'lucide-react'
import { Avatar, Field, PageHeader } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useBeforeUnload } from '../../hooks/useUtils'
import { cn } from '../../utils/cn'

const LANGUAGES = ['English', 'Spanish', 'French', 'Arabic', 'Portuguese', 'German', 'Hindi', 'Japanese']
const MAX_AVATAR_BYTES = 300 * 1024

export default function Profile() {
  useDocumentTitle('Profile')
  const { categories, actions } = useData()
  const { user } = useAuth()
  const toast = useToast()
  const fileRef = useRef(null)
  const initial = {
    name: user.name, bio: user.bio || '', title: user.title || '', location: user.location || '',
    avatar: user.avatar || '', interests: user.interests || [], language: user.language || 'English', weeklyGoalHours: user.weeklyGoalHours ?? 3,
  }
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const dirty = JSON.stringify(values) !== JSON.stringify(initial)
  useBeforeUnload(dirty)

  const set = (key, value) => setValues((v) => ({ ...v, [key]: value }))

  const onFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image file.')
    if (file.size > MAX_AVATAR_BYTES) return toast.error('Image is larger than 300 KB. Choose a smaller file so it fits in browser storage.')
    const reader = new FileReader()
    reader.onload = () => set('avatar', reader.result)
    reader.onerror = () => toast.error('Could not read that image.')
    reader.readAsDataURL(file)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const next = {}
    if (!values.name.trim()) next.name = 'Display name is required.'
    if (values.bio.length > 280) next.bio = 'Keep your bio under 280 characters.'
    const goal = Number(values.weeklyGoalHours)
    if (!Number.isFinite(goal) || goal < 1 || goal > 40) next.weeklyGoalHours = 'Choose between 1 and 40 hours.'
    setErrors(next)
    if (Object.keys(next).length) return
    actions.updateUser(user.id, { ...values, name: values.name.trim(), weeklyGoalHours: goal })
    toast.success('Profile changes saved locally.')
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <PageHeader
        title="Profile"
        description="How you appear across Meridian. Changes are saved in this browser."
        actions={(
          <>
            <button type="button" className="btn btn-ghost" disabled={!dirty} onClick={() => { setValues(initial); setErrors({}) }}>Discard</button>
            <button type="submit" className="btn btn-primary" disabled={!dirty}><Save className="h-4 w-4" aria-hidden="true" />Save changes</button>
          </>
        )}
      />
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <section className="card flex flex-col items-center p-6 text-center" aria-labelledby="avatar-title">
          <h2 id="avatar-title" className="sr-only">Profile photo</h2>
          <Avatar name={values.name} src={values.avatar} size="xl" className="h-28 w-28 ring-4 ring-primary-soft" />
          <p className="mt-4 font-semibold text-ink">{values.name || 'Your name'}</p>
          <p className="text-sm text-muted">{user.email}</p>
          <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={onFile} id="avatar-file" />
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" aria-hidden="true" />Upload photo</button>
            {values.avatar && <button type="button" className="btn btn-danger-ghost btn-sm" onClick={() => set('avatar', '')}><Trash2 className="h-4 w-4" aria-hidden="true" />Remove</button>}
          </div>
          <p className="mt-3 text-xs text-muted">PNG or JPG up to 300 KB. Stored locally as a preview — not uploaded anywhere.</p>
        </section>

        <div className="space-y-6">
          <section className="card grid gap-4 p-6 sm:grid-cols-2" aria-labelledby="details-title">
            <h2 id="details-title" className="text-base font-semibold sm:col-span-2">Personal details</h2>
            <Field label="Display name" htmlFor="pf-name" error={errors.name} required>
              <input id="pf-name" className={cn('input', errors.name && 'input-invalid')} value={values.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
            </Field>
            <Field label="Email" htmlFor="pf-email" hint="Email can’t be changed in the demo.">
              <input id="pf-email" className="input" value={user.email} disabled readOnly />
            </Field>
            <Field label="Headline" htmlFor="pf-title">
              <input id="pf-title" className="input" value={values.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Aspiring data analyst" />
            </Field>
            <Field label="Location" htmlFor="pf-location">
              <input id="pf-location" className="input" value={values.location} onChange={(e) => set('location', e.target.value)} />
            </Field>
            <Field label="Bio" htmlFor="pf-bio" error={errors.bio} hint={`${values.bio.length}/280 characters`} className="sm:col-span-2">
              <textarea id="pf-bio" rows={3} className={cn('input', errors.bio && 'input-invalid')} value={values.bio} onChange={(e) => set('bio', e.target.value)} />
            </Field>
          </section>

          <section className="card grid gap-4 p-6 sm:grid-cols-2" aria-labelledby="prefs-title">
            <h2 id="prefs-title" className="text-base font-semibold sm:col-span-2">Learning preferences</h2>
            <Field label="Preferred learning language" htmlFor="pf-lang">
              <select id="pf-lang" className="input" value={values.language} onChange={(e) => set('language', e.target.value)}>
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Weekly learning goal (hours)" htmlFor="pf-goal" error={errors.weeklyGoalHours}>
              <input id="pf-goal" type="number" min={1} max={40} className={cn('input', errors.weeklyGoalHours && 'input-invalid')} value={values.weeklyGoalHours} onChange={(e) => set('weeklyGoalHours', e.target.value)} />
            </Field>
            <fieldset className="sm:col-span-2">
              <legend className="label">Learning interests</legend>
              <div className="flex flex-wrap gap-2">
                {[...categories].sort((a, b) => a.order - b.order).map((c) => {
                  const on = values.interests.includes(c.name)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set('interests', on ? values.interests.filter((i) => i !== c.name) : [...values.interests, c.name])}
                      className={cn('rounded-full border px-3 py-1.5 text-sm transition-colors', on ? 'border-primary bg-primary text-white' : 'border-line bg-white text-slate-700 hover:border-primary')}
                    >
                      {c.name}
                    </button>
                  )
                })}
              </div>
              <p className="hint">Interests shape the recommendations on your dashboard.</p>
            </fieldset>
          </section>
        </div>
      </div>
    </form>
  )
}
