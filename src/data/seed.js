import { categories } from './categories'
import { instructors } from './instructors'
import { buildCourses } from './courses'
import { quizzes } from './quizzes'
import { buildAssignments } from './assignments'
import { buildUsers } from './users'
import { homepageContent } from './homepageContent'
import { seededRandom, hashString } from '../utils/ids'
import { isoDay } from '../utils/format'

const DAY = 24 * 60 * 60 * 1000
const HOUR = 60 * 60 * 1000

export const DEFAULT_SETTINGS = {
  platformName: 'Meridian',
  tagline: 'Empowering quality and sustainable growth',
  primaryColor: '#2C5F6F',
  accentColor: '#F78D00',
  defaultLanguage: 'English',
  catalogPageSize: 12,
  adminPageSize: 10,
  allowSelfRegistration: true,
  showDemoBanner: true,
  supportEmail: 'info@meqmp.com',
  supportPhone: '+966 50 939 4640',
  learnerNotificationDefaults: { courseUpdates: true, announcements: true, deadlineReminders: true, weeklySummary: false, marketing: false },
}

function requiredLessonIds(course) {
  return course.modules.flatMap((m) => m.lessons).filter((l) => l.required !== false).map((l) => l.id)
}

function findLesson(course, predicate) {
  return course.modules.flatMap((m) => m.lessons).find(predicate)
}

// [userId, courseId, enrolledDaysAgo, completionFraction, lastAccessDaysAgo, archived]
const ENROLLMENT_SPECS = [
  ['usr-learner', 'crs-iso9001-ia', 140, 1, 40],
  ['usr-learner', 'crs-first-aid', 200, 1, 150],
  ['usr-learner', 'crs-iso45001-ia', 60, 0.6, 1],
  ['usr-learner', 'crs-osha', 30, 0.25, 3],
  ['usr-learner', 'crs-lss-gb', 10, 0, 10],
  ['usr-learner', 'crs-5s', 150, 0.15, 90, true],
  ['usr-l02', 'crs-iso9001-la', 300, 1, 220],
  ['usr-l02', 'crs-lss-gb', 60, 0.7, 2],
  ['usr-l02', 'crs-bcm', 40, 0.4, 6],
  ['usr-l03', 'crs-iso9001-ia', 250, 1, 180],
  ['usr-l03', 'crs-iso9001-la', 50, 0.55, 1],
  ['usr-l03', 'crs-5s', 20, 0.2, 4],
  ['usr-l04', 'crs-iso14001-ia', 180, 1, 100],
  ['usr-l04', 'crs-iso14001-la', 45, 0.45, 2],
  ['usr-l05', 'crs-osha', 140, 1, 9],
  ['usr-l05', 'crs-fire', 25, 0.3, 5],
  ['usr-l06', 'crs-iso22000-ia', 110, 1, 70],
  ['usr-l06', 'crs-first-aid', 30, 0.5, 3],
  ['usr-l07', 'crs-iso9001-la', 380, 1, 300],
  ['usr-l07', 'crs-lss-bb', 55, 0.35, 12],
  ['usr-l08', 'crs-ttt', 80, 0.6, 7],
  ['usr-l08', 'crs-5s', 90, 1, 50],
  ['usr-l09', 'crs-iso27001-ia', 200, 1, 150],
  ['usr-l09', 'crs-iso27001-la', 15, 0.6, 2],
  ['usr-l10', 'crs-pmp', 450, 0.1, 400],
  ['usr-l11', 'crs-lss-gb', 65, 1, 20],
  ['usr-l11', 'crs-lss-bb', 20, 0.3, 1],
  ['usr-l11', 'crs-5s', 10, 0.7, 0],
  ['usr-l12', 'crs-iso41001-ia', 40, 0.4, 8],
  ['usr-l12', 'crs-aramco-q', 100, 1, 60],
  ['usr-l13', 'crs-iso50001-ia', 28, 0.65, 1],
  ['usr-l13', 'crs-iso50001-la', 4, 0.1, 1],
  ['usr-l14', 'crs-pmp', 18, 0.2, 6],
  ['usr-l14', 'crs-rmp', 6, 0.1, 2],
  ['usr-l16', 'crs-iso31000-la', 12, 0.15, 2],
  ['usr-l17', 'crs-ttt', 9, 0.5, 1],
  ['usr-l18', 'crs-osha', 6, 0.05, 5],
  ['usr-l18', 'crs-iso45001-ia', 9, 0.4, 1],
  ['usr-l19', 'crs-iso9001-ia', 4, 0.1, 0],
  ['usr-l20', 'crs-defensive-driving', 50, 1, 30],
]

