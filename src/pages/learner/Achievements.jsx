import { Lock } from 'lucide-react'
import Icon from '../../components/common/Icon'
import { PageHeader, ProgressBar, StatCard } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useNow } from '../../hooks/useUtils'
import { getAchievements, getLearnerStats } from '../../utils/learning'
import { Flame, CircleCheck, Award } from 'lucide-react'
import { cn } from '../../utils/cn'

export default function Achievements() {
  useDocumentTitle('Achievements')
  const data = useData()
  const { user } = useAuth()
  const now = useNow()
  const achievements = getAchievements(data, user.id, now)
  const stats = getLearnerStats(data, user.id, now)
  const unlocked = achievements.filter((a) => a.unlocked).length

  return (
    <div>
      <PageHeader title="Achievements" description="Badges are calculated from your real activity in this demo — lessons, quizzes, streaks and more." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Badges unlocked" value={`${unlocked} / ${achievements.length}`} icon={Award} tone="accent" />
        <StatCard label="Lessons completed" value={stats.lessonsCompleted} icon={CircleCheck} tone="success" />
        <StatCard label="Current streak" value={`${stats.streak} days`} icon={Flame} tone="info" />
      </div>
      <ProgressBar value={(unlocked / achievements.length) * 100} className="mt-6" showLabel label="Badges unlocked" tone="accent" />
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a) => (
          <li key={a.id} className={cn('card flex items-center gap-4 p-5', !a.unlocked && 'bg-slate-50')}>
            <span className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl', a.unlocked ? 'bg-accent text-ink shadow-sm' : 'bg-slate-200 text-slate-400')}>
              {a.unlocked ? <Icon name={a.icon} className="h-7 w-7" /> : <Lock className="h-6 w-6" aria-hidden="true" />}
            </span>
            <div>
              <h2 className={cn('font-semibold', a.unlocked ? 'text-ink' : 'text-slate-500')}>{a.title}</h2>
              <p className="text-sm text-muted">{a.description}</p>
              <p className={cn('mt-1 text-xs font-semibold', a.unlocked ? 'text-success' : 'text-slate-400')}>{a.unlocked ? 'Unlocked' : 'Locked'}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
