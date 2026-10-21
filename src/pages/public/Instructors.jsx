import { useState } from 'react'
import { Users } from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import SearchInput from '../../components/common/SearchInput'
import { InstructorCard } from '../../components/courses/Cards'
import { EmptyState } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { searchItems } from '../../utils/query'

export default function Instructors() {
  useDocumentTitle('Instructors')
  const { instructors, courses } = useData()
  const [query, setQuery] = useState('')
  const active = instructors.filter((i) => i.status === 'active')
  const results = searchItems(active, query, ['name', 'title', 'organization', (i) => i.expertise])
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Instructors' }]} eyebrow="Faculty" title="Meet our instructors" description="Practitioners who bring real-world experience into every lesson. All instructor profiles are fictional.">
        <SearchInput className="mt-6 max-w-md" value={query} onChange={setQuery} placeholder="Search by name or expertise" label="Search instructors" />
      </PageHero>
      <div className="container-page py-12">
        {results.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((ins) => (
              <InstructorCard key={ins.id} instructor={ins} courseCount={courses.filter((c) => c.instructorId === ins.id && c.status === 'published').length} />
            ))}
          </div>
        ) : (
          <div className="card"><EmptyState icon={Users} title="No instructors found" description="Try a different name or area of expertise." action={<button type="button" className="btn btn-secondary" onClick={() => setQuery('')}>Clear search</button>} /></div>
        )}
      </div>
    </>
  )
}
