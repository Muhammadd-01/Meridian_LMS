import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ListChecks, Timer } from 'lucide-react'
import Modal from '../../components/common/Modal'
import ChartCard from '../../components/charts/ChartCard'
import { EmptyState, Field, PageHeader } from '../../components/common/ui'
import { axisProps, tooltipProps, CHART_PRIMARY, CHART_GRID } from '../../components/charts/chartTheme'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useConfirm } from '../../context/ConfirmContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { uid } from '../../utils/ids'
import { cn } from '../../utils/cn'

const blankQuestion = () => ({ id: uid('q'), text: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' })

function QuizEditor({ quiz, onSave, onCancel }) {
  const confirm = useConfirm()
  const [form, setForm] = useState(() => (quiz ? JSON.parse(JSON.stringify(quiz)) : { title: '', description: '', passThreshold: 70, timeLimitMinutes: 0, questions: [blankQuestion()] }))
  const [errors, setErrors] = useState({})
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const setQ = (qi, patch) => set('questions', form.questions.map((q, i) => (i === qi ? { ...q, ...patch } : q)))
  const moveQ = (qi, dir) => {
    const t = qi + dir
    if (t < 0 || t >= form.questions.length) return
    const next = [...form.questions]
    ;[next[qi], next[t]] = [next[t], next[qi]]
    set('questions', next)
  }

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.title.trim()) next.title = 'Title is required.'
    const pass = Number(form.passThreshold)
    if (!(pass >= 1 && pass <= 100)) next.passThreshold = 'Between 1 and 100.'
    if (Number(form.timeLimitMinutes) < 0) next.timeLimitMinutes = 'Use 0 for untimed.'
    if (!form.questions.length) next.questions = 'Add at least one question.'
    form.questions.forEach((q, qi) => {
      if (!q.text.trim()) next[`q${qi}`] = 'Question text is required.'
      else if (q.options.filter((o) => o.trim()).length < 2) next[`q${qi}`] = 'Provide at least two answer options.'
      else if (!q.options[q.correctIndex]?.trim()) next[`q${qi}`] = 'The correct answer cannot be empty.'
    })
    setErrors(next)
    if (Object.keys(next).length) return
    if (quiz && !(await confirm({ title: 'Save quiz changes?', message: 'Learners will see the updated questions on their next attempt. Past attempt scores are kept as recorded.', confirmLabel: 'Save quiz' }))) return
    onSave({
      ...form,
      title: form.title.trim(),
      passThreshold: pass,
      timeLimitMinutes: Number(form.timeLimitMinutes) || 0,
      questions: form.questions.map((q) => {
        const kept = q.options.map((o, i) => ({ o: o.trim(), i })).filter((x) => x.o)
        return { ...q, text: q.text.trim(), options: kept.map((x) => x.o), correctIndex: Math.max(0, kept.findIndex((x) => x.i === q.correctIndex)) }
      }),
    })
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Quiz title" htmlFor="qz-title" error={errors.title} required className="sm:col-span-2"><input id="qz-title" className={cn('input', errors.title && 'input-invalid')} value={form.title} onChange={(e) => set('title', e.target.value)} data-autofocus /></Field>
        <Field label="Instructions / description" htmlFor="qz-desc" className="sm:col-span-2"><textarea id="qz-desc" rows={2} className="input" value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>
        <Field label="Pass threshold (%)" htmlFor="qz-pass" error={errors.passThreshold}><input id="qz-pass" type="number" min={1} max={100} className={cn('input', errors.passThreshold && 'input-invalid')} value={form.passThreshold} onChange={(e) => set('passThreshold', e.target.value)} /></Field>
        <Field label="Time limit (minutes)" htmlFor="qz-time" error={errors.timeLimitMinutes} hint="0 = untimed. Client-side timer only."><input id="qz-time" type="number" min={0} className="input" value={form.timeLimitMinutes} onChange={(e) => set('timeLimitMinutes', e.target.value)} /></Field>
      </div>
      <div className="space-y-3">
        <p className="label">Questions ({form.questions.length})</p>
        {errors.questions && <p className="field-error">{errors.questions}</p>}
        {form.questions.map((q, qi) => (
          <fieldset key={q.id} className={cn('rounded-xl border p-4', errors[`q${qi}`] ? 'border-danger/50' : 'border-line')}>
            <legend className="sr-only">Question {qi + 1}</legend>
            <div className="flex items-start gap-2">
              <span className="mt-2 text-sm font-bold text-muted">{qi + 1}.</span>
              <div className="flex-1">
                <label htmlFor={`qt-${q.id}`} className="sr-only">Question text</label>
                <input id={`qt-${q.id}`} className="input" placeholder="Question text" value={q.text} onChange={(e) => setQ(qi, { text: e.target.value })} />
              </div>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => moveQ(qi, -1)} disabled={qi === 0} aria-label="Move question up"><ArrowUp className="h-4 w-4" /></button>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => moveQ(qi, 1)} disabled={qi === form.questions.length - 1} aria-label="Move question down"><ArrowDown className="h-4 w-4" /></button>
              <button type="button" className="btn btn-danger-ghost btn-icon" onClick={() => set('questions', form.questions.filter((_, i) => i !== qi))} aria-label="Delete question"><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="mt-3 grid gap-2 pl-6 sm:grid-cols-2">
              {q.options.map((opt, oi) => (
                <label key={oi} className={cn('flex items-center gap-2 rounded-lg border px-2 py-1.5', q.correctIndex === oi ? 'border-success/50 bg-success-soft' : 'border-line')}>
                  <input type="radio" name={`correct-${q.id}`} className="checkbox" checked={q.correctIndex === oi} onChange={() => setQ(qi, { correctIndex: oi })} aria-label={`Mark option ${oi + 1} as correct`} />
                  <input className="w-full bg-transparent text-sm outline-none" placeholder={`Option ${String.fromCharCode(65 + oi)}`} value={opt} onChange={(e) => setQ(qi, { options: q.options.map((o, j) => (j === oi ? e.target.value : o)) })} aria-label={`Option ${oi + 1}`} />
                </label>
              ))}
            </div>
            <div className="mt-2 pl-6">
              <label htmlFor={`qe-${q.id}`} className="sr-only">Explanation</label>
              <input id={`qe-${q.id}`} className="input text-sm" placeholder="Explanation shown after submission" value={q.explanation} onChange={(e) => setQ(qi, { explanation: e.target.value })} />
              {errors[`q${qi}`] && <p className="field-error">{errors[`q${qi}`]}</p>}
              <p className="hint">Select the radio button next to the correct answer. Empty options are removed on save.</p>
            </div>
          </fieldset>
        ))}
        <button type="button" className="btn btn-outline w-full border-dashed" onClick={() => set('questions', [...form.questions, blankQuestion()])}><Plus className="h-4 w-4" aria-hidden="true" />Add question</button>
      </div>
      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save quiz</button>
      </div>
    </form>
  )
}

