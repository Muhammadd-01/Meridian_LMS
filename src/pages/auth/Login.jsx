import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Shield, GraduationCap, CircleAlert, Info, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import AuthInput from '../../components/auth/AuthInput'
import { Spinner } from '../../components/common/ui'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { DEMO_ACCOUNTS } from '../../data/users'
import { validateCredentials, postLoginPath } from '../../services/mockAuthService'
import { cn } from '../../utils/cn'

const ROLES = [
  { id: 'learner', label: 'Learner', icon: GraduationCap },
  { id: 'admin', label: 'Admin', icon: Shield },
]

export default function Login() {
  useDocumentTitle('Sign in')
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [role, setRole] = useState('learner')
  const [values, setValues] = useState({ email: '', password: '', remember: true })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shaking, setShaking] = useState(false)
  const from = location.state?.from

  const quickFill = (which) => {
    const account = DEMO_ACCOUNTS[which]
    setRole(which)
    setValues((v) => ({ ...v, email: account.email, password: account.password }))
    setErrors({})
    setFormError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validateCredentials(values)
    setErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length) {
      setShaking(true)
      document.getElementById(nextErrors.email ? 'login-email' : 'login-password')?.focus()
      return
    }
    setLoading(true)
    const result = await login(values)
    setLoading(false)
    if (!result.ok) {
      setFormError(result.error)
      setShaking(true)
      return
    }
    if (result.user.role !== role) {
      toast.info(`Signed in as ${result.user.role === 'admin' ? 'an administrator' : 'a learner'} based on the account you used.`)
    }
    navigate(postLoginPath(result.user.role, from), { replace: true })
  }

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" />Welcome back</span>
      <h1 className="mt-3 text-[28px] leading-tight font-extrabold tracking-tight text-deep">Sign in to Meridian</h1>
      <p className="mt-1.5 text-sm text-muted">
        New here? <Link to="/register" className="link">Create a free learner profile</Link>
      </p>

      {location.state?.reason === 'auth' && (
        <div className="mt-5 flex animate-slide-up items-start gap-2 rounded-xl border border-info/30 bg-info-soft p-3 text-sm text-[#1F4E5F]" role="status">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> Please sign in to continue.
        </div>
      )}

      <div className="relative mt-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1" role="radiogroup" aria-label="Demo role">
        <span className={cn('absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-md transition-transform duration-300 ease-out', role === 'admin' && 'translate-x-full')} aria-hidden="true" />
        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={role === r.id}
            onClick={() => quickFill(r.id)}
            className={cn('relative z-10 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors', role === r.id ? 'text-primary' : 'text-muted hover:text-ink')}
          >
            <r.icon className="h-4 w-4" aria-hidden="true" />{r.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-muted">Choosing a role fills in its demo credentials.</p>

      <form onSubmit={onSubmit} noValidate onAnimationEnd={(e) => { if (e.target === e.currentTarget) setShaking(false) }} className={cn('mt-5 space-y-4', shaking && 'animate-shake')}>
        {formError && (
          <div className="flex animate-slide-up items-start gap-2 rounded-xl border border-danger/30 bg-danger-soft p-3 text-sm text-danger" role="alert">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {formError}
          </div>
        )}
        <AuthInput id="login-email" label="Email address" icon={Mail} type="email" autoComplete="username" placeholder="you@example.com" value={values.email} onChange={set('email')} error={errors.email} required />
        <AuthInput id="login-password" label="Password" icon={Lock} reveal autoComplete="current-password" placeholder="••••••••" value={values.password} onChange={set('password')} error={errors.password} required />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="checkbox" checked={values.remember} onChange={set('remember')} />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-semibold text-secondary hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" className="btn btn-gradient btn-lg group w-full rounded-xl shadow-[0_14px_30px_-14px_rgb(9_63_80/0.8)]" disabled={loading}>
          {loading ? <><Spinner /> Checking your details…</> : <>Sign in <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" /></>}
        </button>
      </form>

      <div className="relative my-6 text-center text-xs text-muted">
        <span className="absolute inset-x-0 top-1/2 h-px bg-line" aria-hidden="true" />
        <span className="relative bg-white px-3">Demo accounts</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {Object.entries(DEMO_ACCOUNTS).map(([key, acc]) => (
          <button key={key} type="button" onClick={() => quickFill(key)} className="group rounded-xl border border-line bg-white p-3 text-left text-xs transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
            <span className="flex items-center gap-2 font-semibold text-ink capitalize">
              {key === 'admin' ? <Shield className="h-4 w-4 text-primary" aria-hidden="true" /> : <GraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />}
              Use {key} account
            </span>
            <span className="mt-1 block truncate text-muted">{acc.email}</span>
            <span className="block font-mono text-muted">{acc.password}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
