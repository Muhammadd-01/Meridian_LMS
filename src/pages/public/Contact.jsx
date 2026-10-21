import { Mail, MessageSquare, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHero from '../../components/layout/PageHero'
import DemoInquiryForm from '../../components/forms/DemoInquiryForm'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function Contact() {
  useDocumentTitle('Contact')
  const { settings } = useData()
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} eyebrow="Get in touch" title="Contact us" description="Questions about courses, the demo or partnerships? Send us a message." />
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.6fr]">
        <div className="space-y-4">
          {[
            { icon: Mail, title: 'Email (demo address)', text: settings.supportEmail },
            { icon: Clock, title: 'Typical response time', text: 'Not applicable — this demo does not send messages.' },
            { icon: MessageSquare, title: 'Self-service help', text: <>Browse answers in the <Link to="/help" className="link">help centre</Link>.</> },
          ].map((item) => (
            <div key={item.title} className="card flex gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"><item.icon className="h-5 w-5" aria-hidden="true" /></span>
              <div>
                <h2 className="font-semibold text-ink">{item.title}</h2>
                <p className="mt-0.5 text-sm text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="card p-6 sm:p-8">
          <h2 className="text-xl font-bold">Send a message</h2>
          <p className="mt-1 text-sm text-muted">Fields marked * are required.</p>
          <div className="mt-6">
            <DemoInquiryForm
              submitLabel="Send message"
              fields={[
                { name: 'name', label: 'Your name', required: true, autoComplete: 'name' },
                { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
                { name: 'topic', label: 'Topic', type: 'select', required: true, options: ['Courses and enrolment', 'Certificates', 'Meridian for Business', 'Technical issue', 'Something else'], full: true },
                { name: 'message', label: 'Message', type: 'textarea', required: true, minLength: 20 },
              ]}
            />
          </div>
        </div>
      </div>
    </>
  )
}
