import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import logo from '../../assets/logos/meridian-logo.png'
import logoLight from '../../assets/logos/meridian-logo-light.png'
import mark from '../../assets/logos/meridian-mark.png'

/**
 * Official Meridian Quality Management Professionals logo (transparent PNGs derived from the
 * supplied artwork). `tone="light"` uses the white-text variant for dark backgrounds and
 * `compact` shows only the globe mark. Natural aspect ratio is always preserved.
 */
export default function BrandLogo({ tone = 'dark', to = '/', compact = false, size = 'md', className }) {
  const height = { sm: 'h-9', md: 'h-11', lg: 'h-16' }[size] || 'h-11'
  const content = compact ? (
    <img src={mark} alt="Meridian" className={cn(height, 'w-auto object-contain')} />
  ) : (
    <img src={tone === 'light' ? logoLight : logo} alt="Meridian Quality Management Professionals" className={cn(height, 'w-auto object-contain')} />
  )
  if (!to) return <span className={cn('inline-flex shrink-0 items-center', className)}>{content}</span>
  return (
    <Link to={to} className={cn('group/logo inline-flex shrink-0 items-center rounded-lg transition-opacity hover:opacity-90', className)} aria-label="Meridian home">
      {content}
    </Link>
  )
}
