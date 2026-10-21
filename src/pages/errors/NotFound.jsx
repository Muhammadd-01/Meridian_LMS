import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { homeForRole } from '../../services/mockAuthService'

export default function NotFound({ embedded = false }) {
  useDocumentTitle('Page not found')
  const { user } = useAuth()
  return (
    <div className={embedded ? 'py-16' : 'container-page py-20'}>
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft text-primary"><Compass className="h-8 w-8" aria-hidden="true" /></span>
        <p className="mt-6 text-sm font-bold tracking-widest text-accent-ink">404</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">This page is off the map</h1>
        <p className="mt-3 text-muted">The page you’re looking for doesn’t exist or may have moved. Let’s get you back on course.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to={user ? homeForRole(user.role) : '/'} className="btn btn-primary">{user ? 'Back to dashboard' : 'Go home'}</Link>
          <Link to="/courses" className="btn btn-secondary">Browse courses</Link>
        </div>
      </div>
    </div>
  )
}
