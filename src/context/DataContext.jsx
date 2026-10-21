/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createSeedData, COLLECTION_KEYS, DEFAULT_SETTINGS } from '../data/seed'
import { homepageContent } from '../data/homepageContent'
import {
  DATA_VERSION, NAMESPACE, STORAGE_KEYS, readJSON, writeJSON, clearDataCollections, isValidCollection,
} from '../services/storage'
import { uid, slugify } from '../utils/ids'
import { isoDay } from '../utils/format'
import { computeProgress, getAllLessons } from '../utils/learning'

const DataContext = createContext(null)
const OBJECT_COLLECTIONS = new Set(['settings', 'content'])
const nowIso = () => new Date().toISOString()

function persistAll(data) {
  COLLECTION_KEYS.forEach((key) => writeJSON(STORAGE_KEYS.collection(key), data[key]))
}

/** Reads persisted collections, falling back to seed data per collection when missing or invalid. */
function loadInitialState() {
  const meta = readJSON(STORAGE_KEYS.meta)
  if (!meta || meta.version !== DATA_VERSION) {
    clearDataCollections()
    const seededAt = Date.now()
    const fresh = createSeedData(seededAt)
    persistAll(fresh)
    writeJSON(STORAGE_KEYS.meta, { version: DATA_VERSION, seededAt })
    return fresh
  }
  let seed = null
  const state = {}
  COLLECTION_KEYS.forEach((key) => {
    const stored = readJSON(STORAGE_KEYS.collection(key))
    const shapeHint = OBJECT_COLLECTIONS.has(key) ? {} : []
    if (stored != null && isValidCollection(stored, shapeHint)) {
      state[key] = stored
    } else {
      seed = seed || createSeedData(meta.seededAt || Date.now())
      state[key] = seed[key]
      writeJSON(STORAGE_KEYS.collection(key), seed[key])
    }
  })
  state.settings = { ...DEFAULT_SETTINGS, ...state.settings }
  state.content = { ...homepageContent, ...state.content, sections: { ...homepageContent.sections, ...state.content?.sections } }
  return state
}

/* ---------- pure state helpers (state in → new state out) ---------- */

function replaceById(list, id, updater) {
  return list.map((item) => (item.id === id ? updater(item) : item))
}

function pushNotifications(s, items) {
  if (!items.length) return s
  const created = items.map((n) => ({ id: uid('ntf'), read: false, createdAt: nowIso(), ...n }))
  return { ...s, notifications: [...created, ...s.notifications].slice(0, 500) }
}

function adminIds(s) {
  return s.users.filter((u) => u.role === 'admin').map((u) => u.id)
}

function addActivityMinutes(s, userId, courseId, minutes) {
  const date = isoDay(new Date())
  const existing = s.learningActivity.find((a) => a.userId === userId && a.date === date && a.courseId === courseId)
  const learningActivity = existing
    ? replaceById(s.learningActivity, existing.id, (a) => ({ ...a, minutes: a.minutes + minutes }))
    : [...s.learningActivity, { id: uid('act'), userId, courseId, date, minutes }]
  return { ...s, learningActivity }
}

function applyLessonCompletion(s, userId, courseId, lessonId, complete) {
  const course = s.courses.find((c) => c.id === courseId)
  const enrollment = s.enrollments.find((e) => e.userId === userId && e.courseId === courseId)
  if (!course || !enrollment) return s
  const lessons = getAllLessons(course)
  const lesson = lessons.find((l) => l.id === lessonId)
  if (!lesson) return s
  const valid = new Set(lessons.map((l) => l.id))
  const done = new Set((enrollment.completedLessonIds || []).filter((id) => valid.has(id)))
  if (done.has(lessonId) === complete) return s
  if (complete) done.add(lessonId)
  else done.delete(lessonId)
  const updated = { ...enrollment, completedLessonIds: [...done], lastLessonId: lessonId, lastAccessedAt: nowIso(), archived: false }
  const before = computeProgress(course, enrollment).percent
  const after = computeProgress(course, updated).percent
  updated.completedAt = after >= 100 ? enrollment.completedAt || nowIso() : null
  let next = { ...s, enrollments: replaceById(s.enrollments, enrollment.id, () => updated) }
  if (complete) next = addActivityMinutes(next, userId, courseId, Number(lesson.durationMinutes) || 5)
  if (after >= 100 && before < 100) {
    next = pushNotifications(next, [{
      userId, type: 'achievement', title: 'Course completed',
      message: `You completed ${course.title}. Your demo certificate is ready.`, link: '/learn/certificates',
    }])
  }
  return next
}

