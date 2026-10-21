import { categories } from './categories'
import { instructors } from './instructors'
import { buildCourses } from './courses'
import { quizzes } from './quizzes'
import { buildAssignments } from './assignments'
import { buildUsers } from './users'
import { careerPaths } from './careerPaths'
import { homepageContent } from './homepageContent'
import { seededRandom, hashString } from '../utils/ids'
import { isoDay } from '../utils/format'

const DAY = 24 * 60 * 60 * 1000
const HOUR = 60 * 60 * 1000

export const DEFAULT_SETTINGS = {
  platformName: 'Meridian LMS',
  tagline: 'Learning for quality-driven professionals',
  primaryColor: '#2C5F6F',
  accentColor: '#F78D00',
  defaultLanguage: 'English',
  catalogPageSize: 12,
  adminPageSize: 10,
  allowSelfRegistration: true,
  showDemoBanner: true,
  supportEmail: 'support@meridianlms.demo',
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
  ['usr-learner', 'crs-javascript', 120, 1, 40],
  ['usr-learner', 'crs-pm', 200, 1, 150],
  ['usr-learner', 'crs-python', 60, 0.6, 1],
  ['usr-learner', 'crs-uiux', 30, 0.25, 3],
  ['usr-learner', 'crs-cloud', 10, 0, 10],
  ['usr-learner', 'crs-sql', 150, 0.15, 90, true],
  ['usr-l02', 'crs-pm', 300, 1, 220],
  ['usr-l02', 'crs-qms', 60, 0.7, 2],
  ['usr-l02', 'crs-sql', 40, 0.4, 6],
  ['usr-l03', 'crs-javascript', 250, 1, 180],
  ['usr-l03', 'crs-react', 50, 0.55, 1],
  ['usr-l03', 'crs-fullstack', 20, 0.2, 4],
  ['usr-l04', 'crs-python', 180, 1, 100],
  ['usr-l04', 'crs-ml', 45, 0.45, 2],
  ['usr-l05', 'crs-it-support', 140, 0.8, 9],
  ['usr-l05', 'crs-cyber', 25, 0.3, 5],
  ['usr-l06', 'crs-uiux', 110, 1, 70],
  ['usr-l06', 'crs-design-systems', 30, 0.5, 3],
  ['usr-l07', 'crs-qms', 380, 1, 300],
  ['usr-l07', 'crs-agile', 55, 0.35, 12],
  ['usr-l08', 'crs-digital-marketing', 80, 0.6, 7],
  ['usr-l08', 'crs-communication', 90, 1, 50],
  ['usr-l09', 'crs-cyber', 200, 0.9, 3],
  ['usr-l09', 'crs-incident-response', 15, 0.2, 2],
  ['usr-l10', 'crs-pm', 450, 0.1, 400],
  ['usr-l11', 'crs-ml', 65, 1, 20],
  ['usr-l11', 'crs-deep-learning', 20, 0.3, 1],
  ['usr-l11', 'crs-genai', 10, 0.7, 0],
  ['usr-l12', 'crs-uiux', 40, 0.4, 8],
  ['usr-l13', 'crs-cloud', 28, 0.65, 1],
  ['usr-l13', 'crs-devops', 4, 0.1, 1],
  ['usr-l14', 'crs-pm', 18, 0.2, 6],
  ['usr-l16', 'crs-react', 12, 0.15, 2],
  ['usr-l17', 'crs-communication', 9, 0.5, 1],
  ['usr-l18', 'crs-it-support', 6, 0.05, 5],
  ['usr-l19', 'crs-python', 4, 0.1, 0],
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
        id: `act-l-${d}`, userId: 'usr-learner', courseId: d % 3 === 0 ? 'crs-uiux' : 'crs-python',
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
    ['usr-learner', 'crs-javascript', 7, 50],
    ['usr-learner', 'crs-javascript', 8, 48],
    ['usr-learner', 'crs-pm', 5, 160],
    ['usr-l02', 'crs-pm', 6, 230],
    ['usr-l02', 'crs-qms', 4, 10],
    ['usr-l03', 'crs-javascript', 6, 190],
    ['usr-l03', 'crs-react', 5, 6],
    ['usr-l04', 'crs-python', 7, 110],
    ['usr-l04', 'crs-ml', 4, 3],
    ['usr-l05', 'crs-it-support', 5, 12],
    ['usr-l06', 'crs-uiux', 6, 75],
    ['usr-l07', 'crs-qms', 6, 310],
    ['usr-l09', 'crs-cyber', 4, 8],
    ['usr-l09', 'crs-cyber', 6, 5],
    ['usr-l11', 'crs-ml', 6, 25],
    ['usr-l13', 'crs-cloud', 3, 2],
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
    ['usr-learner', 'asg-pm', 'crs-pm', 165, 'graded', 92, 'Excellent charter — objectives are measurable and the risk register is thoughtful. Consider naming a backup sponsor.'],
    ['usr-l02', 'asg-pm', 'crs-pm', 240, 'graded', 90, 'Clear scope boundaries and a realistic milestone plan.'],
    ['usr-l02', 'asg-qms', 'crs-qms', 3, 'submitted', null, ''],
    ['usr-l03', 'asg-react', 'crs-react', 2, 'submitted', null, ''],
    ['usr-l04', 'asg-python', 'crs-python', 105, 'graded', 85, 'Solid analysis. The data-quality section could quantify the impact of missing values.'],
    ['usr-l05', 'asg-cyber', 'crs-cyber', 1, 'submitted', null, ''],
    ['usr-l06', 'asg-uiux', 'crs-uiux', 72, 'graded', 94, 'Wonderful research synthesis and a very clear flow.'],
    ['usr-l07', 'asg-qms', 'crs-qms', 305, 'graded', 88, 'Strong process map; the quality policy could be more concise.'],
    ['usr-l08', 'asg-marketing', 'crs-digital-marketing', 4, 'submitted', null, ''],
    ['usr-l09', 'asg-cyber', 'crs-cyber', 6, 'graded', 79, 'Good containment steps. Add who approves external communication.'],
    ['usr-l11', 'asg-ml', 'crs-ml', 22, 'submitted', null, ''],
    ['usr-l13', 'asg-cloud', 'crs-cloud', 5, 'resubmit', 62, 'The design is single-zone. Please revise to survive a zone failure and resubmit.'],
  ]
  const texts = {
    'asg-pm': 'Project charter for the "Learning Portal Launch" at Halcyon Logistics (fictional). Objectives: launch by Q3 with 80% staff activation. In scope: catalogue, SSO concept, reporting. Out of scope: payroll integration. Key risks: content readiness and change fatigue.',
    'asg-qms': 'Quality policy for Corvid Components plus a process map for "Order to Delivery" covering inputs, outputs, owners and three KPIs (on-time delivery, defect rate, customer complaints).',
    'asg-react': 'Repository: (demo link omitted). Built Button (primary/secondary/ghost), Card with header/footer slots, and a Modal with focus trap and Escape handling. README documents props.',
    'asg-python': 'West region led Q2 revenue. Home & Garden grew fastest (+11% MoM). 3.2% of rows lacked a region and were excluded after review.',
    'asg-cyber': 'Phishing playbook: detection via user reports and mail gateway alerts; contain by resetting credentials and revoking sessions; communicate via incident channel; review within 5 days.',
    'asg-uiux': 'Insights: shoppers abandon at shipping cost reveal and forced account creation. Redesign shows costs early and offers guest checkout. Test plan with 5 participants included.',
    'asg-marketing': 'Audience: urban professionals 25–40 who value sustainability. Channels: social (40%), email (25%), search (35%). KPI: 2,000 trial sign-ups. Experiment: subject-line A/B test.',
    'asg-ml': 'Compared logistic regression and gradient boosting. Boosting had higher recall (0.81 vs 0.74). Fairness: checked recall across age bands and found a gap for 18–24.',
    'asg-cloud': 'Single region, single zone design with a managed database and object storage for assets. IAM roles per service.',
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
    ['crs-react', 'usr-l03', 5, 'The projects are excellent and the explanations of effects finally made sense to me.', 'approved', 20],
    ['crs-react', 'usr-l16', 4, 'Great pacing. I would love more on testing, but overall very strong.', 'approved', 5],
    ['crs-python', 'usr-l04', 5, 'Perfect introduction for analysts. The cleaning module alone was worth it.', 'approved', 90],
    ['crs-python', 'usr-learner', 5, 'Clear, practical and well paced. The notebooks are easy to follow.', 'approved', 12],
    ['crs-ml', 'usr-l11', 5, 'Rigorous without being overwhelming. The responsible ML module is a highlight.', 'approved', 18],
    ['crs-ml', 'usr-l04', 4, 'Challenging in the evaluation section, but the quizzes help a lot.', 'approved', 6],
    ['crs-uiux', 'usr-l06', 5, 'Changed how I approach every design brief. Highly recommended.', 'approved', 60],
    ['crs-uiux', 'usr-l12', 4, 'Very practical research techniques.', 'pending', 2],
    ['crs-pm', 'usr-l02', 5, 'Templates are ready to use at work. Sofia explains things brilliantly.', 'approved', 200],
    ['crs-qms', 'usr-l07', 5, 'The best explanation of risk-based thinking I have come across.', 'approved', 280],
    ['crs-cyber', 'usr-l09', 4, 'Strong foundations and realistic scenarios.', 'approved', 4],
    ['crs-javascript', 'usr-learner', 4, 'A great first course. The async module could use one more example.', 'approved', 41],
    ['crs-cloud', 'usr-l13', 3, 'Good overview, though some lessons felt short.', 'pending', 1],
    ['crs-digital-marketing', 'usr-l08', 2, 'Buy cheap followers at my site!!! (spam)', 'hidden', 7],
  ]
  return specs.map(([courseId, userId, rating, text, status, daysAgo], i) => ({
    id: `rev-${String(i + 1).padStart(3, '0')}`, courseId, userId, rating, text, status,
    createdAt: new Date(now - daysAgo * DAY).toISOString(),
  }))
}

