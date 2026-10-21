import PageHero from '../../components/layout/PageHero'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

/** Shared layout for the Terms and Privacy pages: section nav + readable prose. */
export default function LegalPage({ title, intro, updated, sections }) {
  useDocumentTitle(title)
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: title }]} eyebrow="Legal" title={title} description={intro} />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[240px_1fr]">
        <nav aria-label={`${title} sections`} className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 text-sm">
            {sections.map((s, i) => (
              <li key={s.title}><a href={`#section-${i}`} className="block rounded-lg px-3 py-1.5 text-muted hover:bg-white hover:text-ink">{s.title}</a></li>
            ))}
          </ul>
        </nav>
        <article className="card max-w-3xl p-6 sm:p-10">
          <p className="text-sm text-muted">Last updated: {updated} · Sample document for a demonstration project</p>
          {sections.map((s, i) => (
            <section key={s.title} id={`section-${i}`} className="mt-8 scroll-mt-24">
              <h2 className="text-lg font-semibold text-ink">{i + 1}. {s.title}</h2>
              {s.body.map((p) => <p key={p.slice(0, 24)} className="mt-3 leading-7 text-slate-700">{p}</p>)}
            </section>
          ))}
        </article>
      </div>
    </>
  )
}
