import { useEffect, useRef, useState } from 'react'
import { Timer, CircleCheck, CircleX, RotateCcw, ArrowLeft, ArrowRight, ListChecks, History, Eye, TriangleAlert } from 'lucide-react'
import Modal from '../common/Modal'
import { StatusBadge } from '../common/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { formatClock, formatDateTime } from '../../utils/format'
import { cn } from '../../utils/cn'

function ScoreRing({ score, passed }) {
  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r="50" fill="none" stroke="#E2E8F0" strokeWidth="12" />
        <circle cx="60" cy="60" r="50" fill="none" stroke={passed ? '#15803D' : '#DC2626'} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(score / 100) * 314} 314`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-ink">{score}%</span>
        <span className="text-xs text-muted">score</span>
      </div>
    </div>
  )
}

function AnswerReview({ quiz, answers }) {
  return (
    <ol className="space-y-4">
      {quiz.questions.map((q, qi) => {
        const chosen = answers?.[q.id]
        const correct = chosen === q.correctIndex
        return (
          <li key={q.id} className="rounded-xl border border-line p-4">
            <div className="flex items-start gap-2">
              {correct ? <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-label="Correct" /> : <CircleX className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-label="Incorrect" />}
              <p className="font-medium text-ink"><span className="text-muted">Q{qi + 1}.</span> {q.text}</p>
            </div>
            <ul className="mt-3 space-y-1.5 pl-7">
              {q.options.map((opt, oi) => {
                const isCorrect = oi === q.correctIndex
                const isChosen = oi === chosen
                return (
                  <li key={oi} className={cn('flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm', isCorrect ? 'border-success/40 bg-success-soft' : isChosen ? 'border-danger/40 bg-danger-soft' : 'border-line')}>
                    <span>{opt}</span>
                    <span className="shrink-0 text-xs font-semibold">
                      {isCorrect && <span className="text-success">Correct answer</span>}
                      {isChosen && !isCorrect && <span className="text-danger">Your answer</span>}
                      {isChosen && isCorrect && <span className="text-success"> · Your answer</span>}
                    </span>
                  </li>
                )
              })}
              {chosen == null && <li className="text-xs font-medium text-warning">Not answered</li>}
            </ul>
            <p className="mt-3 ml-7 rounded-lg bg-info-soft px-3 py-2 text-sm text-slate-700"><strong>Explanation:</strong> {q.explanation}</p>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * Multiple-choice quiz with navigation grid, optional client-side timer, scoring,
 * explanations, retakes and persistent attempt history.
 */
export default function QuizRunner({ quiz, course, lesson, user, onContinue }) {
  const { quizAttempts, actions } = useData()
  const toast = useToast()
  const [mode, setMode] = useState('intro')
  const [answers, setAnswers] = useState({})
  const [index, setIndex] = useState(0)
  const [startedAt, setStartedAt] = useState(null)
  const [deadline, setDeadline] = useState(null)
  const [remaining, setRemaining] = useState(null)
  const [result, setResult] = useState(null)
  const [reviewAttempt, setReviewAttempt] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const submitRef = useRef(null)

  const attempts = quizAttempts
    .filter((a) => a.userId === user.id && a.lessonId === lesson.id)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
  const best = attempts.reduce((m, a) => Math.max(m, a.score), 0)
  const timed = Number(quiz.timeLimitMinutes) > 0

  const submit = (timedOut = false) => {
    setConfirmOpen(false)
    const attempt = actions.recordQuizAttempt({ userId: user.id, quizId: quiz.id, courseId: course.id, lessonId: lesson.id, answers, startedAt, timedOut })
    if (!attempt) {
      toast.error('This quiz could not be found.')
      return
    }
    setResult(attempt)
    setMode('result')
    setDeadline(null)
    if (timedOut) toast.warning('Time is up — your answers were submitted automatically.')
    else if (attempt.passed) toast.success(`Quiz passed with ${attempt.score}%. Lesson marked as complete.`)
    else toast.warning(`You scored ${attempt.score}%. The pass mark is ${quiz.passThreshold}% — review and try again.`)
  }

  useEffect(() => {
    submitRef.current = submit
  })

  useEffect(() => {
    if (mode !== 'taking' || !deadline) return undefined
    const tick = () => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000))
      setRemaining(left)
      if (left <= 0) {
        clearInterval(id)
        submitRef.current?.(true)
      }
    }
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [mode, deadline])

  const start = () => {
    const now = Date.now()
    setAnswers({})
    setIndex(0)
    setResult(null)
    setStartedAt(new Date(now).toISOString())
    if (timed) {
      setDeadline(now + quiz.timeLimitMinutes * 60 * 1000)
      setRemaining(quiz.timeLimitMinutes * 60)
    }
    setMode('taking')
  }

  if (!quiz.questions.length) {
    return <p className="rounded-xl border border-line p-6 text-sm text-muted">This quiz has no questions yet.</p>
  }

  if (mode === 'taking') {
    const question = quiz.questions[index]
    const answeredCount = Object.keys(answers).length
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-slate-50 px-4 py-3">
          <p className="text-sm font-medium text-ink">Question {index + 1} of {quiz.questions.length} · {answeredCount} answered</p>
          {timed && remaining != null && (
            <p className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold tabular-nums', remaining <= 60 ? 'bg-danger-soft text-danger' : 'bg-white text-ink')} role="timer" aria-live={remaining <= 60 ? 'polite' : 'off'}>
              <Timer className="h-4 w-4" aria-hidden="true" />{formatClock(remaining)} left
            </p>
          )}
        </div>

        <fieldset className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <legend className="sr-only">Question {index + 1}</legend>
          <p className="text-lg font-semibold text-ink">{question.text}</p>
          <div className="mt-5 space-y-2.5" role="radiogroup" aria-label={`Answers for question ${index + 1}`}>
            {question.options.map((opt, oi) => {
              const selected = answers[question.id] === oi
              return (
                <label key={oi} className={cn('flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors', selected ? 'border-primary bg-primary-soft ring-1 ring-primary' : 'border-line hover:border-slate-300 hover:bg-slate-50')}>
                  <input type="radio" name={`q-${question.id}`} className="checkbox" checked={selected} onChange={() => setAnswers((a) => ({ ...a, [question.id]: oi }))} />
                  <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold', selected ? 'border-primary bg-primary text-white' : 'border-slate-300 text-muted')}>{String.fromCharCode(65 + oi)}</span>
                  <span className="text-ink">{opt}</span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" className="btn btn-secondary" onClick={() => setIndex((i) => i - 1)} disabled={index === 0}><ArrowLeft className="h-4 w-4" aria-hidden="true" />Previous</button>
          {index < quiz.questions.length - 1 ? (
            <button type="button" className="btn btn-primary" onClick={() => setIndex((i) => i + 1)}>Next<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
          ) : (
            <button type="button" className="btn btn-accent" onClick={() => setConfirmOpen(true)}>Submit quiz</button>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">Question navigator</p>
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((q, qi) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setIndex(qi)}
                aria-label={`Go to question ${qi + 1}${answers[q.id] != null ? ', answered' : ', not answered'}`}
                aria-current={qi === index ? 'step' : undefined}
                className={cn('h-9 w-9 rounded-lg border text-sm font-semibold', answers[q.id] != null ? 'border-primary bg-primary text-white' : 'border-line bg-white text-ink hover:bg-slate-50', qi === index && 'ring-2 ring-accent ring-offset-1')}
              >
                {qi + 1}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn-ghost btn-sm mt-3 text-secondary" onClick={() => setConfirmOpen(true)}>Submit now</button>
        </div>

        <Modal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          size="sm"
          title="Submit your answers?"
          footer={(
            <>
              <button type="button" className="btn btn-secondary" onClick={() => setConfirmOpen(false)}>Keep working</button>
              <button type="button" className="btn btn-primary" onClick={() => submit(false)}>Submit quiz</button>
            </>
          )}
        >
          <p className="text-sm text-muted">You answered {answeredCount} of {quiz.questions.length} questions.</p>
          {answeredCount < quiz.questions.length && (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-warning-soft p-3 text-sm text-[#92400E]"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />Unanswered questions will be marked incorrect.</p>
          )}
        </Modal>
      </div>
    )
  }

  if (mode === 'result' && result) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-white p-6 text-center sm:flex-row sm:text-left">
          <ScoreRing score={result.score} passed={result.passed} />
          <div className="flex-1">
            <StatusBadge status={result.passed ? 'passed' : 'failed'}>{result.passed ? 'Passed' : 'Not passed'}</StatusBadge>
            <h3 className="mt-2 text-xl font-bold text-ink">{result.passed ? 'Great work!' : 'Almost there'}</h3>
            <p className="mt-1 text-sm text-muted">
              You answered {result.correctCount} of {result.total} correctly. Pass mark: {quiz.passThreshold}%.
              {result.timedOut && ' Time expired, so the quiz was submitted automatically.'}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              <button type="button" className="btn btn-secondary" onClick={() => setMode('review')}><Eye className="h-4 w-4" aria-hidden="true" />Review answers</button>
              <button type="button" className="btn btn-secondary" onClick={start}><RotateCcw className="h-4 w-4" aria-hidden="true" />Retake quiz</button>
              {result.passed && onContinue && <button type="button" className="btn btn-primary" onClick={onContinue}>Continue<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if ((mode === 'review' && result) || reviewAttempt) {
    const attempt = reviewAttempt || result
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-ink">Answer review</h3>
            <p className="text-sm text-muted">Attempt on {formatDateTime(attempt.submittedAt)} · {attempt.score}% ({attempt.passed ? 'passed' : 'not passed'})</p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setReviewAttempt(null); setMode('intro') }}><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back</button>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => { setReviewAttempt(null); start() }}><RotateCcw className="h-4 w-4" aria-hidden="true" />Retake</button>
          </div>
        </div>
        <AnswerReview quiz={quiz} answers={attempt.answers} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-white p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"><ListChecks className="h-6 w-6" aria-hidden="true" /></span>
          <div>
            <h3 className="text-lg font-semibold text-ink">{quiz.title}</h3>
            <p className="mt-1 text-sm text-muted">{quiz.description}</p>
          </div>
        </div>
        <ul className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <li className="rounded-lg bg-slate-50 p-3"><span className="block text-xs text-muted">Questions</span><span className="font-semibold">{quiz.questions.length} multiple choice</span></li>
          <li className="rounded-lg bg-slate-50 p-3"><span className="block text-xs text-muted">Pass mark</span><span className="font-semibold">{quiz.passThreshold}%</span></li>
          <li className="rounded-lg bg-slate-50 p-3"><span className="block text-xs text-muted">Time limit</span><span className="font-semibold">{timed ? `${quiz.timeLimitMinutes} minutes` : 'Untimed'}</span></li>
        </ul>
        <div className="mt-4 rounded-lg border border-line p-3 text-sm text-slate-700">
          <p className="font-medium text-ink">Instructions</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-muted">
            <li>Choose one answer per question. You can move between questions freely before submitting.</li>
            <li>Passing marks this lesson complete. You can retake the quiz as many times as you like.</li>
            {timed && <li>The timer runs in your browser only and submits automatically when it reaches zero.</li>}
          </ul>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-accent" onClick={start}>{attempts.length ? 'Retake quiz' : 'Start quiz'}</button>
          {attempts.length > 0 && <p className="text-sm text-muted">Best score: <strong className="text-ink">{best}%</strong></p>}
        </div>
      </div>

      <section aria-labelledby={`history-${lesson.id}`}>
        <h3 id={`history-${lesson.id}`} className="flex items-center gap-2 text-sm font-semibold text-ink"><History className="h-4 w-4" aria-hidden="true" />Attempt history</h3>
        {attempts.length ? (
          <div className="mt-3 overflow-x-auto rounded-xl border border-line">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-600 uppercase">
                <tr><th scope="col" className="px-4 py-2">Attempt</th><th scope="col" className="px-4 py-2">Submitted</th><th scope="col" className="px-4 py-2">Score</th><th scope="col" className="px-4 py-2">Result</th><th scope="col" className="px-4 py-2"><span className="sr-only">Actions</span></th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {attempts.map((a, i) => (
                  <tr key={a.id}>
                    <td className="px-4 py-2">#{attempts.length - i}</td>
                    <td className="px-4 py-2 text-muted">{formatDateTime(a.submittedAt)}{a.timedOut && ' (timed out)'}</td>
                    <td className="px-4 py-2 font-semibold">{a.score}%</td>
                    <td className="px-4 py-2"><StatusBadge status={a.passed ? 'passed' : 'failed'}>{a.passed ? 'Passed' : 'Not passed'}</StatusBadge></td>
                    <td className="px-4 py-2 text-right"><button type="button" className="text-sm font-semibold text-secondary hover:underline" onClick={() => setReviewAttempt(a)}>Review</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">No attempts yet.</p>
        )}
      </section>
    </div>
  )
}
