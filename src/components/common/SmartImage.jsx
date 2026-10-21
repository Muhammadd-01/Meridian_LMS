import { useState } from 'react'
import { hashString } from '../../utils/ids'
import { cn } from '../../utils/cn'

const PALETTES = [
  ['#093F50', '#2C5F6F', '#429BB7'],
  ['#266173', '#093F50', '#F78D00'],
  ['#2C5F6F', '#429BB7', '#E6F3F8'],
  ['#093F50', '#266173', '#F78D00'],
]

/** Branded generative artwork used when an image is missing or fails to load. */
export function FallbackArt({ label = '', seed = '', className }) {
  const h = hashString(seed || label)
  const [a, b, c] = PALETTES[h % PALETTES.length]
  const angle = (h % 6) * 30
  return (
    <div className={cn('relative flex h-full w-full items-center justify-center overflow-hidden', className)} style={{ background: `linear-gradient(${135 + angle}deg, ${a}, ${b})` }} aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
        <circle cx={40 + (h % 120)} cy="60" r="46" fill="none" stroke={c} strokeWidth="2" />
        <circle cx={120 - (h % 60)} cy="40" r="26" fill="none" stroke="#fff" strokeWidth="1" opacity="0.6" />
        <path d={`M0 ${80 + (h % 20)} Q 100 ${30 + (h % 30)} 200 ${70 + (h % 25)}`} fill="none" stroke={c} strokeWidth="2" />
      </svg>
      {label && <span className="relative px-4 text-center text-sm font-semibold text-white/90 line-clamp-2">{label}</span>}
    </div>
  )
}

/** <img> with lazy loading and an attractive fallback when the source is empty or broken. */
export default function SmartImage({ src, alt = '', className, imgClassName, fallbackLabel, seed, ...rest }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const failed = !src || failedSrc === src
  return (
    <div className={cn('relative overflow-hidden bg-slate-100', className)}>
      {failed ? (
        <FallbackArt label={fallbackLabel} seed={seed || alt} />
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(src)}
          className={cn('h-full w-full object-cover', imgClassName)}
          {...rest}
        />
      )}
    </div>
  )
}