function buildEnrollments(courses, now) {
  const byId = Object.fromEntries(courses.map((c) => [c.id, c]))
  return ENROLLMENT_SPECS.map(([userId, courseId, enrolledDaysAgo, fraction, lastDaysAgo, archived], i) => {
    const course = byId[courseId]
    const ids = requiredLessonIds(course)
    const completedLessonIds = ids.slice(0, Math.round(ids.length * fraction))
    const done = completedLessonIds.length === ids.length && ids.length > 0
    const allLessons = course.modules.flatMap((m) => m.lessons)
    const lastLessonId = done
      ? allLessons[allLessons.length - 1].id
      : ids[completedLessonIds.length] || allLessons[0].id
    return {
      id: `enr-${String(i + 1).padStart(3, '0')}`,
      userId,
      courseId,
      enrolledAt: new Date(now - enrolledDaysAgo * DAY).toISOString(),
      completedLessonIds,
      lastLessonId,
      lastAccessedAt: new Date(now - lastDaysAgo * DAY - 3 * HOUR).toISOString(),
      completedAt: done ? new Date(now - (lastDaysAgo + 1) * DAY).toISOString() : null,
      archived: Boolean(archived),
    }
  })
}

function buildActivity(enrollments, now) {
  const records = []
  const rand = seededRandom('meridian-activity')
  // Demo learner: a steady habit with a current streak (yesterday back four days).
  for (let d = 45; d >= 1; d -= 1) {
    const forced = d <= 4
    if (forced || rand() < 0.55) {
      records.push({
        id: `act-l-${d}`, userId: 'usr-learner', courseId: d % 3 === 0 ? 'crs-osha' : 'crs-iso45001-ia',
        date: isoDay(new Date(now - d * DAY)), minutes: 15 + Math.round(rand() * 55),
      })
    }
  }
  // Other learners: sparse activity over the last 90 days for admin engagement analytics.
  const others = enrollments.filter((e) => e.userId !== 'usr-learner')
  others.forEach((e) => {
    const r = seededRandom(e.id)
    for (let d = 90; d >= 0; d -= 1) {
      if (r() < 0.12) {
        records.push({
          id: `act-${e.id}-${d}`, userId: e.userId, courseId: e.courseId,
          date: isoDay(new Date(now - d * DAY)), minutes: 10 + Math.round(r() * 60),
        })
      }
    }
  })
  return records
}

function buildQuizAttempts(courses, now) {
  const byId = Object.fromEntries(courses.map((c) => [c.id, c]))
  const quizById = Object.fromEntries(quizzes.map((q) => [q.id, q]))
  const specs = [
    ['usr-learner', 'crs-iso9001-ia', 6, 50],
    ['usr-learner', 'crs-iso9001-ia', 7, 48],
    ['usr-learner', 'crs-first-aid', 5, 160],
    ['usr-l02', 'crs-iso9001-la', 7, 230],
    ['usr-l02', 'crs-lss-gb', 4, 10],
    ['usr-l03', 'crs-iso9001-ia', 6, 190],
    ['usr-l03', 'crs-iso9001-la', 5, 6],
    ['usr-l04', 'crs-iso14001-ia', 7, 110],
    ['usr-l05', 'crs-osha', 6, 12],
    ['usr-l06', 'crs-iso22000-ia', 6, 75],
    ['usr-l07', 'crs-iso9001-la', 8, 310],
    ['usr-l09', 'crs-iso27001-la', 4, 8],
    ['usr-l09', 'crs-iso27001-la', 7, 5],
    ['usr-l11', 'crs-lss-gb', 6, 25],
    ['usr-l13', 'crs-iso50001-ia', 6, 2],
    ['usr-l14', 'crs-pmp', 4, 4],
  ]
  return specs.map(([userId, courseId, correct, daysAgo], i) => {
    const course = byId[courseId]
    const quiz = quizById[course.quizId]
    const lesson = findLesson(course, (l) => l.quizId === quiz.id)
    const total = quiz.questions.length
    const correctCount = Math.min(correct, total)
    const answers = {}
    quiz.questions.forEach((question, qi) => {
      answers[question.id] = qi < correctCount ? question.correctIndex : (question.correctIndex + 1) % question.options.length
    })
    const score = Math.round((correctCount / total) * 100)
    const submittedAt = new Date(now - daysAgo * DAY - (i % 5) * HOUR)
    return {
      id: `att-${String(i + 1).padStart(3, '0')}`, userId, quizId: quiz.id, courseId, lessonId: lesson.id,
      answers, correctCount, total, score, passed: score >= quiz.passThreshold, timedOut: false,
      startedAt: new Date(submittedAt.getTime() - 12 * 60 * 1000).toISOString(),
      submittedAt: submittedAt.toISOString(),
    }
  })
}

