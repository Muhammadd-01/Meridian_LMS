import { portrait } from './images'

/** Fictional instructors. Ratings and learner counts are illustrative demo data. */
export const instructors = [
  {
    id: 'ins-elena', name: 'Dr. Elena Vasquez', title: 'Principal Frontend Engineer',
    organization: 'Larkspur Institute of Technology',
    avatar: portrait('photo-1494790108377-be9c29b29330'),
    bio: 'Elena has spent fourteen years building large-scale web interfaces, most recently leading a frontend platform team that serves dozens of product squads. She focuses on component architecture, accessibility and teaching engineers to reason about state. Her courses are known for small, practical projects that build into a portfolio.',
    expertise: ['React', 'JavaScript', 'Accessibility', 'Frontend Architecture'],
    rating: 4.8, learners: 48200, status: 'active', website: '', joinedAt: '2022-02-14',
  },
  {
    id: 'ins-marcus', name: 'Marcus Chen', title: 'Senior Data Scientist',
    organization: 'Harborline Data Lab',
    avatar: portrait('photo-1507003211169-0a1dd7228f2d'),
    bio: 'Marcus helps teams turn raw operational data into decisions. He has built forecasting models for logistics and retail, and believes every analysis should end with a clear recommendation. He teaches Python, SQL and data storytelling with realistic datasets.',
    expertise: ['Python', 'pandas', 'SQL', 'Data Visualisation'],
    rating: 4.7, learners: 39100, status: 'active', website: '', joinedAt: '2022-05-03',
  },
  {
    id: 'ins-priya', name: 'Dr. Priya Raman', title: 'Machine Learning Research Lead',
    organization: 'Larkspur Institute of Technology',
    avatar: portrait('photo-1573496359142-b8d87734a5a2'),
    bio: 'Priya leads applied machine-learning research with a focus on model evaluation and responsible AI. She previously taught graduate courses in statistical learning and now designs accessible ML curricula for working professionals.',
    expertise: ['Machine Learning', 'Deep Learning', 'Responsible AI', 'Statistics'],
    rating: 4.9, learners: 52700, status: 'active', website: '', joinedAt: '2021-11-20',
  },
  {
    id: 'ins-jonas', name: 'Jonas Albrecht', title: 'Product Design Director',
    organization: 'Atelier Nine Design School',
    avatar: portrait('photo-1500648767791-00dcc994a43e'),
    bio: 'Jonas has directed design for consumer and enterprise products for over a decade. He teaches a research-first approach to UX, and how design systems help teams ship consistent, accessible interfaces faster.',
    expertise: ['UX Research', 'Interface Design', 'Design Systems', 'Prototyping'],
    rating: 4.8, learners: 27600, status: 'active', website: '', joinedAt: '2022-08-09',
  },
  {
    id: 'ins-amara', name: 'Amara Okafor', title: 'Cloud Solutions Architect',
    organization: 'Stratus Cloud Collective',
    avatar: portrait('photo-1531123897727-8f129e1688ce'),
    bio: 'Amara designs resilient cloud platforms for regulated industries. She is passionate about infrastructure as code, cost awareness and making DevOps practices approachable for teams new to the cloud.',
    expertise: ['Cloud Architecture', 'Kubernetes', 'DevOps', 'Linux'],
    rating: 4.7, learners: 31800, status: 'active', website: '', joinedAt: '2022-03-28',
  },
  {
    id: 'ins-daniel', name: 'Daniel Brooks', title: 'Security Operations Manager',
    organization: 'Bastion Security Academy',
    avatar: portrait('photo-1472099645785-5658abf4ff4e'),
    bio: 'Daniel has run security operations centres and incident response teams for financial and healthcare organisations. He teaches defenders to think like attackers, document clearly and respond calmly under pressure.',
    expertise: ['Security Operations', 'Incident Response', 'Network Defence', 'Risk Management'],
    rating: 4.6, learners: 24300, status: 'active', website: '', joinedAt: '2023-01-16',
  },
  {
    id: 'ins-sofia', name: 'Sofia Lindqvist', title: 'Programme & Quality Management Consultant',
    organization: 'Meridian Quality Management Professionals',
    avatar: portrait('photo-1580489944761-15a19d654956'),
    bio: 'Sofia advises organisations on project delivery and quality management systems. She has led ISO 9001 implementations, coached agile teams and trained hundreds of project managers in practical, people-centred delivery.',
    expertise: ['Project Management', 'Quality Management', 'Agile', 'Process Improvement'],
    rating: 4.8, learners: 35900, status: 'active', website: '', joinedAt: '2021-09-01',
  },
  {
    id: 'ins-ravi', name: 'Ravi Menon', title: 'Growth Marketing Lead',
    organization: 'Meridian Academy',
    avatar: portrait('photo-1519085360753-af0119f7cbe7'),
    bio: 'Ravi builds marketing programmes that blend creativity with measurement. He has grown audiences for start-ups and established brands alike, and teaches strategy, content and analytics with an emphasis on experiments.',
    expertise: ['Digital Marketing', 'SEO', 'Content Strategy', 'Communication'],
    rating: 4.6, learners: 22400, status: 'active', website: '', joinedAt: '2023-04-11',
  },
]
