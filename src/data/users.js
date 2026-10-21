import { portrait } from './images'

const DAY = 24 * 60 * 60 * 1000

/**
 * Demo credentials. Authentication is simulated entirely in the browser —
 * these are NOT real accounts and must never be treated as secure.
 */
export const DEMO_ACCOUNTS = {
  admin: { email: 'admin@meridianlms.demo', password: 'Admin123!', userId: 'usr-admin' },
  learner: { email: 'learner@meridianlms.demo', password: 'Learner123!', userId: 'usr-learner' },
}

export const DEFAULT_NOTIFICATION_PREFS = {
  courseUpdates: true,
  announcements: true,
  deadlineReminders: true,
  weeklySummary: false,
  marketing: false,
}

const LEARNER_SPECS = [
  ['usr-learner', 'Alex Morgan', 'learner@meridianlms.demo', 'Operations coordinator, aspiring quality auditor', 'Dammam, Saudi Arabia', ['Internal Auditor', 'Lead Auditor', 'Safety & Environment'], 'active', 210, 'photo-1539571696357-5a69c17a67c6'],
  ['usr-l02', 'Nadia Haddad', 'nadia.haddad@example.com', 'Quality manager', 'Amman, Jordan', ['Lead Auditor', 'Leadership & Management'], 'active', 340, 'photo-1544005313-94ddf0286df2'],
  ['usr-l03', 'Tomás Ribeiro', 'tomas.ribeiro@example.com', 'QA/QC engineer', 'Porto, Portugal', ['Internal Auditor', 'Leadership & Management'], 'active', 280, null],
  ['usr-l04', 'Grace Mwangi', 'grace.mwangi@example.com', 'Environmental officer', 'Nairobi, Kenya', ['Internal Auditor', 'Lead Auditor'], 'active', 190, 'photo-1531123897727-8f129e1688ce'],
  ['usr-l05', 'Ethan Clarke', 'ethan.clarke@example.com', 'HSE supervisor', 'Leeds, United Kingdom', ['Safety & Environment'], 'active', 155, null],
  ['usr-l06', 'Mei Tanaka', 'mei.tanaka@example.com', 'Food safety coordinator', 'Osaka, Japan', ['Internal Auditor'], 'active', 120, 'photo-1534528741775-53994a69daeb'],
  ['usr-l07', 'Omar Siddiqui', 'omar.siddiqui@example.com', 'Quality engineer', 'Karachi, Pakistan', ['Lead Auditor', 'Leadership & Management'], 'active', 400, null],
  ['usr-l08', 'Lucía Fernández', 'lucia.fernandez@example.com', 'Training coordinator', 'Valencia, Spain', ['Leadership & Management'], 'active', 95, 'photo-1438761681033-6461ffad8d80'],
  ['usr-l09', 'Kwame Asante', 'kwame.asante@example.com', 'Information security analyst', 'Accra, Ghana', ['Lead Auditor', 'Internal Auditor'], 'active', 260, null],
  ['usr-l10', 'Sophie Laurent', 'sophie.laurent@example.com', 'Project coordinator', 'Lyon, France', ['Exam Preparation'], 'inactive', 480, null],
  ['usr-l11', 'Arjun Patel', 'arjun.patel@example.com', 'Continuous improvement engineer', 'Pune, India', ['Leadership & Management'], 'active', 70, 'photo-1506794778202-cad84cf45f1d'],
  ['usr-l12', 'Hannah Becker', 'hannah.becker@example.com', 'Facility manager', 'Hamburg, Germany', ['Lead Auditor', 'Internal Auditor'], 'active', 45, null],
  ['usr-l13', 'Diego Morales', 'diego.morales@example.com', 'Energy engineer', 'Bogotá, Colombia', ['Internal Auditor', 'Lead Auditor'], 'active', 30, null],
  ['usr-l14', 'Fatima Zahra', 'fatima.zahra@example.com', 'Project manager', 'Casablanca, Morocco', ['Exam Preparation', 'Leadership & Management'], 'active', 22, null],
  ['usr-l15', 'Liam O\'Connor', 'liam.oconnor@example.com', 'Site supervisor', 'Cork, Ireland', ['Safety & Environment'], 'suspended', 150, null],
  ['usr-l16', 'Yuki Sato', 'yuki.sato@example.com', 'Risk analyst', 'Sapporo, Japan', ['Exam Preparation', 'Lead Auditor'], 'active', 15, null],
  ['usr-l17', 'Amelia Novak', 'amelia.novak@example.com', 'HR business partner', 'Prague, Czechia', ['Leadership & Management'], 'active', 11, 'photo-1517841905240-472988babdf9'],
  ['usr-l18', 'Samuel Adeyemi', 'samuel.adeyemi@example.com', 'Construction safety officer', 'Lagos, Nigeria', ['Safety & Environment', 'Internal Auditor'], 'active', 8, null],
  ['usr-l19', 'Isabella Rossi', 'isabella.rossi@example.com', 'Quality assistant', 'Bologna, Italy', ['Internal Auditor'], 'active', 5, null],
  ['usr-l20', 'Noah Kim', 'noah.kim@example.com', 'Fleet driver', 'Busan, South Korea', ['Safety & Environment'], 'inactive', 60, null],
]

export function buildUsers(now) {
  const learners = LEARNER_SPECS.map(([id, name, email, title, location, interests, status, joinedDaysAgo, photo]) => ({
    id,
    name,
    email,
    role: 'learner',
    avatar: photo ? portrait(photo) : '',
    title,
    location,
    bio: id === 'usr-learner'
      ? 'Operations coordinator building a career in quality and HSE. Working towards ISO lead auditor qualifications one module at a time.'
      : `${title} based in ${location}. Learning on Meridian to grow in ${interests[0].toLowerCase()}.`,
    interests,
    language: 'English',
    weeklyGoalHours: id === 'usr-learner' ? 5 : 3,
    notificationPrefs: { ...DEFAULT_NOTIFICATION_PREFS },
    status,
    joinedAt: new Date(now - joinedDaysAgo * DAY).toISOString(),
    demoPassword: id === 'usr-learner' ? DEMO_ACCOUNTS.learner.password : null,
  }))

  const admin = {
    id: 'usr-admin',
    name: 'Jordan Hayes',
    email: DEMO_ACCOUNTS.admin.email,
    role: 'admin',
    avatar: portrait('photo-1573164713988-8665fc963095'),
    title: 'Platform Administrator',
    location: 'Remote',
    bio: 'Manages the Meridian training catalogue, trainers and learner support.',
    interests: [],
    language: 'English',
    weeklyGoalHours: 0,
    notificationPrefs: { ...DEFAULT_NOTIFICATION_PREFS },
    status: 'active',
    joinedAt: new Date(now - 800 * DAY).toISOString(),
    demoPassword: DEMO_ACCOUNTS.admin.password,
  }

  return [admin, ...learners]
}
