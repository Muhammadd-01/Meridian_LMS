import { unsplash } from './images'

/**
 * Training programmes modelled on the course catalogue published by Meridian Quality
 * Management Professionals (meqmp.com/trainings): ISO internal/lead auditor tracks,
 * leadership & management, safety & environment, and exam preparation.
 *
 * Course outlines are written for this demo. Ratings, review counts and learner numbers are
 * illustrative. Certification/accreditation outcomes are not issued by this frontend demo.
 */
const PROVIDER = 'Meridian Quality Management Professionals'

const ISO_STANDARDS = [
  {
    key: 'iso9001', code: 'ISO 9001', year: '2015', system: 'Quality Management Systems (QMS)', short: 'QMS',
    focus: 'Customer focus, process approach and risk-based thinking', instructorId: 'ins-hannah',
    skills: ['ISO 9001', 'QMS Auditing', 'Process Approach', 'Corrective Action'],
    images: ['photo-1450101499163-c8848c66ca85', 'photo-1554224155-6726b3ff858f'],
  },
  {
    key: 'iso14001', code: 'ISO 14001', year: '2015', system: 'Environmental Management Systems (EMS)', short: 'EMS',
    focus: 'Environmental aspects, impacts and compliance obligations', instructorId: 'ins-hannah',
    skills: ['ISO 14001', 'EMS Auditing', 'Environmental Aspects', 'Compliance Obligations'],
    images: ['photo-1542601906990-b4d3fb778b09', 'photo-1466611653911-95081537e5b7'],
  },
  {
    key: 'iso45001', code: 'ISO 45001', year: '2018', system: 'Occupational Health & Safety Management Systems (OH&SMS)', short: 'OH&SMS',
    focus: 'Hazard identification, OH&S risk and worker participation', instructorId: 'ins-tariq',
    skills: ['ISO 45001', 'OH&S Auditing', 'Hazard Identification', 'Incident Investigation'],
    images: ['photo-1504307651254-35680f356dfd', 'photo-1541888946425-d81bb19240f5'],
  },
  {
    key: 'iso27001', code: 'ISO/IEC 27001', year: '2022', system: 'Information Security Management Systems (ISMS)', short: 'ISMS',
    focus: 'Information security risk assessment and Annex A controls', instructorId: 'ins-daniel',
    skills: ['ISO 27001', 'ISMS Auditing', 'Information Security Risk', 'Annex A Controls'],
    images: ['photo-1563986768609-322da13575f3', 'photo-1550751827-4bd374c3f58b'],
  },
  {
    key: 'iso22000', code: 'ISO 22000', year: '2018', system: 'Food Safety Management Systems (FSMS)', short: 'FSMS',
    focus: 'HACCP principles, prerequisite programmes and hazard control', instructorId: 'ins-hannah',
    skills: ['ISO 22000', 'HACCP', 'FSMS Auditing', 'Prerequisite Programmes'],
    images: ['photo-1504754524776-8f4f37790ca0'],
  },
  {
    key: 'iso50001', code: 'ISO 50001', year: '2018', system: 'Energy Management Systems (EnMS)', short: 'EnMS',
    focus: 'Energy review, baselines and energy performance indicators', instructorId: 'ins-amara',
    skills: ['ISO 50001', 'Energy Review', 'EnPIs', 'EnMS Auditing'],
    images: ['photo-1473341304170-971dccb5ac1e'],
  },
  {
    key: 'iso31000', code: 'ISO 31000', year: '2018', system: 'Risk Management', short: 'risk management framework',
    focus: 'Risk principles, framework and the risk management process', instructorId: 'ins-sofia',
    skills: ['ISO 31000', 'Risk Assessment', 'Risk Treatment', 'Risk Governance'],
    images: ['photo-1611974789855-9c2a0a7236a3'],
  },
  {
    key: 'iso41001', code: 'ISO 41001', year: '2018', system: 'Facility Management Systems (FMS)', short: 'FMS',
    focus: 'Facility management strategy, service delivery and stakeholder needs', instructorId: 'ins-amara',
    skills: ['ISO 41001', 'Facility Management', 'FMS Auditing', 'Service Delivery'],
    images: ['photo-1486406146926-c627a92ad1ab'],
  },
]

