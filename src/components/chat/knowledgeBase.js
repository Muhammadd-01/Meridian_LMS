import { DEMO_ACCOUNTS } from '../../data/users'
import { normalise, searchItems } from '../../utils/query'
import { COMPANY, SERVICES, INDUSTRIES } from '../../data/companyInfo'

/**
 * Rule-based assistant for the Meridian LMS demo. It matches the visitor's message against
 * intents (keyword phrases) and answers from the live catalogue data — there is no AI model
 * or server involved. Replies: { text, links: [{label,to}], courses: [course], chips: [string] }
 */

const STOPWORDS = new Set(('a an the i me my we you your to for of on in at by with about and or is are am be can could would should do does did ' +
  'want wanna like need looking look find show give get any some course courses class classes training trainings program programme programs ' +
  'learn learning study studying teach me please recommend suggest suggestion something what which who how where when there here that this ' +
  'have has offer offers available tell know more info information best good new start started beginner advanced intermediate').split(' '))

const DEFAULT_CHIPS = ['Find a course', 'ISO auditor training', 'Safety courses', 'Services', 'How do I enroll?', 'Contact Meridian']

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
/** True when any phrase appears at a word start (so "enrol" matches "enrolment" but "test" ignores "latest"). */
const has = (text, phrases) => phrases.some((p) => new RegExp(`(^|[^a-z0-9])${escapeRe(p)}`).test(text))

