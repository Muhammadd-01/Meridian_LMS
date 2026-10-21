import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Save, Trash2, Bookmark, StickyNote } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useConfirm } from '../../context/ConfirmContext'
import { getAllLessons } from '../../utils/learning'
import { relativeTime } from '../../utils/format'

/** Personal notes for the current lesson, all notes in the course, and bookmarked lessons. */
export default function NotesPanel({ course, lesson, user }) {
  const { notes, bookmarks, actions } = useData()
  const toast = useToast()
  const confirm = useConfirm()
  const existing = notes.find((n) => n.userId === user.id && n.lessonId === lesson.id)
  const [draft, setDraft] = useState(existing?.text || '')
  const lessons = getAllLessons(course)
  const courseNotes = notes.filter((n) => n.userId === user.id && n.courseId === course.id).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  const courseBookmarks = bookmarks.filter((b) => b.userId === user.id && b.courseId === course.id)
  const dirty = draft.trim() !== (existing?.text || '')
  const lessonTitle = (id) => lessons.find((l) => l.id === id)?.title || 'Removed lesson'

  const save = () => {
    actions.saveNote({ userId: user.id, courseId: course.id, lessonId: lesson.id, text: draft })
    toast.success(draft.trim() ? 'Note saved locally.' : 'Note removed.')
  }

  const remove = async (note) => {
    if (await confirm({ title: 'Delete this note?', message: `Your note on “${lessonTitle(note.lessonId)}” will be removed.`, confirmLabel: 'Delete note', tone: 'danger' })) {
      actions.deleteNote(note.id)
      if (note.lessonId === lesson.id) setDraft('')
      toast.success('Note deleted.')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section aria-labelledby="note-editor">
        <h3 id="note-editor" className="text-sm font-semibold text-ink">Note for this lesson</h3>
        <label htmlFor="lesson-note" className="sr-only">Note for {lesson.title}</label>
        <textarea id="lesson-note" rows={7} className="input mt-2" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Capture key ideas, questions or examples…" />
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-xs text-muted">{existing ? `Last saved ${relativeTime(existing.updatedAt)}` : 'Not saved yet'} · stored in this browser</p>
          <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={!dirty}><Save className="h-4 w-4" aria-hidden="true" />Save note</button>
        </div>
      </section>

      <div className="space-y-6">
        <section aria-labelledby="all-notes">
          <h3 id="all-notes" className="flex items-center gap-2 text-sm font-semibold text-ink"><StickyNote className="h-4 w-4 text-secondary" aria-hidden="true" />All notes in this course ({courseNotes.length})</h3>
          <ul className="mt-2 space-y-2">
            {courseNotes.map((n) => (
              <li key={n.id} className="rounded-lg border border-line bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <Link to={`/learn/course/${course.id}/${n.lessonId}`} className="text-sm font-medium text-ink hover:underline">{lessonTitle(n.lessonId)}</Link>
                  <button type="button" className="rounded p-1 text-muted hover:text-danger" onClick={() => remove(n)} aria-label={`Delete note on ${lessonTitle(n.lessonId)}`}><Trash2 className="h-4 w-4" /></button>
                </div>
                <p className="mt-1 line-clamp-3 text-sm whitespace-pre-line text-slate-700">{n.text}</p>
                <p className="mt-1 text-[11px] text-slate-400">{relativeTime(n.updatedAt)}</p>
              </li>
            ))}
            {!courseNotes.length && <li className="text-sm text-muted">No notes yet.</li>}
          </ul>
        </section>
        <section aria-labelledby="bookmarks-title">
          <h3 id="bookmarks-title" className="flex items-center gap-2 text-sm font-semibold text-ink"><Bookmark className="h-4 w-4 text-secondary" aria-hidden="true" />Bookmarked lessons ({courseBookmarks.length})</h3>
          <ul className="mt-2 space-y-1">
            {courseBookmarks.map((b) => (
              <li key={b.lessonId} className="flex items-center justify-between gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm">
                <Link to={`/learn/course/${course.id}/${b.lessonId}`} className="truncate hover:underline">{lessonTitle(b.lessonId)}</Link>
                <button type="button" className="shrink-0 text-xs font-semibold text-danger hover:underline" onClick={() => { actions.toggleBookmark(user.id, course.id, b.lessonId); toast.info('Bookmark removed.') }}>Remove</button>
              </li>
            ))}
            {!courseBookmarks.length && <li className="text-sm text-muted">Use the bookmark button on any lesson to save it here.</li>}
          </ul>
        </section>
      </div>
    </div>
  )
}
