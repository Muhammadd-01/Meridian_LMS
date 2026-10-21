import { PlayCircle, FileText, BookOpen, ListChecks, ClipboardList, FolderOpen } from 'lucide-react'

export const LESSON_TYPE_META = {
  video: { label: 'Video', icon: PlayCircle },
  article: { label: 'Article', icon: FileText },
  reading: { label: 'Reading', icon: BookOpen },
  quiz: { label: 'Quiz', icon: ListChecks },
  assignment: { label: 'Assignment', icon: ClipboardList },
  resource: { label: 'Resources', icon: FolderOpen },
}

export function lessonTypeMeta(type) {
  return LESSON_TYPE_META[type] || LESSON_TYPE_META.article
}

/** Demo caption cues for the short sample clip. Real courses would ship WebVTT files. */
export function demoCaptions(lesson) {
  if (!lesson) return []
  return [
    { start: 0, end: 2.4, text: `Welcome to “${lesson.title}”.` },
    { start: 2.4, end: 5, text: 'This short sample clip stands in for the full lesson video.' },
    { start: 5, end: 60, text: 'Read the lesson notes below for the key ideas.' },
  ]
}