function buildSubmissions(now) {
  const specs = [
    ['usr-learner', 'asg-qms-policy', 'crs-iso9001-ia', 130, 'graded', 92, 'Clear, concise policy and a well-scoped process map. Your audit questions are open and evidence-seeking — well done.'],
    ['usr-l02', 'asg-audit-report', 'crs-iso9001-la', 230, 'graded', 90, 'Findings are well structured with precise clause references.'],
    ['usr-l02', 'asg-lss-charter', 'crs-lss-gb', 3, 'submitted', null, ''],
    ['usr-l03', 'asg-qms-policy', 'crs-iso9001-ia', 190, 'graded', 85, 'Good process map. Make the quality objectives measurable.'],
    ['usr-l03', 'asg-audit-report', 'crs-iso9001-la', 2, 'submitted', null, ''],
    ['usr-l04', 'asg-ems-aspects', 'crs-iso14001-ia', 105, 'graded', 88, 'Thorough register. Explain your significance thresholds.'],
    ['usr-l05', 'asg-hse-jsa', 'crs-osha', 12, 'graded', 94, 'Excellent task breakdown and controls that follow the hierarchy.'],
    ['usr-l05', 'asg-fire-plan', 'crs-fire', 1, 'submitted', null, ''],
    ['usr-l07', 'asg-audit-report', 'crs-iso9001-la', 305, 'graded', 89, 'Strong evidence. Keep nonconformity statements free of recommendations.'],
    ['usr-l09', 'asg-isms-procedure', 'crs-iso27001-la', 6, 'submitted', null, ''],
    ['usr-l11', 'asg-lss-charter', 'crs-lss-gb', 22, 'graded', 91, 'Well-defined problem statement and a realistic scope.'],
    ['usr-l14', 'asg-pmp-charter', 'crs-pmp', 5, 'resubmit', 62, 'Success criteria are missing and the risk owners are not named. Please revise and resubmit.'],
    ['usr-l18', 'asg-ohs-hira', 'crs-iso45001-ia', 1, 'submitted', null, ''],
  ]
  const texts = {
    'asg-qms-policy': 'Quality policy for Corvid Components committing to customer satisfaction, compliance and continual improvement. Process map for "Order to Delivery" with owners, inputs, outputs and KPIs (on-time delivery, defect rate, complaints). Audit questions focus on how KPIs are reviewed and acted upon.',
    'asg-audit-report': 'NC1 (clause 8.4.1): two critical suppliers had no evaluation records for 2025. NC2 (clause 7.5.3): obsolete purchasing procedure rev B in use at stores. OFI: consider supplier scorecards. Conclusion: purchasing is largely effective; two minor nonconformities raised.',
    'asg-lss-charter': 'Problem: order picking errors at 3.2% against a 1% target. Goal: reduce to 1% within 4 months. Scope: inbound picking at the main warehouse. SIPOC and metrics attached; team of five with the operations manager as sponsor.',
    'asg-ems-aspects': 'Eight aspects identified including diesel forklift emissions, packaging waste, refrigerant leaks and stormwater run-off. Significance scored on severity, likelihood and legal requirements; controls and obligations listed for each.',
    'asg-hse-jsa': 'Steps: isolate power, set up mobile elevated work platform, remove fitting, install new fitting, test, demobilise. Hazards include electrocution, falls and dropped objects. Controls: LOTO, MEWP with harness, exclusion zone, gloves and helmets.',
    'asg-fire-plan': 'Two protected stairways, assembly point in the north car park, one warden per floor with sweep responsibilities, buddy system and evacuation chair for people with mobility impairments, visitor sign-in used for roll call.',
    'asg-isms-procedure': 'Checklist covers detection, reporting, classification, escalation, evidence collection and lessons learned. Findings: no defined response times for high-severity incidents; incident log lacked post-incident reviews.',
    'asg-pmp-charter': 'Project: implement ISO 9001 QMS at Halcyon Logistics (fictional). Scope includes documentation, training and internal audits; certification audit out of scope. Milestones listed by quarter.',
    'asg-ohs-hira': 'Workshop hazards: rotating machinery, grinding sparks, manual handling of heavy parts and solvent vapours. Initial and residual risk ratings with guarding, extraction and lifting aids as controls.',
  }
  return specs.map(([userId, assignmentId, courseId, daysAgo, status, grade, feedback], i) => ({
    id: `sub-${String(i + 1).padStart(3, '0')}`,
    userId, assignmentId, courseId,
    text: texts[assignmentId],
    attachments: i % 3 === 0 ? [{ name: 'submission-notes.pdf', size: 184320 }] : [],
    submittedAt: new Date(now - daysAgo * DAY).toISOString(),
    status,
    grade,
    feedback,
    gradedAt: status === 'submitted' ? null : new Date(now - (daysAgo - 1) * DAY).toISOString(),
    attempt: 1,
  }))
}

