/**
 * Company facts for Meridian Quality Management Professionals (MEQMP), gathered from meqmp.com.
 * Names, lists, figures and contact details are factual; descriptive sentences are written for this
 * site rather than copied.
 */
export const COMPANY = {
  name: 'Meridian Quality Management Professionals',
  shortName: 'MEQMP',
  since: 2005,
  phone: '+966 50 939 4640',
  email: 'info@meqmp.com',
  website: 'https://meqmp.com',
  regions: ['Middle East', 'Asia', 'North America'],
  offices: [
    { city: 'Dammam', country: 'Saudi Arabia' },
    { city: 'Sitra', country: 'Bahrain' },
    { city: 'Lahore', country: 'Pakistan' },
    { city: '', country: 'Canada' },
  ],
  highlights: [
    'ISO 9001:2015 certified organisation',
    'First TVTC foreign registered training center in Saudi Arabia',
    'Globally certified trainers',
    'Industry-recognised auditors',
    'Proven track record of successful project execution',
  ],
  figures: [
    { value: '530+', label: 'Consultancy projects' },
    { value: '2500+', label: 'Trainings delivered' },
    { value: '2005', label: 'Operating since' },
    { value: '4', label: 'Global offices' },
  ],
}

export const SERVICES = [
  {
    id: 'trainings', title: 'Trainings', icon: 'GraduationCap',
    summary: 'Practical, engaging and customised programmes from internationally certified trainers that lift workforce capability and drive continuous improvement.',
    items: ['ISO Internal Auditor courses', 'ISO Lead Auditor courses', 'Leadership & Management', 'Safety & Environment', 'Exam preparation (PMP®, PMI-RMP®)'],
    to: '/courses',
  },
  {
    id: 'advisory', title: 'Advisory', icon: 'Lightbulb',
    summary: 'Partnering with businesses to solve operational challenges, streamline processes and align strategy with international standards for sustainable growth.',
    items: ['Lean Six Sigma consulting & implementation', 'Sustainability & ESG integration', 'Process re-engineering', 'Supply chain optimisation', 'Project management excellence', 'Change management', 'Corporate well-being'],
  },
  {
    id: 'compliance', title: 'Compliance', icon: 'ShieldCheck',
    summary: 'Helping organisations navigate regulatory frameworks, maintain ISO and legal compliance and build accountability through audits, inspections and expert guidance.',
    items: ['Industrial optimisation & compliance', 'IT & information security (ISO 27001)', 'AI governance (ISO 42001)', 'Oil & gas (API Q1/Q2)', 'Health & safety management', 'Fire safety systems', 'Risk assessments', 'Food safety & hygiene audits', 'Vendor inspections & quality audits'],
  },
  {
    id: 'sustainability', title: 'Sustainability', icon: 'Leaf',
    summary: 'Integrating sustainable practices into operations, improving environmental performance and achieving recognised green certifications.',
    items: ['Sustainability reporting', 'LEED certification', 'Mostadam certification', 'EcoVadis certification', 'Product life cycle analysis (LCA)', 'Carbon footprint assessment', 'Green building advisory', 'ISO 50001 & energy audits'],
  },
  {
    id: 'wellbeing', title: 'Corporate Wellbeing', icon: 'HeartHandshake',
    summary: 'Wellbeing programmes that support employee mental health, productivity and work–life balance, reducing stress and burnout across the organisation.',
    items: ['Employee wellbeing programmes', 'Stress and burnout prevention', 'Healthy workplace culture'],
  },
]

export const CERTIFICATIONS = [
  'ISO 9001 – Quality Management Systems', 'ISO 14001 – Environmental Management', 'ISO 45001 – Occupational Health & Safety',
  'ISO 41001 – Facility Management Systems', 'ISO 20121 – Sustainable Event Management', 'ISO 22000 – Food Safety Management Systems',
  'ISO 50001 – Energy Management Systems', 'ISO 27001 – Information Security Management', 'ISO 31000 – Risk Management',
  'ISO 17020 – Inspection Bodies', 'ISO 17021 – Certification Bodies', 'ISO 17025 – Testing & Calibration Laboratories',
  'ISO 42001 – AI Management Systems', 'ISO 37001 – Anti-Bribery Management', 'API Q1 / API Q2 – Oil & Gas Quality',
]

export const PROCESS = [
  { step: '01', title: 'Discover & Define', tagline: 'Listen and simplify', text: 'Understand your goals and challenges, define the scope and identify compliance gaps before any certification, audit or training journey begins.' },
  { step: '02', title: 'Build & Align', tagline: 'Tailored, standards-aligned', text: 'Co-develop practical systems, training programmes and advisory plans that fit your industry, operations and objectives.' },
  { step: '03', title: 'Scale & Implement', tagline: 'From plan to practice', text: 'Certified auditors, trainers and regional specialists help roll frameworks out across departments and locations, ready for audits and regulators.' },
  { step: '04', title: 'Sustain & Elevate', tagline: 'Long-term impact', text: 'Monitoring, refresher training, internal audits and strategic consulting keep standards maintained and performance improving.' },
]

export const INDUSTRIES = [
  'Oil & Gas', 'Petrochemicals', 'Infrastructure', 'Telecom', 'Supply Chain & Logistics', 'Manufacturing & Production',
  'Healthcare & Pharmaceuticals', 'Insurance & Banking', 'Education', 'Packaging', 'Hospitality', 'Construction',
  'Public Sector', 'Food & Beverage',
]

export const EXPERTISE = [
  { code: 'ISO 9001', area: 'Quality Management' }, { code: 'ISO 45001', area: 'Occupational Health & Safety' },
  { code: 'ISO 14001', area: 'Environmental Management' }, { code: 'HACCP, ISO 22000', area: 'Food Safety' },
  { code: 'ISO/IEC 27001', area: 'IT Security' }, { code: 'ISO/IEC 20000', area: 'IT Service Management' },
  { code: 'ISO 22301', area: 'Business Continuity' }, { code: 'ISO 50001', area: 'Energy Management' },
  { code: 'ISO 17025', area: 'Lab Competence' }, { code: 'Sustainability', area: 'Sustainability & ESG Standards' },
  { code: 'Six Sigma & Lean', area: 'Process Improvement' }, { code: 'Risk', area: 'Risk & Project Management' },
  { code: 'HR', area: 'HR & Strategic Management' }, { code: 'Development', area: 'Organisational Development Systems' },
]

export const CHALLENGES = [
  'Rising operational costs', 'Quality inconsistencies', 'Missed compliance deadlines',
  'ISO documentation challenges', 'Operational inefficiencies', 'Non-compliance risk exposure',
]
