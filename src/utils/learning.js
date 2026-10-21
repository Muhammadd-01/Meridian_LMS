import { hashString } from './ids'
import { isoDay } from './format'

const DAY = 24 * 60 * 60 * 1000

export function getAllLessons(course) {
  if (!course?.modules) return []
  return [...course.modules]
    .sort((a, b) => a.order - b.order)
    .flatMap((m) => [...(m.lessons || [])].sort((a, b) => a.order - b.order).map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title })))
}

export function getRequiredLessonIds(course) {
  return getAllLessons(course).filter((l) => l.required !== false).map((l) => l.id)
}

export function countLessons(course) {
  return getAllLessons(course).length
}

export function totalContentMinutes(course) {
  return getAllLessons(course).reduce((sum, l) => sum + (Number(l.durationMinutes) || 0), 0)
}

/** Progress is always derived from completed lesson ids, clamped to 0–100. */
export function computeProgress(course, enrollment) {
  const required = getRequiredLessonIds(course)
  if (!enrollment || !required.length) return { completed: 0, total: required.length, percent: 0 }
  const done = new Set(enrollment.completedLessonIds || [])
  const completed = required.filter((id) => done.has(id)).length
  const percent = Math.min(100, Math.round((completed / required.length) * 100))
  return { completed, total: required.length, percent }
}

export function enrollmentStatus(course, enrollment) {
  if (!enrollment) return 'not-enrolled'
  if (enrollment.archived) return 'archived'
  const { percent } = computeProgress(course, enrollment)
  if (percent >= 100) return 'completed'
  if ((enrollment.completedLessonIds || []).length > 0) return 'in-progress'
  return 'not-started'
}

export const STATUS_LABELS = {
  'in-progress': 'In progress',
  completed: 'Completed',
  'not-started': 'Not started',
  archived: 'Archived',
  'not-enrolled': 'Not enrolled',
}

export function moduleProgress(module, completedIds) {
  const lessons = module.lessons || []
  const required = lessons.filter((l) => l.required !== false)
  const done = required.filter((l) => completedIds.has(l.id)).length
  return { done, total: required.length, complete: required.length > 0 && done === required.length }
}

export function getStreak(activity, userId, now) {
  const days = new Set(activity.filter((a) => a.userId === userId && a.minutes > 0).map((a) => a.date))
  let cursor = new Date(now)
  if (!days.has(isoDay(cursor))) cursor = new Date(now - DAY)
  let streak = 0
  while (days.has(isoDay(cursor))) {
    streak += 1
    cursor = new Date(cursor.getTime() - DAY)
  }
  return streak
}

export function weeklyActivity(activity, userId, now) {
  const result = []
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(now - i * DAY)
    const key = isoDay(d)
    const minutes = activity.filter((a) => a.userId === userId && a.date === key).reduce((s, a) => s + a.minutes, 0)
    result.push({ day: d.toLocaleDateString('en-US', { weekday: 'short' }), date: key, minutes })
  }
  return result
}

export function certificateRef(enrollment) {
  const year = new Date(enrollment.completedAt || enrollment.enrolledAt).getFullYear()
  const code = hashString(enrollment.id + enrollment.userId).toString(36).toUpperCase().padStart(7, '0').slice(0, 7)
  return `MER-${year}-${code}`
}

