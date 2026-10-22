import { useEffect, useState } from 'react'

/** Scroll distance (px) after which the back-to-top button appears and the chat button moves up. */
export const BACK_TO_TOP_THRESHOLD = 420

/** True once the window has scrolled further than `threshold` pixels. */
export function useScrolledPast(threshold = BACK_TO_TOP_THRESHOLD) {
  const [past, setPast] = useState(() => typeof window !== 'undefined' && window.scrollY > threshold)
  useEffect(() => {
    let frame = null
    const update = () => {
      frame = null
      setPast(window.scrollY > threshold)
    }
    const onScroll = () => { if (frame == null) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    frame = requestAnimationFrame(update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame != null) cancelAnimationFrame(frame)
    }
  }, [threshold])
  return past
}
