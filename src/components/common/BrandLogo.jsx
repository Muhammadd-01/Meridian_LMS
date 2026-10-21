import { Link } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { cn } from '../../utils/cn'

/*
 * If the official Meridian logo is added to src/assets/logos/ (e.g. meridian-logo.png or .svg)
 * it is picked up automatically and rendered at its natural aspect ratio. Until then a
 * vector brand mark in the Meridian palette is shown.
 */
const logoFiles = import.meta.glob('../../assets/logos/meridian-logo.{png,svg,jpg,jpeg,webp}', { eager: true, import: 'default' })
const suppliedLogo = Object.values(logoFiles)[0] || null

function BrandMark({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#093F50" />
      <circle cx="20" cy="20" r="11.5" fill="none" stroke="#429BB7" strokeWidth="2.6" />
      <path d="M20 6.5v27" stroke="#F78D00" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M8.5 20h23" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
    </svg>
  )
}

export default function BrandLogo({ tone = 'dark', to = '/', compact = false, className }) {
  const { settings } = useData()
  const name = settings?.platformName || 'Meridian LMS'
  const [first, ...rest] = name.split(' ')
  const content = suppliedLogo ? (
    <img src={suppliedLogo} alt={name} className="h-9 w-auto object-contain" />
  ) : (
    <span className="flex items-center gap-2.5">
      <BrandMark className="h-9 w-9 shrink-0" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className={cn('text-[17px] font-extrabold tracking-tight', tone === 'light' ? 'text-white' : 'text-deep')}>{first}</span>
          {rest.length > 0 && (
            <span className={cn('mt-0.5 text-[10px] font-semibold tracking-[0.22em] uppercase', tone === 'light' ? 'text-[#9fd3e3]' : 'text-secondary')}>
              {rest.join(' ')}
            </span>
          )}
        </span>
      )}
    </span>
  )
  if (!to) return <span className={className}>{content}</span>
  return (
    <Link to={to} className={cn('inline-flex shrink-0 items-center rounded-lg', className)} aria-label={`${name} home`}>
      {content}
    </Link>
  )
}