/** Certificates are derived from completed (non-archived) enrolments — never stored separately. */
export function getCertificates({ enrollments, courses, users, instructors }, userId) {
  return enrollments
    .filter((e) => (!userId || e.userId === userId))
    .map((e) => {
      const course = courses.find((c) => c.id === e.courseId)
      if (!course) return null
      const { percent } = computeProgress(course, e)
      if (percent < 100) return null
      const user = users.find((u) => u.id === e.userId)
      const instructor = instructors.find((i) => i.id === course.instructorId)
      return {
        id: `cert-${e.id}`,
        enrollmentId: e.id,
        reference: certificateRef(e),
        courseId: course.id,
        courseTitle: course.title,
        courseSlug: course.slug,
        thumbnail: course.thumbnail,
        learnerName: user?.name || 'Meridian learner',
        userId: e.userId,
        instructorName: instructor?.name || 'Meridian faculty',
        providerName: course.providerName,
        completedAt: e.completedAt || e.lastAccessedAt,
        durationHours: course.durationHours,
        skills: course.skills || [],
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
}

export function getLearnerStats(data, userId, now) {
  const { enrollments, courses, learningActivity = [] } = data
  const mine = enrollments.filter((e) => e.userId === userId)
  const withCourse = mine
    .map((e) => ({ enrollment: e, course: courses.find((c) => c.id === e.courseId) }))
    .filter((x) => x.course)
  const statuses = withCourse.map(({ course, enrollment }) => enrollmentStatus(course, enrollment))
  const minutes = learningActivity.filter((a) => a.userId === userId).reduce((s, a) => s + a.minutes, 0)
  const weekMinutes = weeklyActivity(learningActivity, userId, now).reduce((s, d) => s + d.minutes, 0)
  const lessonsCompleted = mine.reduce((s, e) => s + (e.completedLessonIds?.length || 0), 0)
  return {
    enrolled: mine.filter((e) => !e.archived).length,
    completed: statuses.filter((s) => s === 'completed').length,
    inProgress: statuses.filter((s) => s === 'in-progress').length,
    notStarted: statuses.filter((s) => s === 'not-started').length,
    hours: Math.round((minutes / 60) * 10) / 10,
    weekMinutes,
    streak: getStreak(learningActivity, userId, now),
    lessonsCompleted,
  }
}

export const ACHIEVEMENTS = [
  { id: 'first-enrol', title: 'First step', description: 'Enrol in your first course.', icon: 'Rocket', test: (s) => s.enrolledTotal >= 1 },
  { id: 'first-lesson', title: 'Off the starting line', description: 'Complete your first lesson.', icon: 'CirclePlay', test: (s) => s.lessonsCompleted >= 1 },
  { id: 'ten-lessons', title: 'Momentum', description: 'Complete 10 lessons.', icon: 'TrendingUp', test: (s) => s.lessonsCompleted >= 10 },
  { id: 'fifty-lessons', title: 'Dedicated learner', description: 'Complete 50 lessons.', icon: 'Layers', test: (s) => s.lessonsCompleted >= 50 },
  { id: 'streak-3', title: 'Habit forming', description: 'Learn three days in a row.', icon: 'Flame', test: (s) => s.streak >= 3 },
  { id: 'streak-7', title: 'Week warrior', description: 'Learn seven days in a row.', icon: 'Flame', test: (s) => s.streak >= 7 },
  { id: 'quiz-pass', title: 'Quiz ace', description: 'Pass a course quiz.', icon: 'CircleCheck', test: (s) => s.quizzesPassed >= 1 },
  { id: 'assignment', title: 'Maker', description: 'Submit an assignment.', icon: 'ClipboardList', test: (s) => s.submissions >= 1 },
  { id: 'note-taker', title: 'Note taker', description: 'Save three lesson notes.', icon: 'StickyNote', test: (s) => s.notes >= 3 },
  { id: 'first-cert', title: 'Certified (demo)', description: 'Complete a course and earn a demo certificate.', icon: 'Award', test: (s) => s.completed >= 1 },
  { id: 'three-certs', title: 'Collector', description: 'Complete three courses.', icon: 'Trophy', test: (s) => s.completed >= 3 },
  { id: 'reviewer', title: 'Community voice', description: 'Write a course review.', icon: 'MessageSquare', test: (s) => s.reviews >= 1 },
]

export function getAchievements(data, userId, now) {
  const stats = getLearnerStats(data, userId, now)
  const summary = {
    ...stats,
    enrolledTotal: data.enrollments.filter((e) => e.userId === userId).length,
    quizzesPassed: data.quizAttempts.filter((a) => a.userId === userId && a.passed).length,
    submissions: data.submissions.filter((s) => s.userId === userId).length,
    notes: data.notes.filter((n) => n.userId === userId).length,
    reviews: data.reviews.filter((r) => r.userId === userId).length,
  }
  return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.test(summary) }))
}

/** Finds a course by slug or id. */
export function findCourse(courses, idOrSlug) {
  return courses.find((c) => c.slug === idOrSlug || c.id === idOrSlug) || null
}

export function resolveAuthor(id, users, instructors) {
  const user = users.find((u) => u.id === id)
  if (user) return { name: user.name, avatar: user.avatar, role: user.role === 'admin' ? 'Moderator' : 'Learner' }
  const ins = instructors.find((i) => i.id === id)
  if (ins) return { name: ins.name, avatar: ins.avatar, role: 'Instructor' }
  return { name: 'Former member', avatar: '', role: 'Learner' }
}
