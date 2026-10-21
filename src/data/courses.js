import { DEMO_VIDEO_URL } from './images'
import { getLessonContent } from './lessonContent'
import { hashString } from '../utils/ids'
import { MEQMP_COURSE_SPECS } from './meqmpCourses'

/**
 * Course record builder. The catalogue itself lives in meqmpCourses.js; compact specs are
 * expanded here into full module/lesson records.
 */
const TYPE_PATTERN = ['video', 'article', 'video', 'reading']
const DAY = 24 * 60 * 60 * 1000

function lessonDuration(type, seed) {
  const h = hashString(seed)
  switch (type) {
    case 'video': return 6 + (h % 13)
    case 'article': return 8 + (h % 7)
    case 'reading': return 12 + (h % 9)
    case 'quiz': return 20
    case 'assignment': return 60
    default: return 5
  }
}

function lessonDescription(type, title) {
  const map = {
    video: `Video walkthrough: ${title}.`,
    article: `Short article explaining ${title.toLowerCase()} with examples.`,
    reading: `Guided reading on ${title.toLowerCase()} with key takeaways.`,
    quiz: 'Check your understanding with a short graded quiz.',
    assignment: 'Apply what you have learned in a practical assignment.',
    resource: 'Downloadable references and templates for this course.',
  }
  return map[type] || title
}

/** Expands a compact course spec into a full course record with modules and lessons. */
export function buildCourse(spec, now) {
  const { curriculum, createdDaysAgo, updatedDaysAgo, image, ...rest } = spec
  const modules = curriculum.map(([title, description, lessonTitles], mi) => {
    const moduleId = `${spec.id}-m${mi + 1}`
    const lessons = lessonTitles.map((lessonTitle, li) => {
      const type = TYPE_PATTERN[li % TYPE_PATTERN.length]
      const id = `${moduleId}-l${li + 1}`
      return {
        id,
        title: lessonTitle,
        type,
        description: lessonDescription(type, lessonTitle),
        durationMinutes: lessonDuration(type, id),
        content: getLessonContent(lessonTitle, spec),
        videoUrl: type === 'video' ? DEMO_VIDEO_URL : '',
        isPreview: li === 0 && mi < 2,
        required: true,
        order: li + 1,
      }
    })
    return { id: moduleId, title, description, order: mi + 1, lessons }
  })

  const last = modules[modules.length - 1]
  const extras = []
  if (spec.quizId) extras.push({ type: 'quiz', title: 'Course knowledge check', quizId: spec.quizId })
  if (spec.assignmentId) extras.push({ type: 'assignment', title: 'Applied assignment', assignmentId: spec.assignmentId })
  extras.push({ type: 'resource', title: 'Course resources and templates', required: false })
  extras.forEach((extra) => {
    const order = last.lessons.length + 1
    const id = `${last.id}-l${order}`
    last.lessons.push({
      id,
      title: extra.title,
      type: extra.type,
      description: lessonDescription(extra.type, extra.title),
      durationMinutes: lessonDuration(extra.type, id),
      content: extra.type === 'resource'
        ? 'Download the course syllabus generated from this curriculum, or browse the sample templates listed below. Items marked “Demo resource” are illustrative and are not included in this frontend demo.'
        : '',
      videoUrl: '',
      quizId: extra.quizId || null,
      assignmentId: extra.assignmentId || null,
      isPreview: false,
      required: extra.required ?? true,
      order,
    })
  })

  return {
    ...rest,
    thumbnail: image,
    createdAt: new Date(now - createdDaysAgo * DAY).toISOString(),
    updatedAt: new Date(now - updatedDaysAgo * DAY).toISOString(),
    modules,
  }
}

export function buildCourses(now) {
  return MEQMP_COURSE_SPECS.map((spec) => buildCourse(spec, now))
}

export const COURSE_TYPES = ['Professional Certificate', 'Course', 'Exam Preparation', 'Awareness Training']
export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']
export const LESSON_TYPES = ['video', 'article', 'reading', 'quiz', 'assignment', 'resource']
