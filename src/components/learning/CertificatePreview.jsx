import { formatDate } from '../../utils/format'
import logo from '../../assets/logos/meridian-logo.png'

/** Landscape certificate artwork. Clearly marked as a demo, not a verified credential. */
export default function CertificatePreview({ certificate, platformName = 'Meridian' }) {
  return (
    <div className="print-area relative mx-auto aspect-[1.414/1] w-full max-w-4xl overflow-hidden rounded-xl border border-line bg-white shadow-[var(--shadow-raised)]">
      <div className="absolute inset-3 rounded-lg border-2 border-deep/80 sm:inset-5" aria-hidden="true" />
      <div className="absolute inset-[18px] rounded border border-accent/60 sm:inset-[28px]" aria-hidden="true" />
      <svg className="absolute -right-16 -bottom-16 h-64 w-64 opacity-[0.07]" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#093F50" strokeWidth="6" />
        <path d="M50 5v90M5 50h90" stroke="#093F50" strokeWidth="4" />
      </svg>
      <div className="relative flex h-full flex-col items-center justify-between px-[8%] py-[6%] text-center">
        <div className="flex flex-col items-center gap-1">
          <img src={logo} alt="Meridian Quality Management Professionals" className="h-[clamp(30px,6.5vw,62px)] w-auto object-contain" />
          <span className="text-[clamp(8px,1.1vw,11px)] font-semibold tracking-[0.3em] text-muted uppercase">{platformName}</span>
        </div>
        <div>
          <p className="text-[clamp(9px,1.4vw,13px)] font-semibold tracking-[0.3em] text-secondary uppercase">Certificate of completion</p>
          <p className="mt-[2%] text-[clamp(10px,1.5vw,14px)] text-muted">This demo certificate is presented to</p>
          <p className="mt-[1.5%] font-serif text-[clamp(20px,4.6vw,46px)] leading-tight text-deep italic">{certificate.learnerName}</p>
          <p className="mt-[2%] text-[clamp(10px,1.5vw,14px)] text-muted">for successfully completing</p>
          <p className="mt-[1%] text-[clamp(13px,2.4vw,24px)] font-bold text-ink">{certificate.courseTitle}</p>
          <p className="mt-[1%] text-[clamp(9px,1.3vw,13px)] text-muted">offered by {certificate.providerName} · approx. {certificate.durationHours} hours</p>
        </div>
        <div className="grid w-full grid-cols-3 items-end gap-2 text-[clamp(8px,1.2vw,12px)] text-muted">
          <div className="text-left">
            <p className="font-serif text-[clamp(11px,1.8vw,18px)] text-ink italic">{certificate.instructorName}</p>
            <p className="border-t border-slate-300 pt-1">Instructor</p>
          </div>
          <div className="flex justify-center">
            <span className="flex h-[clamp(40px,8vw,80px)] w-[clamp(40px,8vw,80px)] items-center justify-center rounded-full border-2 border-accent bg-accent-soft text-center text-[clamp(6px,1vw,10px)] leading-tight font-bold text-accent-ink uppercase">Demo<br />only</span>
          </div>
          <div className="text-right">
            <p className="font-semibold text-ink">{formatDate(certificate.completedAt)}</p>
            <p className="border-t border-slate-300 pt-1">Ref. {certificate.reference}</p>
          </div>
        </div>
      </div>
      <p className="absolute inset-x-0 bottom-[1.5%] text-center text-[clamp(6px,0.9vw,10px)] text-slate-400">Demonstration document generated in the browser — not a verified credential.</p>
    </div>
  )
}
