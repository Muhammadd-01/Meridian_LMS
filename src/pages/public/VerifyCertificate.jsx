import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, SearchCheck, CircleX, Award, Info } from 'lucide-react'
import PageHero from '../../components/layout/PageHero'
import { Field } from '../../components/common/ui'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { getCertificates } from '../../utils/learning'
import { formatDate } from '../../utils/format'
import { cn } from '../../utils/cn'

/** Looks up a demo certificate by its reference number in this browser’s data. */
export default function VerifyCertificate() {
  useDocumentTitle('Verify certificate')
  const data = useData()
  const [ref, setRef] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const verify = (e) => {
    e.preventDefault()
    const value = ref.trim().toUpperCase()
    if (!value) return setError('Enter a certificate reference, e.g. MER-2026-1ABC234.')
    setError('')
    const found = getCertificates(data).find((c) => c.reference.toUpperCase() === value)
    setResult(found ? { ok: true, cert: found } : { ok: false })
  }

  return (
    <>
      <PageHero breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Verify certificate' }]} eyebrow="Certificates" title="Verify a certificate" description="Check a Meridian certificate by its reference number." />
      <div className="container-page grid gap-8 py-14 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={verify} noValidate className="card animate-pop-in p-6 sm:p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-deep text-white"><SearchCheck className="h-6 w-6" aria-hidden="true" /></span>
          <h2 className="mt-4 text-xl font-bold">Certificate reference</h2>
          <p className="mt-1 text-sm text-muted">You’ll find the reference in the bottom-right corner of every certificate.</p>
          <Field label="Reference number" htmlFor="cert-ref" error={error} className="mt-5">
            <input id="cert-ref" className={cn('input font-mono uppercase', error && 'input-invalid')} value={ref} onChange={(e) => { setRef(e.target.value); setResult(null) }} placeholder="MER-2026-XXXXXXX" />
          </Field>
          <button type="submit" className="btn btn-gradient mt-5 w-full rounded-full sm:w-auto">Verify certificate</button>

          {result && (
            <div className={cn('mt-6 animate-slide-up rounded-2xl border p-5', result.ok ? 'border-success/30 bg-success-soft' : 'border-danger/30 bg-danger-soft')} role="status">
              {result.ok ? (
                <div className="flex gap-4">
                  <ShieldCheck className="h-8 w-8 shrink-0 text-success" aria-hidden="true" />
                  <div className="text-sm">
                    <p className="font-semibold text-ink">Certificate found</p>
                    <p className="mt-1 text-slate-700"><strong>{result.cert.learnerName}</strong> completed <strong>{result.cert.courseTitle}</strong> on {formatDate(result.cert.completedAt)}.</p>
                    <Link to={`/certificates/${result.cert.id}`} className="link mt-2 inline-flex items-center gap-1"><Award className="h-4 w-4" aria-hidden="true" />View certificate</Link>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <CircleX className="h-8 w-8 shrink-0 text-danger" aria-hidden="true" />
                  <div className="text-sm">
                    <p className="font-semibold text-ink">No certificate found</p>
                    <p className="mt-1 text-slate-700">Check the reference and try again.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
        <aside className="card h-fit p-6">
          <Info className="h-6 w-6 text-info" aria-hidden="true" />
          <h2 className="mt-3 font-semibold">About demo verification</h2>
          <p className="mt-2 text-sm leading-6 text-muted">This frontend demo checks certificates stored in this browser only. Demo certificates are not accredited credentials. To verify a certificate issued by MEQMP, use the official verification service on meqmp.com.</p>
          <a href="https://meqmp.com/verify-certificate/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm mt-4 rounded-full">Official MEQMP verification</a>
        </aside>
      </div>
    </>
  )
}
