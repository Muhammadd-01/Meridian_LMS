import { Link, useParams } from 'react-router-dom'
import { Info } from 'lucide-react'
import CertificatePreview from '../../components/learning/CertificatePreview'
import MissingRecord from '../../components/common/MissingRecord'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getCertificates } from '../../utils/learning'

/** Shareable certificate page. Only works in the browser that holds the demo data. */
export default function CertificateVerify() {
  const { certId } = useParams()
  const data = useData()
  const certificate = getCertificates(data).find((c) => c.id === certId || c.reference === certId)
  useDocumentTitle(certificate ? `Certificate · ${certificate.courseTitle}` : 'Certificate not found')

  if (!certificate) {
    return (
      <MissingRecord
        title="Certificate not found"
        description="Demo certificates live in the browser that created them, so shared links only resolve on the same device and browser profile."
        backTo="/"
      />
    )
  }

  return (
    <div className="container-page py-10">
      <div className="mx-auto mb-6 flex max-w-4xl items-start gap-3 rounded-xl border border-info/30 bg-info-soft p-4 text-sm text-[#1F4E5F]">
        <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p>This is a <strong>demo certificate</strong> stored in this browser. It is not an externally verified credential. Reference <strong>{certificate.reference}</strong>.</p>
      </div>
      <CertificatePreview certificate={certificate} platformName={data.settings.platformName} />
      <div className="mt-6 text-center">
        <Link to={`/courses/${certificate.courseSlug}`} className="btn btn-secondary">View the course</Link>
      </div>
    </div>
  )
}
