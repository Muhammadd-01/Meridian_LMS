import { useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn'

/** Fires once when the element first scrolls into view. */
function useInViewOnce(options = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(() => typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined')
  useEffect(() => {
    const el = ref.current
    if (!el || visible) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, options)
    observer.observe(el)
    // Content already on screen at mount reveals on the next frame, without waiting for the observer.
    const frame = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setVisible(true)
        observer.disconnect()
      }
    })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
    // options is a stable literal for each caller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])
  return [ref, visible]
}

/**
 * Scroll-reveal wrapper: fades/slides children in when they enter the viewport.
 * variant: 'up' (default) | 'left' | 'right' | 'zoom'. `delay` (ms) staggers siblings.
 * Respects reduced-motion preferences via CSS.
 */
export function Reveal({ as: Tag = 'div', variant = 'up', delay = 0, className, style, children, ...rest }) {
  const [ref, visible] = useInViewOnce()
  return (
    <Tag
      ref={ref}
      data-variant={variant}
      className={cn('reveal', visible && 'is-visible', className)}
      style={{ ...style, '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Counts up the numeric part of a value like "530+", "4.7★" or "2,500+" when scrolled into view. */
export function AnimatedCounter({ value, duration = 1400, className }) {
  const [ref, visible] = useInViewOnce({ threshold: 0.4 })
  const match = String(value).match(/^([^\d]*)([\d,.]+)(.*)$/)
  const target = match ? Number(match[2].replace(/,/g, '')) : null
  const decimals = match && match[2].includes('.') ? match[2].split('.')[1].length : 0
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!visible || target == null) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('reduce-motion')
    let frame
    const start = performance.now()
    const tick = (now) => {
      const t = reduced ? 1 : Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setDisplay(target * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    // Guarantee the final value even if animation frames are throttled (background tabs).
    const settle = setTimeout(() => setDisplay(target), duration + 250)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(settle)
    }
  }, [visible, target, duration])

  if (target == null) return <span className={className}>{value}</span>
  // Only group digits when the source value does (so "2005" stays a year, "2,500" keeps its comma).
  const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: match[2].includes(',') }).format(display)
  return (
    <span ref={ref} className={cn('tabular-nums', className)} aria-label={String(value)}>
      {match[1]}{formatted}{match[3]}
    </span>
  )
}

/** Infinite horizontal ticker. Content is duplicated for a seamless loop; pauses on hover. */
export function Marquee({ items, className, itemClassName, separator = '•', reverse = false }) {
  const row = (hidden) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className={cn('flex items-center whitespace-nowrap', itemClassName)}>
          {item}
          <span className="mx-6 opacity-60" aria-hidden="true">{separator}</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className={cn('marquee-mask overflow-hidden', className)}>
      <div className="marquee-track flex w-max animate-marquee" style={reverse ? { animationDirection: 'reverse' } : undefined}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
