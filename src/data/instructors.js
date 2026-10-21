import { portrait } from './images'

/**
 * Trainer profiles for the demo. MEQMP describes its faculty as globally certified trainers and
 * industry-recognised auditors; these individual profiles are fictional and illustrative.
 */
export const instructors = [
  {
    id: 'ins-hannah', name: 'Hannah Whitfield', title: 'Principal Lead Auditor — QMS, EMS & FSMS',
    organization: 'Meridian Quality Management Professionals',
    avatar: portrait('photo-1573497019940-1c28c88b4f3e'),
    bio: 'Hannah has led first-, second- and third-party audits across manufacturing, construction, food and service organisations. She delivers the ISO 9001, ISO 14001 and ISO 22000 auditor programmes with an emphasis on practical case studies and clear, evidence-based reporting.',
    expertise: ['ISO 9001', 'ISO 14001', 'ISO 22000', 'ISO 19011 Auditing'],
    rating: 4.9, learners: 21300, status: 'active', website: '', joinedAt: '2021-06-12',
  },
  {
    id: 'ins-tariq', name: 'Eng. Tariq Al-Mansouri', title: 'HSE Lead Trainer',
    organization: 'Meridian Quality Management Professionals',
    avatar: portrait('photo-1560250097-0b93528c311a'),
    bio: 'Tariq is a health and safety engineer with two decades on industrial, oil and gas and construction projects. He trains supervisors and workforces in OSHA standards, ISO 45001, fire safety, first aid and defensive driving, keeping every session practical enough to use on site the next day.',
    expertise: ['ISO 45001', 'OSHA', 'Fire Safety', 'Emergency Response'],
    rating: 4.8, learners: 18700, status: 'active', website: '', joinedAt: '2021-08-30',
  },
  {
    id: 'ins-sofia', name: 'Sofia Lindqvist', title: 'Operational Excellence & Project Management Consultant',
    organization: 'Meridian Quality Management Professionals',
    avatar: portrait('photo-1580489944761-15a19d654956'),
    bio: 'Sofia advises organisations on Lean Six Sigma, project delivery and business continuity. A certified Black Belt and project management professional, she coaches improvement teams and prepares candidates for the PMP® and PMI-RMP® examinations.',
    expertise: ['Lean Six Sigma', 'Project Management', 'Risk Management', 'Business Continuity'],
    rating: 4.8, learners: 35900, status: 'active', website: '', joinedAt: '2021-09-01',
  },
  {
    id: 'ins-daniel', name: 'Daniel Brooks', title: 'Information Security Lead Auditor',
    organization: 'Meridian Quality Management Professionals',
    avatar: portrait('photo-1472099645785-5658abf4ff4e'),
    bio: 'Daniel has implemented and audited information security management systems for financial, healthcare and technology organisations. He teaches ISO/IEC 27001 with a focus on risk-based controls and audit evidence that stands up to certification bodies.',
    expertise: ['ISO/IEC 27001', 'Information Security Risk', 'ISMS Auditing', 'Annex A Controls'],
    rating: 4.7, learners: 14300, status: 'active', website: '', joinedAt: '2023-01-16',
  },
  {
    id: 'ins-amara', name: 'Amara Okafor', title: 'Energy, Risk & Facility Management Specialist',
    organization: 'Meridian Quality Management Professionals',
    avatar: portrait('photo-1531123897727-8f129e1688ce'),
    bio: 'Amara helps organisations run efficient, resilient facilities. She leads energy reviews, ISO 50001 and ISO 41001 implementations and risk management programmes aligned with ISO 31000.',
    expertise: ['ISO 50001', 'ISO 41001', 'ISO 31000', 'Energy Audits'],
    rating: 4.7, learners: 11800, status: 'active', website: '', joinedAt: '2022-03-28',
  },
  {
    id: 'ins-ravi', name: 'Ravi Menon', title: 'Leadership & Training Development Consultant',
    organization: 'Meridian Quality Management Professionals',
    avatar: portrait('photo-1519085360753-af0119f7cbe7'),
    bio: 'Ravi designs leadership and train-the-trainer programmes for organisations building internal training capability. He also delivers contractor quality awareness programmes, including ARAMCO Schedule Q.',
    expertise: ['Train the Trainer', 'Facilitation', 'Contractor Quality', 'Leadership Development'],
    rating: 4.7, learners: 9400, status: 'active', website: '', joinedAt: '2023-04-11',
  },
]