function buildReviews(now) {
  const specs = [
    ['crs-iso9001-la', 'usr-l07', 5, 'The case-study audit pulled everything together. I now feel ready to lead audits on my own.', 'approved', 280],
    ['crs-iso9001-la', 'usr-l02', 5, 'Practical and well paced. Hannah’s examples of good and bad findings were especially useful.', 'approved', 200],
    ['crs-iso9001-ia', 'usr-learner', 5, 'Clear explanation of ISO 19011 and great checklists I could use at work straight away.', 'approved', 41],
    ['crs-iso9001-ia', 'usr-l03', 4, 'Very useful. I would have liked one more practice audit in module three.', 'approved', 170],
    ['crs-iso45001-ia', 'usr-l18', 4, 'Good mix of theory and real site examples.', 'pending', 2],
    ['crs-osha', 'usr-l05', 5, 'The Focus Four module alone was worth it. Clear, practical and relevant to our sites.', 'approved', 8],
    ['crs-first-aid', 'usr-learner', 5, 'Confidence-building course. The CPR walkthrough was easy to follow.', 'approved', 140],
    ['crs-lss-gb', 'usr-l11', 5, 'DMAIC finally clicked for me. The project charter assignment was excellent practice.', 'approved', 18],
    ['crs-iso14001-ia', 'usr-l04', 4, 'Great coverage of aspects and impacts with realistic examples.', 'approved', 90],
    ['crs-iso22000-ia', 'usr-l06', 5, 'Exactly what our food safety team needed before our internal audit cycle.', 'approved', 60],
    ['crs-iso27001-la', 'usr-l09', 4, 'Strong on Annex A controls and audit evidence.', 'approved', 4],
    ['crs-pmp', 'usr-l14', 3, 'Good content, but I wanted more practice questions.', 'pending', 1],
    ['crs-5s', 'usr-l08', 5, 'Simple, practical and our warehouse already looks better.', 'approved', 45],
    ['crs-defensive-driving', 'usr-l20', 2, 'Buy cheap followers at my site!!! (spam)', 'hidden', 7],
  ]
  return specs.map(([courseId, userId, rating, text, status, daysAgo], i) => ({
    id: `rev-${String(i + 1).padStart(3, '0')}`, courseId, userId, rating, text, status,
    createdAt: new Date(now - daysAgo * DAY).toISOString(),
  }))
}

