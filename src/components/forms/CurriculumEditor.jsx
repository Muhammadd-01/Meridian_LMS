import { useState } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, GripVertical } from 'lucide-react'
import { Field } from '../common/ui'
import { LESSON_TYPE_META } from '../learning/lessonMeta'
import { useConfirm } from '../../context/ConfirmContext'
import { DEMO_VIDEO_URL } from '../../data/images'
import { blankLesson, blankModule } from '../../utils/curriculum'
import { cn } from '../../utils/cn'

const move = (list, index, dir) => {
  const target = index + dir
  if (target < 0 || target >= list.length) return list
  const next = [...list]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

function LessonRow({ lesson, index, count, onChange, onMove, onRemove, quizzes, assignments, errors, prefix }) {
  const [open, setOpen] = useState(!lesson.title)
  const meta = LESSON_TYPE_META[lesson.type] || LESSON_TYPE_META.article
  const set = (patch) => onChange({ ...lesson, ...patch })
  const id = (k) => `${prefix}-${k}`
  return (
    <li className={cn('rounded-lg border bg-white', errors?.title ? 'border-danger/50' : 'border-line')}>
      <div className="flex items-center gap-2 px-3 py-2">
        <GripVertical className="h-4 w-4 shrink-0 text-slate-300" aria-hidden="true" />
        <meta.icon className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
        <button type="button" className="min-w-0 flex-1 truncate text-left text-sm font-medium text-ink" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {lesson.title || <span className="text-muted italic">Untitled lesson</span>}
          <span className="ml-2 text-xs font-normal text-muted">{meta.label}{lesson.durationMinutes ? ` · ${lesson.durationMinutes} min` : ''}{lesson.isPreview ? ' · Preview' : ''}</span>
        </button>
        <button type="button" className="rounded p-1 text-muted hover:bg-slate-100 disabled:opacity-30" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Move lesson up"><ArrowUp className="h-4 w-4" /></button>
        <button type="button" className="rounded p-1 text-muted hover:bg-slate-100 disabled:opacity-30" onClick={() => onMove(1)} disabled={index === count - 1} aria-label="Move lesson down"><ArrowDown className="h-4 w-4" /></button>
        <button type="button" className="rounded p-1 text-muted hover:bg-danger-soft hover:text-danger" onClick={onRemove} aria-label="Remove lesson"><Trash2 className="h-4 w-4" /></button>
        <button type="button" className="rounded p-1 text-muted hover:bg-slate-100" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Collapse lesson' : 'Expand lesson'}><ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} /></button>
      </div>
      {open && (
        <div className="grid gap-3 border-t border-line p-3 sm:grid-cols-2">
          <Field label="Lesson title" htmlFor={id('title')} error={errors?.title} required>
            <input id={id('title')} className={cn('input', errors?.title && 'input-invalid')} value={lesson.title} onChange={(e) => set({ title: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type" htmlFor={id('type')}>
              <select id={id('type')} className="input" value={lesson.type} onChange={(e) => set({ type: e.target.value, videoUrl: e.target.value === 'video' ? lesson.videoUrl || DEMO_VIDEO_URL : '', required: e.target.value !== 'resource' })}>
                {Object.entries(LESSON_TYPE_META).map(([value, m]) => <option key={value} value={value}>{m.label}</option>)}
              </select>
            </Field>
            <Field label="Duration (min)" htmlFor={id('dur')}>
              <input id={id('dur')} type="number" min={0} className="input" value={lesson.durationMinutes} onChange={(e) => set({ durationMinutes: Number(e.target.value) })} />
            </Field>
          </div>
          <Field label="Description" htmlFor={id('desc')} className="sm:col-span-2">
            <input id={id('desc')} className="input" value={lesson.description} onChange={(e) => set({ description: e.target.value })} />
          </Field>
          {lesson.type === 'video' && (
            <Field label="Video URL" htmlFor={id('video')} hint="Public MP4/WebM URL. Defaults to the CC0 demo clip." className="sm:col-span-2">
              <input id={id('video')} type="url" className="input" value={lesson.videoUrl} onChange={(e) => set({ videoUrl: e.target.value })} />
            </Field>
          )}
          {lesson.type === 'quiz' && (
            <Field label="Quiz" htmlFor={id('quiz')} error={errors?.quizId} className="sm:col-span-2">
              <select id={id('quiz')} className="input" value={lesson.quizId || ''} onChange={(e) => set({ quizId: e.target.value || null })}>
                <option value="">Select a quiz…</option>
                {quizzes.map((q) => <option key={q.id} value={q.id}>{q.title} ({q.questions.length} questions)</option>)}
              </select>
            </Field>
          )}
          {lesson.type === 'assignment' && (
            <Field label="Assignment" htmlFor={id('asg')} error={errors?.assignmentId} hint="Manage assignments under Admin → Assignments." className="sm:col-span-2">
              <select id={id('asg')} className="input" value={lesson.assignmentId || ''} onChange={(e) => set({ assignmentId: e.target.value || null })}>
                <option value="">Select an assignment…</option>
                {assignments.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
              </select>
            </Field>
          )}
          {['video', 'article', 'reading', 'resource'].includes(lesson.type) && (
            <Field label={lesson.type === 'video' ? 'Lesson notes / transcript' : 'Reading content'} htmlFor={id('content')} hint="Supports ## headings, - lists, **bold**, `code` and ``` code blocks." className="sm:col-span-2">
              <textarea id={id('content')} rows={5} className="input font-mono text-[13px]" value={lesson.content} onChange={(e) => set({ content: e.target.value })} />
            </Field>
          )}
          <div className="flex flex-wrap gap-5 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="checkbox" checked={lesson.isPreview} onChange={(e) => set({ isPreview: e.target.checked })} />Free preview</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="checkbox" checked={lesson.required !== false} onChange={(e) => set({ required: e.target.checked })} />Required for completion</label>
          </div>
        </div>
      )}
    </li>
  )
}

/** Module and lesson builder with ordering controls. */
export default function CurriculumEditor({ modules, onChange, quizzes, assignments, errors = {} }) {
  const confirm = useConfirm()

  const updateModule = (mi, patch) => onChange(modules.map((m, i) => (i === mi ? { ...m, ...patch } : m)))
  const removeModule = async (mi) => {
    const m = modules[mi]
    if (m.lessons.length && !(await confirm({ title: 'Remove this module?', message: `“${m.title || 'Untitled module'}” and its ${m.lessons.length} lesson(s) will be removed from the curriculum.`, confirmLabel: 'Remove module', tone: 'danger' }))) return
    onChange(modules.filter((_, i) => i !== mi))
  }

  return (
    <div className="space-y-4">
      {modules.map((module, mi) => (
        <div key={module.id} className={cn('rounded-xl border bg-slate-50/60 p-4', errors[`m${mi}`] ? 'border-danger/50' : 'border-line')}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">{mi + 1}</span>
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <Field label="Module title" htmlFor={`mod-${module.id}-title`} error={errors[`m${mi}`]} required>
                <input id={`mod-${module.id}-title`} className={cn('input', errors[`m${mi}`] && 'input-invalid')} value={module.title} onChange={(e) => updateModule(mi, { title: e.target.value })} />
              </Field>
              <Field label="Description" htmlFor={`mod-${module.id}-desc`}>
                <input id={`mod-${module.id}-desc`} className="input" value={module.description} onChange={(e) => updateModule(mi, { description: e.target.value })} />
              </Field>
            </div>
            <div className="flex gap-1 sm:pt-7">
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => onChange(move(modules, mi, -1))} disabled={mi === 0} aria-label={`Move module ${mi + 1} up`}><ArrowUp className="h-4 w-4" /></button>
              <button type="button" className="btn btn-ghost btn-icon" onClick={() => onChange(move(modules, mi, 1))} disabled={mi === modules.length - 1} aria-label={`Move module ${mi + 1} down`}><ArrowDown className="h-4 w-4" /></button>
              <button type="button" className="btn btn-danger-ghost btn-icon" onClick={() => removeModule(mi)} aria-label={`Remove module ${mi + 1}`}><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
          <ol className="mt-4 space-y-2">
            {module.lessons.map((lesson, li) => (
              <LessonRow
                key={lesson.id}
                lesson={lesson}
                index={li}
                count={module.lessons.length}
                prefix={`les-${lesson.id}`}
                quizzes={quizzes}
                assignments={assignments}
                errors={errors[`m${mi}l${li}`]}
                onChange={(next) => updateModule(mi, { lessons: module.lessons.map((l, j) => (j === li ? next : l)) })}
                onMove={(dir) => updateModule(mi, { lessons: move(module.lessons, li, dir) })}
                onRemove={() => updateModule(mi, { lessons: module.lessons.filter((_, j) => j !== li) })}
              />
            ))}
            {!module.lessons.length && <li className="rounded-lg border border-dashed border-line p-4 text-center text-sm text-muted">No lessons in this module yet.</li>}
          </ol>
          <div className="mt-3 flex flex-wrap gap-2">
            {['video', 'article', 'reading', 'quiz', 'assignment', 'resource'].map((type) => (
              <button key={type} type="button" className="btn btn-secondary btn-sm" onClick={() => updateModule(mi, { lessons: [...module.lessons, blankLesson(type)] })}>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />{LESSON_TYPE_META[type].label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-outline w-full border-dashed" onClick={() => onChange([...modules, blankModule(modules.length + 1)])}>
        <Plus className="h-4 w-4" aria-hidden="true" />Add module
      </button>
    </div>
  )
}