// [standardKey, level, featured, trending, rating, reviewCount, enrollmentCount, createdDaysAgo, updatedDaysAgo]
const ISO_COURSES = [
  ['iso9001', 'internal', false, false, 4.8, 2140, 18600, 300, 20],
  ['iso9001', 'lead', true, true, 4.9, 3410, 26400, 280, 6],
  ['iso14001', 'internal', false, false, 4.7, 980, 8200, 250, 35],
  ['iso14001', 'lead', false, false, 4.8, 1260, 9900, 240, 15],
  ['iso45001', 'internal', false, false, 4.8, 1530, 12800, 230, 25],
  ['iso45001', 'lead', true, true, 4.9, 1980, 15100, 220, 8],
  ['iso27001', 'internal', false, false, 4.7, 870, 7400, 160, 18],
  ['iso27001', 'lead', false, true, 4.8, 1420, 11300, 150, 9],
  ['iso22000', 'internal', false, false, 4.7, 640, 5100, 140, 30],
  ['iso50001', 'lead', false, false, 4.6, 410, 3200, 90, 12],
  ['iso31000', 'lead', false, false, 4.7, 590, 4700, 120, 22],
  ['iso41001', 'lead', false, false, 4.6, 380, 2900, 60, 10],
]

function isoCourse([key, level, featured, trending, rating, reviewCount, enrollmentCount, createdDaysAgo, updatedDaysAgo]) {
  const s = ISO_STANDARDS.find((x) => x.key === key)
  const lead = level === 'lead'
  const role = lead ? 'Lead Auditor' : 'Internal Auditor'
  const name = `${s.code}:${s.year}`
  const curriculum = [
    [`Understanding ${name}`, `The structure, intent and requirements of ${s.code} for ${s.system}.`, [
      `Introduction to ${s.system}`,
      'The High-Level Structure (Annex SL) and key terms',
      `${s.focus}`,
      `${s.code} requirements, clauses 4 to 10`,
    ]],
    ['Audit principles and planning (ISO 19011)', 'How audits are planned and how auditors think.', [
      'Principles of auditing and auditor competence',
      'First-, second- and third-party audits',
      'Planning an audit programme and audit plan',
      `Building a ${s.short} audit checklist`,
    ]],
    ['Conducting and reporting the audit', 'Gathering objective evidence and reporting it well.', [
      'Opening meetings and gathering audit evidence',
      'Interviewing, observation and sampling techniques',
      'Writing nonconformities and observations',
      'Closing meetings, audit reports and follow-up',
    ]],
  ]
  if (lead) {
    curriculum.push(['Leading audit teams and certification audits', 'Lead an audit team and prepare for the lead auditor examination.', [
      'Managing an audit team and allocating work',
      'Certification audits and the ISO/IEC 17021 context',
      'Handling conflict and difficult audit situations',
      'Case-study audit and examination preparation',
    ]])
  }
  return {
    id: `crs-${key}-${lead ? 'la' : 'ia'}`,
    slug: `${s.code.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${s.year}-${lead ? 'lead' : 'internal'}-auditor`,
    title: `${name} ${role}`,
    shortDescription: lead
      ? `Plan, lead and report first-, second- and third-party audits of ${s.system} to ${name}.`
      : `Audit your organisation’s ${s.short} against ${name} and drive continual improvement.`,
    description: lead
      ? `This lead auditor programme equips professionals to perform first-, second- and third-party audits of ${s.system} in line with ${name}. Following ISO 19011 guidelines and the ISO/IEC 17021 context for certification audits, it emphasises practical auditing techniques: planning, conducting, reporting and following up audits, leading an audit team and writing clear, evidence-based findings. The course ends with a case-study audit and examination preparation.`
      : `This internal auditor course builds the knowledge and skills to plan and carry out internal audits of a ${s.short} based on ${name}. You will interpret the requirements of the standard, apply ISO 19011 audit principles, collect objective evidence and report nonconformities that lead to genuine improvement.`,
    image: unsplash(s.images[lead ? s.images.length - 1 : 0]),
    categoryId: 'cat-iso', instructorId: s.instructorId, providerName: PROVIDER,
    difficulty: lead ? 'Advanced' : 'Intermediate', language: 'English', subtitles: ['English', 'Arabic'],
    durationHours: lead ? 40 : 16, courseType: lead ? 'Professional Certificate' : 'Course', access: 'paid',
    priceLabel: lead ? '$399 · demo price' : '$149 · demo price',
    rating, reviewCount, enrollmentCount, featured, trending, status: 'published', createdDaysAgo, updatedDaysAgo,
    quizId: 'quiz-iso-audit', assignmentId: key === 'iso9001' && lead ? 'asg-audit-report' : null,
    skills: [...s.skills, 'ISO 19011', ...(lead ? ['Audit Team Leadership'] : [])],
    learningOutcomes: [
      `Interpret the requirements of ${name} and its underlying principles`,
      'Apply ISO 19011 audit guidelines when planning and conducting audits',
      'Collect objective evidence and write clear, actionable audit findings',
      lead ? 'Lead an audit team through a full certification-style audit' : 'Report audit results and verify corrective actions',
    ],
    prerequisites: lead
      ? [`Working knowledge of ${s.code} or completion of the internal auditor course`, 'Some workplace experience with management systems']
      : ['Basic familiarity with your organisation’s processes', 'No prior auditing experience required'],
    tags: ['iso', 'audit', 'auditor', s.code.toLowerCase(), s.short.toLowerCase(), lead ? 'lead auditor' : 'internal auditor', 'meqmp'],
    curriculum,
  }
}

