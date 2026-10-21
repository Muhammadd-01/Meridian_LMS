import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { homeForRole } from '../services/mockAuthService'

function RoleRedirect({ to, message }) {
  const toast = useToast()
  useEffect(() => {
    toast.warning(message)
  }, [toast, message])
  return <Navigate to={to} replace />
}

/**
 * UI-level route guard for the demo. NOTE: client-side guards are a convenience,
 * not a security boundary — a real product must enforce access on the server.
 */
export function RequireRole({ role, children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search, reason: 'auth' }} />
  }
  if (role && user.role !== role) {
    return (
      <RoleRedirect
        to={homeForRole(user.role)}
        message={role === 'admin' ? 'The admin area is only available to the demo administrator.' : 'That page is part of the learner experience. Sign in as the demo learner to view it.'}
      />
    )
  }
  return children
}

export function GuestOnly({ children }) {
  const { user } = useAuth()
  if (user) return <Navigate to={homeForRole(user.role)} replace />
  return children
}
