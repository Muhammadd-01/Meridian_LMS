import PageHero from '../../components/layout/PageHero'
import { CareerPathCard } from '../../components/courses/Cards'
import { Reveal } from '../../components/common/Motion'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { pathProgress } from '../../utils/learning'

export default function CareerPaths() {
  useDocumentTitle('Career paths')
  const data = useData()
  const { user } = useAuth()
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Career paths' }]} eyebrow="Learning journeys" title="Career paths" description="Structured sequences of courses with a skills roadmap, time estimate and completion checklist — so you always know what to learn next." />
      <div className="container-page grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {data.careerPaths.map((path, i) => (
          <Reveal key={path.id} delay={(i % 3) * 90} className="h-full">
            <CareerPathCard path={path} progress={user?.role === 'learner' ? pathProgress(data, user.id, path).percent : undefined} />
          </Reveal>
        ))}
      </div>
    </>
  )
}