function uniqueSlug(base, courses, excludeId) {
  const root = slugify(base) || 'course'
  let slug = root
  let n = 2
  while (courses.some((c) => c.slug === slug && c.id !== excludeId)) {
    slug = `${root}-${n}`
    n += 1
  }
  return slug
}

function normaliseModules(modules = []) {
  return modules.map((m, mi) => ({
    ...m,
    id: m.id || uid('mod'),
    order: mi + 1,
    lessons: (m.lessons || []).map((l, li) => ({
      ...l,
      id: l.id || uid('les'),
      order: li + 1,
      durationMinutes: Number(l.durationMinutes) || 0,
      required: l.required !== false,
      isPreview: Boolean(l.isPreview),
    })),
  }))
}

function cloneModules(modules = []) {
  return modules.map((m) => ({
    ...m,
    id: uid('mod'),
    lessons: (m.lessons || []).map((l) => ({ ...l, id: uid('les') })),
  }))
}

/* ---------- provider ---------- */

export function DataProvider({ children }) {
  const [state, setState] = useState(loadInitialState)
  const stateRef = useRef(state)
  const persistedRef = useRef(state)
  const actorRef = useRef(null)

  // Persist only the collections that changed.
  useEffect(() => {
    const prev = persistedRef.current
    COLLECTION_KEYS.forEach((key) => {
      if (prev[key] !== state[key]) writeJSON(STORAGE_KEYS.collection(key), state[key])
    })
    persistedRef.current = state
  }, [state])

  // Keep multiple open tabs in sync.
  useEffect(() => {
    const prefix = `${NAMESPACE}.data.`
    const onStorage = (event) => {
      if (!event.key || !event.key.startsWith(prefix) || event.newValue == null) return
      const key = event.key.slice(prefix.length)
      if (!COLLECTION_KEYS.includes(key)) return
      try {
        const value = JSON.parse(event.newValue)
        if (!isValidCollection(value, OBJECT_COLLECTIONS.has(key) ? {} : [])) return
        const next = { ...stateRef.current, [key]: value }
        stateRef.current = next
        persistedRef.current = { ...persistedRef.current, [key]: value }
        setState(next)
      } catch {
        /* ignore malformed cross-tab payloads */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Apply admin-configured brand colours and reduced-motion preference.
  useEffect(() => {
    const root = document.documentElement
    const { primaryColor, accentColor } = state.settings
    if (primaryColor) root.style.setProperty('--color-primary', primaryColor)
    if (accentColor) root.style.setProperty('--color-accent', accentColor)
  }, [state.settings])

  const actions = useMemo(() => {
    const get = () => stateRef.current
    const commit = (fn) => {
      const prev = stateRef.current
      const next = fn(prev)
      if (next !== prev) {
        stateRef.current = next
        setState(next)
      }
      return next
    }
    const log = (s, action, entityType, entityId, entityLabel, details = '') => {
      const actor = actorRef.current
      const entry = {
        id: uid('log'), actorId: actor?.id || 'system', actorName: actor?.name || 'System',
        action, entityType, entityId, entityLabel, details, createdAt: nowIso(),
      }
      return { ...s, activityLogs: [entry, ...s.activityLogs].slice(0, 400) }
    }

    return {
      setActor(user) {
        actorRef.current = user
      },

      /* ----- learner: enrolment & progress ----- */
      enroll(userId, courseId) {
        const s = get()
        const course = s.courses.find((c) => c.id === courseId)
        if (!course || course.status !== 'published') return { ok: false, reason: 'unavailable' }
        const existing = s.enrollments.find((e) => e.userId === userId && e.courseId === courseId)
        if (existing) {
          if (existing.archived) commit((st) => ({ ...st, enrollments: replaceById(st.enrollments, existing.id, (e) => ({ ...e, archived: false })) }))
          return { ok: false, reason: 'exists', enrollment: existing }
        }
        const firstLesson = getAllLessons(course)[0]
        const enrollment = {
          id: uid('enr'), userId, courseId, enrolledAt: nowIso(), completedLessonIds: [],
          lastLessonId: firstLesson?.id || null, lastAccessedAt: nowIso(), completedAt: null, archived: false,
        }
        const user = s.users.find((u) => u.id === userId)
        commit((st) => {
          let next = { ...st, enrollments: [...st.enrollments, enrollment] }
          next = pushNotifications(next, [{
            userId, type: 'course', title: 'Enrolment confirmed',
            message: `You are enrolled in ${course.title}. Start whenever you are ready.`, link: `/learn/course/${course.id}`,
          }])
          return log(next, 'enrollment.created', 'enrollment', enrollment.id, `${user?.name || 'Learner'} → ${course.title}`, 'Learner enrolment recorded')
        })
        return { ok: true, enrollment }
      },

      setEnrollmentArchived(enrollmentId, archived) {
        commit((s) => ({ ...s, enrollments: replaceById(s.enrollments, enrollmentId, (e) => ({ ...e, archived })) }))
      },

      setLessonComplete(userId, courseId, lessonId, complete = true) {
        const before = get()
        const after = commit((s) => applyLessonCompletion(s, userId, courseId, lessonId, complete))
        const course = after.courses.find((c) => c.id === courseId)
        const prevEnr = before.enrollments.find((e) => e.userId === userId && e.courseId === courseId)
        const enr = after.enrollments.find((e) => e.userId === userId && e.courseId === courseId)
        const prevPct = computeProgress(course, prevEnr).percent
        const pct = computeProgress(course, enr).percent
        return { changed: before !== after, percent: pct, courseCompleted: pct >= 100 && prevPct < 100 }
      },

      visitLesson(userId, courseId, lessonId) {
        const s = get()
        const enr = s.enrollments.find((e) => e.userId === userId && e.courseId === courseId)
        if (!enr || enr.lastLessonId === lessonId) return
        commit((st) => ({
          ...st,
          enrollments: replaceById(st.enrollments, enr.id, (e) => ({ ...e, lastLessonId: lessonId, lastAccessedAt: nowIso() })),
        }))
      },

      toggleSaved(userId, courseId) {
        const s = get()
        const isSaved = s.saved.some((x) => x.userId === userId && x.courseId === courseId)
        commit((st) => ({
          ...st,
          saved: isSaved
            ? st.saved.filter((x) => !(x.userId === userId && x.courseId === courseId))
            : [...st.saved, { userId, courseId, savedAt: nowIso() }],
        }))
        return !isSaved
      },

      saveNote({ userId, courseId, lessonId, text }) {
        const trimmed = text.trim()
        commit((s) => {
          const existing = s.notes.find((n) => n.userId === userId && n.lessonId === lessonId)
          if (!trimmed) return existing ? { ...s, notes: s.notes.filter((n) => n.id !== existing.id) } : s
          if (existing) return { ...s, notes: replaceById(s.notes, existing.id, (n) => ({ ...n, text: trimmed, updatedAt: nowIso() })) }
          return { ...s, notes: [...s.notes, { id: uid('note'), userId, courseId, lessonId, text: trimmed, updatedAt: nowIso() }] }
        })
      },

      deleteNote(noteId) {
        commit((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== noteId) }))
      },

      toggleBookmark(userId, courseId, lessonId) {
        const s = get()
        const exists = s.bookmarks.some((b) => b.userId === userId && b.lessonId === lessonId)
        commit((st) => ({
          ...st,
          bookmarks: exists
            ? st.bookmarks.filter((b) => !(b.userId === userId && b.lessonId === lessonId))
            : [...st.bookmarks, { userId, courseId, lessonId, createdAt: nowIso() }],
        }))
        return !exists
      },

      recordQuizAttempt({ userId, quizId, courseId, lessonId, answers, startedAt, timedOut = false }) {
        const s = get()
        const quiz = s.quizzes.find((q) => q.id === quizId)
        if (!quiz) return null
        const total = quiz.questions.length
        const correctCount = quiz.questions.filter((q) => answers[q.id] === q.correctIndex).length
        const score = total ? Math.round((correctCount / total) * 100) : 0
        const attempt = {
          id: uid('att'), userId, quizId, courseId, lessonId, answers: { ...answers }, correctCount, total, score,
          passed: score >= quiz.passThreshold, timedOut, startedAt, submittedAt: nowIso(),
        }
        commit((st) => {
          const next = { ...st, quizAttempts: [...st.quizAttempts, attempt] }
          return attempt.passed ? applyLessonCompletion(next, userId, courseId, lessonId, true) : next
        })
        return attempt
      },

      submitAssignment({ userId, assignmentId, courseId, lessonId, text, attachments = [] }) {
        const s = get()
        const assignment = s.assignments.find((a) => a.id === assignmentId)
        if (!assignment) return { ok: false, reason: 'missing' }
        const existing = s.submissions.find((x) => x.userId === userId && x.assignmentId === assignmentId)
        if (existing && existing.status === 'graded' && !assignment.allowResubmission) return { ok: false, reason: 'locked' }
        const user = s.users.find((u) => u.id === userId)
        const submission = {
          id: existing?.id || uid('sub'), userId, assignmentId, courseId, text: text.trim(), attachments,
          submittedAt: nowIso(), status: 'submitted', grade: null, feedback: '', gradedAt: null,
          attempt: (existing?.attempt || 0) + 1,
          history: existing
            ? [...(existing.history || []), { text: existing.text, submittedAt: existing.submittedAt, grade: existing.grade, feedback: existing.feedback, status: existing.status }]
            : [],
        }
        commit((st) => {
          let next = {
            ...st,
            submissions: existing ? replaceById(st.submissions, existing.id, () => submission) : [...st.submissions, submission],
          }
          if (lessonId) next = applyLessonCompletion(next, userId, courseId, lessonId, true)
          return pushNotifications(next, adminIds(next).map((adminId) => ({
            userId: adminId, type: 'course', title: 'New assignment submission',
            message: `${user?.name || 'A learner'} submitted “${assignment.title}”.`, link: '/admin/assignments',
          })))
        })
        return { ok: true, submission }
      },

      submitReview({ userId, courseId, rating, text }) {
        const s = get()
        const existing = s.reviews.find((r) => r.userId === userId && r.courseId === courseId)
        const course = s.courses.find((c) => c.id === courseId)
        const review = {
          id: existing?.id || uid('rev'), userId, courseId, rating, text: text.trim(), status: 'pending', createdAt: nowIso(),
        }
        commit((st) => {
          const next = { ...st, reviews: existing ? replaceById(st.reviews, existing.id, () => review) : [review, ...st.reviews] }
          return pushNotifications(next, adminIds(next).map((adminId) => ({
            userId: adminId, type: 'course', title: 'Review awaiting moderation',
            message: `A ${rating}-star review was submitted for ${course?.title || 'a course'}.`, link: '/admin/reviews',
          })))
        })
        return review
      },

      createThread({ userId, courseId, title, body }) {
        const thread = { id: uid('dsc'), courseId, userId, title: title.trim(), body: body.trim(), pinned: false, status: 'visible', createdAt: nowIso(), replies: [] }
        commit((s) => ({ ...s, discussions: [thread, ...s.discussions] }))
        return thread
      },

      addReply(threadId, userId, body) {
        const reply = { id: uid('rep'), userId, body: body.trim(), createdAt: nowIso(), status: 'visible' }
        commit((s) => ({ ...s, discussions: replaceById(s.discussions, threadId, (t) => ({ ...t, replies: [...t.replies, reply] })) }))
        return reply
      },

      /* ----- notifications ----- */
      markNotificationRead(id, read = true) {
        commit((s) => ({ ...s, notifications: replaceById(s.notifications, id, (n) => ({ ...n, read })) }))
      },
      markAllNotificationsRead(userId) {
        commit((s) => ({ ...s, notifications: s.notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n)) }))
      },
      dismissNotification(id) {
        commit((s) => ({ ...s, notifications: s.notifications.filter((n) => n.id !== id) }))
      },
      clearNotifications(userId) {
        commit((s) => ({ ...s, notifications: s.notifications.filter((n) => n.userId !== userId) }))
      },

      /* ----- users ----- */
      updateUser(userId, patch) {
        commit((s) => ({ ...s, users: replaceById(s.users, userId, (u) => ({ ...u, ...patch })) }))
      },

      registerLearner({ name, email, password }) {
        const s = get()
        const normalised = email.trim().toLowerCase()
        if (s.users.some((u) => u.email.toLowerCase() === normalised)) return { ok: false, reason: 'exists' }
        const user = {
          id: uid('usr'), name: name.trim(), email: normalised, role: 'learner', avatar: '', title: 'Meridian learner', location: '',
          bio: '', interests: [], language: s.settings.defaultLanguage || 'English', weeklyGoalHours: 3,
          notificationPrefs: { ...s.settings.learnerNotificationDefaults }, status: 'active', joinedAt: nowIso(),
          demoPassword: password,
        }
        commit((st) => {
          let next = { ...st, users: [...st.users, user] }
          next = pushNotifications(next, [{ userId: user.id, type: 'system', title: `Welcome to ${st.settings.platformName}`, message: 'Browse the catalogue and enrol in your first course to get started.', link: '/courses' }])
          next = pushNotifications(next, adminIds(next).map((adminId) => ({ userId: adminId, type: 'system', title: 'New learner registered', message: `${user.name} created a demo learner profile.`, link: '/admin/learners' })))
          return log(next, 'learner.registered', 'user', user.id, user.name, 'Self-registration (demo)')
        })
        return { ok: true, user }
      },

      setUserStatus(userId, status) {
        const user = get().users.find((u) => u.id === userId)
        commit((s) => log({ ...s, users: replaceById(s.users, userId, (u) => ({ ...u, status })) }, 'learner.status', 'user', userId, user?.name || userId, `Status set to ${status}`))
      },

      /* ----- admin: courses ----- */
      createCourse(data) {
        const s = get()
        const course = {
          rating: 0, reviewCount: 0, enrollmentCount: 0, trending: false, subtitles: ['English'], tags: [],
          ...data,
          id: uid('crs'),
          slug: uniqueSlug(data.slug || data.title, s.courses),
          modules: normaliseModules(data.modules),
          createdAt: nowIso(),
          updatedAt: nowIso(),
        }
        commit((st) => log({ ...st, courses: [course, ...st.courses] }, 'course.created', 'course', course.id, course.title, `Created as ${course.status}`))
        return course
      },

      updateCourse(courseId, data, details = 'Updated course details') {
        const s = get()
        const current = s.courses.find((c) => c.id === courseId)
        if (!current) return null
        const updated = {
          ...current,
          ...data,
          id: courseId,
          slug: uniqueSlug(data.slug || current.slug, s.courses, courseId),
          modules: data.modules ? normaliseModules(data.modules) : current.modules,
          updatedAt: nowIso(),
        }
        commit((st) => log({ ...st, courses: replaceById(st.courses, courseId, () => updated) }, 'course.updated', 'course', courseId, updated.title, details))
        return updated
      },

      setCourseStatus(courseId, status) {
        const course = get().courses.find((c) => c.id === courseId)
        if (!course) return
        const verb = { published: 'published', draft: 'unpublished', archived: 'archived' }[status] || status
        commit((s) => log(
          { ...s, courses: replaceById(s.courses, courseId, (c) => ({ ...c, status, updatedAt: nowIso() })) },
          `course.${verb}`, 'course', courseId, course.title, `Status changed to ${status}`,
        ))
      },

      duplicateCourse(courseId) {
        const s = get()
        const source = s.courses.find((c) => c.id === courseId)
        if (!source) return null
        const copy = {
          ...source,
          id: uid('crs'),
          title: `${source.title} (Copy)`,
          slug: uniqueSlug(`${source.slug}-copy`, s.courses),
          status: 'draft', featured: false, trending: false, rating: 0, reviewCount: 0, enrollmentCount: 0,
          modules: cloneModules(source.modules),
          createdAt: nowIso(), updatedAt: nowIso(),
        }
        commit((st) => log({ ...st, courses: [copy, ...st.courses] }, 'course.duplicated', 'course', copy.id, copy.title, `Duplicated from ${source.title}`))
        return copy
      },

      deleteCourse(courseId) {
        const s = get()
        const course = s.courses.find((c) => c.id === courseId)
        if (!course) return { removedEnrollments: 0 }
        const removedEnrollments = s.enrollments.filter((e) => e.courseId === courseId).length
        const assignmentIds = new Set(s.assignments.filter((a) => a.courseId === courseId).map((a) => a.id))
        commit((st) => log({
          ...st,
          courses: st.courses.filter((c) => c.id !== courseId),
          enrollments: st.enrollments.filter((e) => e.courseId !== courseId),
          saved: st.saved.filter((x) => x.courseId !== courseId),
          reviews: st.reviews.filter((r) => r.courseId !== courseId),
          notes: st.notes.filter((n) => n.courseId !== courseId),
          bookmarks: st.bookmarks.filter((b) => b.courseId !== courseId),
          discussions: st.discussions.filter((d) => d.courseId !== courseId),
          quizAttempts: st.quizAttempts.filter((a) => a.courseId !== courseId),
          assignments: st.assignments.filter((a) => a.courseId !== courseId),
          submissions: st.submissions.filter((x) => !assignmentIds.has(x.assignmentId)),
          careerPaths: st.careerPaths.map((p) => ({ ...p, courseIds: p.courseIds.filter((id) => id !== courseId) })),
        }, 'course.deleted', 'course', courseId, course.title, `Removed ${removedEnrollments} related enrolment(s)`))
        return { removedEnrollments }
      },

      /* ----- admin: categories ----- */
      saveCategory(category) {
        const s = get()
        if (category.id && s.categories.some((c) => c.id === category.id)) {
          commit((st) => log({ ...st, categories: replaceById(st.categories, category.id, (c) => ({ ...c, ...category })) }, 'category.updated', 'category', category.id, category.name))
          return category
        }
        const created = {
          ...category, id: uid('cat'), slug: slugify(category.name),
          order: Math.max(0, ...s.categories.map((c) => c.order)) + 1,
        }
        commit((st) => log({ ...st, categories: [...st.categories, created] }, 'category.created', 'category', created.id, created.name))
        return created
      },

      deleteCategory(categoryId, reassignTo = null) {
        const s = get()
        const category = s.categories.find((c) => c.id === categoryId)
        const dependents = s.courses.filter((c) => c.categoryId === categoryId).length
        if (dependents && !reassignTo) return { ok: false, dependents }
        commit((st) => log({
          ...st,
          courses: dependents ? st.courses.map((c) => (c.categoryId === categoryId ? { ...c, categoryId: reassignTo } : c)) : st.courses,
          categories: st.categories.filter((c) => c.id !== categoryId),
        }, 'category.deleted', 'category', categoryId, category?.name || categoryId, dependents ? `Reassigned ${dependents} course(s)` : ''))
        return { ok: true, dependents }
      },

      moveCategory(categoryId, direction) {
        commit((s) => {
          const sorted = [...s.categories].sort((a, b) => a.order - b.order)
          const index = sorted.findIndex((c) => c.id === categoryId)
          const target = index + direction
          if (index < 0 || target < 0 || target >= sorted.length) return s
          const reordered = [...sorted]
          ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
          return { ...s, categories: reordered.map((c, i) => ({ ...c, order: i + 1 })) }
        })
      },

      /* ----- admin: instructors ----- */
      saveInstructor(instructor) {
        const s = get()
        if (instructor.id && s.instructors.some((i) => i.id === instructor.id)) {
          commit((st) => log({ ...st, instructors: replaceById(st.instructors, instructor.id, (i) => ({ ...i, ...instructor })) }, 'instructor.updated', 'instructor', instructor.id, instructor.name))
          return instructor
        }
        const created = { rating: 0, learners: 0, ...instructor, id: uid('ins'), joinedAt: nowIso() }
        commit((st) => log({ ...st, instructors: [...st.instructors, created] }, 'instructor.added', 'instructor', created.id, created.name))
        return created
      },

      deleteInstructor(instructorId, reassignTo = null) {
        const s = get()
        const instructor = s.instructors.find((i) => i.id === instructorId)
        const dependents = s.courses.filter((c) => c.instructorId === instructorId).length
        if (dependents && !reassignTo) return { ok: false, dependents }
        commit((st) => log({
          ...st,
          courses: dependents ? st.courses.map((c) => (c.instructorId === instructorId ? { ...c, instructorId: reassignTo } : c)) : st.courses,
          instructors: st.instructors.filter((i) => i.id !== instructorId),
        }, 'instructor.deleted', 'instructor', instructorId, instructor?.name || instructorId))
        return { ok: true, dependents }
      },

      /* ----- admin: assessments ----- */
      saveQuiz(quiz) {
        const s = get()
        const exists = quiz.id && s.quizzes.some((q) => q.id === quiz.id)
        const saved = exists ? quiz : { ...quiz, id: uid('quiz') }
        commit((st) => log(
          { ...st, quizzes: exists ? replaceById(st.quizzes, quiz.id, () => saved) : [...st.quizzes, saved] },
          exists ? 'quiz.updated' : 'quiz.created', 'quiz', saved.id, saved.title, `${saved.questions.length} question(s), pass ${saved.passThreshold}%`,
        ))
        return saved
      },

      saveAssignment(assignment) {
        const s = get()
        const exists = assignment.id && s.assignments.some((a) => a.id === assignment.id)
        const saved = exists ? assignment : { maxPoints: 100, allowResubmission: true, rubric: [], ...assignment, id: uid('asg') }
        commit((st) => log(
          { ...st, assignments: exists ? replaceById(st.assignments, assignment.id, () => saved) : [...st.assignments, saved] },
          exists ? 'assignment.updated' : 'assignment.created', 'assignment', saved.id, saved.title,
        ))
        return saved
      },

      gradeSubmission(submissionId, { grade, feedback, status }) {
        const s = get()
        const submission = s.submissions.find((x) => x.id === submissionId)
        if (!submission) return
        const assignment = s.assignments.find((a) => a.id === submission.assignmentId)
        commit((st) => {
          let next = {
            ...st,
            submissions: replaceById(st.submissions, submissionId, (x) => ({ ...x, grade, feedback, status, gradedAt: nowIso() })),
          }
          next = pushNotifications(next, [{
            userId: submission.userId, type: 'course',
            title: status === 'resubmit' ? 'Resubmission requested' : 'Assignment graded',
            message: `${assignment?.title || 'Your assignment'}: ${grade ?? '—'}/${assignment?.maxPoints || 100}.`,
            link: `/learn/course/${submission.courseId}`,
          }])
          return log(next, status === 'resubmit' ? 'submission.returned' : 'submission.graded', 'submission', submissionId, assignment?.title || submissionId, `Grade: ${grade ?? '—'}/${assignment?.maxPoints || 100}`)
        })
      },

      /* ----- admin: moderation ----- */
      setReviewStatus(reviewId, status) {
        const review = get().reviews.find((r) => r.id === reviewId)
        const course = get().courses.find((c) => c.id === review?.courseId)
        commit((s) => log({ ...s, reviews: replaceById(s.reviews, reviewId, (r) => ({ ...r, status })) }, `review.${status}`, 'review', reviewId, course?.title || 'Review'))
      },
      deleteReview(reviewId) {
        const review = get().reviews.find((r) => r.id === reviewId)
        const course = get().courses.find((c) => c.id === review?.courseId)
        commit((s) => log({ ...s, reviews: s.reviews.filter((r) => r.id !== reviewId) }, 'review.removed', 'review', reviewId, course?.title || 'Review'))
      },
      updateThread(threadId, patch, action) {
        const thread = get().discussions.find((d) => d.id === threadId)
        commit((s) => {
          const next = { ...s, discussions: replaceById(s.discussions, threadId, (t) => ({ ...t, ...patch })) }
          return action ? log(next, action, 'discussion', threadId, thread?.title || threadId) : next
        })
      },
      deleteThread(threadId) {
        const thread = get().discussions.find((d) => d.id === threadId)
        commit((s) => log({ ...s, discussions: s.discussions.filter((d) => d.id !== threadId) }, 'discussion.removed', 'discussion', threadId, thread?.title || threadId))
      },
      setReplyStatus(threadId, replyId, status) {
        commit((s) => ({
          ...s,
          discussions: replaceById(s.discussions, threadId, (t) => ({ ...t, replies: t.replies.map((r) => (r.id === replyId ? { ...r, status } : r)) })),
        }))
      },
      deleteReply(threadId, replyId) {
        commit((s) => ({
          ...s,
          discussions: replaceById(s.discussions, threadId, (t) => ({ ...t, replies: t.replies.filter((r) => r.id !== replyId) })),
        }))
      },

      /* ----- admin: announcements ----- */
      saveAnnouncement(announcement) {
        const s = get()
        const previous = s.announcements.find((a) => a.id === announcement.id)
        const publishing = announcement.status === 'published' && previous?.status !== 'published'
        const saved = {
          ...announcement,
          id: previous ? announcement.id : uid('ann'),
          createdAt: previous?.createdAt || nowIso(),
          authorId: previous?.authorId || actorRef.current?.id || 'usr-admin',
          publishedAt: publishing ? nowIso() : announcement.status === 'published' ? previous?.publishedAt : null,
        }
        commit((st) => {
          let next = { ...st, announcements: previous ? replaceById(st.announcements, saved.id, () => saved) : [saved, ...st.announcements] }
          if (publishing && saved.audience !== 'admins') {
            const learnerIds = saved.audience === 'course'
              ? [...new Set(st.enrollments.filter((e) => e.courseId === saved.courseId).map((e) => e.userId))]
              : st.users.filter((u) => u.role === 'learner' && u.status !== 'suspended').map((u) => u.id)
            const recipients = learnerIds.filter((id) => st.users.find((u) => u.id === id)?.notificationPrefs?.announcements !== false)
            next = pushNotifications(next, recipients.map((userId) => ({
              userId, type: 'announcement', title: saved.title, message: saved.message, link: '/learn/notifications', announcementId: saved.id,
            })))
          }
          return log(next, publishing ? 'announcement.published' : previous ? 'announcement.updated' : 'announcement.created', 'announcement', saved.id, saved.title, `Status: ${saved.status}`)
        })
        return { announcement: saved, published: publishing }
      },
      deleteAnnouncement(id) {
        const a = get().announcements.find((x) => x.id === id)
        commit((s) => log({ ...s, announcements: s.announcements.filter((x) => x.id !== id) }, 'announcement.deleted', 'announcement', id, a?.title || id))
      },

      /* ----- admin: content & settings ----- */
      updateContent(patch, details = 'Updated homepage content') {
        commit((s) => log({ ...s, content: { ...s.content, ...patch } }, 'content.updated', 'content', 'homepage', 'Homepage content', details))
      },
      updateSettings(patch, details = 'Updated platform settings') {
        commit((s) => log({ ...s, settings: { ...s.settings, ...patch } }, 'settings.updated', 'settings', 'platform', 'Platform settings', details))
      },
      logActivity(action, entityType, entityId, entityLabel, details) {
        commit((s) => log(s, action, entityType, entityId, entityLabel, details))
      },

      /** Restores the original seed data. The demo session is kept. */
      resetDemoData() {
        clearDataCollections()
        const seededAt = Date.now()
        const fresh = createSeedData(seededAt)
        persistAll(fresh)
        writeJSON(STORAGE_KEYS.meta, { version: DATA_VERSION, seededAt })
        persistedRef.current = fresh
        commit(() => fresh)
      },
    }
  }, [])

  const value = useMemo(() => ({ ...state, actions }), [state, actions])
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}
