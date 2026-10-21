/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useData } from './DataContext'
import { STORAGE_KEYS, readJSON, writeJSON, removeKey } from '../services/storage'
import { authenticate } from '../services/mockAuthService'
import AuthTransitionOverlay from '../components/auth/AuthTransitionOverlay'

const AuthContext = createContext(null)

function readSession() {
  return readJSON(STORAGE_KEYS.session, null, 'local') || readJSON(STORAGE_KEYS.session, null, 'session')
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const LOGIN_MS = 1500
const LOGOUT_MS = 1100

/**
 * Demo session management. Route guards built on this are a UX convenience only —
 * they are not a security boundary. Sign-in and sign-out play a short branded transition.
 */
export function AuthProvider({ children }) {
  const { users, actions } = useData()
  const [session, setSession] = useState(readSession)
  const [signedOut, setSignedOut] = useState(false)
  const [transition, setTransition] = useState(null)
  const timers = useRef([])

  const user = useMemo(() => {
    if (!session) return null
    const found = users.find((u) => u.id === session.userId)
    return found && found.role === session.role ? found : null
  }, [session, users])

  useEffect(() => {
    actions.setActor(user)
  }, [user, actions])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  /** Shows the overlay: `progress` phase, then a `done` checkmark, then fades out. */
  const playTransition = useCallback((info, total) => {
    timers.current.forEach(clearTimeout)
    setTransition({ ...info, phase: 'progress', duration: total })
    timers.current = [
      setTimeout(() => setTransition((t) => (t ? { ...t, phase: 'done' } : t)), total * 0.62),
      setTimeout(() => setTransition((t) => (t ? { ...t, phase: 'leaving' } : t)), total),
      setTimeout(() => setTransition(null), total + 420),
    ]
  }, [])

  const startSession = useCallback((account, remember, { animate = true, kind = 'login' } = {}) => {
    const next = { userId: account.id, role: account.role, remember: Boolean(remember), signedInAt: new Date().toISOString() }
    removeKey(STORAGE_KEYS.session, 'local')
    removeKey(STORAGE_KEYS.session, 'session')
    writeJSON(STORAGE_KEYS.session, next, remember ? 'local' : 'session')
    setSignedOut(false)
    setSession(next)
    if (animate) playTransition({ type: kind, name: account.name.split(' ')[0], role: account.role }, LOGIN_MS)
  }, [playTransition])

  const login = useCallback(async ({ email, password, remember }) => {
    await wait(450)
    const result = authenticate(users, { email, password })
    if (result.ok) startSession(result.user, remember)
    return result
  }, [users, startSession])

  const logout = useCallback(() => {
    removeKey(STORAGE_KEYS.session, 'local')
    removeKey(STORAGE_KEYS.session, 'session')
    setSignedOut(true)
    setSession(null)
  }, [])

  /** Animated sign-out: shows the overlay, clears the session underneath it, then fades away. */
  const signOut = useCallback(async () => {
    const name = user?.name.split(' ')[0] || ''
    playTransition({ type: 'logout', name, role: user?.role }, LOGOUT_MS + 500)
    await wait(LOGOUT_MS * 0.6)
    logout()
  }, [user, playTransition, logout])

  // Called once the app has left the protected area, so later visits to learner/admin routes show the login screen.
  const acknowledgeSignOut = useCallback(() => setSignedOut(false), [])

  const value = useMemo(() => ({
    user,
    role: user?.role || null,
    isAuthenticated: Boolean(user),
    signedOut,
    login,
    logout,
    signOut,
    startSession,
    acknowledgeSignOut,
  }), [user, signedOut, login, logout, signOut, startSession, acknowledgeSignOut])

  return (
    <AuthContext.Provider value={value}>
      {children}
      {transition && <AuthTransitionOverlay transition={transition} />}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
