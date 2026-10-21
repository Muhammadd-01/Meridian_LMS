import { useState } from 'react'
import { Eye, EyeOff, CircleAlert } from 'lucide-react'
import { cn } from '../../utils/cn'

/** Floating-icon input used on the sign-in and sign-up screens, with optional password reveal. */
export default function AuthInput({ id, label, icon: Icon, error, hint, type = 'text', reveal = false, required, className, ...props }) {
  const [show, setShow] = useState(false)
  const inputType = reveal ? (show ? 'text' : 'password') : type
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}{required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
      </label>
      <div className="group relative">
        {Icon && (
          <span className={cn('pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 transition-colors duration-200', error ? 'text-danger' : 'text-slate-400 group-focus-within:text-primary')}>
            <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
        )}
        <input
          id={id}
          type={inputType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(
            'block w-full rounded-xl border bg-slate-50/80 py-3 text-[15px] text-ink placeholder:text-slate-400 transition-all duration-200',
            'focus:bg-white focus:outline-none focus:ring-4',
            Icon ? 'pl-11' : 'pl-4',
            reveal ? 'pr-12' : 'pr-4',
            error ? 'border-danger focus:border-danger focus:ring-danger/15' : 'border-slate-200 hover:border-slate-300 focus:border-info focus:ring-info/15',
          )}
          {...props}
        />
        {reveal && (
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-2 text-muted transition hover:bg-slate-100 hover:text-ink" aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex animate-slide-up items-center gap-1 text-xs font-medium text-danger" role="alert"><CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}
