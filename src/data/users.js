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
  ['usr-learner', 'Alex Morgan', 'learner@meridianlms.demo', 'Aspiring frontend developer', 'Toronto, Canada', ['Development', 'Data Science', 'Design'], 'active', 210, 'photo-1539571696357-5a69c17a67c6'],
  ['usr-l02', 'Nadia Haddad', 'nadia.haddad@example.com', 'Operations analyst', 'Amman, Jordan', ['Business', 'Data Science'], 'active', 340, 'photo-1544005313-94ddf0286df2'],
  ['usr-l03', 'Tomás Ribeiro', 'tomas.ribeiro@example.com', 'Junior developer', 'Porto, Portugal', ['Development', 'Cloud Computing'], 'active', 280, null],
  ['usr-l04', 'Grace Mwangi', 'grace.mwangi@example.com', 'Data analyst', 'Nairobi, Kenya', ['Data Science', 'Artificial Intelligence'], 'active', 190, 'photo-1531123897727-8f129e1688ce'],
  ['usr-l05', 'Ethan Clarke', 'ethan.clarke@example.com', 'IT support specialist', 'Leeds, United Kingdom', ['Information Technology', 'Cybersecurity'], 'active', 155, null],
  ['usr-l06', 'Mei Tanaka', 'mei.tanaka@example.com', 'Product designer', 'Osaka, Japan', ['Design'], 'active', 120, 'photo-1534528741775-53994a69daeb'],
  ['usr-l07', 'Omar Siddiqui', 'omar.siddiqui@example.com', 'Quality engineer', 'Karachi, Pakistan', ['Business', 'Personal Development'], 'active', 400, null],
  ['usr-l08', 'Lucía Fernández', 'lucia.fernandez@example.com', 'Marketing coordinator', 'Valencia, Spain', ['Marketing', 'Personal Development'], 'active', 95, 'photo-1438761681033-6461ffad8d80'],
  ['usr-l09', 'Kwame Asante', 'kwame.asante@example.com', 'Security analyst', 'Accra, Ghana', ['Cybersecurity', 'Cloud Computing'], 'active', 260, null],
  ['usr-l10', 'Sophie Laurent', 'sophie.laurent@example.com', 'Project coordinator', 'Lyon, France', ['Business'], 'inactive', 480, null],
  ['usr-l11', 'Arjun Patel', 'arjun.patel@example.com', 'ML engineer', 'Pune, India', ['Artificial Intelligence', 'Data Science'], 'active', 70, 'photo-1506794778202-cad84cf45f1d'],
  ['usr-l12', 'Hannah Becker', 'hannah.becker@example.com', 'UX researcher', 'Hamburg, Germany', ['Design', 'Marketing'], 'active', 45, null],
  ['usr-l13', 'Diego Morales', 'diego.morales@example.com', 'Cloud engineer', 'Bogotá, Colombia', ['Cloud Computing', 'Development'], 'active', 30, null],
  ['usr-l14', 'Fatima Zahra', 'fatima.zahra@example.com', 'Business student', 'Casablanca, Morocco', ['Business', 'Marketing'], 'active', 22, null],
  ['usr-l15', 'Liam O\'Connor', 'liam.oconnor@example.com', 'Career changer', 'Cork, Ireland', ['Development', 'Information Technology'], 'suspended', 150, null],
  ['usr-l16', 'Yuki Sato', 'yuki.sato@example.com', 'Frontend developer', 'Sapporo, Japan', ['Development', 'Design'], 'active', 15, null],
  ['usr-l17', 'Amelia Novak', 'amelia.novak@example.com', 'HR business partner', 'Prague, Czechia', ['Personal Development', 'Business'], 'active', 11, 'photo-1517841905240-472988babdf9'],
  ['usr-l18', 'Samuel Adeyemi', 'samuel.adeyemi@example.com', 'Systems administrator', 'Lagos, Nigeria', ['Information Technology', 'Cloud Computing'], 'active', 8, null],
  ['usr-l19', 'Isabella Rossi', 'isabella.rossi@example.com', 'Data science student', 'Bologna, Italy', ['Data Science', 'Artificial Intelligence'], 'active', 5, null],
  ['usr-l20', 'Noah Kim', 'noah.kim@example.com', 'Security student', 'Busan, South Korea', ['Cybersecurity'], 'inactive', 60, null],
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
      ? 'Marketing coordinator turned aspiring frontend developer. Learning a little every day and building a portfolio along the way.'
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
    bio: 'Keeps the Meridian catalogue healthy and learners supported.',
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
