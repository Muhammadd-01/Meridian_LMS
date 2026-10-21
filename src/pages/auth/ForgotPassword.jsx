import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MailQuestion, ArrowLeft } from 'lucide-react'
import { Field } from '../../components/common/ui'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { isValidEmail } from '../../services/mockAuthService'
import { DEMO_ACCOUNTS } from '../../data/users'
import { cn } from '../../utils/cn'

export default function ForgotPassword() {
  useDocumentTitle('Reset password')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return setError('Email is required.')
    if (!isValidEmail(email)) return setError('Enter a valid email address.')
    setError('')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div>
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-info-soft text-info"><MailQuestion className="h-6 w-6" aria-hidden="true" /></span>
        <h1 className="mt-5 text-2xl font-bold text-ink">This is a demo — no email was sent</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          In a production system, a password-reset link would be emailed to <strong className="text-ink">{email}</strong>. Meridian LMS has no backend or email service, so nothing was sent.
        </p>
        <div className="mt-5 rounded-xl border border-line bg-slate-50 p-4 text-sm">
          <p className="font-semibold text-ink">You can sign in with the demo accounts:</p>
          <ul className="mt-2 space-y-1 text-muted">
            <li>Learner — {DEMO_ACCOUNTS.learner.email} / <span className="font-mono">{DEMO_ACCOUNTS.learner.password}</span></li>
            <li>Admin — {DEMO_ACCOUNTS.admin.email} / <span className="font-mono">{DEMO_ACCOUNTS.admin.password}</span></li>
          </ul>
        </div>
        <Link to="/login" className="btn btn-primary mt-6"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to sign in</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Forgot your password?</h1>
      <p className="mt-2 text-sm text-muted">Enter your email and we’ll explain how password resets would work. (Simulated — no email is sent.)</p>
      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        <Field label="Email" htmlFor="fp-email" error={error} required>
          <input id="fp-email" type="email" autoComplete="email" className={cn('input', error && 'input-invalid')} value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? 'fp-email-error' : undefined} />
        </Field>
        <button type="submit" className="btn btn-primary btn-lg w-full">Continue</button>
      </form>
      <Link to="/login" className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-secondary hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to sign in</Link>
    </div>
  )
}
