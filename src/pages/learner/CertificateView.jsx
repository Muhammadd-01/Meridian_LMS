import { Link, useParams } from 'react-router-dom'
import { Printer, Share2, ArrowLeft, Award } from 'lucide-react'
import CertificatePreview from '../../components/learning/CertificatePreview'
import { EmptyState, Breadcrumbs } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useShareCertificate } from '../../hooks/useShareCertificate'
import { getCertificates } from '../../utils/learning'

export default function CertificateView() {
  const { certId } = useParams()
  const data = useData()
  const { user } = useAuth()
  const share = useShareCertificate()
  const certificate = getCertificates(data, user.id).find((c) => c.id === certId)
  useDocumentTitle(certificate ? `Certificate · ${certificate.courseTitle}` : 'Certificate not found')

  if (!certificate) {
    return (
      <div className="card">
        <EmptyState icon={Award} title="Certificate not found" description="This certificate doesn’t exist or the course isn’t complete yet." action={<Link to="/learn/certificates" className="btn btn-primary">Back to certificates</Link>} />
      </div>
    )
  }

  return (
    <div>
      <div className="no-print mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: 'Certificates', to: '/learn/certificates' }, { label: certificate.courseTitle }]} />
          <h1 className="mt-2 text-2xl font-bold">Certificate preview</h1>
          <p className="text-sm text-muted">Use Print to save as PDF with your browser’s “Save as PDF” option.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/learn/certificates" className="btn btn-ghost"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back</Link>
          <button type="button" className="btn btn-secondary" onClick={() => share(certificate)}><Share2 className="h-4 w-4" aria-hidden="true" />Share link</button>
          <button type="button" className="btn btn-primary" onClick={() => window.print()}><Printer className="h-4 w-4" aria-hidden="true" />Print / Save as PDF</button>
        </div>
      </div>
      <CertificatePreview certificate={certificate} platformName={data.settings.platformName} />
      <p className="no-print mt-4 text-center text-xs text-muted">Demo certificate — not an externally verified credential.</p>
    </div>
  )
}
