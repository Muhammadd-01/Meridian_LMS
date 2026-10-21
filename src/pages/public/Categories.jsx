import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import Icon from '../../components/common/Icon'
import { Reveal } from '../../components/common/Motion'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function Categories() {
  useDocumentTitle('Categories')
  const { categories, courses } = useData()
  const published = courses.filter((c) => c.status === 'published')
  const sorted = [...categories].sort((a, b) => a.order - b.order)
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Categories' }]} eyebrow="Browse" title="All categories" description="Choose a subject area to see every course, from beginner introductions to advanced specialisations." />
      <div className="container-page grid gap-5 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((cat, i) => {
          const list = published.filter((c) => c.categoryId === cat.id)
          return (
            <Reveal key={cat.id} delay={(i % 3) * 80} className="h-full">
            <article className="card card-hover card-glow group relative flex h-full flex-col overflow-hidden p-6">
              <span className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-info/0 to-accent/0 transition-all duration-500 group-hover:scale-150 group-hover:from-info/15 group-hover:to-accent/15" aria-hidden="true" />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white"><Icon name={cat.icon} className="h-6 w-6" /></span>
              <h2 className="mt-4 text-lg font-semibold text-ink">
                <Link to={`/courses?category=${cat.slug}`} className="after:absolute after:inset-0 group-hover:underline">{cat.name}</Link>
              </h2>
              <p className="mt-1 text-sm text-muted">{cat.description}</p>
              <ul className="mt-4 space-y-1 text-sm text-slate-700">
                {list.slice(0, 3).map((c) => <li key={c.id} className="truncate">• {c.title}</li>)}
                {!list.length && <li className="text-muted">New courses coming soon.</li>}
              </ul>
              <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-secondary">
                {list.length} course{list.length === 1 ? '' : 's'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </article>
            </Reveal>
          )
        })}
      </div>
    </>
  )
}
