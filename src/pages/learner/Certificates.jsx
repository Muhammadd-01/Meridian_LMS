import { Link } from 'react-router-dom'
import { Award, Eye, Share2, Info } from 'lucide-react'
import { EmptyState, PageHeader } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useShareCertificate } from '../../hooks/useShareCertificate'
import { getCertificates } from '../../utils/learning'
import { formatDate } from '../../utils/format'

export default function Certificates() {
  useDocumentTitle('Certificates')
  const data = useData()
  const { user } = useAuth()
  const share = useShareCertificate()
  const certificates = getCertificates(data, user.id)

  return (
    <div>
      <PageHeader title="Certificates" description="Demo certificates for the courses you have completed." />
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-info/30 bg-info-soft p-4 text-sm text-[#1F4E5F]">
        <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p>These are <strong>demo certificates</strong> generated in your browser. They are not externally verified credentials and are not issued by any real organisation.</p>
      </div>
      {certificates.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {certificates.map((cert) => (
            <article key={cert.id} className="card card-hover flex flex-col overflow-hidden">
              <div className="relative flex aspect-[1.414/1] flex-col items-center justify-center border-b border-line bg-gradient-to-br from-[#F7FAFB] to-primary-soft p-5 text-center">
                <div className="absolute inset-3 rounded-lg border border-deep/30" aria-hidden="true" />
                <Award className="h-8 w-8 text-accent" aria-hidden="true" />
                <p className="mt-2 text-[10px] font-semibold tracking-[0.25em] text-secondary uppercase">Certificate of completion</p>
                <p className="mt-2 line-clamp-2 font-semibold text-ink">{cert.courseTitle}</p>
                <p className="mt-1 font-serif text-sm text-deep italic">{cert.learnerName}</p>
                <span className="absolute top-4 right-4 badge badge-accent">Demo</span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <dl className="space-y-1 text-xs text-muted">
                  <div className="flex justify-between gap-2"><dt>Issued by</dt><dd className="text-right font-medium text-ink">{cert.providerName}</dd></div>
                  <div className="flex justify-between gap-2"><dt>Instructor</dt><dd className="font-medium text-ink">{cert.instructorName}</dd></div>
                  <div className="flex justify-between gap-2"><dt>Completed</dt><dd className="font-medium text-ink">{formatDate(cert.completedAt)}</dd></div>
                  <div className="flex justify-between gap-2"><dt>Reference</dt><dd className="font-mono font-medium text-ink">{cert.reference}</dd></div>
                </dl>
                <div className="mt-4 flex gap-2">
                  <Link to={`/learn/certificates/${cert.id}`} className="btn btn-primary btn-sm flex-1"><Eye className="h-4 w-4" aria-hidden="true" />Preview</Link>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => share(cert)} aria-label={`Share certificate for ${cert.courseTitle}`}><Share2 className="h-4 w-4" aria-hidden="true" />Share</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card">
          <EmptyState icon={Award} title="No certificates yet" description="Complete every required lesson in a course to earn a demo certificate." action={<Link to="/learn/my-learning" className="btn btn-primary">Continue learning</Link>} />
        </div>
      )}
    </div>
  )
}
