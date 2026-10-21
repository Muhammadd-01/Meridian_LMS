import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '../../utils/cn'

const RADIUS = 22
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/** Floating "back to top" button with a scroll-progress ring; appears after scrolling down. */
export default function BackToTop({ threshold = 420 }) {
  const [state, setState] = useState({ visible: false, progress: 0 })

  useEffect(() => {
    let frame = null
    const update = () => {
      frame = null
      const max = document.documentElement.scrollHeight - window.innerHeight
      setState({ visible: window.scrollY > threshold, progress: max > 0 ? Math.min(1, window.scrollY / max) : 0 })
    }
    const onScroll = () => { if (frame == null) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    frame = requestAnimationFrame(update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame != null) cancelAnimationFrame(frame)
    }
  }, [threshold])

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('reduce-motion')
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={state.visible ? 0 : -1}
      aria-hidden={!state.visible}
      className={cn(
        'no-print group fixed right-[22px] bottom-5 z-[59] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white text-primary shadow-[0_12px_28px_-10px_rgb(9_63_80/0.55)] ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white',
        state.visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0',
      )}
    >
      <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r={RADIUS} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="3" />
        <circle cx="26" cy="26" r={RADIUS} fill="none" stroke="#F78D00" strokeWidth="3" strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={CIRCUMFERENCE * (1 - state.progress)} className="transition-[stroke-dashoffset] duration-150" />
      </svg>
      <ArrowUp className="relative h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:animate-bounce-soft" aria-hidden="true" />
    </button>
  )
}
