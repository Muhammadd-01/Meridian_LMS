import { Link } from 'react-router-dom'
import { ChevronRight, Star, CircleAlert, FlaskConical } from 'lucide-react'
import { cn } from '../../utils/cn'
import { hashString } from '../../utils/ids'
import { initials } from '../../utils/format'

/* ---------- Avatar ---------- */
const AVATAR_COLORS = ['bg-[#093F50]', 'bg-[#2C5F6F]', 'bg-[#266173]', 'bg-[#1F6F88]', 'bg-[#9A4F00]', 'bg-[#475569]']
const AVATAR_SIZES = { xs: 'h-6 w-6 text-[10px]', sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg', xl: 'h-24 w-24 text-2xl' }

export function Avatar({ name = '', src, size = 'md', className }) {
  const sizeClass = AVATAR_SIZES[size] || AVATAR_SIZES.md
  if (src) {
    return <img src={src} alt={name ? `${name}` : ''} className={cn('shrink-0 rounded-full object-cover ring-2 ring-white', sizeClass, className)} loading="lazy" />
  }
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-white', sizeClass, AVATAR_COLORS[hashString(name) % AVATAR_COLORS.length], className)}
      aria-label={name || undefined}
      role={name ? 'img' : undefined}
    >
      {initials(name) || '?'}
    </span>
  )
}

/* ---------- RatingStars ---------- */
export function RatingStars({ rating = 0, count, size = 'sm', showValue = true, className }) {
  const iconSize = size === 'lg' ? 'h-5 w-5' : size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5'
  const value = Number(rating) || 0
  if (!value) return <span className={cn('text-xs text-muted', className)}>No ratings yet</span>
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      {showValue && <span className="text-sm font-bold text-ink">{value.toFixed(1)}</span>}
      <span className="inline-flex" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, value - (i - 1)))
          return (
            <span key={i} className={cn('relative', iconSize)}>
              <Star className={cn('absolute inset-0 text-slate-300', iconSize)} aria-hidden="true" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={cn('fill-accent text-accent', iconSize)} aria-hidden="true" />
              </span>
            </span>
          )
        })}
      </span>
      {count != null && <span className="text-xs text-muted">({count})</span>}
    </span>
  )
}

/* ---------- ProgressBar ---------- */
export function ProgressBar({ value = 0, size = 'md', tone = 'primary', label, showLabel = false, className }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  const height = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2'
  const color = pct >= 100 ? 'bg-success' : tone === 'accent' ? 'bg-accent' : tone === 'info' ? 'bg-info' : 'bg-primary'
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn('w-full overflow-hidden rounded-full bg-slate-200', height)}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={label || 'Progress'}
      >
        <div className={cn('h-full rounded-full transition-[width] duration-500 ease-out', color)} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="w-10 shrink-0 text-right text-xs font-semibold text-ink">{pct}%</span>}
    </div>
  )
}

/* ---------- EmptyState ---------- */
export function EmptyState({ icon: IconComp, title, description, action, className, compact = false, titleAs: Heading = 'h3' }) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', compact ? 'px-4 py-8' : 'px-6 py-14', className)}>
      <div className="relative mb-4">
        <div className="absolute inset-0 scale-150 rounded-full bg-primary-soft blur-xl" aria-hidden="true" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-white text-secondary shadow-[var(--shadow-card)]">
          {IconComp ? <IconComp className="h-7 w-7" aria-hidden="true" /> : <CircleAlert className="h-7 w-7" aria-hidden="true" />}
        </span>
      </div>
      <Heading className="text-base font-semibold text-ink">{title}</Heading>
      {description && <p className="mt-1 max-w-md text-sm text-muted">{description}</p>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  )
}