function buildAnnouncements(now) {
  const specs = [
    ['Welcome to the autumn learning season', 'New cohorts are starting across development, data and quality management. Set a weekly goal on your profile to stay on track.', 'learners', null, 'published', 14],
    ['New course: Generative AI for Professionals', 'Learn to use generative AI tools effectively and responsibly at work. The course is free to all learners in this demo.', 'learners', null, 'published', 11],
    ['ISO 9001 Essentials — live Q&A recap posted', 'A written recap of last week’s Q&A has been added to the course discussion board.', 'course', 'crs-qms', 'published', 8],
    ['Reminder: Python assignment due soon', 'The retail sales analysis assignment for Python for Data Analysis is due in a few days.', 'course', 'crs-python', 'published', 2],
    ['Tip: use notes and bookmarks while you learn', 'You can now bookmark lessons and keep personal notes in the course player. Everything stays in your browser.', 'learners', null, 'published', 5],
    ['Planned maintenance window (demo)', 'This is a sample scheduled announcement. No real maintenance will take place.', 'all', null, 'scheduled', -3],
    ['Instructor office hours pilot', 'We are piloting monthly office hours with instructors. Details to follow.', 'learners', null, 'draft', 1],
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
    ['announcement', 'Welcome to the autumn learning season', 'New cohorts are starting. Set a weekly goal to stay on track.', '/learn/dashboard', true, 14 * 24],
    ['announcement', 'New course: Generative AI for Professionals', 'A free course on using generative AI responsibly at work.', '/courses/generative-ai-for-professionals', false, 11 * 24],
    ['deadline', 'Assignment due soon', '“Analyse a retail sales dataset” is due in 3 days.', '/learn/course/crs-python', false, 30],
    ['course', 'Your instructor replied', 'Marcus Chen replied to your question in Python for Data Analysis.', '/learn/course/crs-python', false, 20],
    ['achievement', 'Achievement unlocked: 4-day streak', 'You have learned four days in a row. Keep it up!', '/learn/achievements', true, 26],
    ['announcement', 'Tip: use notes and bookmarks', 'Bookmark lessons and keep personal notes in the course player.', '/learn/my-learning', true, 5 * 24],
    ['system', 'Certificate available', 'Your demo certificate for JavaScript Fundamentals is ready.', '/learn/certificates', true, 40 * 24],
  ]
  return specs.map(([type, title, message, link, read, hoursAgo], i) => ({
    id: `ntf-${String(i + 1).padStart(3, '0')}`, userId: 'usr-learner', type, title, message, link, read,
    createdAt: new Date(now - hoursAgo * HOUR).toISOString(),
  }))
}

