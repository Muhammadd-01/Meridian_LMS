import { Breadcrumbs } from '../common/ui'
import { Reveal } from '../common/Motion'

/** Branded heading band for public listing and information pages, with soft animated shapes. */
export default function PageHero({ eyebrow, title, description, breadcrumbs, children }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-mesh">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-60" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 animate-blob rounded-full bg-info/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 animate-blob rounded-full bg-accent/15 blur-3xl [animation-delay:-5s]" aria-hidden="true" />
      <div className="relative container-page py-12 sm:py-16">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <Reveal>
          {eyebrow && (
            <p className="eyebrow mt-5 flex items-center gap-2">
              <span className="h-0.5 w-6 rounded-full bg-gradient-to-r from-accent to-info" aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          <h1 className="mt-2 max-w-3xl text-3xl font-extrabold tracking-tight text-deep sm:text-[42px] sm:leading-tight">{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-lg text-slate-600">{description}</p>}
        </Reveal>
        {children && <Reveal delay={120}>{children}</Reveal>}
      </div>
    </section>
  )
}
