import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Shield, GraduationCap, CircleAlert, Info } from 'lucide-react'
import { Field, Spinner } from '../../components/common/ui'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { DEMO_ACCOUNTS } from '../../data/users'
import { validateCredentials, postLoginPath } from '../../services/mockAuthService'
import { cn } from '../../utils/cn'

const ROLES = [
  { id: 'learner', label: 'Learner', icon: GraduationCap, description: 'Browse, enrol and learn' },
  { id: 'admin', label: 'Admin', icon: Shield, description: 'Manage the platform' },
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
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
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
      document.getElementById(nextErrors.email ? 'login-email' : 'login-password')?.focus()
      return
    }
    setLoading(true)
    const result = await login(values)
    setLoading(false)
    if (!result.ok) {
      setFormError(result.error)
      return
    }
    if (result.user.role !== role) {
      toast.info(`Signed in as ${result.user.role === 'admin' ? 'an administrator' : 'a learner'} based on the account you used.`)
    }
    toast.success(`Welcome back, ${result.user.name.split(' ')[0]}!`)
    navigate(postLoginPath(result.user.role, from), { replace: true })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Sign in to Meridian</h1>
      <p className="mt-2 text-sm text-muted">
        New here? <Link to="/register" className="link">Create a demo learner profile</Link>
      </p>

      {location.state?.reason === 'auth' && (
        <div className="mt-5 flex items-start gap-2 rounded-lg border border-info/30 bg-info-soft p-3 text-sm text-[#1F4E5F]" role="status">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> Please sign in to continue.
        </div>
      )}

      <fieldset className="mt-6">
        <legend className="label">Demo role</legend>
        <div className="grid grid-cols-2 gap-3" role="radiogroup">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={role === r.id}
              onClick={() => quickFill(r.id)}
              className={cn('flex items-start gap-3 rounded-xl border p-3 text-left transition-colors', role === r.id ? 'border-primary bg-primary-soft ring-1 ring-primary' : 'border-line hover:border-slate-300')}
            >
              <r.icon className={cn('mt-0.5 h-5 w-5', role === r.id ? 'text-primary' : 'text-muted')} aria-hidden="true" />
              <span>
                <span className="block text-sm font-semibold text-ink">{r.label}</span>
                <span className="block text-xs text-muted">{r.description}</span>
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">Selecting a role fills in its demo credentials.</p>
      </fieldset>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        {formError && (
          <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-soft p-3 text-sm text-danger" role="alert">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {formError}
          </div>
        )}
        <Field label="Email" htmlFor="login-email" error={errors.email} required>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            className={cn('input', errors.email && 'input-invalid')}
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Password" htmlFor="login-password" error={errors.password} required>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={cn('input pr-11', errors.password && 'input-invalid')}
              value={values.password}
              onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
            />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-muted hover:bg-slate-100 hover:text-ink" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="checkbox" checked={values.remember} onChange={(e) => setValues((v) => ({ ...v, remember: e.target.checked }))} />
            Remember me on this device
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-secondary hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
          {loading && <Spinner />} {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="mt-8 rounded-xl border border-dashed border-line bg-slate-50 p-4">
        <p className="text-sm font-semibold text-ink">Demo accounts</p>
        <p className="mt-0.5 text-xs text-muted">For demonstration only — authentication is simulated in this browser.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {Object.entries(DEMO_ACCOUNTS).map(([key, acc]) => (
            <button key={key} type="button" onClick={() => quickFill(key)} className="rounded-lg border border-line bg-white p-3 text-left text-xs hover:border-primary">
              <span className="block font-semibold text-ink capitalize">Use {key} account</span>
              <span className="mt-1 block text-muted">{acc.email}</span>
              <span className="block font-mono text-muted">{acc.password}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