function buildDiscussions(now) {
  const t = (h) => new Date(now - h * HOUR).toISOString()
  return [
    { id: 'dsc-001', courseId: 'crs-python', userId: 'ins-marcus', title: 'Welcome! Introduce yourself here', pinned: true, status: 'visible', createdAt: t(24 * 40),
      body: 'Tell the group what brings you to data analysis and one dataset you would love to explore.',
      replies: [
        { id: 'rep-001', userId: 'usr-l04', body: 'Hi all — Grace from Nairobi. I want to analyse public transport ridership data.', createdAt: t(24 * 39), status: 'visible' },
        { id: 'rep-002', userId: 'usr-learner', body: 'Alex here! Moving from marketing into tech, keen to analyse campaign performance data.', createdAt: t(24 * 30), status: 'visible' },
      ] },
    { id: 'dsc-002', courseId: 'crs-python', userId: 'usr-learner', title: 'groupby returns a Series instead of a DataFrame?', pinned: false, status: 'visible', createdAt: t(26),
      body: 'When I run df.groupby("region")["revenue"].sum() I get a Series. How do I get a DataFrame back?',
      replies: [
        { id: 'rep-003', userId: 'ins-marcus', body: 'Great question! Add .reset_index() at the end, or select with double brackets: df.groupby("region")[["revenue"]].sum().', createdAt: t(20), status: 'visible' },
      ] },
    { id: 'dsc-003', courseId: 'crs-react', userId: 'usr-l03', title: 'When should I reach for context vs. props?', pinned: false, status: 'visible', createdAt: t(24 * 6),
      body: 'I am passing the user object through four levels of components. Is that the point to use context?',
      replies: [
        { id: 'rep-004', userId: 'ins-elena', body: 'Usually yes — if many distant components need the same value, context is a good fit. Start with composition first, though.', createdAt: t(24 * 5), status: 'visible' },
        { id: 'rep-005', userId: 'usr-l16', body: 'This helped me too, thanks!', createdAt: t(24 * 2), status: 'visible' },
      ] },
    { id: 'dsc-004', courseId: 'crs-react', userId: 'ins-elena', title: 'Project showcase thread', pinned: true, status: 'visible', createdAt: t(24 * 30),
      body: 'Share a screenshot or description of your module project and give feedback to two classmates.', replies: [] },
    { id: 'dsc-005', courseId: 'crs-uiux', userId: 'usr-l12', title: 'How many participants for a usability test?', pinned: false, status: 'visible', createdAt: t(24 * 4),
      body: 'Is five participants really enough?',
      replies: [{ id: 'rep-006', userId: 'ins-jonas', body: 'For finding the biggest problems in a qualitative test, five is a good start. Run several small rounds rather than one large one.', createdAt: t(24 * 3), status: 'visible' }] },
    { id: 'dsc-006', courseId: 'crs-qms', userId: 'ins-sofia', title: 'Live Q&A recap', pinned: true, status: 'visible', createdAt: t(24 * 8),
      body: 'Key themes: scoping the QMS, documenting risk-based thinking, and preparing internal auditors.', replies: [] },
    { id: 'dsc-007', courseId: 'crs-cyber', userId: 'usr-l09', title: 'Recommended home lab setup?', pinned: false, status: 'visible', createdAt: t(24 * 3),
      body: 'What is a safe way to practise log analysis at home?',
      replies: [{ id: 'rep-007', userId: 'usr-l05', body: 'Virtual machines on an isolated network worked well for me.', createdAt: t(24 * 2), status: 'visible' }] },
    { id: 'dsc-008', courseId: 'crs-digital-marketing', userId: 'usr-l08', title: 'Check out my promo codes', pinned: false, status: 'hidden', createdAt: t(24 * 7),
      body: 'Off-topic promotional content (hidden by moderator).', replies: [] },
  ]
}

