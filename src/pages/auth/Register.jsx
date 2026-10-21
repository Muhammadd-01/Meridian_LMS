import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TriangleAlert, User, Mail, Lock, ShieldCheck, ArrowRight, Check, X, Rocket } from 'lucide-react'
import AuthInput from '../../components/auth/AuthInput'
import { Spinner } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { isValidEmail, passwordIssues } from '../../services/mockAuthService'
import { cn } from '../../utils/cn'

const RULES = [
  { label: '8+ characters', test: (p) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Number', test: (p) => /[0-9]/.test(p) },
  { label: 'Symbol', test: (p) => /[^A-Za-z0-9]/.test(p) },
]
const STRENGTH = [
  { label: 'Too weak', color: 'bg-danger', text: 'text-danger' },
  { label: 'Weak', color: 'bg-danger', text: 'text-danger' },
  { label: 'Fair', color: 'bg-warning', text: 'text-[#B45309]' },
  { label: 'Good', color: 'bg-info', text: 'text-[#1F6F88]' },
  { label: 'Strong', color: 'bg-success', text: 'text-success' },
]

function PasswordStrength({ password }) {
  const score = RULES.filter((r) => r.test(password)).length
  const level = STRENGTH[password ? score : 0]
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn('h-1.5 flex-1 rounded-full transition-all duration-500', password && score >= i ? level.color : 'bg-slate-200')} />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <ul className="flex flex-wrap gap-x-3 gap-y-1">
          {RULES.map((r) => {
            const ok = r.test(password)
            return (
              <li key={r.label} className={cn('flex items-center gap-1 text-[11px] font-medium transition-colors', ok ? 'text-success' : 'text-muted')}>
                {ok ? <Check className="h-3 w-3" aria-hidden="true" /> : <X className="h-3 w-3" aria-hidden="true" />}{r.label}
              </li>
            )
          })}
        </ul>
        {password && <span className={cn('text-xs font-bold', level.text)}>{level.label}</span>}
      </div>
    </div>
  )
}

export default function Register() {
  useDocumentTitle('Join for free')
  const { actions, settings } = useData()
  const { startSession } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '', agree: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [shaking, setShaking] = useState(false)

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
      setShaking(true)
      document.getElementById(`reg-${Object.keys(next)[0]}`)?.focus()
      return
    }
    setLoading(true)
    const result = actions.registerLearner(values)
    setLoading(false)
    if (!result.ok) {
      setErrors({ email: 'A demo profile with this email already exists. Try signing in instead.' })
      setShaking(true)
      return
    }
    startSession(result.user, true, { kind: 'register' })
    toast.success('Your demo learner profile was created in this browser.', { title: `Welcome, ${result.user.name.split(' ')[0]}!` })
    navigate('/learn/dashboard', { replace: true })
  }

  const confirmOk = values.confirm && values.confirm === values.password

  return (
    <div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-ink"><Rocket className="h-3.5 w-3.5" aria-hidden="true" />Free to join</span>
      <h1 className="mt-3 text-[28px] leading-tight font-extrabold tracking-tight text-deep">Create your learner profile</h1>
      <p className="mt-1.5 text-sm text-muted">Already have one? <Link to="/login" className="link">Sign in</Link></p>

      <div className="mt-5 flex items-start gap-2 rounded-xl border border-warning/30 bg-warning-soft p-3 text-xs text-[#92400E]">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>This creates a <strong>local demo profile</strong> in your browser — no server account is created. Don’t reuse a real password.</p>
      </div>

      <form onSubmit={onSubmit} noValidate onAnimationEnd={(e) => { if (e.target === e.currentTarget) setShaking(false) }} className={cn('mt-6 space-y-4', shaking && 'animate-shake')}>
        <AuthInput id="reg-name" label="Full name" icon={User} autoComplete="name" placeholder="e.g. Sara Ahmed" value={values.name} onChange={set('name')} error={errors.name} required />
        <AuthInput id="reg-email" label="Email address" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={set('email')} error={errors.email} required />
        <div>
          <AuthInput id="reg-password" label="Password" icon={Lock} reveal autoComplete="new-password" placeholder="Create a password" value={values.password} onChange={set('password')} error={errors.password} required />
          <PasswordStrength password={values.password} />
        </div>
        <div className="relative">
          <AuthInput id="reg-confirm" label="Confirm password" icon={ShieldCheck} reveal autoComplete="new-password" placeholder="Repeat your password" value={values.confirm} onChange={set('confirm')} error={errors.confirm} required />
          {confirmOk && !errors.confirm && <span className="absolute top-0 right-0 inline-flex animate-pop-in items-center gap-1 text-xs font-semibold text-success"><Check className="h-3.5 w-3.5" aria-hidden="true" />Matches</span>}
        </div>
        <div>
          <label className="flex cursor-pointer items-start gap-2 text-sm text-slate-700">
            <input id="reg-agree" type="checkbox" className="checkbox mt-0.5" checked={values.agree} onChange={set('agree')} aria-invalid={Boolean(errors.agree)} />
            <span>I understand this is a demo and accept the <Link to="/terms" className="link">terms of use</Link>.</span>
          </label>
          {errors.agree && <p className="field-error animate-slide-up" role="alert">{errors.agree}</p>}
        </div>
        <button type="submit" className="btn btn-gradient btn-lg group w-full rounded-xl shadow-[0_14px_30px_-14px_rgb(9_63_80/0.8)]" disabled={loading}>
          {loading ? <><Spinner /> Creating profile…</> : <>Create my profile <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" /></>}
        </button>
      </form>
    </div>
  )
}
