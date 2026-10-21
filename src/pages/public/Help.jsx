import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, LifeBuoy, SearchX } from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import SearchInput from '../../components/common/SearchInput'
import { EmptyState } from '../../components/common/ui'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { matchesSearch } from '../../utils/query'
import { cn } from '../../utils/cn'

const TOPICS = [
  { topic: 'Getting started', items: [
    ['How do I try the platform?', 'Use the demo learner or admin accounts shown on the sign-in page, or create a local demo learner profile from “Join for Free”.'],
    ['Is this a real learning platform?', 'No. Meridian LMS is a frontend demonstration. Courses, people and figures are fictional and no backend is involved.'],
  ] },
  { topic: 'Courses & progress', items: [
    ['How do I enrol in a course?', 'Open any course and choose “Enroll”. Enrolments are saved in your browser and appear under My Learning.'],
    ['How is progress calculated?', 'Progress is the share of required lessons you have completed. Resource lessons are optional. Progress never exceeds 100%.'],
    ['Where are my notes and bookmarks?', 'Inside the course player, open the Notes or Bookmarks tab. Notes are stored per lesson in your browser.'],
    ['Can I archive a course?', 'Yes. In My Learning, open a course’s menu and choose Archive. You can restore it at any time.'],
  ] },
  { topic: 'Assessments', items: [
    ['Can I retake a quiz?', 'Yes — every attempt is saved to your attempt history and you can retake as often as you like.'],
    ['Are quiz timers enforced?', 'Timed quizzes use a simple countdown in your browser. They are not enforced by a server.'],
    ['How are assignments graded?', 'Submissions are stored locally and appear in the admin dashboard, where the demo administrator can add a grade and feedback.'],
  ] },
  { topic: 'Certificates', items: [
    ['How do I get a certificate?', 'Complete every required lesson in a course. A demo certificate appears under Certificates.'],
    ['Are certificates verified credentials?', 'No. Demo certificates illustrate the experience and are not issued or verified by any organisation.'],
  ] },
  { topic: 'Data & privacy', items: [
    ['Where is my data stored?', 'In your browser’s LocalStorage under keys beginning with “meridian.v1”. Nothing is sent to a server.'],
    ['How do I reset the demo?', 'Learners can reset all demo data from Settings; admins can do so from Platform settings. Both ask for confirmation first.'],
  ] },
]

function Question({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-line last:border-b-0">
      <h3>
        <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 py-4 text-left font-medium text-ink hover:text-primary">
          {q}<ChevronDown className={cn('h-5 w-5 shrink-0 text-muted transition-transform', open && 'rotate-180')} aria-hidden="true" />
        </button>
      </h3>
      {open && <p className="pb-4 text-sm leading-6 text-muted">{a}</p>}
    </div>
  )
}

export default function Help() {
  useDocumentTitle('Help centre')
  const [query, setQuery] = useState('')
  const filtered = TOPICS.map((t) => ({ ...t, items: t.items.filter(([q, a]) => matchesSearch({ q, a }, query, ['q', 'a'])) })).filter((t) => t.items.length)
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Help centre' }]} eyebrow="Support" title="How can we help?" description="Answers about enrolment, progress, assessments and how this demo stores data.">
        <SearchInput className="mt-6 max-w-xl" size="lg" value={query} onChange={setQuery} placeholder="Search help articles" label="Search help articles" />
      </PageHero>
      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          {filtered.map((t) => (
            <section key={t.topic} className="card px-6 pt-4" aria-labelledby={`topic-${t.topic}`}>
              <h2 id={`topic-${t.topic}`} className="pb-1 text-lg font-semibold">{t.topic}</h2>
              {t.items.map(([q, a]) => <Question key={q} q={q} a={a} />)}
            </section>
          ))}
          {!filtered.length && <div className="card"><EmptyState icon={SearchX} title="No matching articles" description="Try different keywords or contact us." action={<button type="button" className="btn btn-secondary" onClick={() => setQuery('')}>Clear search</button>} /></div>}
        </div>
        <aside className="card h-fit p-6">
          <LifeBuoy className="h-7 w-7 text-secondary" aria-hidden="true" />
          <h2 className="mt-3 font-semibold">Still need help?</h2>
          <p className="mt-1 text-sm text-muted">Send a message through the demo contact form.</p>
          <Link to="/contact" className="btn btn-primary mt-4 w-full">Contact support</Link>
        </aside>
      </div>
    </>
  )
}