export default function AdminAssessments() {
  useDocumentTitle('Quizzes')
  const { quizzes, quizAttempts, courses, actions } = useData()
  const toast = useToast()
  const [editing, setEditing] = useState(null)

  const stats = quizzes.map((q) => {
    const attempts = quizAttempts.filter((a) => a.quizId === q.id)
    const usedIn = courses.filter((c) => c.modules.some((m) => m.lessons.some((l) => l.quizId === q.id)))
    return {
      quiz: q,
      attempts: attempts.length,
      avg: attempts.length ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length) : 0,
      passRate: attempts.length ? Math.round((attempts.filter((a) => a.passed).length / attempts.length) * 100) : 0,
      usedIn,
    }
  })
  const chartData = stats.filter((s) => s.attempts).map((s) => ({ name: s.quiz.title.replace(/ (Fundamentals|Essentials|Basics|Concepts|Principles)$/, ''), full: s.quiz.title, avg: s.avg, attempts: s.attempts }))

  const save = (quiz) => {
    actions.saveQuiz(quiz)
    toast.success(quiz.id ? 'Quiz updated. Learners see the changes on their next attempt.' : 'Quiz created. Add it to a course from the course editor.')
    setEditing(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Quizzes & assessments" description="Create questions, configure pass thresholds and review assessment performance." breadcrumbs={[{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Quizzes' }]} actions={<button type="button" className="btn btn-primary" onClick={() => setEditing({})}><Plus className="h-4 w-4" aria-hidden="true" />New quiz</button>} />

      <ChartCard title="Assessment performance" description="Average score per quiz across all recorded attempts" table={{ columns: [{ key: 'full', label: 'Quiz' }, { key: 'avg', label: 'Average score (%)' }, { key: 'attempts', label: 'Attempts' }], rows: chartData }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={CHART_GRID} strokeDasharray="3 3" />
            <XAxis dataKey="name" {...axisProps} interval={0} tick={{ fill: '#64748B', fontSize: 11 }} />
            <YAxis {...axisProps} axisLine={false} domain={[0, 100]} unit="%" />
            <Tooltip {...tooltipProps} labelFormatter={(_, p) => p?.[0]?.payload?.full} formatter={(v, n) => (n === 'avg' ? [`${v}%`, 'Average score'] : [v, n])} />
            <Bar dataKey="avg" fill={CHART_PRIMARY} radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ quiz, attempts, avg, passRate, usedIn }) => (
          <article key={quiz.id} className="card flex flex-col p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"><ListChecks className="h-5 w-5" aria-hidden="true" /></span>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-ink">{quiz.title}</h2>
                <p className="text-xs text-muted">{quiz.questions.length} questions · pass {quiz.passThreshold}%{quiz.timeLimitMinutes ? <> · <Timer className="inline h-3 w-3" aria-hidden="true" /> {quiz.timeLimitMinutes} min</> : ' · untimed'}</p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-lg bg-slate-50 p-2"><dt className="text-[11px] text-muted">Attempts</dt><dd className="font-semibold">{attempts}</dd></div>
              <div className="rounded-lg bg-slate-50 p-2"><dt className="text-[11px] text-muted">Avg score</dt><dd className="font-semibold">{attempts ? `${avg}%` : '—'}</dd></div>
              <div className="rounded-lg bg-slate-50 p-2"><dt className="text-[11px] text-muted">Pass rate</dt><dd className="font-semibold">{attempts ? `${passRate}%` : '—'}</dd></div>
            </dl>
            <p className="mt-3 line-clamp-2 text-xs text-muted">Used in: {usedIn.length ? usedIn.map((c) => c.title).join(', ') : 'not assigned to a course'}</p>
            <button type="button" className="btn btn-secondary btn-sm mt-auto self-start" style={{ marginTop: 16 }} onClick={() => setEditing(quiz)}><Pencil className="h-4 w-4" aria-hidden="true" />Edit questions</button>
          </article>
        ))}
        {!quizzes.length && <div className="card md:col-span-2 xl:col-span-3"><EmptyState icon={ListChecks} title="No quizzes yet" /></div>}
      </div>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.id ? `Edit quiz: ${editing.title}` : 'New quiz'} size="xl">
        {editing && <QuizEditor quiz={editing.id ? editing : null} onSave={save} onCancel={() => setEditing(null)} />}
      </Modal>
    </div>
  )
}
