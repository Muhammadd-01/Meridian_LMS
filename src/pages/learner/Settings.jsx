import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RotateCcw, LogOut, Database, Save } from 'lucide-react'
import { PageHeader, Toggle, Field } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useConfirm } from '../../context/ConfirmContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useSignOut } from '../../hooks/useSignOut'
import { DEFAULT_NOTIFICATION_PREFS } from '../../data/users'
import { readJSON, writeJSON, STORAGE_KEYS } from '../../services/storage'

const PREFS = [
  { key: 'courseUpdates', label: 'Course updates', description: 'Enrolment confirmations, instructor replies and grading results.' },
  { key: 'announcements', label: 'Announcements', description: 'Platform and course announcements from the Meridian team.' },
  { key: 'deadlineReminders', label: 'Deadline reminders', description: 'Reminders before assignments are due.' },
  { key: 'weeklySummary', label: 'Weekly summary', description: 'A recap of your study time and progress (demo only — nothing is emailed).' },
  { key: 'marketing', label: 'Product news', description: 'Occasional news about new features and courses.' },
]

export default function LearnerSettings() {
  useDocumentTitle('Settings')
  const { actions } = useData()
  const { user } = useAuth()
  const signOut = useSignOut()
  const toast = useToast()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [prefs, setPrefs] = useState({ ...DEFAULT_NOTIFICATION_PREFS, ...user.notificationPrefs })
  const [goal, setGoal] = useState(user.weeklyGoalHours ?? 3)
  const [reduceMotion, setReduceMotion] = useState(() => Boolean(readJSON(STORAGE_KEYS.ui, {})?.reduceMotion))

  const save = () => {
    const hours = Number(goal)
    if (!Number.isFinite(hours) || hours < 1 || hours > 40) {
      toast.error('Weekly goal must be between 1 and 40 hours.')
      return
    }
    actions.updateUser(user.id, { notificationPrefs: prefs, weeklyGoalHours: hours })
    toast.success('Settings saved locally.')
  }

  const toggleMotion = (value) => {
    setReduceMotion(value)
    writeJSON(STORAGE_KEYS.ui, { ...readJSON(STORAGE_KEYS.ui, {}), reduceMotion: value })
    document.documentElement.classList.toggle('reduce-motion', value)
  }

  const reset = async () => {
    const ok = await confirm({
      title: 'Reset all demo data?',
      message: 'This restores the original sample catalogue and removes every change made in this browser — enrolments, progress, notes, quiz attempts and admin edits. Your sign-in session is kept if your account still exists.',
      confirmLabel: 'Reset demo data',
      tone: 'danger',
    })
    if (!ok) return
    actions.resetDemoData()
    toast.success('Demo data has been reset to the original sample data.')
    navigate('/learn/dashboard')
  }

  return (
    <div>
      <PageHeader title="Settings" description="Notification preferences, goals and demo data controls." actions={<button type="button" className="btn btn-primary" onClick={save}><Save className="h-4 w-4" aria-hidden="true" />Save changes</button>} />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6" aria-labelledby="ntf-title">
          <h2 id="ntf-title" className="text-base font-semibold">Notification preferences</h2>
          <p className="mt-1 text-sm text-muted">Choose what appears in your notification centre. Announcements respect this setting.</p>
          <div className="mt-5 space-y-5">
            {PREFS.map((p) => (
              <Toggle key={p.key} id={`pref-${p.key}`} label={p.label} description={p.description} checked={Boolean(prefs[p.key])} onChange={(v) => setPrefs((s) => ({ ...s, [p.key]: v }))} />
            ))}
          </div>
        </section>
        <div className="space-y-6">
          <section className="card p-6" aria-labelledby="goal-title">
            <h2 id="goal-title" className="text-base font-semibold">Learning goal & display</h2>
            <Field label="Weekly learning goal (hours)" htmlFor="set-goal" hint="Shown on your dashboard and in the sidebar." className="mt-4">
              <input id="set-goal" type="number" min={1} max={40} className="input max-w-[160px]" value={goal} onChange={(e) => setGoal(e.target.value)} />
            </Field>
            <div className="mt-5">
              <Toggle id="pref-motion" label="Reduce motion" description="Minimise animations across the app on this device (also follows your system setting)." checked={reduceMotion} onChange={toggleMotion} />
            </div>
          </section>
          <section className="card p-6" aria-labelledby="data-title">
            <h2 id="data-title" className="flex items-center gap-2 text-base font-semibold"><Database className="h-4 w-4 text-secondary" aria-hidden="true" />Demo data</h2>
            <p className="mt-1 text-sm text-muted">All data lives in this browser’s LocalStorage. It is not secure storage and is not synced to any server.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className="btn btn-danger-ghost border border-danger/30" onClick={reset}><RotateCcw className="h-4 w-4" aria-hidden="true" />Reset demo data</button>
              <button type="button" className="btn btn-secondary" onClick={signOut}><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
