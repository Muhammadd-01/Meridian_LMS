import { useToast } from '../context/ToastContext'

/** Shares a certificate link with the Web Share API, falling back to copying it. */
export function useShareCertificate() {
  const toast = useToast()
  return async (certificate) => {
    const url = `${window.location.origin}/certificates/${certificate.id}`
    const shareData = { title: `Demo certificate: ${certificate.courseTitle}`, text: `I completed ${certificate.courseTitle} on Meridian (demo).`, url }
    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        await navigator.share(shareData)
        return
      }
    } catch (error) {
      if (error?.name === 'AbortError') return
    }
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Certificate link copied. It opens in this browser, where the demo data lives.')
    } catch {
      toast.warning(`Copy this link manually: ${url}`, { duration: 8000 })
    }
  }
}
