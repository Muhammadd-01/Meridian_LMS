/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useData } from './DataContext'
import { STORAGE_KEYS, readJSON, writeJSON, removeKey } from '../services/storage'
import { authenticate } from '../services/mockAuthService'

const AuthContext = createContext(null)

function readSession() {
  return readJSON(STORAGE_KEYS.session, null, 'local') || readJSON(STORAGE_KEYS.session, null, 'session')
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Demo session management. Route guards built on this are a UX convenience only —
 * they are not a security boundary.
 */
export function AuthProvider({ children }) {
  const { users, actions } = useData()
  const [session, setSession] = useState(readSession)
  const [signedOut, setSignedOut] = useState(false)

  const user = useMemo(() => {
    if (!session) return null
    const found = users.find((u) => u.id === session.userId)
    return found && found.role === session.role ? found : null
  }, [session, users])

  useEffect(() => {
    actions.setActor(user)
  }, [user, actions])

  const startSession = useCallback((account, remember) => {
    const next = { userId: account.id, role: account.role, remember: Boolean(remember), signedInAt: new Date().toISOString() }
    removeKey(STORAGE_KEYS.session, 'local')
    removeKey(STORAGE_KEYS.session, 'session')
    writeJSON(STORAGE_KEYS.session, next, remember ? 'local' : 'session')
    setSignedOut(false)
    setSession(next)
  }, [])

  const login = useCallback(async ({ email, password, remember }) => {
    await wait(350)
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

  // Called once the app has left the protected area, so later visits to learner/admin routes show the login screen.
  const acknowledgeSignOut = useCallback(() => setSignedOut(false), [])

  const value = useMemo(() => ({
    user,
    role: user?.role || null,
    isAuthenticated: Boolean(user),
    signedOut,
    login,
    logout,
    startSession,
    acknowledgeSignOut,
  }), [user, signedOut, login, logout, startSession, acknowledgeSignOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