/* ---------- StatusBadge ---------- */
const STATUS_STYLES = {
  published: 'badge-success', active: 'badge-success', approved: 'badge-success', completed: 'badge-success', graded: 'badge-success', visible: 'badge-success', passed: 'badge-success', issued: 'badge-success',
  draft: 'badge-neutral', inactive: 'badge-neutral', 'not-started': 'badge-neutral', 'not-enrolled': 'badge-neutral',
  scheduled: 'badge-info', 'in-progress': 'badge-info', submitted: 'badge-info',
  pending: 'badge-warning', resubmit: 'badge-warning', archived: 'badge-warning',
  hidden: 'badge-danger', suspended: 'badge-danger', failed: 'badge-danger', overdue: 'badge-danger',
}
const STATUS_TEXT = { 'in-progress': 'In progress', 'not-started': 'Not started', resubmit: 'Resubmit requested', 'not-enrolled': 'Not enrolled' }

export function StatusBadge({ status, children, className }) {
  const label = children || STATUS_TEXT[status] || (status ? status.charAt(0).toUpperCase() + status.slice(1) : '')
  return <span className={cn('badge', STATUS_STYLES[status] || 'badge-neutral', className)}>{label}</span>
}

/* ---------- Demo pill ---------- */
export function DemoPill({ children = 'Sample data', className }) {
  return (
    <span className={cn('badge badge-accent', className)} title="Illustrative demo data — not real metrics">
      <FlaskConical className="h-3 w-3" aria-hidden="true" />
      {children}
    </span>
  )
}

/* ---------- Breadcrumbs ---------- */
export function Breadcrumbs({ items, tone = 'dark', className }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className={cn('flex flex-wrap items-center gap-1 text-sm', tone === 'light' ? 'text-white/75' : 'text-muted')}>
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {item.to && !last ? (
                <Link to={item.to} className={cn('rounded hover:underline', tone === 'light' ? 'hover:text-white' : 'hover:text-ink')}>{item.label}</Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={cn(last && (tone === 'light' ? 'text-white' : 'font-medium text-ink'), 'line-clamp-1')}>{item.label}</span>
              )}
              {!last && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* ---------- PageHeader ---------- */
export function PageHeader({ title, description, actions, breadcrumbs, eyebrow, className }) {
  return (
    <div className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-2" />}
        {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted sm:text-[15px]">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

/* ---------- StatCard ---------- */
export function StatCard({ label, value, icon: IconComp, hint, tone = 'primary', className }) {
  const tones = {
    primary: 'bg-primary-soft text-primary',
    info: 'bg-info-soft text-[#1F6F88]',
    accent: 'bg-accent-soft text-accent-ink',
    success: 'bg-success-soft text-success',
    warning: 'bg-warning-soft text-[#B45309]',
  }
  return (
    <div className={cn('card flex items-start gap-4 p-5', className)}>
      {IconComp && (
        <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', tones[tone])}>
          <IconComp className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted">{label}</p>
        <p className="mt-0.5 text-2xl font-bold tracking-tight text-ink">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      </div>
    </div>
  )
}

/* ---------- Field ---------- */
export function Field({ label, htmlFor, error, hint, required, children, className }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="label">
          {label}
          {required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="field-error" id={htmlFor ? `${htmlFor}-error` : undefined} role="alert">
          <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p className="hint" id={htmlFor ? `${htmlFor}-hint` : undefined}>{hint}</p>
      ) : null}
    </div>
  )
}

/* ---------- Toggle ---------- */
export function Toggle({ checked, onChange, label, description, id, disabled }) {
  return (
    <label htmlFor={id} className={cn('flex items-start justify-between gap-4', disabled ? 'opacity-60' : 'cursor-pointer')}>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-muted">{description}</span>}
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input id={id} type="checkbox" role="switch" className="peer sr-only" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
        <span className="h-6 w-11 rounded-full bg-slate-300 transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-info peer-focus-visible:ring-offset-2" aria-hidden="true" />
        <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" aria-hidden="true" />
      </span>
    </label>
  )
}

/* ---------- Skeletons ---------- */
export function CourseCardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="skeleton aspect-[16/9] rounded-none" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  )
}

export function Spinner({ className }) {
  return <span className={cn('inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent', className)} aria-hidden="true" />
}

/* ---------- Section heading ---------- */
export function SectionHeading({ eyebrow, title, description, action, className }) {
  return (
    <div className={cn('mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div>
        {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
        {description && <p className="mt-1.5 max-w-2xl text-[15px] text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
