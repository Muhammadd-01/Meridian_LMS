import { GlobePattern } from './BrandDecor'
import { cn } from '../../utils/cn'

/** Gradient welcome banner used at the top of the learner and admin dashboards. */
export default function DashboardHero({ eyebrow, title, subtitle, children, aside, className }) {
  return (
    <section className={cn('relative animate-page-in overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-deep via-primary to-secondary p-6 text-white shadow-[0_30px_60px_-30px_rgb(9_63_80/0.7)] sm:p-8', className)}>
      <div className="pointer-events-none absolute inset-0 bg-dots-light" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 animate-blob rounded-full bg-info/30 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-28 left-1/4 h-64 w-64 animate-blob rounded-full bg-accent/20 blur-3xl [animation-delay:-5s]" aria-hidden="true" />
      <GlobePattern className="pointer-events-none absolute -right-8 -bottom-10 hidden h-56 w-56 animate-spin-slow opacity-15 md:block" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          {eyebrow && <p className="text-sm font-medium text-white/75">{eyebrow}</p>}
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 max-w-xl text-sm text-white/80 sm:text-[15px]">{subtitle}</p>}
          {children && <div className="mt-5 flex flex-wrap gap-2">{children}</div>}
        </div>
        {aside && <div className="relative shrink-0">{aside}</div>}
      </div>
    </section>
  )
}
