import { Breadcrumbs } from '../common/ui'

/** Compact branded heading band used by public listing and information pages. */
export default function PageHero({ eyebrow, title, description, breadcrumbs, children }) {
  return (
    <section className="border-b border-line bg-gradient-to-b from-[#EAF3F5] to-page">
      <div className="container-page py-10 sm:py-14">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        {eyebrow && <p className="eyebrow mt-4">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-deep sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-lg text-slate-600">{description}</p>}
        {children}
      </div>
    </section>
  )
}