function buildAnnouncements(now) {
  const specs = [
    ['New ISO Lead Auditor intake now open', 'Enrolments are open for ISO 9001, ISO 14001, ISO 45001 and ISO/IEC 27001 Lead Auditor programmes. Set a weekly goal on your profile to stay on track.', 'learners', null, 'published', 14],
    ['New: ISO 41001 and ISO 50001 Internal Auditor courses', 'Two new internal auditor courses for facility management and energy management systems are now available in the catalogue.', 'learners', null, 'published', 11],
    ['ISO 45001 Internal Auditor — updated case studies', 'New construction and manufacturing case studies have been added to module three.', 'course', 'crs-iso45001-ia', 'published', 8],
    ['Reminder: OSHA job safety analysis due soon', 'The job safety analysis assignment for OSHA 10 & 30 Hour is due in a few days.', 'course', 'crs-osha', 'published', 2],
    ['Tip: use notes and bookmarks while you learn', 'Bookmark lessons and keep personal notes in the course player. Everything stays in your browser.', 'learners', null, 'published', 5],
    ['Planned maintenance window (demo)', 'This is a sample scheduled announcement. No real maintenance will take place.', 'all', null, 'scheduled', -3],
    ['Lean Six Sigma Green Belt — trainer Q&A', 'We are planning a live Q&A with the Green Belt trainer. Details to follow.', 'learners', null, 'draft', 1],
    ['Admin: quarterly catalogue review', 'Please review draft and low-rated courses before the end of the quarter.', 'admins', null, 'published', 6],
  ]
  return specs.map(([title, message, audience, courseId, status, daysAgo], i) => ({
    id: `ann-${String(i + 1).padStart(3, '0')}`, title, message, audience, courseId, status,
    scheduledFor: status === 'scheduled' ? new Date(now - daysAgo * DAY).toISOString() : null,
    publishedAt: status === 'published' ? new Date(now - daysAgo * DAY).toISOString() : null,
    createdAt: new Date(now - (Math.abs(daysAgo) + 1) * DAY).toISOString(),
    authorId: 'usr-admin',
  }))
}

function buildNotifications(now) {
  const specs = [
    ['announcement', 'New ISO Lead Auditor intake now open', 'Lead auditor programmes for ISO 9001, 14001, 45001 and 27001 are open for enrolment.', '/courses?category=lead-auditor', true, 14 * 24],
    ['announcement', 'New: ISO 41001 and ISO 50001 Internal Auditor courses', 'Two new internal auditor courses are now available.', '/courses?category=internal-auditor', false, 11 * 24],
    ['deadline', 'Assignment due soon', '“Complete a job safety analysis” is due in 6 days.', '/learn/course/crs-osha', false, 30],
    ['course', 'Your trainer replied', 'Eng. Tariq Al-Mansouri replied to your question in ISO 45001:2018 Internal Auditor.', '/learn/course/crs-iso45001-ia', false, 20],
    ['achievement', 'Achievement unlocked: 4-day streak', 'You have learned four days in a row. Keep it up!', '/learn/achievements', true, 26],
    ['announcement', 'Tip: use notes and bookmarks', 'Bookmark lessons and keep personal notes in the course player.', '/learn/my-learning', true, 5 * 24],
    ['system', 'Certificate available', 'Your demo certificate for ISO 9001:2015 Internal Auditor is ready.', '/learn/certificates', true, 40 * 24],
  ]
  return specs.map(([type, title, message, link, read, hoursAgo], i) => ({
    id: `ntf-${String(i + 1).padStart(3, '0')}`, userId: 'usr-learner', type, title, message, link, read,
    createdAt: new Date(now - hoursAgo * HOUR).toISOString(),
  }))
}

