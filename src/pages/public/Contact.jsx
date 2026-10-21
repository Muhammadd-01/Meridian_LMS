import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHero from '../../components/layout/PageHero'
import DemoInquiryForm from '../../components/forms/DemoInquiryForm'
import { Reveal } from '../../components/common/Motion'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { COMPANY } from '../../data/companyInfo'

export default function Contact() {
  useDocumentTitle('Contact')
  const items = [
    { icon: Phone, title: 'Call us', text: <a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`} className="link">{COMPANY.phone}</a> },
    { icon: Mail, title: 'Need support', text: <a href={`mailto:${COMPANY.email}`} className="link">{COMPANY.email}</a> },
    { icon: MapPin, title: 'Our global locations', text: COMPANY.offices.map((o) => o.country).join(' · ') },
    { icon: MessageSquare, title: 'Quick answers', text: <>Ask Meri, our assistant, or visit the <Link to="/help" className="link">help centre</Link>.</> },
  ]
  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} eyebrow="Get in touch" title="Need to reach us?" description="We’re here to answer your questions about training, advisory, compliance and sustainability." />
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1fr_1.6fr]">
        <div className="space-y-4">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div className="card card-hover group flex gap-4 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-deep text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"><item.icon className="h-5 w-5" aria-hidden="true" /></span>
                <div>
                  <h2 className="font-semibold text-ink">{item.title}</h2>
                  <p className="mt-0.5 text-sm text-muted">{item.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal variant="right">
          <div className="card p-6 sm:p-8">
            <h2 className="text-xl font-bold">Send us a message</h2>
            <p className="mt-1 text-sm text-muted">Fields marked * are required. In this demo the form is validated in your browser and not sent — for real enquiries use the phone number or email address shown.</p>
            <div className="mt-6">
              <DemoInquiryForm
                submitLabel="Send message"
                fields={[
                  { name: 'name', label: 'Your name', required: true, autoComplete: 'name' },
                  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
                  { name: 'topic', label: 'Topic', type: 'select', required: true, options: ['Training & courses', 'Advisory', 'Compliance & audits', 'Sustainability', 'Corporate wellbeing', 'Certificates', 'Something else'], full: true },
                  { name: 'message', label: 'Message', type: 'textarea', required: true, minLength: 20 },
                ]}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </>
  )
}
