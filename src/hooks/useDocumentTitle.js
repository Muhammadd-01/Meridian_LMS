import { useEffect } from 'react'
import { useData } from '../context/DataContext'

export function useDocumentTitle(title) {
  const { settings } = useData()
  const platform = settings?.platformName || 'Meridian LMS'
  useEffect(() => {
    document.title = title ? `${title} · ${platform}` : `${platform} — Build Skills. Unlock Your Potential.`
  }, [title, platform])
}