function buildDiscussions(now) {
  const t = (h) => new Date(now - h * HOUR).toISOString()
  return [
    { id: 'dsc-001', courseId: 'crs-iso45001-ia', userId: 'ins-tariq', title: 'Welcome! Introduce yourself here', pinned: true, status: 'visible', createdAt: t(24 * 40),
      body: 'Tell the group about your workplace and the biggest OH&S risk you deal with day to day.',
      replies: [
        { id: 'rep-001', userId: 'usr-l18', body: 'Samuel here — construction safety officer in Lagos. Working at height is our biggest risk.', createdAt: t(24 * 39), status: 'visible' },
        { id: 'rep-002', userId: 'usr-learner', body: 'Alex from Dammam. I coordinate operations and I am building towards lead auditor.', createdAt: t(24 * 30), status: 'visible' },
      ] },
    { id: 'dsc-002', courseId: 'crs-iso45001-ia', userId: 'usr-learner', title: 'Is a near miss an “incident” under ISO 45001?', pinned: false, status: 'visible', createdAt: t(26),
      body: 'Our procedure only records injuries. Do near misses need to be investigated too?',
      replies: [
        { id: 'rep-003', userId: 'ins-tariq', body: 'Yes — ISO 45001 treats near misses as incidents. Investigating them is one of the best ways to prevent future injuries.', createdAt: t(20), status: 'visible' },
      ] },
    { id: 'dsc-003', courseId: 'crs-iso9001-la', userId: 'usr-l03', title: 'When does a minor nonconformity become a major?', pinned: false, status: 'visible', createdAt: t(24 * 6),
      body: 'If I find the same minor issue in three departments, should it be graded as a major?',
      replies: [
        { id: 'rep-004', userId: 'ins-hannah', body: 'Often, yes — repeated findings can indicate a systemic breakdown of a requirement. Look at whether the process as a whole is failing.', createdAt: t(24 * 5), status: 'visible' },
        { id: 'rep-005', userId: 'usr-l07', body: 'This helped me too, thanks!', createdAt: t(24 * 2), status: 'visible' },
      ] },
    { id: 'dsc-004', courseId: 'crs-iso9001-la', userId: 'ins-hannah', title: 'Case-study audit: team allocations', pinned: true, status: 'visible', createdAt: t(24 * 30),
      body: 'Share which process you are auditing in the case study and give feedback on two classmates’ audit plans.', replies: [] },
    { id: 'dsc-005', courseId: 'crs-lss-gb', userId: 'usr-l11', title: 'Sample size for measurement system analysis?', pinned: false, status: 'visible', createdAt: t(24 * 4),
      body: 'How many parts and operators do we need for a gauge R&R study?',
      replies: [{ id: 'rep-006', userId: 'ins-sofia', body: 'A common starting point is 10 parts, 3 operators and 2–3 trials each. Make sure the parts span the real process range.', createdAt: t(24 * 3), status: 'visible' }] },
    { id: 'dsc-006', courseId: 'crs-iso27001-la', userId: 'ins-daniel', title: 'Annex A (2022) control mapping recap', pinned: true, status: 'visible', createdAt: t(24 * 8),
      body: 'Key themes: the four control themes, new controls such as threat intelligence, and how to audit the Statement of Applicability.', replies: [] },
    { id: 'dsc-007', courseId: 'crs-osha', userId: 'usr-l05', title: 'Ladder inspection checklist template?', pinned: false, status: 'visible', createdAt: t(24 * 3),
      body: 'Does anyone have a simple pre-use ladder inspection checklist?',
      replies: [{ id: 'rep-007', userId: 'usr-l18', body: 'We check feet, stiles, rungs, locking bars and labels before each use — happy to share our template.', createdAt: t(24 * 2), status: 'visible' }] },
    { id: 'dsc-008', courseId: 'crs-defensive-driving', userId: 'usr-l20', title: 'Check out my promo codes', pinned: false, status: 'hidden', createdAt: t(24 * 7),
      body: 'Off-topic promotional content (hidden by moderator).', replies: [] },
  ]
}

