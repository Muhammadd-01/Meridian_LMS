import { portrait } from './images'

/** Editable homepage content (managed from Admin → Homepage content). */
export const homepageContent = {
  hero: {
    headline: 'Build Skills. Unlock Your Potential.',
    subtext: 'Discover expert-led courses, develop in-demand skills, and take the next step in your learning journey with Meridian.',
  },
  stats: [
    { id: 'st1', value: '25+', label: 'Expert-led courses' },
    { id: 'st2', value: '10', label: 'Subject categories' },
    { id: 'st3', value: '6', label: 'Career paths' },
    { id: 'st4', value: '4.7★', label: 'Average course rating' },
  ],
  benefits: [
    { id: 'b1', icon: 'GraduationCap', title: 'Learn from practitioners', text: 'Courses are designed by people who do the work every day, with practical projects in every module.' },
    { id: 'b2', icon: 'Route', title: 'Follow a clear path', text: 'Career paths sequence the right courses so you always know what to learn next.' },
    { id: 'b3', icon: 'Clock', title: 'Study on your schedule', text: 'Short lessons, resumable progress and weekly goals fit learning around real life.' },
    { id: 'b4', icon: 'Award', title: 'Show what you know', text: 'Quizzes, assignments and completion certificates help you demonstrate progress.' },
  ],
  testimonials: [
    { id: 't1', name: 'Priyanka S.', role: 'Junior Frontend Developer', avatar: portrait('photo-1544005313-94ddf0286df2'),
      quote: 'The React programme finally made state management click for me. The small weekly projects became the core of my portfolio.' },
    { id: 't2', name: 'Daniel O.', role: 'Quality Coordinator', avatar: portrait('photo-1506794778202-cad84cf45f1d'),
      quote: 'The ISO 9001 course was practical rather than theoretical — I used the audit checklist at work the following week.' },
    { id: 't3', name: 'Marta K.', role: 'Data Analyst', avatar: portrait('photo-1534528741775-53994a69daeb'),
      quote: 'I came from finance with no coding background. The Data Analyst path gave me a clear order to learn things in.' },
  ],
  faqs: [
    { id: 'f1', question: 'Is Meridian LMS a real learning platform?', answer: 'This is a frontend demonstration. Courses, instructors, ratings and learners are fictional sample data, and everything you do is stored only in this browser.' },
    { id: 'f2', question: 'Do I need to pay to enrol?', answer: 'No. Some courses display a demo price label to show how paid courses would appear, but no payment is ever requested or processed.' },
    { id: 'f3', question: 'How is my progress saved?', answer: 'Progress, notes, bookmarks and quiz attempts are saved to your browser’s LocalStorage. Clearing site data or using another browser will reset them.' },
    { id: 'f4', question: 'Are the certificates verified credentials?', answer: 'No. Certificates are demo documents generated in the browser to illustrate the experience. They are not issued or verified by any organisation.' },
    { id: 'f5', question: 'Can I try the admin experience?', answer: 'Yes — sign in with the demo administrator account shown on the sign-in page to manage courses, learners, announcements and settings.' },
  ],
  sections: { trending: true, paths: true, instructors: true, recent: true, programs: true, testimonials: true, faq: true },
}