function buildActivityLogs(now) {
  const specs = [
    ['course.published', 'course', 'crs-devops', 'DevOps with Docker & Kubernetes', 'Published course', 5],
    ['course.created', 'course', 'crs-devops', 'DevOps with Docker & Kubernetes', 'Created course draft', 6],
    ['course.created', 'course', 'crs-react-native', 'Mobile Apps with React Native', 'Created course draft', 18],
    ['course.updated', 'course', 'crs-react-native', 'Mobile Apps with React Native', 'Updated curriculum (3 modules)', 2],
    ['course.published', 'course', 'crs-genai', 'Generative AI for Professionals', 'Published course', 12],
    ['course.archived', 'course', 'crs-linux', 'Linux Command Line Essentials', 'Archived course', 30],
    ['announcement.published', 'announcement', 'ann-002', 'New course: Generative AI for Professionals', 'Audience: learners', 11],
    ['announcement.published', 'announcement', 'ann-004', 'Reminder: Python assignment due soon', 'Audience: course learners', 2],
    ['instructor.added', 'instructor', 'ins-ravi', 'Ravi Menon', 'Added instructor profile', 160],
    ['category.updated', 'category', 'cat-ai', 'Artificial Intelligence', 'Updated description', 25],
    ['enrollment.created', 'enrollment', 'enr-031', 'Diego Morales → DevOps with Docker & Kubernetes', 'Learner enrolment recorded', 4],
    ['enrollment.created', 'enrollment', 'enr-036', 'Isabella Rossi → Python for Data Analysis', 'Learner enrolment recorded', 4],
    ['review.hidden', 'review', 'rev-014', 'Digital Marketing Strategy', 'Hid spam review', 7],
    ['discussion.hidden', 'discussion', 'dsc-008', 'Check out my promo codes', 'Hid off-topic thread', 7],
    ['submission.graded', 'submission', 'sub-010', 'Write an incident response playbook', 'Grade: 79/100', 5],
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
    careerPaths,
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
      { userId: 'usr-learner', courseId: 'crs-ml', savedAt: new Date(now - 6 * DAY).toISOString() },
      { userId: 'usr-learner', courseId: 'crs-cyber', savedAt: new Date(now - 2 * DAY).toISOString() },
      { userId: 'usr-l03', courseId: 'crs-node', savedAt: new Date(now - 9 * DAY).toISOString() },
      { userId: 'usr-l04', courseId: 'crs-deep-learning', savedAt: new Date(now - 12 * DAY).toISOString() },
    ],
    notes: [
      { id: 'note-001', userId: 'usr-learner', courseId: 'crs-python', lessonId: 'crs-python-m2-l1',
        text: 'Series = one labelled column. DataFrame = table of Series sharing an index. Use df.info() first!', updatedAt: new Date(now - 8 * DAY).toISOString() },
      { id: 'note-002', userId: 'usr-learner', courseId: 'crs-python', lessonId: 'crs-python-m2-l3',
        text: 'Cleaning checklist: duplicates, missing values, inconsistent categories, wrong types.', updatedAt: new Date(now - 3 * DAY).toISOString() },
    ],
    bookmarks: [
      { userId: 'usr-learner', courseId: 'crs-python', lessonId: 'crs-python-m2-l4', createdAt: new Date(now - 2 * DAY).toISOString() },
    ],
    settings: { ...DEFAULT_SETTINGS },
    content: homepageContent,
  }
}

export const COLLECTION_KEYS = [
  'courses', 'categories', 'instructors', 'users', 'careerPaths', 'quizzes', 'assignments', 'enrollments',
  'quizAttempts', 'submissions', 'reviews', 'announcements', 'notifications', 'discussions', 'activityLogs',
  'learningActivity', 'saved', 'notes', 'bookmarks', 'settings', 'content',
]
