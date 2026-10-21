import { useId } from 'react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { AnimatedCounter } from '../common/Motion'
import { cn } from '../../utils/cn'

const TONES = {
  primary: { chip: 'from-primary to-deep', stroke: '#2C5F6F', glow: 'from-primary/15' },
  info: { chip: 'from-info to-secondary', stroke: '#2F95C8', glow: 'from-info/20' },
  accent: { chip: 'from-accent to-[#d96f00]', stroke: '#D97400', glow: 'from-accent/20' },
  success: { chip: 'from-[#16a34a] to-[#0f766e]', stroke: '#15803d', glow: 'from-success/20' },
  warning: { chip: 'from-[#f59e0b] to-[#d97706]', stroke: '#B45309', glow: 'from-warning/20' },
}

/** Change badge: positive is green, negative red; `invert` flips the colours (e.g. backlog going down is good). */
export function DeltaPill({ delta, invert = false, className }) {
  if (delta == null) return <span className={cn('inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-muted', className)}>New</span>
  const flat = delta === 0
  const good = invert ? delta < 0 : delta > 0
  const Icon = flat ? Minus : delta > 0 ? TrendingUp : TrendingDown
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums',
        flat ? 'bg-slate-100 text-muted' : good ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
        className,
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {delta > 0 ? '+' : ''}{delta}%
    </span>
  )
}

export function Sparkline({ data, color = '#2C5F6F', height = 44 }) {
  const id = useId().replace(/:/g, '')
  return (
    <div style={{ height }} className="w-full" aria-hidden="true">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data.map((v, i) => ({ i, v }))} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#spark-${id})`} isAnimationActive={false} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/** KPI tile with gradient icon, animated value, period-over-period change and a sparkline. */
export function KpiCard({ label, value, icon: Icon, tone = 'primary', delta, invertDelta, caption, series, className }) {
  const t = TONES[tone] || TONES.primary
  return (
    <div className={cn('card group relative flex h-full flex-col overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgb(9_63_80/0.45)]', className)}>
      <span className={cn('pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br to-transparent opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-100', t.glow)} aria-hidden="true" />
      <div className="relative flex items-start justify-between gap-3">
        <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-[0_10px_20px_-10px_rgb(9_63_80/0.8)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6', t.chip)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {delta !== undefined && <DeltaPill delta={delta} invert={invertDelta} />}
      </div>
      <p className="relative mt-4 text-[13px] font-medium text-muted">{label}</p>
      <p className="relative mt-0.5 text-3xl font-extrabold tracking-tight text-ink tabular-nums">
        {/\d/.test(String(value)) ? <AnimatedCounter value={String(value)} /> : value}
      </p>
      {caption && <p className="relative mt-1 text-xs text-muted">{caption}</p>}
      {series && <div className="relative -mx-5 mt-auto -mb-5 pt-3"><Sparkline data={series} color={t.stroke} /></div>}
    </div>
  )
}

/** Circular progress indicator (0–100). */
export function RingProgress({ value, size = 96, stroke = 9, track = 'rgb(255 255 255 / 0.15)', color = '#F78D00', children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  )
}

/** Card section with an icon heading and optional action on the right. */
export function Panel({ title, description, icon: Icon, action, children, className, bodyClassName }) {
  const headingId = useId()
  return (
    <section className={cn('card flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[0_24px_40px_-28px_rgb(9_63_80/0.45)]', className)} aria-labelledby={headingId}>
      <div className="flex items-start justify-between gap-3 border-b border-line/70 px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <h2 id={headingId} className="text-[15px] font-semibold text-ink">{title}</h2>
            {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className={cn('flex-1 p-5', bodyClassName)}>{children}</div>
    </section>
  )
}
