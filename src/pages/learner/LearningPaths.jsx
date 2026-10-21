import { Link } from 'react-router-dom'
import { CircleCheck, Circle, ArrowRight } from 'lucide-react'
import SmartImage from '../../components/common/SmartImage'
import { PageHeader, ProgressBar } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { pathProgress } from '../../utils/learning'

export default function LearningPaths() {
  useDocumentTitle('Learning paths')
  const data = useData()
  const { user } = useAuth()
  const paths = data.careerPaths
    .map((path) => ({ path, ...pathProgress(data, user.id, path) }))
    .sort((a, b) => b.percent - a.percent)

  return (
    <div>
      <PageHeader title="Learning Paths" description="Track your progress through curated career paths. Progress is the average completion of each path’s courses." />
      <div className="grid gap-5 lg:grid-cols-2">
        {paths.map(({ path, items, percent, completed }) => (
          <article key={path.id} className="card overflow-hidden">
            <div className="flex gap-4 p-5">
              <SmartImage src={path.image} alt="" seed={path.id} fallbackLabel={path.title} className="h-20 w-20 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-ink">{path.title}</h2>
                <p className="line-clamp-2 text-sm text-muted">{path.description}</p>
                <div className="mt-3 flex items-center gap-3">
                  <ProgressBar value={percent} className="flex-1" label={`${path.title} progress`} />
                  <span className="text-sm font-semibold">{percent}%</span>
                </div>
                <p className="mt-1 text-xs text-muted">{completed} of {items.length} courses completed · ~{path.estimatedHours} hours</p>
              </div>
            </div>
            <ul className="divide-y divide-line border-t border-line">
              {items.map(({ course, percent: p, enrollment }) => (
                <li key={course.id} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                  {p >= 100 ? <CircleCheck className="h-4 w-4 text-success" aria-label="Completed" /> : <Circle className="h-4 w-4 text-slate-300" aria-label="Not completed" />}
                  <Link to={enrollment ? `/learn/course/${course.id}` : `/courses/${course.slug}`} className="min-w-0 flex-1 truncate hover:underline">{course.title}</Link>
                  <span className="text-xs text-muted">{enrollment ? `${p}%` : 'Not enrolled'}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-line bg-slate-50 px-5 py-3">
              <Link to={`/career-paths/${path.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:underline">View path details <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
