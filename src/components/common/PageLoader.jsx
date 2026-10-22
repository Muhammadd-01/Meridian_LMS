import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import mark from '../../assets/logos/meridian-mark.png'
import logo from '../../assets/logos/meridian-logo.png'
import { cn } from '../../utils/cn'

const FIRST_LOAD_MS = 1500
const NAVIGATION_MS = 1000
const FADE_MS = 380

/** Full-screen branded loader: the Meridian mark inside a spinning gradient ring. */
export function BrandLoader({ leaving = false, duration = NAVIGATION_MS }) {
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className={cn('no-print fixed inset-0 z-[95] flex items-center justify-center bg-mesh', leaving ? 'loader-out' : 'loader-in')}
      style={{ '--loader-duration': `${duration}ms` }}
    >
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-60" aria-hidden="true" />
      <div className="relative flex flex-col items-center">
        <div className="relative h-36 w-36">
          <span className="absolute inset-0 animate-ping rounded-full bg-info/15 [animation-duration:1.8s]" aria-hidden="true" />
          <span className="loader-ring absolute inset-0 rounded-full" aria-hidden="true" />
          <span className="absolute inset-[10px] rounded-full bg-white shadow-[0_18px_40px_-18px_rgb(9_63_80/0.55)]" aria-hidden="true" />
          <img src={mark} alt="" className="loader-mark absolute inset-[26px] h-[calc(100%-52px)] w-[calc(100%-52px)] object-contain" />
        </div>
        <img src={logo} alt="Meridian Quality Management Professionals" className="mt-6 h-12 w-auto object-contain" />
        <div className="mt-5 h-1 w-44 overflow-hidden rounded-full bg-slate-200">
          <span className="loader-bar block h-full rounded-full bg-gradient-to-r from-accent via-info to-primary" />
        </div>
        <span className="sr-only">Loading…</span>
      </div>
    </div>,
    document.body,
  )
}

/** Groups paths that belong to one page (lessons inside the course player do not re-trigger the loader). */
function pageKey(pathname) {
  const player = pathname.match(/^\/learn\/course\/[^/]+/)
  return player ? player[0] : pathname
}

/**
 * Shows the branded loader on first load and briefly on every page change.
 * Rendered once near the router root.
 */
export default function RouteLoader() {
  const { pathname } = useLocation()
  const key = pageKey(pathname)
  const [state, setState] = useState({ phase: 'show', duration: FIRST_LOAD_MS, cycle: key })

  // Start a new cycle when the page changes (state update during render, before paint).
  if (state.cycle !== key) {
    setState({ phase: 'show', duration: NAVIGATION_MS, cycle: key })
  }

  // show → (duration) → leaving → (fade) → hidden; a new page change restarts the cycle.
  useEffect(() => {
    if (state.phase === 'hidden') return undefined
    const timer = setTimeout(
      () => setState((s) => ({ ...s, phase: s.phase === 'show' ? 'leaving' : 'hidden' })),
      state.phase === 'show' ? state.duration : FADE_MS,
    )
    return () => clearTimeout(timer)
  }, [state.phase, state.duration, state.cycle])

  if (state.phase === 'hidden') return null
  return <BrandLoader leaving={state.phase === 'leaving'} duration={state.duration} />
}
