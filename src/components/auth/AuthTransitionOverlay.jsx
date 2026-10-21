import { createPortal } from 'react-dom'
import mark from '../../assets/logos/meridian-mark.png'
import { GlobePattern } from '../common/BrandDecor'
import { cn } from '../../utils/cn'

const COPY = {
  login: { progress: (n) => `Welcome back${n ? `, ${n}` : ''}`, sub: (role) => (role === 'admin' ? 'Opening the admin console…' : 'Preparing your learning dashboard…'), done: 'You’re signed in' },
  register: { progress: (n) => `Welcome to Meridian${n ? `, ${n}` : ''}`, sub: () => 'Setting up your learner profile…', done: 'Your profile is ready' },
  logout: { progress: () => 'Signing you out', sub: () => 'Your progress stays saved in this browser…', done: 'You’ve been signed out' },
}

/** Full-screen branded transition shown while signing in, registering or signing out. */
export default function AuthTransitionOverlay({ transition }) {
  const copy = COPY[transition.type] || COPY.login
  const done = transition.phase === 'done' || transition.phase === 'leaving'
  return createPortal(
    <div
      role="status"
      aria-live="assertive"
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-gradient-to-br from-deep via-[#0c4a5d] to-primary text-white',
        transition.phase === 'leaving' ? 'auth-overlay-out' : 'auth-overlay-in',
      )}
      style={{ '--auth-duration': `${transition.duration}ms` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-dots-light" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 animate-blob rounded-full bg-info/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 -bottom-32 h-96 w-96 animate-blob rounded-full bg-accent/20 blur-3xl [animation-delay:-5s]" aria-hidden="true" />
      <GlobePattern className="pointer-events-none absolute -right-10 -bottom-10 h-72 w-72 animate-spin-slow opacity-15" />

      <div className="relative flex flex-col items-center px-6 text-center">
        <div className="relative flex h-32 w-32 items-center justify-center">
          {!done && (
            <svg className="auth-ring absolute inset-0 h-full w-full" viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgb(255 255 255 / 0.15)" strokeWidth="5" />
              <circle cx="60" cy="60" r="54" fill="none" stroke="url(#authGrad)" strokeWidth="5" strokeLinecap="round" strokeDasharray="110 340" />
              <defs>
                <linearGradient id="authGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F78D00" />
                  <stop offset="100%" stopColor="#429BB7" />
                </linearGradient>
              </defs>
            </svg>
          )}
          {done ? (
            <span className="flex h-24 w-24 animate-pop-in items-center justify-center rounded-full bg-white shadow-[0_0_0_10px_rgb(255_255_255/0.12)]">
              <svg viewBox="0 0 52 52" className="h-12 w-12" aria-hidden="true">
                <path className="check-draw" fill="none" stroke="#15803D" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" d="M14 27l8 8 17-18" />
              </svg>
            </span>
          ) : (
            <span className="flex h-20 w-20 animate-pop-in items-center justify-center rounded-full bg-white p-3 shadow-xl">
              <img src={mark} alt="" className="h-full w-full object-contain" />
            </span>
          )}
        </div>
        <h2 key={done ? 'done' : 'progress'} className="mt-8 animate-slide-up text-2xl font-bold text-white sm:text-3xl">
          {done ? copy.done : copy.progress(transition.name)}
        </h2>
        <p className="mt-2 animate-fade-in text-sm text-white/75">{done ? 'Meridian LMS' : copy.sub(transition.role)}</p>
        <div className="mt-8 h-1.5 w-56 overflow-hidden rounded-full bg-white/15">
          <span className="auth-progress block h-full rounded-full bg-gradient-to-r from-accent to-info" />
        </div>
      </div>
    </div>,
    document.body,
  )
}
