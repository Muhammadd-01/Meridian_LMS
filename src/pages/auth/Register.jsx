import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, TriangleAlert } from 'lucide-react'
import { Field, Spinner } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { isValidEmail, passwordIssues } from '../../services/mockAuthService'
import { cn } from '../../utils/cn'

export default function Register() {
  useDocumentTitle('Join for free')
  const { actions, settings } = useData()
  const { startSession } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '', agree: false })
  const [errors, setErrors] = useState({})
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!settings.allowSelfRegistration) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-ink">Registration is paused</h1>
        <p className="mt-2 text-sm text-muted">The demo administrator has turned off self-registration. You can still use the demo learner account.</p>
        <Link to="/login" className="btn btn-primary mt-6">Go to sign in</Link>
      </div>
    )
  }

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const validate = () => {
    const next = {}
    if (!values.name.trim()) next.name = 'Full name is required.'
    else if (values.name.trim().length < 2) next.name = 'Enter at least 2 characters.'
    if (!values.email.trim()) next.email = 'Email is required.'
    else if (!isValidEmail(values.email)) next.email = 'Enter a valid email address.'
    const issues = passwordIssues(values.password)
    if (!values.password) next.password = 'Password is required.'
    else if (issues.length) next.password = `Password needs ${issues.join(', ')}.`
    if (values.confirm !== values.password) next.confirm = 'Passwords do not match.'
    if (!values.agree) next.agree = 'Please acknowledge the demo terms.'
    return next
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) {
      document.getElementById(`reg-${Object.keys(next)[0]}`)?.focus()
      return
    }
    setLoading(true)
    const result = actions.registerLearner(values)
    setLoading(false)
    if (!result.ok) {
      setErrors({ email: 'A demo profile with this email already exists. Try signing in instead.' })
      return
    }
    startSession(result.user, true)
    toast.success(`Welcome to ${settings.platformName}, ${result.user.name.split(' ')[0]}! Your demo profile was created in this browser.`)
    navigate('/learn/dashboard', { replace: true })
  }

  const input = (key, props = {}) => ({
    id: `reg-${key}`,
    value: values[key],
    onChange: set(key),
    className: cn('input', errors[key] && 'input-invalid'),
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `reg-${key}-error` : undefined,
    ...props,
  })

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Join Meridian for free</h1>
      <p className="mt-2 text-sm text-muted">Already have a profile? <Link to="/login" className="link">Sign in</Link></p>

      <div className="mt-5 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-soft p-3 text-xs text-[#92400E]">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>This creates a <strong>local demo profile</strong> stored in your browser — no server account is created. Don’t reuse a real password; it is stored unencrypted for the demo.</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        <Field label="Full name" htmlFor="reg-name" error={errors.name} required>
          <input type="text" autoComplete="name" {...input('name')} />
        </Field>
        <Field label="Email" htmlFor="reg-email" error={errors.email} required>
          <input type="email" autoComplete="email" {...input('email')} />
        </Field>
        <Field label="Password" htmlFor="reg-password" error={errors.password} hint="At least 8 characters with an uppercase letter and a number." required>
          <div className="relative">
            <input type={show ? 'text' : 'password'} autoComplete="new-password" {...input('password', { className: cn('input pr-11', errors.password && 'input-invalid') })} />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-muted hover:bg-slate-100" aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <Field label="Confirm password" htmlFor="reg-confirm" error={errors.confirm} required>
          <input type={show ? 'text' : 'password'} autoComplete="new-password" {...input('confirm')} />
        </Field>
        <div>
          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input id="reg-agree" type="checkbox" className="checkbox mt-0.5" checked={values.agree} onChange={set('agree')} aria-invalid={Boolean(errors.agree)} />
            <span>I understand this is a demo and accept the <Link to="/terms" className="link">terms of use</Link>.</span>
          </label>
          {errors.agree && <p className="field-error" role="alert">{errors.agree}</p>}
        </div>
        <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
          {loading && <Spinner />} Create demo profile
        </button>
      </form>
    </div>
  )
}
