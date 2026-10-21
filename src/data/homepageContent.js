import { portrait } from './images'

/**
 * Editable homepage content (Admin → Homepage content). Facts come from meqmp.com; wording is
 * original. Testimonials are fictional sample personas — real ones can be added by the admin.
 */
export const homepageContent = {
  hero: {
    headline: 'Empowering Quality. Building Sustainable Growth.',
    subtext: 'Internationally recognised ISO auditor, safety, leadership and exam-preparation training from Meridian Quality Management Professionals — now online, at your own pace.',
  },
  stats: [
    { id: 'st1', value: '26', label: 'Training programmes' },
    { id: 'st2', value: '2500+', label: 'Trainings delivered by MEQMP' },
    { id: 'st3', value: '530+', label: 'Consultancy projects' },
    { id: 'st4', value: '2005', label: 'Operating since' },
  ],
  benefits: [
    { id: 'b1', icon: 'Target', title: 'Cost saving', text: 'Streamlined operations reduce waste and cost, so teams can reinvest where it matters most.' },
    { id: 'b2', icon: 'Layers', title: 'Operational clarity', text: 'Quality management systems that remove complexity and make performance consistent.' },
    { id: 'b3', icon: 'Award', title: 'Excellence', text: 'Sustained performance and audit readiness that earns the trust of clients and regulators.' },
    { id: 'b4', icon: 'TrendingUp', title: 'Efficiency', text: 'Data-backed process improvement that unlocks capacity and real business value.' },
  ],
  testimonials: [
    { id: 't1', name: 'Rana A.', role: 'QHSE Coordinator', avatar: portrait('photo-1544005313-94ddf0286df2'),
      quote: 'The ISO 45001 Internal Auditor course gave me a checklist approach I used in our very next internal audit.' },
    { id: 't2', name: 'Daniel O.', role: 'Quality Engineer', avatar: portrait('photo-1506794778202-cad84cf45f1d'),
      quote: 'Lead auditor training that focuses on real findings and real evidence — not just memorising clauses.' },
    { id: 't3', name: 'Marta K.', role: 'Operations Manager', avatar: portrait('photo-1534528741775-53994a69daeb'),
      quote: 'The Green Belt project charter assignment turned into a real improvement project at our warehouse.' },
  ],
  faqs: [
    { id: 'f1', question: 'Who provides the training on Meridian LMS?', answer: 'Courses are based on the training catalogue of Meridian Quality Management Professionals (MEQMP), which offers advisory, training, compliance and sustainability services across the Middle East, Asia and North America. This LMS is a frontend demonstration of the online learning experience.' },
    { id: 'f2', question: 'What is the difference between Internal Auditor and Lead Auditor courses?', answer: 'Internal Auditor courses (about 16 hours) prepare you to audit your own organisation’s management system using ISO 19011. Lead Auditor courses (about 40 hours) add leading audit teams, the certification-audit context and a case-study audit with exam preparation.' },
    { id: 'f3', question: 'Which ISO standards are covered?', answer: 'ISO 9001, ISO 14001, ISO 45001, ISO/IEC 27001, ISO 22000, ISO 50001, ISO 41001 and ISO 31000, plus Lean Six Sigma, business continuity, OSHA, fire safety, first aid, defensive driving and PMP®/PMI-RMP® exam preparation.' },
    { id: 'f4', question: 'Do I receive a certificate?', answer: 'In this demo you receive a demo certificate when you complete every required lesson. It illustrates the experience and is not an accredited or externally verified credential.' },
    { id: 'f5', question: 'How is my progress saved?', answer: 'Progress, notes, bookmarks and quiz attempts are saved in your browser’s LocalStorage. Clearing site data or switching browsers resets them.' },
    { id: 'f6', question: 'Can my organisation train a whole team?', answer: 'Yes — see Meridian for Business. MEQMP delivers corporate training and advisory programmes tailored to your industry; contact the team to discuss your needs.' },
  ],
  sections: { trending: true, paths: true, instructors: true, recent: true, programs: true, testimonials: true, faq: true },
}
