import { useState } from 'react'
import { CircleCheck } from 'lucide-react'
import { Field, Spinner } from '../common/ui'
import { isValidEmail } from '../../services/mockAuthService'

/**
 * Locally validated form that shows a demo confirmation. Nothing is sent anywhere.
 * fields: [{ name, label, type: 'text' | 'email' | 'textarea' | 'select', options, required, placeholder, minLength }]
 */
export default function DemoInquiryForm({ fields, submitLabel = 'Submit', successTitle = 'Demo submission recorded' }) {
  const initial = Object.fromEntries(fields.map((f) => [f.name, f.type === 'select' ? '' : '']))
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const validate = () => {
    const next = {}
    fields.forEach((f) => {
      const v = String(values[f.name] || '').trim()
      if (f.required && !v) next[f.name] = `${f.label} is required.`
      else if (f.type === 'email' && v && !isValidEmail(v)) next[f.name] = 'Enter a valid email address.'
      else if (f.minLength && v && v.length < f.minLength) next[f.name] = `Please write at least ${f.minLength} characters.`
    })
    return next
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) {
      document.getElementById(`inq-${Object.keys(next)[0]}`)?.focus()
      return
    }
    setStatus('submitting')
    setTimeout(() => setStatus('done'), 400)
  }

  if (status === 'done') {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-success/20 bg-success-soft p-8 text-center" role="status">
        <CircleCheck className="h-10 w-10 text-success" aria-hidden="true" />
        <h3 className="mt-3 text-lg font-semibold text-ink">{successTitle}</h3>
        <p className="mt-1 max-w-md text-sm text-slate-700">
          Thanks, {values.name || 'there'}. This is a frontend demo, so your message was validated in the browser but <strong>not sent</strong> to anyone and no email was delivered.
        </p>
        <button type="button" className="btn btn-secondary mt-5" onClick={() => { setValues(initial); setStatus('idle') }}>Send another</button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => {
        const id = `inq-${f.name}`
        const common = {
          id,
          name: f.name,
          value: values[f.name],
          onChange: (e) => setValues((v) => ({ ...v, [f.name]: e.target.value })),
          'aria-invalid': Boolean(errors[f.name]),
          'aria-describedby': errors[f.name] ? `${id}-error` : undefined,
          className: `input ${errors[f.name] ? 'input-invalid' : ''}`,
          placeholder: f.placeholder,
        }
        return (
          <Field key={f.name} label={f.label} htmlFor={id} error={errors[f.name]} required={f.required} className={f.type === 'textarea' || f.full ? 'sm:col-span-2' : ''}>
            {f.type === 'textarea' ? (
              <textarea rows={5} {...common} />
            ) : f.type === 'select' ? (
              <select {...common}>
                <option value="">Select…</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input type={f.type || 'text'} autoComplete={f.autoComplete} {...common} />
            )}
          </Field>
        )
      })}
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
          {status === 'submitting' && <Spinner />} {submitLabel}
        </button>
        <p className="text-xs text-muted">Demo only — submissions are not transmitted or stored.</p>
      </div>
    </form>
  )
}