function buildActivityLogs(now) {
  const specs = [
    ['course.published', 'course', 'crs-iso41001-ia', 'ISO 41001:2018 Internal Auditor', 'Published course', 11],
    ['course.created', 'course', 'crs-iso41001-ia', 'ISO 41001:2018 Internal Auditor', 'Created course draft', 13],
    ['course.published', 'course', 'crs-iso50001-ia', 'ISO 50001:2018 Internal Auditor', 'Published course', 11],
    ['course.updated', 'course', 'crs-iso45001-ia', 'ISO 45001:2018 Internal Auditor', 'Added case studies to module 3', 8],
    ['course.updated', 'course', 'crs-pmp', 'PMP® Exam Preparation', 'Updated practice exam review', 4],
    ['announcement.published', 'announcement', 'ann-001', 'New ISO Lead Auditor intake now open', 'Audience: learners', 14],
    ['announcement.published', 'announcement', 'ann-004', 'Reminder: OSHA job safety analysis due soon', 'Audience: course learners', 2],
    ['instructor.added', 'instructor', 'ins-tariq', 'Eng. Tariq Al-Mansouri', 'Added instructor profile', 160],
    ['category.updated', 'category', 'cat-leadership', 'Leadership & Management', 'Updated description', 25],
    ['enrollment.created', 'enrollment', 'enr-031', 'Diego Morales → ISO 50001:2018 Internal Auditor', 'Learner enrolment recorded', 28],
    ['enrollment.created', 'enrollment', 'enr-036', 'Amelia Novak → Train the Trainer', 'Learner enrolment recorded', 9],
    ['review.hidden', 'review', 'rev-014', 'Defensive Driving', 'Hid spam review', 7],
    ['discussion.hidden', 'discussion', 'dsc-008', 'Check out my promo codes', 'Hid off-topic thread', 7],
    ['submission.graded', 'submission', 'sub-007', 'Complete a job safety analysis', 'Grade: 94/100', 11],
    ['submission.returned', 'submission', 'sub-012', 'Create a project charter', 'Grade: 62/100', 4],
    ['settings.updated', 'settings', 'platform', 'Platform settings', 'Updated default catalogue page size', 20],
  ]
  return specs.map(([action, entityType, entityId, entityLabel, details, daysAgo], i) => ({
    id: `log-${String(i + 1).padStart(3, '0')}`, actorId: entityType === 'enrollment' ? 'system' : 'usr-admin',
    actorName: entityType === 'enrollment' ? 'System' : 'Jordan Hayes',
    action, entityType, entityId, entityLabel, details,
    createdAt: new Date(now - daysAgo * DAY - (hashString(entityId) % 8) * HOUR).toISOString(),
    seeded: true,
  }))
}

/**
 * Builds the complete initial dataset. Called once on first run (or after a demo reset);
 * the result is persisted, so records are never regenerated on render.
 */
export function createSeedData(now = Date.now()) {
  const courses = buildCourses(now)
  const enrollments = buildEnrollments(courses, now)
  return {
    courses,
    categories,
    instructors,
    users: buildUsers(now),
    quizzes,
    assignments: buildAssignments(now),
    enrollments,
    quizAttempts: buildQuizAttempts(courses, now),
    submissions: buildSubmissions(now),
    reviews: buildReviews(now),
    announcements: buildAnnouncements(now),
    notifications: buildNotifications(now),
    discussions: buildDiscussions(now),
    activityLogs: buildActivityLogs(now),
    learningActivity: buildActivity(enrollments, now),
    saved: [
      { userId: 'usr-learner', courseId: 'crs-iso9001-la', savedAt: new Date(now - 6 * DAY).toISOString() },
      { userId: 'usr-learner', courseId: 'crs-fire', savedAt: new Date(now - 2 * DAY).toISOString() },
      { userId: 'usr-l03', courseId: 'crs-iso14001-ia', savedAt: new Date(now - 9 * DAY).toISOString() },
      { userId: 'usr-l04', courseId: 'crs-iso50001-ia', savedAt: new Date(now - 12 * DAY).toISOString() },
    ],
    notes: [
      { id: 'note-001', userId: 'usr-learner', courseId: 'crs-iso45001-ia', lessonId: 'crs-iso45001-ia-m1-l3',
        text: 'Near misses count as incidents. Worker participation and consultation are explicit requirements — check how they are evidenced.', updatedAt: new Date(now - 8 * DAY).toISOString() },
      { id: 'note-002', userId: 'usr-learner', courseId: 'crs-iso45001-ia', lessonId: 'crs-iso45001-ia-m2-l1',
        text: 'Seven audit principles: integrity, fair presentation, due professional care, confidentiality, independence, evidence-based, risk-based.', updatedAt: new Date(now - 3 * DAY).toISOString() },
    ],
    bookmarks: [
      { userId: 'usr-learner', courseId: 'crs-iso45001-ia', lessonId: 'crs-iso45001-ia-m3-l3', createdAt: new Date(now - 2 * DAY).toISOString() },
    ],
    settings: { ...DEFAULT_SETTINGS },
    content: homepageContent,
  }
}

export const COLLECTION_KEYS = [
  'courses', 'categories', 'instructors', 'users', 'quizzes', 'assignments', 'enrollments',
  'quizAttempts', 'submissions', 'reviews', 'announcements', 'notifications', 'discussions', 'activityLogs',
  'learningActivity', 'saved', 'notes', 'bookmarks', 'settings', 'content',
]
