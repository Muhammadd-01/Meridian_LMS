import { useEffect } from 'react'
import { useData } from '../context/DataContext'

export function useDocumentTitle(title) {
  const { settings } = useData()
  const platform = settings?.platformName || 'Meridian'
  useEffect(() => {
    document.title = title ? `${title} · ${platform}` : `${platform} — Empowering Quality & Sustainable Growth`
  }, [title, platform])
}