const OTHER_COURSES = [
  {
    id: 'crs-lss-gb', slug: 'lean-six-sigma-green-belt', title: 'Lean Six Sigma Green Belt',
    shortDescription: 'Lead improvement projects with DMAIC, root cause analysis and data-driven decisions.',
    description: 'A structured Green Belt programme that teaches you to improve quality and efficiency using the DMAIC methodology. You will learn to scope and lead Six Sigma projects, apply statistical tools, reduce variation and waste, and sustain gains with control plans.',
    image: unsplash('photo-1581092160562-40aa08e78837'), categoryId: 'cat-business', instructorId: 'ins-sofia', providerName: PROVIDER,
    difficulty: 'Intermediate', language: 'English', subtitles: ['English', 'Arabic'], durationHours: 40, courseType: 'Professional Certificate',
    access: 'paid', priceLabel: '$349 · demo price', rating: 4.8, reviewCount: 2760, enrollmentCount: 21800, featured: true, trending: true,
    status: 'published', createdDaysAgo: 260, updatedDaysAgo: 5, quizId: 'quiz-lean', assignmentId: 'asg-lss-charter',
    skills: ['Lean Six Sigma', 'DMAIC', 'Root Cause Analysis', 'Statistical Process Control'],
    learningOutcomes: ['Apply the DMAIC methodology to real business problems', 'Use root cause analysis and core statistical tools', 'Reduce process variation and waste', 'Lead and facilitate continuous improvement initiatives'],
    prerequisites: ['Basic spreadsheet skills', 'Some experience with business processes'],
    tags: ['six sigma', 'lean', 'green belt', 'process improvement', 'meqmp'],
    curriculum: [
      ['Lean Six Sigma foundations', 'Why Lean and Six Sigma work together.', ['What Lean Six Sigma is and why it matters', 'Voice of the customer and critical-to-quality requirements', 'The DMAIC roadmap']],
      ['Define and Measure', 'Scope the problem and measure the baseline.', ['Project charters and SIPOC diagrams', 'Process mapping and value stream basics', 'Data collection and measurement system analysis']],
      ['Analyze', 'Find the root causes that matter.', ['Root cause analysis: fishbone and 5 Whys', 'Hypothesis testing essentials', 'Identifying the vital few causes']],
      ['Improve and Control', 'Implement solutions and make them stick.', ['Generating and piloting solutions', 'Mistake-proofing (Poka-Yoke)', 'Control plans and statistical process control']],
    ],
  },
  {
    id: 'crs-lss-bb', slug: 'lean-six-sigma-black-belt', title: 'Lean Six Sigma Black Belt',
    shortDescription: 'Lead complex improvement programmes with advanced statistics and change leadership.',
    description: 'For experienced Green Belts ready to lead strategic improvement. Covers advanced statistical methods, design of experiments, Lean enterprise thinking, project portfolio management and coaching Green Belt teams.',
    image: unsplash('photo-1581091226825-a6a2a5aee158'), categoryId: 'cat-business', instructorId: 'ins-sofia', providerName: PROVIDER,
    difficulty: 'Advanced', language: 'English', subtitles: ['English'], durationHours: 80, courseType: 'Professional Certificate',
    access: 'paid', priceLabel: '$699 · demo price', rating: 4.8, reviewCount: 940, enrollmentCount: 6400, featured: false, trending: false,
    status: 'published', createdDaysAgo: 200, updatedDaysAgo: 14, quizId: 'quiz-lean', assignmentId: null,
    skills: ['Lean Six Sigma', 'Design of Experiments', 'Regression', 'Change Leadership'],
    learningOutcomes: ['Select and lead high-impact improvement projects', 'Apply regression and design of experiments', 'Build a Lean enterprise culture', 'Coach and mentor Green Belt teams'],
    prerequisites: ['Lean Six Sigma Green Belt or equivalent experience'],
    tags: ['six sigma', 'black belt', 'lean', 'statistics', 'meqmp'],
    curriculum: [
      ['Leading transformation', 'Strategy, deployment and governance.', ['Aligning projects to strategy', 'Project selection and portfolio management', 'Stakeholder management and change leadership']],
      ['Advanced analysis', 'Statistical tools for complex problems.', ['Multiple regression', 'Design of experiments', 'Non-normal data and capability analysis']],
      ['Lean enterprise', 'Flow, pull and value across the organisation.', ['Value stream mapping at enterprise scale', 'Kaizen events and flow', 'Sustaining a continuous improvement culture']],
      ['Coaching and certification project', 'Lead others and deliver results.', ['Coaching Green Belts', 'Black Belt project review', 'Presenting results to leadership']],
    ],
  },
  {
    id: 'crs-pmp', slug: 'pmp-exam-preparation', title: 'PMP® Exam Preparation',
    shortDescription: 'Prepare for the PMP® exam across people, process and business environment domains.',
    description: 'A structured exam-preparation course aligned to the PMP® Examination Content Outline. It covers predictive, agile and hybrid approaches, the people, process and business environment domains, exam strategy and full-length practice questions. PMP is a registered mark of the Project Management Institute; this demo course is not affiliated with or endorsed by PMI.',
    image: unsplash('photo-1611224923853-80b023f02d71'), categoryId: 'cat-business', instructorId: 'ins-sofia', providerName: PROVIDER,
    difficulty: 'Advanced', language: 'English', subtitles: ['English', 'Arabic'], durationHours: 35, courseType: 'Course',
    access: 'paid', priceLabel: '$299 · demo price', rating: 4.8, reviewCount: 1890, enrollmentCount: 14700, featured: false, trending: true,
    status: 'published', createdDaysAgo: 180, updatedDaysAgo: 4, quizId: 'quiz-pm', assignmentId: null,
    skills: ['Project Management', 'Agile', 'Hybrid Delivery', 'Exam Strategy'],
    learningOutcomes: ['Understand the PMP® exam structure and content outline', 'Apply predictive, agile and hybrid practices', 'Answer situational questions with confidence', 'Build a personal study plan for exam success'],
    prerequisites: ['Project management experience as required by the exam eligibility criteria'],
    tags: ['pmp', 'project management', 'exam preparation', 'meqmp'],
    curriculum: [
      ['Exam orientation', 'Understand what the exam measures.', ['The PMP® exam and content outline', 'Building your study plan', 'How situational questions work']],
      ['People domain', 'Lead and support high-performing teams.', ['Leading and building teams', 'Conflict management and negotiation', 'Stakeholder engagement']],
      ['Process domain', 'Plan and manage delivery.', ['Scope, schedule and cost', 'Quality, risk and procurement', 'Agile and hybrid delivery practices']],
      ['Business environment and practice', 'Connect projects to value — then practise.', ['Compliance and benefits realisation', 'Managing organisational change', 'Full-length practice exam review']],
    ],
  },
  {
    id: 'crs-rmp', slug: 'rmp-exam-preparation', title: 'PMI-RMP® Exam Preparation',
    shortDescription: 'Master risk strategy, identification, analysis and response for the PMI-RMP® exam.',
    description: 'Exam preparation for project risk professionals covering risk strategy and planning, stakeholder engagement, identification, qualitative and quantitative analysis, response planning and monitoring. PMI-RMP is a registered mark of the Project Management Institute; this demo course is not affiliated with PMI.',
    image: unsplash('photo-1556761175-4b46a572b786'), categoryId: 'cat-business', instructorId: 'ins-sofia', providerName: PROVIDER,
    difficulty: 'Advanced', language: 'English', subtitles: ['English'], durationHours: 30, courseType: 'Course',
    access: 'paid', priceLabel: '$279 · demo price', rating: 4.7, reviewCount: 520, enrollmentCount: 3900, featured: false, trending: false,
    status: 'published', createdDaysAgo: 150, updatedDaysAgo: 16, quizId: 'quiz-pm', assignmentId: null,
    skills: ['Risk Management', 'Quantitative Risk Analysis', 'Risk Response', 'Exam Strategy'],
    learningOutcomes: ['Develop a project risk management strategy', 'Identify and analyse risks qualitatively and quantitatively', 'Plan and implement effective risk responses', 'Monitor and close risks across the lifecycle'],
    prerequisites: ['Project risk management experience as required by the exam eligibility criteria'],
    tags: ['rmp', 'risk', 'exam preparation', 'meqmp'],
    curriculum: [
      ['Risk strategy and planning', 'Set up risk management for success.', ['Risk management strategy and appetite', 'Stakeholder engagement in risk', 'The risk management plan']],
      ['Identification and analysis', 'Understand uncertainty.', ['Risk identification techniques', 'Qualitative risk analysis', 'Quantitative analysis: EMV and Monte Carlo']],
      ['Response and monitoring', 'Act on risk and learn.', ['Risk response strategies', 'Monitoring, triggers and reserves', 'Exam practice and review']],
    ],
  },
  {
    id: 'crs-aramco-q', slug: 'aramco-schedule-q-awareness', title: 'ARAMCO Schedule Q Awareness',
    shortDescription: 'Understand Schedule Q quality requirements for contractors, audits and submittals.',
    description: 'An awareness course on Schedule Q quality management requirements for contractors working on Saudi Aramco projects. Covers the structure and clauses, quality plans and submittals, QA/QC expectations and how to prepare for audits and reviews. This demo course is not affiliated with or endorsed by Saudi Aramco.',
    image: unsplash('photo-1513828583688-c52646db42da'), categoryId: 'cat-iso', instructorId: 'ins-hannah', providerName: PROVIDER,
    difficulty: 'Beginner', language: 'English', subtitles: ['English', 'Arabic'], durationHours: 8, courseType: 'Course',
    access: 'paid', priceLabel: '$99 · demo price', rating: 4.7, reviewCount: 610, enrollmentCount: 5300, featured: false, trending: false,
    status: 'published', createdDaysAgo: 110, updatedDaysAgo: 20, quizId: 'quiz-iso-audit', assignmentId: null,
    skills: ['Schedule Q', 'Contractor QA/QC', 'Quality Plans', 'Audit Readiness'],
    learningOutcomes: ['Explain the structure and key clauses of Schedule Q', 'Prepare compliant quality plans and submittals', 'Interpret QA and QC requirements', 'Get ready for client audits and reviews'],
    prerequisites: ['Experience on industrial or construction projects is helpful'],
    tags: ['aramco', 'schedule q', 'oil and gas', 'quality', 'meqmp'],
    curriculum: [
      ['Schedule Q essentials', 'Structure, scope and intent.', ['What Schedule Q is and who it applies to', 'Structure and key clauses', 'Relationship with ISO 9001']],
      ['Quality planning and submittals', 'Documentation that passes review.', ['Project quality plans', 'Inspection and test plans', 'Documentation and submittal expectations']],
      ['QA/QC and audits', 'Demonstrate compliance in practice.', ['Quality control and assurance requirements', 'Nonconformance and corrective action', 'Preparing for client audits and reviews']],
    ],
  },
  {
    id: 'crs-bcm', slug: 'business-continuity-management', title: 'Business Continuity Management (ISO 22301)',
    shortDescription: 'Build resilience with business impact analysis, continuity strategies and exercises.',
    description: 'Learn to design and maintain a business continuity management system aligned with ISO 22301. You will run a business impact analysis, assess risks, develop continuity strategies and plans, and exercise them so your organisation can keep critical activities running through disruption.',
    image: unsplash('photo-1504384308090-c894fdcc538d'), categoryId: 'cat-business', instructorId: 'ins-sofia', providerName: PROVIDER,
    difficulty: 'Intermediate', language: 'English', subtitles: ['English'], durationHours: 16, courseType: 'Course',
    access: 'paid', priceLabel: '$179 · demo price', rating: 4.7, reviewCount: 430, enrollmentCount: 3600, featured: false, trending: false,
    status: 'published', createdDaysAgo: 130, updatedDaysAgo: 11, quizId: 'quiz-pm', assignmentId: null,
    skills: ['ISO 22301', 'Business Impact Analysis', 'Continuity Planning', 'Crisis Management'],
    learningOutcomes: ['Explain the requirements of ISO 22301', 'Conduct a business impact analysis', 'Develop continuity strategies and plans', 'Plan exercises and improve the BCMS'],
    prerequisites: ['Familiarity with your organisation’s critical activities'],
    tags: ['business continuity', 'iso 22301', 'resilience', 'meqmp'],
    curriculum: [
      ['BCMS fundamentals', 'Context, leadership and scope.', ['Why business continuity matters', 'ISO 22301 structure and requirements', 'Scoping the BCMS']],
      ['Analysis', 'Understand what must keep running.', ['Business impact analysis', 'Risk assessment for disruption', 'Recovery objectives (RTO and RPO)']],
      ['Strategies, plans and exercises', 'Prepare, rehearse and improve.', ['Continuity strategies and solutions', 'Writing business continuity plans', 'Exercising, testing and improvement']],
    ],
  },
  {
    id: 'crs-ttt', slug: 'train-the-trainer', title: 'Train the Trainer',
    shortDescription: 'Design and deliver engaging, effective training for adult learners.',
    description: 'A practical programme for subject-matter experts and new trainers. Learn how adults learn, design training with clear objectives, deliver confident sessions with engaging activities, and evaluate impact using the Kirkpatrick model.',
    image: unsplash('photo-1524178232363-1fb2b075b655'), categoryId: 'cat-personal', instructorId: 'ins-ravi', providerName: PROVIDER,
    difficulty: 'Intermediate', language: 'English', subtitles: ['English', 'Arabic'], durationHours: 24, courseType: 'Professional Certificate',
    access: 'paid', priceLabel: '$249 · demo price', rating: 4.8, reviewCount: 1120, enrollmentCount: 8900, featured: false, trending: false,
    status: 'published', createdDaysAgo: 170, updatedDaysAgo: 13, quizId: null, assignmentId: null,
    skills: ['Instructional Design', 'Facilitation', 'Presentation Skills', 'Training Evaluation'],
    learningOutcomes: ['Apply adult learning principles', 'Design sessions with measurable objectives', 'Facilitate engaging, inclusive training', 'Evaluate training with the Kirkpatrick model'],
    prerequisites: ['Expertise in a subject you would like to teach'],
    tags: ['training', 'facilitation', 'leadership', 'meqmp'],
    curriculum: [
      ['How adults learn', 'Principles that shape every session.', ['Adult learning principles', 'Learning styles and motivation', 'Creating a safe learning environment']],
      ['Designing training', 'From needs to a session plan.', ['Training needs analysis', 'Writing learning objectives', 'Designing activities and materials']],
      ['Delivering and evaluating', 'Facilitate with confidence and measure impact.', ['Presentation and facilitation skills', 'Handling questions and difficult participants', 'Evaluating training with the Kirkpatrick model']],
    ],
  },
  {
    id: 'crs-osha', slug: 'osha-10-and-30-hour-general-construction', title: 'OSHA 10 & 30 Hour (General / Construction Industry)',
    shortDescription: 'Recognise, avoid and control workplace hazards in general and construction settings.',
    description: 'Based on the OSHA Outreach 10-hour and 30-hour outlines, this course introduces workplace health and safety standards. The 10-hour track suits entry-level workers; the 30-hour track is designed for supervisors and safety personnel in general or construction industries. This demo course does not issue official OSHA cards.',
    image: unsplash('photo-1504307651254-35680f356dfd'), categoryId: 'cat-hse', instructorId: 'ins-tariq', providerName: PROVIDER,
    difficulty: 'Beginner', language: 'English', subtitles: ['English', 'Arabic', 'Hindi'], durationHours: 30, courseType: 'Professional Certificate',
    access: 'paid', priceLabel: '$199 · demo price', rating: 4.8, reviewCount: 2310, enrollmentCount: 19800, featured: true, trending: true,
    status: 'published', createdDaysAgo: 210, updatedDaysAgo: 7, quizId: 'quiz-hse', assignmentId: 'asg-hse-jsa',
    skills: ['OSHA Standards', 'Hazard Recognition', 'PPE', 'Fall Protection'],
    learningOutcomes: ['Understand OSHA standards and employer/employee responsibilities', 'Identify hazards in general and construction workplaces', 'Apply fall protection, PPE and safe equipment handling', 'Understand reporting, recordkeeping and emergency planning'],
    prerequisites: ['None'],
    tags: ['osha', 'safety', 'construction', 'hse', 'meqmp'],
    curriculum: [
      ['Introduction to OSHA', 'Rights, responsibilities and standards.', ['Introduction to OSHA and workers’ rights', 'Employer and employee responsibilities', 'Hazard communication (HazCom)']],
      ['The Focus Four hazards', 'The leading causes of construction fatalities.', ['Fall hazards and fall protection', 'Electrical hazards', 'Struck-by and caught-in/between hazards', 'Scaffolds, ladders and excavations']],
      ['Health hazards and PPE', 'Protect people from what you can’t always see.', ['Personal protective equipment', 'Noise, dust and chemical exposure', 'Ergonomics and manual handling']],
      ['Managing safety', 'Systems that keep sites safe.', ['Recordkeeping and incident reporting', 'Emergency action and fire prevention plans', 'Safety leadership for supervisors']],
    ],
  },
  {
    id: 'crs-fire', slug: 'fire-safety-awareness-and-fire-fighting', title: 'Fire Safety Awareness & Fire Fighting',
    shortDescription: 'Prevent fires, use extinguishers correctly and lead safe evacuations.',
    description: 'A hands-on awareness course covering how fires start and spread, workplace fire prevention, choosing and using the right extinguisher, and how to raise the alarm and evacuate safely.',
    image: unsplash('photo-1486551937199-baf066858de7'), categoryId: 'cat-hse', instructorId: 'ins-tariq', providerName: PROVIDER,
    difficulty: 'Beginner', language: 'English', subtitles: ['English', 'Arabic'], durationHours: 8, courseType: 'Course',
    access: 'paid', priceLabel: '$79 · demo price', rating: 4.8, reviewCount: 980, enrollmentCount: 9400, featured: false, trending: false,
    status: 'published', createdDaysAgo: 190, updatedDaysAgo: 24, quizId: 'quiz-hse', assignmentId: null,
    skills: ['Fire Prevention', 'Fire Extinguishers', 'Evacuation', 'Emergency Response'],
    learningOutcomes: ['Explain the fire triangle and classes of fire', 'Identify and control fire hazards', 'Select and operate extinguishers using PASS', 'Raise the alarm and evacuate safely'],
    prerequisites: ['None'],
    tags: ['fire safety', 'hse', 'emergency', 'meqmp'],
    curriculum: [
      ['Fire science', 'How fires start and spread.', ['The fire triangle and fire tetrahedron', 'Classes of fire', 'How fire and smoke spread']],
      ['Prevention', 'Stop fires before they start.', ['Common workplace fire hazards', 'Housekeeping and hot work controls', 'Fire risk assessment basics']],
      ['Fighting fires and evacuation', 'Act quickly and safely.', ['Choosing the right extinguisher', 'Using an extinguisher: the PASS technique', 'Raising the alarm and evacuation procedures']],
    ],
  },
  {
    id: 'crs-first-aid', slug: 'first-aid-cpr-aed', title: 'First Aid, CPR & AED',
    shortDescription: 'Respond confidently to emergencies with first aid, CPR and AED skills.',
    description: 'Learn the essential skills to help in a medical emergency: assessing the scene, performing CPR, using an AED, and managing bleeding, burns, fractures and common medical conditions until professional help arrives. Practical skills must be practised in person; this demo course is awareness only.',
    image: unsplash('photo-1576091160550-2173dba999ef'), categoryId: 'cat-hse', instructorId: 'ins-tariq', providerName: PROVIDER,
    difficulty: 'Beginner', language: 'English', subtitles: ['English', 'Arabic'], durationHours: 8, courseType: 'Course',
    access: 'free', priceLabel: 'Free', rating: 4.9, reviewCount: 1640, enrollmentCount: 15200, featured: false, trending: true,
    status: 'published', createdDaysAgo: 175, updatedDaysAgo: 9, quizId: 'quiz-hse', assignmentId: null,
    skills: ['First Aid', 'CPR', 'AED', 'Emergency Response'],
    learningOutcomes: ['Assess an emergency scene safely', 'Perform CPR and use an AED', 'Manage bleeding, burns and fractures', 'Recognise and respond to common medical emergencies'],
    prerequisites: ['None'],
    tags: ['first aid', 'cpr', 'aed', 'hse', 'meqmp'],
    curriculum: [
      ['The first aider', 'Your role and keeping yourself safe.', ['Role and responsibilities of a first aider', 'Scene safety and primary survey', 'Calling for help effectively']],
      ['CPR and AED', 'Life-saving skills.', ['Adult CPR', 'Using an automated external defibrillator', 'Choking in adults and children']],
      ['Injuries and medical emergencies', 'Common situations at work.', ['Bleeding and shock', 'Burns, fractures and sprains', 'Heart attack, stroke and seizures']],
    ],
  },
  {
    id: 'crs-5s', slug: '5s-sustainability-and-workplace-organization', title: '5S Sustainability & Workplace Organization',
    shortDescription: 'Create safer, more efficient workplaces with Sort, Set, Shine, Standardize and Sustain.',
    description: 'Learn the 5S methodology and how to make it last. This course covers each of the five steps, visual management, 5S audits and how 5S underpins Lean, safety and quality improvement.',
    image: unsplash('photo-1586528116311-ad8dd3c8310d'), categoryId: 'cat-business', instructorId: 'ins-sofia', providerName: PROVIDER,
    difficulty: 'Beginner', language: 'English', subtitles: ['English', 'Arabic'], durationHours: 8, courseType: 'Course',
    access: 'free', priceLabel: 'Free', rating: 4.7, reviewCount: 720, enrollmentCount: 7600, featured: false, trending: false,
    status: 'published', createdDaysAgo: 160, updatedDaysAgo: 19, quizId: 'quiz-lean', assignmentId: null,
    skills: ['5S', 'Lean', 'Visual Management', 'Workplace Organization'],
    learningOutcomes: ['Explain each step of 5S', 'Run a 5S event in your area', 'Use visual management and 5S audits', 'Sustain improvements over time'],
    prerequisites: ['None'],
    tags: ['5s', 'lean', 'workplace', 'meqmp'],
    curriculum: [
      ['5S foundations', 'Why organised workplaces perform better.', ['What 5S is and where it came from', 'Sort: remove what isn’t needed', 'Set in order: a place for everything']],
      ['Shine and Standardize', 'Clean, inspect and standardise.', ['Shine: cleaning as inspection', 'Standardize: visual controls and standards', 'Visual management boards']],
      ['Sustain', 'Make 5S part of the culture.', ['Sustain: habits and leadership', '5S audits and scoring', 'Linking 5S to safety and quality']],
    ],
  },
  {
    id: 'crs-defensive-driving', slug: 'defensive-driving', title: 'Defensive Driving',
    shortDescription: 'Reduce road risk with hazard perception, space management and safe habits.',
    description: 'A practical course for company drivers and anyone who drives for work. Learn to anticipate hazards, manage speed and space, drive safely in adverse conditions, and manage fatigue and distraction.',
    image: unsplash('photo-1449965408869-eaa3f722e40d'), categoryId: 'cat-hse', instructorId: 'ins-tariq', providerName: PROVIDER,
    difficulty: 'Beginner', language: 'English', subtitles: ['English', 'Arabic', 'Urdu'], durationHours: 6, courseType: 'Course',
    access: 'free', priceLabel: 'Free', rating: 4.7, reviewCount: 540, enrollmentCount: 6100, featured: false, trending: false,
    status: 'published', createdDaysAgo: 140, updatedDaysAgo: 27, quizId: 'quiz-hse', assignmentId: null,
    skills: ['Defensive Driving', 'Hazard Perception', 'Road Safety', 'Fatigue Management'],
    learningOutcomes: ['Recognise how attitude affects driving risk', 'Anticipate and respond to hazards', 'Manage speed, space and following distance', 'Drive safely in adverse conditions'],
    prerequisites: ['A valid driving licence is recommended'],
    tags: ['driving', 'road safety', 'hse', 'meqmp'],
    curriculum: [
      ['Driver risk', 'Why collisions happen.', ['Attitude, behaviour and risk', 'Distraction and mobile phones', 'Fatigue management']],
      ['Defensive techniques', 'Stay ahead of hazards.', ['Hazard perception and scanning', 'Space cushion and following distance', 'Intersections and overtaking']],
      ['Conditions and emergencies', 'Adapt to the road.', ['Night, rain, fog and sandstorms', 'Vehicle checks before a journey', 'What to do after a collision']],
    ],
  },
  {
    id: 'crs-esg', slug: 'sustainability-and-esg-fundamentals', title: 'Sustainability & ESG Fundamentals',
    shortDescription: 'Understand ESG, carbon footprints and sustainability reporting for your organisation.',
    description: 'An introduction to environmental, social and governance (ESG) practice: sustainability frameworks, carbon footprint assessment, energy efficiency, green building concepts and how organisations report sustainability performance.',
    image: unsplash('photo-1509391366360-2e959784a276'), categoryId: 'cat-hse', instructorId: 'ins-amara', providerName: PROVIDER,
    difficulty: 'Beginner', language: 'English', subtitles: ['English', 'Arabic'], durationHours: 12, courseType: 'Course',
    access: 'paid', priceLabel: '$129 · demo price', rating: 4.7, reviewCount: 460, enrollmentCount: 4200, featured: false, trending: true,
    status: 'published', createdDaysAgo: 40, updatedDaysAgo: 3, quizId: 'quiz-hse', assignmentId: null,
    skills: ['ESG', 'Carbon Footprint', 'Sustainability Reporting', 'Energy Efficiency'],
    learningOutcomes: ['Explain ESG and why it matters to stakeholders', 'Estimate an organisational carbon footprint', 'Identify energy and resource efficiency opportunities', 'Outline a sustainability report'],
    prerequisites: ['None'],
    tags: ['sustainability', 'esg', 'carbon', 'environment', 'meqmp'],
    curriculum: [
      ['ESG foundations', 'What sustainability means for business.', ['Introduction to ESG', 'Sustainability frameworks and standards', 'Materiality and stakeholders']],
      ['Environmental performance', 'Measure and reduce impact.', ['Carbon footprint assessment', 'Energy efficiency and energy audits', 'Green building and life cycle thinking']],
      ['Reporting and action', 'Communicate and improve.', ['Sustainability reporting basics', 'Setting targets and KPIs', 'Building a sustainability roadmap']],
    ],
  },
]

export const MEQMP_COURSE_SPECS = [...ISO_COURSES.map(isoCourse), ...OTHER_COURSES]