function courseResults(data, query, limit = 3) {
  const published = data.courses.filter((c) => c.status === 'published')
  const terms = normalise(query).split(/[^a-z0-9+#]+/).filter((t) => t.length > 1 && !STOPWORDS.has(t))
  if (!terms.length) return []
  const fields = ['title', 'shortDescription', 'providerName', (c) => c.skills, (c) => c.tags,
    (c) => data.categories.find((x) => x.id === c.categoryId)?.name, (c) => data.instructors.find((i) => i.id === c.instructorId)?.name]
  // Prefer courses matching every term; fall back to the best single-term matches.
  let results = searchItems(published, terms.join(' '), fields)
  if (!results.length) {
    const scored = published
      .map((c) => ({ c, score: terms.filter((t) => searchItems([c], t, fields).length).length }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || b.c.rating - a.c.rating)
    results = scored.map((x) => x.c)
  }
  return results.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating).slice(0, limit)
}

const INTENTS = [
  {
    id: 'greeting',
    match: (t) => /^(hi|hello|hey|salam|assalam|good (morning|afternoon|evening)|yo|hola)\b/.test(t),
    reply: (data, ctx) => ({
      text: `Hello${ctx.user ? `, ${ctx.user.name.split(' ')[0]}` : ''}! 👋 I'm **Meri**, the Meridian learning assistant. I can help you find courses, explain ISO auditor and safety training, and show you how the platform works. What would you like to do?`,
      chips: DEFAULT_CHIPS,
    }),
  },
  {
    id: 'thanks',
    match: (t) => has(t, ['thank', 'thanks', 'thx', 'great help', 'appreciate', 'jazak']),
    reply: () => ({ text: 'You’re welcome! Anything else I can help you with?', chips: ['Find a course', 'Services', 'Contact Meridian'] }),
  },
  {
    id: 'bye',
    match: (t) => /\b(bye|goodbye|see you|that'?s all)\b/.test(t),
    reply: () => ({ text: 'Goodbye, and happy learning! You can reopen this chat any time from the bottom-right corner.' }),
  },
  {
    id: 'iso',
    match: (t) => has(t, ['iso', 'auditor', 'audit', 'qms', 'ems', 'isms', '9001', '14001', '45001', '27001', '22000', '50001', '31000', '41001', '19011', 'quality management', 'schedule q', 'aramco']),
    reply: (data, ctx, raw) => {
      const iso = (c) => c.categoryId === 'cat-internal-auditor' || c.categoryId === 'cat-lead-auditor'
      const specific = courseResults(data, raw, 4).filter(iso)
      const list = specific.length ? specific : data.courses.filter((c) => iso(c) && c.status === 'published' && c.featured).slice(0, 3)
      return {
        text: 'Meridian offers **ISO Internal Auditor** (about 16 hours) and **ISO Lead Auditor** (about 40 hours) training for ISO 9001, ISO 14001, ISO 45001, ISO/IEC 27001, ISO 22000, ISO 50001, ISO 41001 and ISO 31000, all following ISO 19011 audit guidance. Internal auditor courses suit people auditing their own organisation; lead auditor courses prepare you to lead first-, second- and third-party audits.',
        courses: list,
        links: [{ label: 'Internal Auditor courses', to: '/courses?category=internal-auditor' }, { label: 'Lead Auditor courses', to: '/courses?category=lead-auditor' }],
        chips: ['Internal vs lead auditor?', 'ISO 45001 courses', 'Safety (HSE) courses'],
      }
    },
  },
  {
    id: 'internal-vs-lead',
    priority: 2,
    match: (t) => has(t, ['internal vs lead', 'difference between internal', 'internal or lead', 'lead or internal']),
    reply: () => ({
      text: '**Internal Auditor** (≈16 hrs, Intermediate): learn the standard and ISO 19011 so you can audit your own organisation’s management system.\n\n**Lead Auditor** (≈40 hrs, Advanced): everything in the internal course plus leading audit teams, certification-audit context (ISO/IEC 17021) and a case-study exam preparation. Start with Internal Auditor if you’re new to auditing.',
      links: [{ label: 'Internal Auditor track', to: '/courses?category=internal-auditor' }, { label: 'Lead Auditor track', to: '/courses?category=lead-auditor' }],
      chips: ['ISO 9001 Lead Auditor', 'Find a course'],
    }),
  },
  {
    id: 'hse',
    match: (t) => has(t, ['safety', 'hse', 'osha', 'fire', 'first aid', 'cpr', 'aed', 'driving', 'driver', 'hazard', 'health and safety']),
    reply: (data, ctx, raw) => {
      const specific = courseResults(data, raw, 3).filter((c) => c.categoryId === 'cat-safety' || c.id.startsWith('crs-iso45001'))
      const list = specific.length ? specific : data.courses.filter((c) => c.categoryId === 'cat-safety' && c.status === 'published').slice(0, 3)
      return {
        text: 'The **Safety & Environment** track includes OSHA 10 & 30 Hour, Fire Safety Awareness & Fire Fighting, First Aid/CPR/AED and Defensive Driving — plus ISO 45001 Internal and Lead Auditor courses for OH&S management systems.',
        courses: list,
        links: [{ label: 'Safety & Environment courses', to: '/courses?category=safety-environment' }],
        chips: ['ISO 45001 courses', 'Fire safety', 'How do I enroll?'],
      }
    },
  },
  {
    id: 'lean',
    match: (t) => has(t, ['six sigma', 'lean', 'green belt', 'black belt', 'dmaic', '5s', 'kaizen', 'process improvement']),
    reply: (data) => ({
      text: 'For process improvement we have **Lean Six Sigma Green Belt** (DMAIC, root cause analysis, SPC), **Black Belt** (advanced statistics and change leadership) and a free **5S Workplace Organization** course.',
      courses: data.courses.filter((c) => ['crs-lss-gb', 'crs-lss-bb', 'crs-5s'].includes(c.id)),
      chips: ['PMP exam prep', 'Find a course'],
    }),
  },
  {
    id: 'pm',
    match: (t) => has(t, ['pmp', 'rmp', 'exam', 'project management', 'project manager', 'risk management', 'business continuity', '22301', 'train the trainer', 'trainer course']),
    reply: (data, ctx, raw) => ({
      text: 'For exams and management, Meridian offers **PMP® Exam Preparation**, **PMI-RMP® Exam Preparation**, **ISO 31000 Lead Auditor (risk management)**, **Business Continuity Management (ISO 22301)** and **Train the Trainer**.',
      courses: courseResults(data, raw, 3).length ? courseResults(data, raw, 3) : data.courses.filter((c) => ['crs-pmp', 'crs-rmp', 'crs-bcm'].includes(c.id)),
      chips: ['Lean Six Sigma', 'Find a course'],
    }),
  },
  {
    id: 'categories',
    match: (t) => has(t, ['categor', 'topics', 'subjects', 'what can i learn', 'what do you teach', 'areas']),
    reply: (data) => {
      const cats = [...data.categories].sort((a, b) => a.order - b.order)
      return {
        text: `We have **${cats.length} categories**: ${cats.map((c) => c.name).join(', ')}.`,
        links: [{ label: 'Browse all categories', to: '/categories' }, ...cats.slice(0, 3).map((c) => ({ label: c.name, to: `/courses?category=${c.slug}` }))],
        chips: ['ISO auditor training', 'Safety (HSE) courses', 'Exam preparation'],
      }
    },
  },
  {
    id: 'enroll',
    match: (t) => has(t, ['enrol', 'enroll', 'join a course', 'sign up for', 'register for', 'how to start', 'start a course', 'buy']),
    reply: (data, ctx) => ({
      text: `Enrolling takes three steps:\n1. Open any course page from the catalogue.\n2. ${ctx.user ? 'Click **Enroll**' : '**Sign in** (or join for free), then click **Enroll**'} — no payment is taken in this demo.\n3. Find it under **My Learning** and press **Start learning**. Your progress saves automatically.`,
      links: [{ label: 'Browse courses', to: '/courses' }, ...(ctx.user ? [{ label: 'My Learning', to: '/learn/my-learning' }] : [{ label: 'Sign in', to: '/login' }])],
      chips: ['Are courses free?', 'Certificates', 'Demo login details'],
    }),
  },
  {
    id: 'price',
    match: (t) => has(t, ['price', 'cost', 'fee', 'free', 'pay', 'payment', 'discount', 'cheap', 'how much']),
    reply: (data) => {
      const free = data.courses.filter((c) => c.status === 'published' && c.access === 'free').length
      return {
        text: `This is a demo, so **no payment is ever requested or processed**. ${free} courses are marked Free; the others show a *demo price* label to illustrate how paid programmes would appear. You can enroll in any published course at no cost.`,
        links: [{ label: 'Free courses', to: '/courses?access=free' }],
        chips: ['How do I enroll?', 'For Business'],
      }
    },
  },
  {
    id: 'certificate',
    match: (t) => has(t, ['certificate', 'certification', 'certified', 'credential', 'accredit', 'verify']),
    reply: (data, ctx) => ({
      text: 'Complete every **required lesson** in a course (quizzes need a passing score) and a **demo certificate** appears under *Certificates*. You can preview it, print/save it as a PDF and copy a share link. Note: demo certificates are illustrative and are not externally verified credentials.',
      links: [...(ctx.user?.role === 'learner' ? [{ label: 'My certificates', to: '/learn/certificates' }] : [{ label: 'Sign in to view certificates', to: '/login' }]), { label: 'Verify a certificate', to: '/verify-certificate' }],
      chips: ['How is progress tracked?', 'Find a course'],
    }),
  },
  {
    id: 'progress',
    match: (t) => has(t, ['progress', 'track', 'resume', 'continue', 'complete a lesson', 'mark complete', 'streak', 'goal']),
    reply: () => ({
      text: 'Progress is the share of **required lessons** you’ve completed (resource lessons are optional) and never exceeds 100%. Mark videos and readings complete, pass quizzes and submit assignments. The course player remembers your last lesson, and your dashboard shows study time, streaks and weekly goals.',
      links: [{ label: 'My dashboard', to: '/learn/dashboard' }],
      chips: ['Quizzes & assignments', 'Certificates'],
    }),
  },
  {
    id: 'assessment',
    match: (t) => has(t, ['quiz', 'exam', 'test', 'assignment', 'grade', 'retake', 'score', 'pass mark']),
    reply: () => ({
      text: '**Quizzes** are multiple choice with explanations after you submit; some are timed (the timer runs in your browser). You can **retake** them and your attempt history is saved. **Assignments** are submitted in the course player and graded by the demo admin, who can also request a resubmission.',
      chips: ['Certificates', 'How is progress tracked?'],
    }),
  },
  {
    id: 'login',
    match: (t) => has(t, ['login', 'log in', 'sign in', 'signin', 'password', 'credential', 'demo account', 'admin account', 'learner account', 'account']),
    reply: (data, ctx) => ({
      text: `Use these demo accounts (authentication is simulated in your browser):\n- **Learner:** ${DEMO_ACCOUNTS.learner.email} / ${DEMO_ACCOUNTS.learner.password}\n- **Admin:** ${DEMO_ACCOUNTS.admin.email} / ${DEMO_ACCOUNTS.admin.password}\n\nThe sign-in page also has quick-fill buttons.${ctx.user ? ` You’re currently signed in as **${ctx.user.name}** (${ctx.user.role}).` : ''}`,
      links: ctx.user ? [] : [{ label: 'Go to sign in', to: '/login' }, { label: 'Join for free', to: '/register' }],
      chips: ['How do I enroll?', 'Is my data private?'],
    }),
  },
  {
    id: 'register',
    priority: 1,
    match: (t) => has(t, ['create account', 'sign up', 'signup', 'register', 'new account', 'join for free']),
    reply: () => ({
      text: 'Click **Join for Free** to create a local demo learner profile — it’s stored only in this browser (don’t reuse a real password). Then browse the catalogue and enroll.',
      links: [{ label: 'Join for free', to: '/register' }],
      chips: ['Demo login details', 'Find a course'],
    }),
  },
  {
    id: 'privacy',
    match: (t) => has(t, ['privacy', 'my data', 'data stored', 'where is my data', 'stored', 'localstorage', 'local storage', 'reset', 'delete my', 'is it secure']),
    reply: () => ({
      text: 'Everything you do is saved in your browser’s **LocalStorage** (keys starting with “meridian.v1”) — nothing is sent to a server. You can restore the original sample data any time with **Reset demo data** in Settings. LocalStorage isn’t encrypted, so avoid entering sensitive information.',
      links: [{ label: 'Privacy notice', to: '/privacy' }, { label: 'Help centre', to: '/help' }],
    }),
  },
  {
    id: 'services',
    match: (t) => has(t, ['service', 'advisory', 'compliance', 'sustainab', 'esg', 'wellbeing', 'well-being', 'leed', 'carbon', 'consult', 'certification support', 'ecovadis', 'mostadam']),
    reply: () => ({
      text: `Beyond training, MEQMP offers ${SERVICES.map((s) => `**${s.title}**`).join(', ')}. Examples include Lean Six Sigma consulting, ISO and legal compliance audits, risk assessments, carbon footprint assessment, LEED/Mostadam/EcoVadis certification support and employee wellbeing programmes.`,
      links: [{ label: 'Explore services', to: '/services' }, { label: 'Book a strategy call', to: '/business' }],
      chips: ['Industries you serve', 'Contact Meridian'],
    }),
  },
  {
    id: 'industries',
    match: (t) => has(t, ['industr', 'sector', 'oil', 'gas', 'construction', 'healthcare', 'banking', 'hospitality', 'manufactur']),
    reply: () => ({
      text: `MEQMP works with organisations in ${INDUSTRIES.join(', ')}.`,
      links: [{ label: 'About MEQMP', to: '/about' }],
      chips: ['Services', 'ISO auditor training'],
    }),
  },
  {
    id: 'about',
    match: (t) => has(t, ['about', 'meridian', 'meqmp', 'company', 'who are you', 'who is', 'history', 'since', 'experience']),
    reply: () => ({
      text: `**${COMPANY.name} (MEQMP)** is an ISO 9001:2015 certified organisation providing advisory, training, compliance, sustainability and corporate wellbeing services across the Middle East, Asia and North America since ${COMPANY.since}. It was the first TVTC foreign registered training center in Saudi Arabia, and MEQMP reports 530+ consultancy projects and 2500+ trainings. Offices: Saudi Arabia, Bahrain, Pakistan and Canada.`,
      links: [{ label: 'About us', to: '/about' }, { label: 'Services', to: '/services' }],
      chips: ['ISO auditor training', 'Contact Meridian', 'Industries you serve'],
    }),
  },
  {
    id: 'contact',
    match: (t) => has(t, ['contact', 'phone', 'email', 'call', 'office', 'location', 'address', 'where are you', 'reach', 'talk to', 'human', 'support team']),
    reply: () => ({
      text: `You can reach Meridian by phone at **${COMPANY.phone}** or by email at **${COMPANY.email}**. Offices: **Saudi Arabia · Bahrain · Pakistan · Canada**. (The contact form on this demo site doesn’t send messages.)`,
      links: [{ label: 'Contact form', to: '/contact' }, { label: 'Help centre', to: '/help' }],
    }),
  },
  {
    id: 'business',
    match: (t) => has(t, ['business', 'corporate', 'company training', 'team', 'employees', 'organisation', 'organization', 'bulk', 'group training']),
    reply: () => ({
      text: 'Meridian for Business supports team training with tailored training plans, progress analytics and quality-focused content. Request a (demo) consultation on the For Business page.',
      links: [{ label: 'Meridian for Business', to: '/business' }],
      chips: ['ISO auditor training', 'Safety (HSE) courses'],
    }),
  },
  {
    id: 'instructors',
    match: (t) => has(t, ['instructor', 'teacher', 'trainer', 'tutor', 'faculty', 'who teaches']),
    reply: (data) => ({
      text: `Our courses are taught by ${data.instructors.length} instructors (fictional demo profiles), including ${data.instructors.slice(0, 3).map((i) => `${i.name} (${i.title})`).join(', ')}.`,
      links: [{ label: 'Meet the instructors', to: '/instructors' }],
    }),
  },
  {
    id: 'admin',
    match: (t) => has(t, ['admin', 'dashboard', 'manage course', 'create course', 'analytics']),
    reply: (data, ctx) => ({
      text: ctx.user?.role === 'admin'
        ? 'As an admin you can create and publish courses with a curriculum builder, manage categories, instructors and learners, grade assignments, moderate reviews and discussions, publish announcements and view analytics.'
        : 'The admin console lets the demo administrator manage courses, learners, assessments, announcements and analytics. Sign in with the admin demo account to explore it.',
      links: ctx.user?.role === 'admin' ? [{ label: 'Admin dashboard', to: '/admin/dashboard' }, { label: 'Create a course', to: '/admin/courses/new' }] : [{ label: 'Demo sign in', to: '/login' }],
    }),
  },
  {
    id: 'help',
    match: (t) => has(t, ['help', 'how does', 'how do', 'support', 'faq', 'question', 'problem', 'not working', 'issue']),
    reply: () => ({
      text: 'Here are some things I can help with:',
      chips: DEFAULT_CHIPS,
      links: [{ label: 'Help centre', to: '/help' }],
    }),
  },
]

/** Builds the assistant's reply for a user message. */
export function getBotReply(message, data, ctx = {}) {
  const raw = message.trim()
  const t = normalise(raw)
  if (!t) return { text: 'Type a question, or pick one of the suggestions below.', chips: DEFAULT_CHIPS }

  if (t === 'find a course' || t === 'find course') {
    return { text: 'Sure! What would you like to learn? Try a topic like “ISO 9001”, “lead auditor”, “fire safety” or “PMP”.', chips: ['ISO 9001', 'Fire safety', 'Six Sigma', 'PMP exam'] }
  }

  const matched = INTENTS.filter((intent) => intent.match(t)).sort((a, b) => (b.priority || 0) - (a.priority || 0))
  const explicitCourseAsk = /\b(course|courses|learn|training|class|teach|recommend|suggest|study)\b/.test(t)
  const results = courseResults(data, raw, 3)

  // Topic-specific intents first (they include relevant courses), then general ones.
  if (matched.length) {
    const reply = matched[0].reply(data, ctx, raw)
    if (!reply.courses && explicitCourseAsk && results.length && !['enroll', 'price', 'certificate', 'login', 'register'].includes(matched[0].id)) {
      reply.courses = results
    }
    return reply
  }

  if (results.length) {
    return {
      text: results.length === 1 ? `Here is a course that matches “${raw}”:` : `Here are ${results.length} courses that match “${raw}”:`,
      courses: results,
      links: [{ label: `See all results for “${raw}”`, to: `/courses?q=${encodeURIComponent(raw)}` }],
      chips: ['How do I enroll?', 'Services'],
    }
  }

  return {
    text: 'Sorry, I don’t have an answer for that yet. I’m a simple assistant with predefined answers about Meridian courses and this website. Try one of these, or browse the help centre:',
    chips: DEFAULT_CHIPS,
    links: [{ label: 'Help centre', to: '/help' }, { label: 'Contact us', to: '/contact' }],
  }
}

export const WELCOME_CHIPS = DEFAULT_CHIPS
